import { db } from "$db"
import { registrations, turns, activities } from "$schema"
import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"

export const GET: RequestHandler = async ({ locals }) => {
  const user = locals.user

  if (!user) {
    return json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const userRegistrations = await db
    .select({
      turn: registrations.turn,
    })
    .from(registrations)
    .innerJoin(turns, eq(registrations.turn, turns.id))
    .innerJoin(activities, eq(turns.activity, activities.name))
    .where(
      and(
        eq(registrations.user, user.email),
        eq(activities.type, 'individual')
      )
    )

  for (const userRegistration of userRegistrations) {
    await db
      .delete(registrations)
      .where(
        and(
          eq(registrations.turn, userRegistration.turn),
          eq(registrations.user, user.email)
        )
      )
  }

  return json({ ok: true })
}
