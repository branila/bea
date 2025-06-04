import { pgTable, pgEnum, primaryKey, text, time, date, smallint, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { timestamps } from './timestamps'
import { users } from './users'
import { registrations } from './registrations'

export const eventDays = pgTable('event_days', {
  date: date('date').primaryKey().notNull(),
  start: time('start').notNull(),
  end: time('end').notNull(),
  ...timestamps
})

export const daysRelations = relations(eventDays, ({ many }) => ({
  turns: many(turns),
}))

export const activityType = pgEnum('activity_type', [
  'individual', 'team'
])

export const activities = pgTable('activities', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  details: text('details').notNull(),
  type: activityType().notNull(),
  image: text('image'),
  ...timestamps
})

export const activitiesRelations = relations(activities, ({ many, one }) => ({
  turns: many(turns),
  organizers: many(organizers),
  tournament: one(tournaments, {
    fields: [activities.name],
    references: [tournaments.activity],
  })
}))

export const tournaments = pgTable('tournaments', {
  activity: text('name').references(() => activities.name).primaryKey().notNull(),
  minTeamMembers: smallint('min_team_members').notNull(),
  maxTeamMembers: smallint('max_team_members').notNull(),
  ...timestamps
})

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  activity: one(activities, {
    fields: [tournaments.activity],
    references: [activities.name],
  }),
  teams: many(teams),
}))

export const teams = pgTable('teams', {
  name: text('name').primaryKey().notNull(),
  tournament: text('tournament').references(() => tournaments.activity).notNull(),
  ...timestamps
})

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournament],
    references: [tournaments.activity],
  }),
  members: many(teamMembers),
}))

export const teamMembers = pgTable('team_members', {
  team: text('team').references(() => teams.name).notNull(),
  user: text('user').references(() => users.email).notNull(),
  ...timestamps
}, table => [
  primaryKey({ columns: [table.team, table.user] })
])

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.team],
    references: [teams.name],
  }),
}))

export const turns = pgTable('turns', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  day: date('day').references(() => eventDays.date).notNull(),
  activity: text('activity').references(() => activities.name).notNull(),
  start: time('start').notNull(),
  end: time('end').notNull(),
  capacity: smallint('capacity').notNull(),
  ...timestamps
})

export const turnsRelations = relations(turns, ({ one, many }) => ({
  day: one(eventDays, {
    fields: [turns.day],
    references: [eventDays.date],
  }),
  activity: one(activities, {
    fields: [turns.activity],
    references: [activities.name],
  }),
  registrations: many(registrations),
}))

export const organizers = pgTable('organizers', {
  user: text('user').references(() => users.email).primaryKey().notNull(),
  activity: text('activity').references(() => activities.name).notNull(),
  ...timestamps
})

export const organizersRelations = relations(organizers, ({ one }) => ({
  user: one(users, {
    fields: [organizers.user],
    references: [users.email],
  }),
  activity: one(activities, {
    fields: [organizers.activity],
    references: [activities.name],
  }),
}))
