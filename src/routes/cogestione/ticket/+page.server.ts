import type { PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { db } from '$db'
import { tickets, eventDays } from '$lib/schema'
import { eq } from 'drizzle-orm'
import goCatch from '$lib/utils/go-catch'

export const load: PageServerLoad = async ({ parent, locals }) => {
  // Cerca il ticket dell'utente
  let ticketResult = await db
    .select()
    .from(tickets)
    .where(eq(tickets.user, locals.user!.email))
    .limit(1)

  if (!ticketResult || ticketResult.length === 0) {
    redirect(302, '/cogestione/registration')
  }

  const ticket = ticketResult[0]

  // Recupera tutti i giorni dell'evento
  let eventDaysResult = await db
    .select()
    .from(eventDays)
    .orderBy(eventDays.date)

  return {
    user: locals.user!,
    ticket,
    eventDays: eventDaysResult || []
  }
}
