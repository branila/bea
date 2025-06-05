import { db } from '$db'
import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { scans } from '$schema'

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.user

  if (!user) {
    return json({
      success: false,
      error: 'Utente non autenticato'
    })
  }

  if (!user.roles.includes('organizzatore')) {
    return json({
      success: false,
      error: 'Utente non autorizzato'
    })
  }

  const { ticketId } = await request.json()

  if (!ticketId) {
    return json({
      success: false,
      error: 'Non è stato fornito alcun codice ticket'
    })
  }

  const today = new Date().toISOString().split('T')[0]

  await db
    .insert(scans)
    .values({
      ticket: ticketId,
      date: today,
      authenticator: user.email
    })

  return json({
    success: true,
    message: 'Ticket scansionato con successo'
  })

  return json({})
}
