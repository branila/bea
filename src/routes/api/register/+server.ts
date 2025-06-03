import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$db'
import { activities, registrations, teamMembers, teams, turns, tickets } from '$schema'
import { eq } from 'drizzle-orm'
import { generateUniqueTicketId } from '$db/utils'

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

    // Raccoglie tutti gli utenti che necessitano di un ticket
    const usersNeedingTickets = new Set<string>()
    usersNeedingTickets.add(user.email.toLowerCase())

    // Aggiunge tutti i membri dei team
    for (const { members } of teamRegistrations) {
      for (const member of members) {
        usersNeedingTickets.add(member.toLowerCase())
      }
    }

    // Esegue tutto in una transazione
    await db.transaction(async (tx) => {
      // 1. Crea i ticket per tutti gli utenti che ne hanno bisogno
      for (const userEmail of usersNeedingTickets) {
        // Controlla se il ticket esiste già
        const existingTicket = await tx
          .select()
          .from(tickets)
          .where(eq(tickets.user, userEmail))
          .limit(1)

        // Se non esiste, crea un nuovo ticket
        if (existingTicket.length === 0) {
          const ticketId = await generateUniqueTicketId()
          await tx
            .insert(tickets)
            .values({
              id: ticketId,
              user: userEmail
            })
        }
      }

      // 2. Registra l'utente alle attività individuali selezionate
      for (const turn of selectedActivities) {
        await tx
          .insert(registrations)
          .values({ user: user.email.toLowerCase(), turn })
      }

      // 3. Gestisce le registrazioni dei team per i tornei
      for (const { team, tournamentTurn, members } of teamRegistrations) {
        // Ottiene il nome del torneo dall'attività
        const tournamentResult = await tx
          .select({ name: activities.name })
          .from(activities)
          .innerJoin(turns, eq(turns.activity, activities.name))
          .where(eq(turns.id, tournamentTurn))
          .limit(1)

        if (tournamentResult.length === 0) {
          throw new Error(`Torneo non trovato per il turno ${tournamentTurn}`)
        }

        const tournament = tournamentResult[0]

        // Crea il team
        await tx
          .insert(teams)
          .values({
            name: team,
            tournament: tournament.name
          })

        // Aggiunge i membri al team e li registra al torneo
        for (let member of members) {
          member = member.toLowerCase()

          // Aggiunge il membro al team
          await tx
            .insert(teamMembers)
            .values({
              team,
              user: member
            })

          // Registra il membro al turno del torneo
          await tx
            .insert(registrations)
            .values({
              user: member,
              turn: tournamentTurn
            })
        }
      }
    })

    return json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)

    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Errore durante la registrazione'
    }, { status: 400 })
  }
}
