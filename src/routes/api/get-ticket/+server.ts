import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
  const { ticketId } = await request.json()

  const [ticketNotFoundError, ticket] = await goCatch(locals.pb.collection('tickets').getOne(ticketId, {
    expand: 'authenticator'
  }))

  if (ticketNotFoundError) {
    return json({
      ticket: null,
      user: undefined,
      registration: undefined,
    })
  }

  const user = await locals.pb.collection('users').getOne(ticket.user)!

  const registration = await locals.pb.collection('registrations').getOne(ticket.registration, {
    expand: 'firstActivity,secondActivity,thirdActivity'
  })!

  return json({
    ticket,
    user,
    registration
  })
}
