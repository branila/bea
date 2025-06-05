import { db } from "$db"
import { activities, registrations, tournaments, turns } from "$schema"
import { gt } from "drizzle-orm"
import type { RequestHandler } from "./$types"
import { eq } from "drizzle-orm"
import { json } from "@sveltejs/kit"

export const GET: RequestHandler = async () => {
  // The turns of the activities that already registered users have signed up for
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
      .orderBy(turns.start, turns.day)

  return json({ activitiesTurns })
}
