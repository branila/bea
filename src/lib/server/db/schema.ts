import { pgEnum, pgTable, text, boolean, timestamp, primaryKey, date, time, integer, smallint, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).defaultNow().notNull(),
}

export const users = pgTable('users', {
  email: text('email').primaryKey().notNull(),
  surname: text('surname').notNull(),
  name: text('name').notNull(),
  class: text('class'),
  verified: boolean('verified').default(false).notNull(),
  banned: boolean('banned').default(false).notNull(),
  googleId: text('google_id'),
  ...timestamps
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().notNull(),
  user: text('user').references(() => users.email).notNull(),
  expiration: timestamp('expiration').notNull(),
  ...timestamps
})

export const roles = pgTable('roles', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  ...timestamps
})

export const userRoles = pgTable('user_roles', {
  user: text('user').references(() => users.email).notNull(),
  role: text('role').references(() => roles.name).notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.user, table.role] })
])

export const permissions = pgTable('permissions', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  ...timestamps
})

export const rolePermissions = pgTable('role_permissions', {
  role: text('role').references(() => roles.name).notNull(),
  permission: text('permission').references(() => permissions.name).notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.role, table.permission] })
])

export const days = pgTable('event_days', {
  date: date('date').primaryKey().notNull(),
  start: time('start').notNull(),
  end: time('end').notNull(),
  ...timestamps
})

export const activityType = pgEnum('activity_type', ['individual', 'team'])

export const activities = pgTable('activities', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  type: activityType().notNull(),
  ...timestamps
})

export const tournaments = pgTable('tournaments', {
  name: text('name').references(() => activities.name).primaryKey().notNull(),
  maxTeams: smallint('max_teams').notNull(),
  minTeamMembers: smallint('min_team_members').notNull(),
  maxTeamMembers: smallint('max_team_members').notNull(),
  ...timestamps
})

export const teams = pgTable('teams', {
  name: text('name').primaryKey().notNull(),
  tournament: text('tournament').references(() => tournaments.name).notNull(),
  ...timestamps
})

export const teamMembers = pgTable('team_members', {
  team: text('team').references(() => teams.name).notNull(),
  tournament: text('tournament').references(() => tournaments.name).notNull(),
  user: text('user').references(() => users.email).notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.team, table.user] })
])

export const turns = pgTable('activities_turns', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  day: date('day').references(() => days.date).notNull(),
  activity: text('activity').references(() => activities.name).notNull(),
  start: time('start').notNull(),
  end: time('end').notNull(),
  capacity: smallint('capacity').notNull(),
  ...timestamps
})

export const organizers = pgTable('organizers', {
  user: text('user').references(() => users.email).primaryKey().notNull(),
  activity: text('activity').references(() => activities.name).notNull(),
  ...timestamps
})

export const registrations = pgTable('registrations', {
  user: text('user').references(() => users.email).notNull(),
  turn: integer('turn').references(() => turns.id).notNull(),
  ...timestamps
})

export const tickets = pgTable('tickets', {
  id: varchar('id', { length: 4 }).primaryKey().notNull(),
  user: text('user').references(() => users.email).unique().notNull(),
  scanned: timestamp('scanned'),
  authenticator: text('authenticator').references(() => users.email)
})

export const registrationWindow = pgTable('registration_window', {
  opening: timestamp('opening').notNull(),
  closing: timestamp('closing').notNull(),
}, table => [
  primaryKey({ columns: [table.opening, table.closing] })
])
