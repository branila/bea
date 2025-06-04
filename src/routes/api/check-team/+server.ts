// src/routes/api/check-team/+server.ts
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$db'
import { teams, tournaments, turns, activities } from '$schema'
import { eq, and } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { teamName, day } = await request.json()

    if (!teamName || !day) {
      return json(
        { available: false, message: 'Nome squadra e giorno sono richiesti' },
        { status: 400 }
      )
    }

    const trimmedTeamName = teamName.trim()

    if (trimmedTeamName.length === 0) {
      return json({
        available: false,
        message: 'Il nome della squadra non può essere vuoto'
      })
    }

    // Check if team namse already exists for any tournament on the same day
    // We need to check teams that are registered for tournaments happening on the specified day
    const existingTeams = await db
      .select({
        teamName: teams.name,
        tournamentActivity: teams.tournament,
        turnDay: turns.day
      })
      .from(teams)
      .innerJoin(tournaments, eq(teams.tournament, tournaments.activity))
      .innerJoin(activities, eq(tournaments.activity, activities.name))
      .innerJoin(turns, and(
        eq(turns.activity, activities.name),
        eq(turns.day, day)
      ))
      .where(eq(teams.name, trimmedTeamName))

    if (existingTeams.length > 0) {
      return json({
        available: false,
        message: 'Nome squadra già esistente per questo giorno'
      })
    }

    // Team name is available
    return json({
      available: true
    })

  } catch (error) {
    console.error('Error checking team name availability:', error)
    return json(
      { available: false, message: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
