import { pgTable, timestamp, primaryKey } from 'drizzle-orm/pg-core'

// Utility properties used in all tables
export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).defaultNow().notNull(),
}

// Contains opening and closing dates for registration
export const timespan = pgTable('timespan', {
  opening: timestamp('opening').notNull(),
  closing: timestamp('closing').notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.opening, table.closing] })
])
