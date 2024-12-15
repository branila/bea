import type { PageServerLoad, Actions } from './$types'
import type { User, Registration, Activity } from '$types/db'
import { sendMail } from '$lib/server/scripts/emailService'

export const load: PageServerLoad = async ({ parent, locals }) => {
  const parentData = await parent()

  let [error, activities] = await goCatch(locals.pb.collection('activities').getFullList())

  if (error || !activities) {
    activities = []
  }

  // Remove organizers from activities for safety reasons
  activities.forEach(activity => activity.organizers = [])

  // Filters out sold out activitiesa
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

    const firstActivity = await locals.pb.collection('activities').getOne(data.get('firstActivity') as string)
    const secondActivity = await locals.pb.collection('activities').getOne(data.get('secondActivity') as string)
    const thirdActivity = await locals.pb.collection('activities').getOne(data.get('thirdActivity') as string)

    // Checks if the activities are still available
    // if (
    //   firstActivity.capacity.every(capacity => capacity === 0) ||
    //   secondActivity.capacity.every(capacity => capacity === 0) ||
    //   thirdActivity.capacity.every(capacity => capacity === 0))
    // {
    //   return console.error('Una o più attività sono esaurite')
    // }

    const registration = await locals.pb.collection('registrations').create({
      user: locals.user!.id,
      firstActivity: firstActivity.id,
      secondActivity: secondActivity.id,
      thirdActivity: thirdActivity.id,
    })

    await locals.pb.collection('tickets').create({
      user: locals.user!.id,
      registration: registration.id,
    })

    firstActivity.capacity[0] = firstActivity.capacity[0] > 0 ? firstActivity.capacity[0] - 1 : 0

    if (firstActivity.turns != 1) {

      if (secondActivity.id == firstActivity.id) {
        secondActivity.capacity = firstActivity.capacity
      }

      secondActivity.capacity[1] = secondActivity.capacity[1] > 0 ? secondActivity.capacity[1] - 1 : 0

      if (thirdActivity.id == firstActivity.id) {
        thirdActivity.capacity = firstActivity.capacity
      }

      if (thirdActivity.id == secondActivity.id) {
        thirdActivity.capacity = secondActivity.capacity
      }

      thirdActivity.capacity[2] = thirdActivity.capacity[2] > 0 ? thirdActivity.capacity[2] - 1 : 0
    }

    let [error] = await goCatch(locals.pb.collection('activities').update(firstActivity.id, {
      capacity: firstActivity.capacity
    }))

    if (error) {
      return console.error(`Error updating activity ${firstActivity.name}: ${error}`)
    }

    if (firstActivity.turns != 1) {
      [error] = await goCatch(locals.pb.collection('activities').update(secondActivity.id, {
        capacity: secondActivity.capacity
      }))

      if (error) {
        return console.error(`Error updating activity ${secondActivity.name}: ${error}`)
      }

      [error] = await goCatch(locals.pb.collection('activities').update(thirdActivity.id, {
        capacity: thirdActivity.capacity
      }))

      if (error) {
        return console.error(`Error updating activity ${thirdActivity.name}: ${error}`)
      }
    }

    //TODO, GET TICKET ID INSTEAD OF USER ID
    let { id, email, surname, name } = locals.user!

    await sendMail(
      id,
      email,
      `${surname} ${name}`,
      locals.user!.roles[0])
  }
} satisfies Actions
