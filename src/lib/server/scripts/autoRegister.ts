import postgres from 'postgres'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../../schema'
import { eq, isNull, and, arrayContains, not, or } from 'drizzle-orm'

dotenv.config()

console.log('Starting ticket creation script...')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

console.log('Connecting to the database...')

const client = postgres(process.env.DATABASE_URL, {
  connection: {
    options: '-c client_min_messages=warning'
  }
})

const db = drizzle(client, { schema })

await autoRegister()

//Find users without registrations on a specific date and automatically register them
export async function autoRegister() {
  const usersWithoutRegistrations = await db
    .select()
    .from(schema.registrations)
    .innerJoin(schema.turns, eq(schema.turns.id, schema.registrations.turn))
    .rightJoin(schema.users, eq(schema.registrations.user, schema.users.email))
    .where(and(or(eq(schema.turns.day, '2025-06-07'), isNull(schema.turns.day)), isNull(schema.registrations.turn), not(arrayContains(schema.users.roles, ['docente']))))

  for (const user of usersWithoutRegistrations) {
    const activities = [[38, 39, 40], [42, 43, 44], [45, 46, 47]]

    // Randomly select one of the activity sets on a 40/20/40 split
    const randomIndex = Math.floor(Math.random() * 10)
    let selectedActivities
    if (randomIndex < 4) {
      selectedActivities = activities[0] // 40% chance
    } else if (randomIndex < 6) {
      selectedActivities = activities[1] // 20% chance
    } else {
      selectedActivities = activities[2] // 40% chance
    }

    // Create a registration for the user with the selected activities
    for (const activity of selectedActivities) {
      await db.insert(schema.registrations).values({
        user: user.users.email,
        turn: activity
      })
    }

  }

  console.log(`Created registrations for ${usersWithoutRegistrations.length} users without registrations.`)
}