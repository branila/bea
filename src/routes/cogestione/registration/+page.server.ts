import { db } from '$db'
import { eq, gt } from 'drizzle-orm'
import type { PageServerLoad, Actions } from './$types'
import { registrations, turns, eventDays, activities, tournaments } from '$schema'

export const load: PageServerLoad = async ({ parent }) => {
  const { user, userRegistrations, activitiesTurns, eventDays } = await parent()

  return {
    user,
    userRegistrations,
    activitiesTurns,
    eventDays,
  }
}
