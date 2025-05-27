import type { LayoutServerLoad } from './$types'
import { db } from '$db'
import { activities, organizers, registrations, users } from '$schema'
import { eq } from 'drizzle-orm'
import type { Activity } from '$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user!

  // Activity organized by the user (if they are an organizer)
  let organizerActivity: Activity | undefined

  const isRegistered = await db
    .select()
    .from(registrations)
    .where(eq(registrations.user, user.email))
    .then(rows => rows.length > 0)

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
    isRegistered
  }
}
