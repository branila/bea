import { relations } from 'drizzle-orm'

import {
  users,
  roles,
  userRoles,
  permissions,
  rolePermissions,
  days,
  activities,
  tournaments,
  teams,
  teamMembers,
  turns,
  organizers,
  registrations,
  tickets
} from './schema'

export const usersRelations = relations(users, ({ many, one }) => ({
  userRoles: many(userRoles),
  organizers: many(organizers),
  registrations: many(registrations),
  ticket: one(tickets, {
    fields: [users.email],
    references: [tickets.user],
  }),
  authenticatedTickets: many(tickets),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}))

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user],
    references: [users.email],
  }),
  role: one(roles, {
    fields: [userRoles.role],
    references: [roles.name],
  }),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.role],
    references: [roles.name],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permission],
    references: [permissions.name],
  }),
}))

export const daysRelations = relations(days, ({ many }) => ({
  turns: many(turns),
}))

export const activitiesRelations = relations(activities, ({ many, one }) => ({
  turns: many(turns),
  organizers: many(organizers),
  tournament: one(tournaments, {
    fields: [activities.name],
    references: [tournaments.name],
  })
}))

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  activity: one(activities, {
    fields: [tournaments.name],
    references: [activities.name],
  }),
  teams: many(teams),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournament],
    references: [tournaments.name],
  }),
  members: many(teamMembers),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.team],
    references: [teams.name],
  }),
  user: one(users, {
    fields: [teamMembers.user],
    references: [users.email],
  }),
  tournament: one(tournaments, {
    fields: [teamMembers.tournament],
    references: [tournaments.name],
  }),
}))

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

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.user],
    references: [users.email],
    relationName: 'user',
  }),
  authenticator: one(users, {
    fields: [tickets.authenticator],
    references: [users.email],
    relationName: 'authenticator',
  }),
}))
