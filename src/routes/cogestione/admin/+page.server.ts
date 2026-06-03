import type { PageServerLoad } from './$types'
import { db } from '$db'
import {
  users,
  activities,
  turns,
  organizers,
  tickets,
  scans,
  registrations,
  opening as openingTable,
  eventDays,
} from '$schema'
import { count, countDistinct, sql, eq, desc } from 'drizzle-orm'

export const load: PageServerLoad = async () => {
  const today = new Date().toISOString().split('T')[0]

  // All queries run in parallel for efficiency
  const [
    totalUsersResult,
    totalStudentsResult,
    totalActivitiesResult,
    totalTurnsResult,
    totalOrganizersResult,
    totalSecurityResult,
    totalRepresentantsResult,
    totalTicketsResult,
    studentsRegisteredResult,
    totalScansTodayResult,
    totalScansResult,
    ticketsValidatedResult,
    totalEventDaysResult,
    openingRows,
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    // Non-teachers only — used to verify ticket coverage
    db.select({ value: count() }).from(users).where(sql`NOT ('docente' = ANY(${users.roles}))`),
    db.select({ value: count() }).from(activities),
    db.select({ value: count() }).from(turns),
    db.select({ value: count() }).from(organizers),
    db.select({ value: count() }).from(users).where(sql`'sicurezza' = ANY(${users.roles})`),
    db.select({ value: count() }).from(users).where(sql`'rappresentante' = ANY(${users.roles})`),
    db.select({ value: count() }).from(tickets),
    db.select({ value: countDistinct(registrations.user) }).from(registrations),
    db.select({ value: count() }).from(scans).where(eq(scans.date, today)),
    db.select({ value: count() }).from(scans),
    // Unique tickets scanned at least once across all event days
    db.select({ value: countDistinct(scans.ticket) }).from(scans),
    db.select({ value: count() }).from(eventDays),
    // Most recent window by closing date
    db.select().from(openingTable).orderBy(desc(openingTable.closing)).limit(1),
  ])

  const now = new Date()
  const registrationWindow = openingRows[0] ?? null
  const isRegistrationOpen = registrationWindow
    ? now >= registrationWindow.opening && now <= registrationWindow.closing
    : false

  return {
    totalUsers: totalUsersResult[0].value,
    totalStudents: totalStudentsResult[0].value,
    totalActivities: totalActivitiesResult[0].value,
    totalTurns: totalTurnsResult[0].value,
    totalOrganizers: totalOrganizersResult[0].value,
    totalSecurity: totalSecurityResult[0].value,
    totalRepresentants: totalRepresentantsResult[0].value,
    totalTickets: totalTicketsResult[0].value,
    studentsRegistered: studentsRegisteredResult[0].value,
    totalScansToday: totalScansTodayResult[0].value,
    totalScans: totalScansResult[0].value,
    ticketsValidated: ticketsValidatedResult[0].value,
    totalEventDays: totalEventDaysResult[0].value,
    registrationWindow,
    isRegistrationOpen,
  }
}
