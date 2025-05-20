import { timestamps } from './timestamps'
import { pgTable, text, timestamp, smallint, varchar, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { turns } from './activities'

export const registrations = pgTable('registrations', {
  user: text('user').references(() => users.email).notNull(),
  turn: smallint('turn').references(() => turns.id).notNull(),
  ...timestamps
}, (table) => [
  primaryKey({ columns: [table.user, table.turn] })
])

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.user],
    references: [users.email],
  }),
  turn: one(turns, {
    fields: [registrations.turn],
    references: [turns.id],
  }),
}))

export const tickets = pgTable('tickets', {
  id: varchar('id', { length: 4 }).primaryKey().notNull(),
  user: text('user').references(() => users.email).unique().notNull(),
  scanned: timestamp('scanned'),
  authenticator: text('authenticator').references(() => users.email),
  ...timestamps
})

export const ticketsRelations = relations(tickets, ({ one }) => ({
  owner: one(users, {
    fields: [tickets.user],
    references: [users.email],
    relationName: 'ticketOwner',
  }),
  authenticator: one(users, {
    fields: [tickets.authenticator],
    references: [users.email],
    relationName: 'ticketAuthenticator',
  }),
}))
