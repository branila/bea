import { pgTable, pgEnum, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { timestamps } from './timestamps'
import { organizers } from './activities'
import { registrations, scans, tickets } from './registrations'

export const roles = pgEnum('roles', [
  'studente', // Regular students can register to activities and view them
  'rappresentante', // Class representatives can view their classmates' registrations
  'organizzatore', // Activity organizers can view informations about their activity
  'sicurezza', // Security members can access the ticket scanner
  'docente', // Teachers can access student registrations and ticket scanning
  'amministratore' // Administrators have full platform access and control
])

export const users = pgTable('users', {
  email: text('email').primaryKey().notNull(),
  surname: text('surname').notNull(),
  name: text('name').notNull(),
  class: text('class'),
  roles: roles().array().default(['studente']).notNull(),
  banned: boolean('banned').default(false).notNull(),
  googleId: text('google_id'),
  ...timestamps
})

export const usersRelations = relations(users, ({ many, one }) => ({
  organizers: many(organizers),
  registrations: many(registrations),
  ticketOwner: one(tickets, {
    fields: [users.email],
    references: [tickets.user]
  }),
  ticketAuthenticator: many(scans),
}))

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().notNull(),
  user: text('user').references(() => users.email).notNull(),
  expiration: timestamp('expiration').notNull(),
  ...timestamps
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user],
    references: [users.email],
  }),
}))
