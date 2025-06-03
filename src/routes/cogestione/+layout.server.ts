import type { LayoutServerLoad } from './$types'
import { db } from '$db'
import { activities, eventDays, organizers, registrations, tournaments, turns, users } from '$schema'
import { eq, gt } from 'drizzle-orm'
import type { Activity } from '$types'
import { isRegistered } from '$lib/utils/is-registered'

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user!

  const eventDaysList = await db
    .select()
    .from(eventDays)

  // The turns of the activities that already registered users have signed up for
  const userRegistrations = await db
    .select({
      turn: registrations.turn,
      activity: turns.activity,
      day: turns.day,
      start: turns.start,
      end: turns.end
    })
    .from(registrations)
    .innerJoin(turns, eq(turns.id, registrations.turn))
    .where(eq(registrations.user, user.email))

  // Retrieves activity turns including the type of activity (individual or team)
  // and, if it is a tournament, the minimum and maximum number of participants
  const activitiesTurns = await db
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
    .where(gt(turns.capacity, 0))
    .orderBy(turns.start, turns.day)

  // Activity organized by the user (if they are an organizer)
  let organizerActivity: Activity | undefined

  if (user.roles.includes('organizzatore')) {
    organizerActivity = await db
      .select()
      .from(activities)
      .innerJoin(organizers, eq(organizers.activity, activities.name))
      .where(eq(organizers.user, user.email))
      .then(rows => rows[0]?.activities)
  }

  return {
    user,
    organizerActivity,
    userRegistrations,
    activitiesTurns,
    eventDays: eventDaysList,
    isRegistered: isRegistered(userRegistrations, activitiesTurns, eventDaysList)
  }
}
