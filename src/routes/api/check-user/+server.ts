import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$db'
import { users, registrations, turns } from '$schema'
import { eq, and } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, day } = await request.json()

    // Validate input
    if (!email || !day) {
      return json(
        { exists: false, available: false, message: 'Email e giorno sono richiesti' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length === 0) {
      return json({
        exists: false,
        available: false,
        message: 'Utente non trovato'
      })
    }

    // Check if user is banned
    if (user[0].banned) {
      return json({
        exists: true,
        available: false,
        message: 'Utente sospeso'
      })
    }

    // Check if user is already registered for any activity on that day
    const existingRegistrations = await db
      .select({
        turnId: registrations.turn,
        turnDay: turns.day
      })
      .from(registrations)
      .innerJoin(turns, eq(registrations.turn, turns.id))
      .where(
        and(
          eq(registrations.user, email),
          eq(turns.day, day)
        )
      )

    if (existingRegistrations.length > 0) {
      return json({
        exists: true,
        available: false,
        message: 'Utente già registrato per un\'attività in questo giorno'
      })
    }

    // User exists and is available
    return json({
      exists: true,
      available: true
    })

  } catch (error) {
    console.error('Error checking user availability:', error)
    return json(
      { exists: false, available: false, message: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
