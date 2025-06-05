import { db } from '$db'
import { registrations, tickets, users, turns } from '$schema'
import { scans } from '$schema/registrations'
import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'

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

  // TODO: Contrrolla con ticket non esistenti
  const ticket = await db
    .select()
    .from(tickets)
    .where(eq(tickets.id, ticketId))
    .then(result => result[0])

  if (!ticket) {
    return json({
      success: false,
      error: `Non è stato trovato nessun ticket con id ${ticketId}`
    })
  }

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.email, ticket.user))
    .then(result => result[0])

  if (!userData) {
    return json({
      success: false,
      error: `Non è stato possibile recuperare le informazioni dell'utente`
    })
  }

  let today = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Rome' // GMT+2 (ora solare italiana)
  })

  // Gets the registrations for the user on the current day
  const userRegistrations = await db
    .select({ activity: turns.activity, start: turns.start, end: turns.end })
    .from(registrations)
    .innerJoin(turns, eq(registrations.turn, turns.id))
    .where(
      and(
        eq(registrations.user, userData.email),
        eq(turns.day, today)
      )
    )

  const todayWithTimezone = new Date().toISOString().split('T')[0]

  const scan = await db
    .select({
      ticket: scans.ticket,
      date: scans.date,
      authenticator: {
        name: users.name,
        surname: users.surname,
      },
      createdAt: scans.createdAt,
    })
    .from(scans)
    .innerJoin(users, eq(scans.authenticator, users.email))
    .where(
      and(
        eq(scans.ticket, ticket.id.toUpperCase()),
        eq(scans.date, todayWithTimezone)
      )
    ).then(result => result[0])

  return json({
    success: true,
    ticket,
    user: userData,
    registrations: userRegistrations,
    scan
  })
}
