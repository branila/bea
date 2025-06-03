import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$db'
import {
  registrations,
  turns,
  activities,
  tournaments,
  teams,
  teamMembers,
  users,
  eventDays
} from '$schema'
import { eq, and, inArray, sql } from 'drizzle-orm'

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\.studente[0-9]*@itispaleocapa\.it$/
  return emailRegex.test(email)
}

// Check if user exists
async function checkUserExists(email: string) {
  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return user.length > 0
}

// Check if user is already registered for a specific day
async function checkUserRegisteredForDay(userEmail: string, day: string) {
  const userRegistration = await db
    .select({ user: registrations.user })
    .from(registrations)
    .innerJoin(turns, eq(registrations.turn, turns.id))
    .where(and(
      eq(registrations.user, userEmail),
      eq(turns.day, day)
    ))
    .limit(1)

  return userRegistration.length > 0
}

// Check if team name is available for a specific day and activity
async function checkTeamNameAvailable(teamName: string, day: string, activity: string) {
  const existingTeam = await db
    .select({ name: teams.name })
    .from(teams)
    .innerJoin(tournaments, eq(teams.tournament, tournaments.activity))
    .innerJoin(turns, eq(tournaments.activity, turns.activity))
    .where(and(
      eq(teams.name, teamName),
      eq(turns.day, day),
      eq(turns.activity, activity)
    ))
    .limit(1)

  return existingTeam.length === 0
}

// Validate team registration data
async function validateTeamRegistration(
  teamData: any,
  selectedTurn: any,
  userEmail: string,
  day: string
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  // Check team name
  if (!teamData.name || !teamData.name.trim()) {
    errors.push('Nome squadra obbligatorio')
  } else {
    const isNameAvailable = await checkTeamNameAvailable(teamData.name.trim(), day, selectedTurn.activity)
    if (!isNameAvailable) {
      errors.push('Nome squadra già esistente')
    }
  }

  // Check team members count
  const totalMembers = teamData.members.length + 1 // +1 for current user
  if (totalMembers < selectedTurn.minTeamMembers) {
    errors.push(`La squadra deve avere almeno ${selectedTurn.minTeamMembers} membri`)
  }

  if (totalMembers > selectedTurn.maxTeamMembers) {
    errors.push(`La squadra può avere al massimo ${selectedTurn.maxTeamMembers} membri`)
  }

  // Validate each member
  const allEmails = [userEmail, ...teamData.members.map((m: any) => m.email)]
  const uniqueEmails = new Set(allEmails.map((email: string) => email.toLowerCase()))

  if (uniqueEmails.size !== allEmails.length) {
    errors.push('Email duplicate nella squadra')
  }

  for (const member of teamData.members) {
    if (!member.email || !member.email.trim()) {
      errors.push('Email membro obbligatoria')
      continue
    }

    if (!isValidEmail(member.email)) {
      errors.push(`Email non valida: ${member.email}`)
      continue
    }

    if (member.email.toLowerCase() === userEmail.toLowerCase()) {
      errors.push('Non puoi inserire la tua email come membro')
      continue
    }

    // Check if user exists
    const userExists = await checkUserExists(member.email)
    if (!userExists) {
      errors.push(`Utente non trovato: ${member.email}`)
      continue
    }

    // Check if user is already registered for this day
    const alreadyRegistered = await checkUserRegisteredForDay(member.email, day)
    if (alreadyRegistered) {
      errors.push(`${member.email} è già registrato per questo giorno`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check if selected activities cover the entire event day
async function validateEventDayCoverage(
  selectedTurnIds: number[],
  day: string
): Promise<{ isValid: boolean; error?: string }> {
  // Get event day info
  const eventDay = await db
    .select()
    .from(eventDays)
    .where(eq(eventDays.date, day))
    .limit(1)

  if (eventDay.length === 0) {
    return { isValid: false, error: 'Giorno evento non trovato' }
  }

  // Get selected turns
  const selectedTurns = await db
    .select()
    .from(turns)
    .where(inArray(turns.id, selectedTurnIds))
    .orderBy(turns.start)

  if (selectedTurns.length === 0) {
    return { isValid: false, error: 'Nessuna attività selezionata' }
  }

  // Check if first turn starts at event day start
  if (selectedTurns[0].start !== eventDay[0].start) {
    return { isValid: false, error: 'Le attività devono coprire tutto il periodo dell\'evento' }
  }

  // Check if last turn ends at event day end
  if (selectedTurns[selectedTurns.length - 1].end !== eventDay[0].end) {
    return { isValid: false, error: 'Le attività devono coprire tutto il periodo dell\'evento' }
  }

  return { isValid: true }
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const user = locals.user
    if (!user) {
      return json({ error: 'Utente non autenticato' }, { status: 401 })
    }

    const data = await request.json()
    const { selectedActivities, teamRegistrations } = data

    if (!selectedActivities || typeof selectedActivities !== 'object') {
      return json({ error: 'Dati di registrazione non validi' }, { status: 400 })
    }

    // Start transaction
    const result = await db.transaction(async (tx) => {
      const registrationResults = []

      // Process each day
      for (const [day, daySelections] of Object.entries(selectedActivities)) {
        const selectedTurnIds = (daySelections as (number | undefined)[])
          .filter((id): id is number => id !== undefined)

        if (selectedTurnIds.length === 0) {
          continue
        }

        // Check if user is already registered for this day
        const alreadyRegistered = await checkUserRegisteredForDay(user.email, day)
        if (alreadyRegistered) {
          throw new Error(`Sei già registrato per il giorno ${day}`)
        }

        // Validate event day coverage
        const coverageValidation = await validateEventDayCoverage(selectedTurnIds, day)
        if (!coverageValidation.isValid) {
          throw new Error(coverageValidation.error!)
        }

        // Get detailed turn information
        const selectedTurns = await tx
          .select({
            id: turns.id,
            day: turns.day,
            activity: turns.activity,
            start: turns.start,
            end: turns.end,
            capacity: turns.capacity,
            type: activities.type,
            minTeamMembers: tournaments.minTeamMembers,
            maxTeamMembers: tournaments.maxTeamMembers,
          })
          .from(turns)
          .innerJoin(activities, eq(turns.activity, activities.name))
          .leftJoin(tournaments, eq(turns.activity, tournaments.activity))
          .where(inArray(turns.id, selectedTurnIds))

        // Check capacity for all selected turns
        for (const turn of selectedTurns) {
          if (turn.capacity <= 0) {
            throw new Error(`Attività "${turn.activity}" non ha più posti disponibili`)
          }
        }

        // Process each selected turn
        for (const turn of selectedTurns) {
          if (turn.type === 'team') {
            // Handle team registration
            const teamData = teamRegistrations?.[day]?.[selectedTurnIds.indexOf(turn.id)]

            if (!teamData) {
              throw new Error(`Dati squadra mancanti per ${turn.activity}`)
            }

            // Validate team registration
            const validation = await validateTeamRegistration(teamData, turn, user.email, day)
            if (!validation.isValid) {
              throw new Error(validation.errors.join(', '))
            }

            // Create team
            await tx.insert(teams).values({
              name: teamData.name.trim(),
              tournament: turn.activity
            })

            // Add team members (including current user)
            const allMembers = [user.email, ...teamData.members.map((m: any) => m.email)]

            for (const memberEmail of allMembers) {
              await tx.insert(teamMembers).values({
                team: teamData.name.trim(),
                user: memberEmail
              })
            }

            // Register all team members for this turn
            for (const memberEmail of allMembers) {
              await tx.insert(registrations).values({
                user: memberEmail,
                turn: turn.id
              })
            }
          } else {
            // Handle individual registration
            await tx.insert(registrations).values({
              user: user.email,
              turn: turn.id
            })
          }

          // Decrease turn capacity
          await tx
            .update(turns)
            .set({
              capacity: sql`${turns.capacity} - 1`
            })
            .where(eq(turns.id, turn.id))
        }

        registrationResults.push({
          day,
          turns: selectedTurns.map(t => ({
            id: t.id,
            activity: t.activity,
            start: t.start,
            end: t.end
          }))
        })
      }

      return registrationResults
    })

    return json({
      success: true,
      message: 'Registrazione completata con successo!',
      registrations: result
    })

  } catch (error) {
    console.error('Registration error:', error)

    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Errore durante la registrazione'
    }, { status: 400 })
  }
}
