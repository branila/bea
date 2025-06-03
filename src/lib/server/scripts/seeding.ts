import fs from 'fs'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql, getTableName, eq } from 'drizzle-orm'
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core'
import postgres from 'postgres'
import dotenv from 'dotenv'
import * as schema from '../../schema'
import type { Organizer, Role } from '../../types'
import { generateUniqueTicketId } from '$lib/server/db/utils'

import {
  users,
  eventDays,
  activities,
  tournaments,
  turns,
  organizers,
  opening,
  registrations,
  tickets
} from '../../schema'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(process.env.DATABASE_URL, {
  connection: {
    options: '-c client_min_messages=warning'
  }
})
const db = drizzle(client, { schema })

const tables = [
  users,
  opening,
  eventDays,
  activities,
  tournaments,
  turns,
  organizers,
]

seedDatabase()

async function seedDatabase() {
  console.log('Starting database seeding...\n')

  try {
    // Clean up the database
    await truncateTables()

    // Insert basic data
    await seedTables()

    // Assign roles to users
    await assignRoles()

    console.log('\nDatabase seeding completed successfully!')
  } catch (error) {
    console.error('\nDatabase seeding failed:', error)
  } finally {
    await client.end()
  }
}

// Truncate all tables
async function truncateTables() {
  console.log('Cleaning up database tables...\n')

  for (const table of tables) {
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`))

      console.log(`Truncated table ${getTableName(table)}`)
    } catch (error) {
      console.error(`Failed to truncate ${getTableName(table)}:`, error)
    }
  }

  console.log('Database truncated successfully\n')
}

async function seedTables() {
  console.log('Starting to seed database tables...\n')

  for (const table of tables) {
    let transform: ((item: Record<string, any>) => Record<string, any>) | undefined

    if (getTableName(table) == 'opening') {
      transform = (item: any) => ({
        opening: new Date(item.opening),
        closing: new Date(item.closing)
      })
    }

    await seedEntity(table, transform)
  }

  console.log('Database tables seeded successfully\n')
}

async function seedEntity<
  T extends PgTable<TableConfig>,
  I extends Record<string, any>
>(
  table: T,
  transformer?: (item: I) => I, // Modifies the item before insertion
) {
  const fileName = `${getTableName(table)}.json`
  console.log(`Seeding ${getTableName(table)} from ${fileName}...`)

  try {
    const items = loadJsonData(fileName)

    for (const item of items) {
      const data = transformer ? transformer(item) : item
      await db.insert(table).values(data)
    }

    console.log(`Seeded ${items.length} items into ${getTableName(table)}`)
  } catch (error) {
    console.error(`Error seeding ${getTableName(table)}:`, error)
  }
}

function loadJsonData(fileName: string) {
  console.log(`Loaded ${fileName} data...`)

  try {
    return JSON.parse(fs.readFileSync(`./seeding/${fileName}`, 'utf8'))

  } catch (error) {
    console.error(`Error loading file ${fileName}:`, error)
    return []
  }
}

async function assignRoles() {
  console.log('Starting role assignment process...\n')

  const roleAssignments = [
    { role: 'amministratore', file: 'administrators.json' },
    { role: 'sicurezza', file: 'security.json' },
    { role: 'rappresentante', file: 'representants.json' },
    { role: 'organizzatore', file: 'organizers.json' }
  ]

  for (const { role, file } of roleAssignments) {
    console.log(`Processing ${role} role assignments...`)

    let emails = loadJsonData(file)

    // Extracts emails from the 'organizers.json' file
    if (file == 'organizers.json') {
      emails = emails.map((email: Organizer) => email.user)

      console.log("Setting up organizers' registrations...")
      // Set organizer as registered for the activity they are organizing
      for (const email of emails) {
        // Find all turns for the activity the organizer is associated with
        const activityTurns = await db
          .select({ id: turns.id })
          .from(turns)
          .innerJoin(activities, eq(turns.activity, activities.name))
          .innerJoin(organizers, eq(turns.activity, organizers.activity))
          .where(eq(organizers.user, email))

        // Insert registrations for each turn
        for (const turn of activityTurns) {
          await db
            .insert(registrations)
            .values({
              user: email,
              turn: turn.id
            })
        }
        // Create a ticket for the organizer
        await createTicket(email)
      }
    } else if (file == 'security.json') {
      // For security, we need to ensure they are registered for all turns
      console.log("Setting up security's registrations...")

      const securityTurns = await db
        .select({ id: turns.id })
        .from(turns)
        .innerJoin(activities, eq(turns.activity, activities.name))
        .where(eq(activities.name, 'Security'))

      for (const email of emails) {
        // Insert registrations for each turn
        for (const turn of securityTurns) {
          await db
            .insert(registrations)
            .values({
              user: email,
              turn: turn.id
            })
        }
        // Create a ticket for the security personnel
        await createTicket(email)
      }
    }

    for (const email of emails) {
      await setRole(email, role as Role)
    }

    console.log(`Assigned role ${role} to ${emails.length} users`)
  }

  console.log('\nRole assignment completed successfully!')
}

async function createTicket(userEmail: string) {
  const ticketId = await generateUniqueTicketId()
  await db.insert(schema.tickets).values({
    id: ticketId,
    user: userEmail
  })
}

async function setRole(userEmail: string, role: Role) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, userEmail))
    .limit(1)

  if (!user) {
    console.error(`User not found: ${userEmail}`)
    return
  }

  // Remove 'studente' role if present
  if (user.roles.includes('studente')) {
    user.roles.splice(user.roles.indexOf('studente'), 1)
  }

  // Add the new role if not already present
  if (!user.roles.includes(role)) {
    user.roles.push(role)
  }

  // Update the user
  await db
    .update(schema.users)
    .set(user)
    .where(eq(schema.users.email, userEmail))
}
