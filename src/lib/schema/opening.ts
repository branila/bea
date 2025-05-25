import { pgTable, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { timestamps } from './timestamps'

// Contains opening and closing dates for registration
export const opening = pgTable('opening', {
  opening: timestamp('opening').notNull(),
  closing: timestamp('closing').notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.opening, table.closing] })
])
