import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$db'
import { eq } from 'drizzle-orm'
import { registrations, turns, activities, users } from '$schema'

export const load: PageServerLoad = async ({ locals, params }) => {
  const queriedClass = params.class.toUpperCase()
  
  if (queriedClass != locals.user?.class && !locals.user?.roles.includes('amministratore') && !locals.user?.roles.includes('docente')) {
    error(403, 'Non hai accesso a questa classe')
  }

  // Get students in the class
  const [studentsQueryError, students] = await goCatch(
    db.select()
      .from(users)
      .where(eq(users.class, queriedClass))
      .orderBy(users.surname, users.name)
  )
  
  if (studentsQueryError || students.length == 0) {
    error(400, 'Errore nel caricamento degli studenti')
  }

  // Get all registrations with activity details including day and time
  const [studentRegistrationsQueryError, allRegistrations] = await goCatch(
    db.select({
      userEmail: users.email,
      activityName: activities.name,
      day: turns.day,
      startTime: turns.start,
      endTime: turns.end,
    })
      .from(registrations)
      .innerJoin(turns, eq(registrations.turn, turns.id))
      .innerJoin(activities, eq(turns.activity, activities.name))
      .innerJoin(users, eq(registrations.user, users.email))
      .where(eq(users.class, queriedClass)) // Filter by class
      .orderBy(turns.day, turns.start) // Sort by day, then by start time
  )
  
  if (studentRegistrationsQueryError) {
    error(400, 'Errore nel caricamento delle registrazioni')
  }

  // Get all unique event days for the header
  const [eventDaysQueryError, eventDays] = await goCatch(
    db.select({
      date: turns.day
    })
      .from(turns)
      .groupBy(turns.day)
      .orderBy(turns.day)
  )

  if (eventDaysQueryError) {
    error(400, 'Errore nel caricamento dei giorni dell\'evento')
  }

  return {
    students,
    registrations: allRegistrations,
    eventDays: eventDays.map(d => d.date)
  }
}