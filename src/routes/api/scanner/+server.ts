import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request, locals }) => {
  const { ticketId } = await request.json()

  if (!ticketId) {
    return json({
      success: false,
      error: 'Non è stato fornito alcun codice ticket'
    })
  }

  const [ticketNotFound, ticket] = await goCatch(locals.pb.collection('tickets').getOne(ticketId, {
    expand: 'authenticator'
  }))

  if (ticketNotFound) {
    return json({
      success: false,
      error: `Non è stato trovato nessun ticket con id ${ticketId}`
    })
  }

  const [userNotFound, user] = await goCatch(locals.pb.collection('users').getOne(ticket.user))

  if (userNotFound) {
    return json({
      success: false,
      error: `Non è stato possibile recupare le informazioni dell'utente`
    })
  }

  const [registrationNotFound, registration] = await goCatch(locals.pb.collection('registrations').getOne(ticket.registration, {
    expand: 'firstActivity, secondActivity, thirdActivity'
  }))

  if (registrationNotFound) {
    return json({
      success: false,
      error: `Non è stato possibile recuperare le informazioni della registrazione`
    })
  }

  return json({
    success: true,
    ticket,
    user,
    registration
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { ticketId } = await request.json()

  if (!ticketId) {
    return json({
      success: false,
      error: 'Non è stato fornito alcun codice ticket'
    })
  }

  const [ticketUpdateError] = await goCatch(locals.pb.collection('tickets').update(ticketId, {
    scanned: new Date().toISOString(),
    authenticator: locals.user!.id
  }))

  if (ticketUpdateError) {
    return json({
      success: false,
      error: `Non è stato possibile aggiornare lo stato del ticket`
    })
  }

  return json({
    success: true
  })
}
