import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$db'
import { activities, registrations, teamMembers, teams, turns } from '$schema'
import { eq } from 'drizzle-orm'

type TeamRegistrations = {
  team: string,
  tournamentTurn: number,
  members: string[] // Members emails
}[]

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const user = locals.user
    if (!user) {
      return json({ error: 'Utente non autenticato'}, { status: 401 })
    }

    const {
      selectedActivities,
      teamRegistrations
    }: {
      selectedActivities: number[]
      teamRegistrations: TeamRegistrations
    } = await request.json()

    for (const turn of selectedActivities) {
      await db
        .insert(registrations)
        .values({ user: user.email.toLowerCase(), turn })
    }

    for (const { team, tournamentTurn, members } of teamRegistrations) {
      const tournament = await db
        .select({ name: activities.name })
        .from(activities)
        .innerJoin(turns, eq(turns.id, tournamentTurn))
        .then(tournaments => tournaments[0])

      await db
        .insert(teams)
        .values({
          name: team,
          tournament: tournament.name
        })

      for (let member of members) {
        member = member.toLowerCase()

        await db
          .insert(teamMembers)
          .values({
            team,
            user: member
          })

        await db
          .insert(registrations)
          .values({
            user: member,
            turn: tournamentTurn
          })
      }
    }

    return json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)

    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Errore durante la registrazione'
    }, { status: 400 })
  }
}
