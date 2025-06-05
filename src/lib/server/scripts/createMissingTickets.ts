import postgres from 'postgres'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../../schema'
import { eq, isNull, and, arrayContains, not } from 'drizzle-orm'

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

await createMissingTickets()

//Find users without tickets and create missing tickets for non-teachers
export async function createMissingTickets() {
  const usersWithoutTickets = await db
    .select()
    .from(schema.users)
    .leftJoin(schema.tickets, eq(schema.tickets.user, schema.users.email))
    .where(and(isNull(schema.tickets.id), not(arrayContains(schema.users.roles, ['docente']))))
    .execute()

  for (const user of usersWithoutTickets) {
    const ticketId = await generateUniqueTicketId()
    await db.insert(schema.tickets).values({
      id: ticketId,
      user: user.users.email
    }).execute()
  }

  console.log(`Created tickets for ${usersWithoutTickets.length} users without tickets.`)
}

async function generateUniqueTicketId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
  let attempts = 0
  const maxAttempts = 100

  while (attempts < maxAttempts) {
    const id = Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')

    const existing = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id))
    if (existing.length === 0) return id

    attempts++
  }

  throw new Error('Impossibile generare un ID unico dopo diversi tentativi')
}