import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
  const { ticketId } = await request.json()

  const [ticketUpdateError] = await goCatch(locals.pb.collection('tickets').update(ticketId, {
    scanned: new Date().toISOString(),
    authenticator: locals.user!.id
  }))

  if (ticketUpdateError) {
    console.error(ticketUpdateError)
    return json({
      success: false
    })
  }

  return json({
    success: true
  })
}
