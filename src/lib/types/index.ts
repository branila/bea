import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  users,
  roles,
  sessions,
  days,
  activities,
  tournaments,
  teams,
  teamMembers,
  turns,
  organizers,
  registrations,
  tickets,
  timespan,
  activityType
} from '$lib/schema'

export type User = InferSelectModel<typeof users>
export type Session = InferSelectModel<typeof sessions>
export type Day = InferSelectModel<typeof days>
export type Activity = InferSelectModel<typeof activities>
export type Tournament = InferSelectModel<typeof tournaments>
export type Team = InferSelectModel<typeof teams>
export type TeamMember = InferSelectModel<typeof teamMembers>
export type Turn = InferSelectModel<typeof turns>
export type Organizer = InferSelectModel<typeof organizers>
export type Registration = InferSelectModel<typeof registrations>
export type Ticket = InferSelectModel<typeof tickets>
export type Timespan = InferSelectModel<typeof timespan>

export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof sessions>
export type NewDay = InferInsertModel<typeof days>
export type NewActivity = InferInsertModel<typeof activities>
export type NewTournament = InferInsertModel<typeof tournaments>
export type NewTeam = InferInsertModel<typeof teams>
export type NewTeamMember = InferInsertModel<typeof teamMembers>
export type NewTurn = InferInsertModel<typeof turns>
export type NewOrganizer = InferInsertModel<typeof organizers>
export type NewRegistration = InferInsertModel<typeof registrations>
export type NewTicket = InferInsertModel<typeof tickets>
export type NewTimespan = InferInsertModel<typeof timespan>

export type Role = typeof roles.enumValues[number]
export type ActivityType = typeof activityType.enumValues[number]
