import { timestamp } from 'drizzle-orm/pg-core'

// Utility properties used in all tables
export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).defaultNow().notNull(),
}
