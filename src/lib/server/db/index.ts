import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import { env } from '$env/dynamic/private'

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(env.DATABASE_URL, { schema })
