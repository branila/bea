import type { PageServerLoad, Actions, RequestEvent } from './$types'
import type { User, Registration, Activity } from '$types/db'
import { sendMail } from '$lib/server/scripts/emailService'
import notify from '$lib/utils/notify'
import { handleError } from '../../../hooks.server'

export const load: PageServerLoad = async ({ parent, locals }) => {
  const parentData = await parent()

  let [error, activities] = await goCatch(locals.pb.collection('activities').getFullList())

  if (error || !activities) {
    activities = []
  }

  // Filters out sold out activities
  activities = activities.filter(activity => {
    return !activity.capacity.every(capacity => capacity === 0)
  })

  return {
    registration: parentData.registration,
    activities
  } as {
    registration: Registration | undefined,
    activities: Activity[]
  }
}

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData()

    // Ids os of the activities selected by the user
    const activityIds = [
      data.get('firstActivity') as string,
      data.get('secondActivity') as string,
      data.get('thirdActivity') as string
    ]

    // Retrieves the activities from the database
    const firstActivity = await locals.pb.collection('activities').getOne(activityIds[0])
    const secondActivity = await locals.pb.collection('activities').getOne(activityIds[1])
    const thirdActivity = await locals.pb.collection('activities').getOne(activityIds[2])

    // Checks if the activities are still available
    const soldOut = firstActivity.capacity[0] === 0 || (
      firstActivity.turns != 1 && (
        secondActivity.capacity[1] === 0 || thirdActivity.capacity[2] === 0
      )
    )

    if (soldOut) {
      return {
        error: 'Errore: una delle attività selezionate si è esaurita mentre completavi la registrazione. Ritenta e sarai più fortunato!'
      }
    }

    // Saves the registration in the registration collection
    const [registrationError, registration] = await goCatch(locals.pb.collection('registrations').create({
      user: locals.user!.id,
      firstActivity: firstActivity.id,
      secondActivity: secondActivity.id,
      thirdActivity: thirdActivity.id,
    }))

    if (registrationError) {
      await handleError({
        error: registrationError,
        event: {
          locals
        } as RequestEvent,
        status: 500,
        message: 'Failed to create registration'
      })

      return {
        error: 'Si è verificato un errore durante la registrazione della tua iscrizione. Contattaci al più presto per risolvere il problema.'
      }
    }

    // Creates a personal ticket for the user
    const [ticketCreationError] = await goCatch(locals.pb.collection('tickets').create({
      user: locals.user!.id,
      registration: registration!.id,
    }))

    if (ticketCreationError) {
      await handleError({
        error: ticketCreationError,
        event: {
          locals
        } as RequestEvent,
        status: 500,
        message: 'Failed to create ticket'
      })

      return {
        error: 'Errore: si è verificato un errore durante la creazione del biglietto. Riprova più tardi.'
      }
    }

    /* Activities capacity decrement */

    firstActivity.capacity[0]--

    if (firstActivity.turns != 1) {
      // If the second activity is the same as the first one, the capacity is the same
      if (secondActivity.id == firstActivity.id) {
        secondActivity.capacity = firstActivity.capacity
      }

      secondActivity.capacity[1]--

      // If the third activity is the same as the first one, the capacity is the same
      if (thirdActivity.id == firstActivity.id) {
        thirdActivity.capacity = firstActivity.capacity
      }

      // If the third activity is the same as the second one, the capacity is the same
      if (thirdActivity.id == secondActivity.id) {
        thirdActivity.capacity = secondActivity.capacity
      }

      thirdActivity.capacity[2]--
    }

    /* Updates the activities in the database */

    await locals.pb.collection('activities').update(firstActivity.id, {
      capacity: firstActivity.capacity
    })

    if (firstActivity.turns != 1) {
      await locals.pb.collection('activities').update(secondActivity.id, {
        capacity: secondActivity.capacity
      })

      await locals.pb.collection('activities').update(thirdActivity.id, {
        capacity: thirdActivity.capacity
      })
    }

    //TODO, GET TICKET ID INSTEAD OF USER ID
    let { id, email, surname, name } = locals.user!

    const [emailSendError] = await goCatch(sendMail(
      id, email,
      locals.user!.roles[0],
      `${surname} ${name}`
    ))

    if (emailSendError) {
      await handleError({
        error: emailSendError,
        event: {
          locals
        } as RequestEvent,
        status: 500,
        message: 'Failed to send confirmation email'
      })

      return {
        error: 'Errore: si è verificato un errore durante l\'invio della mail di conferma. Contattaci al più presto per risolvere il problema.'
      }
    }
  }
} satisfies Actions
