import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

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
