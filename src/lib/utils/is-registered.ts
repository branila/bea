import type { EventDay, Registration } from '$types'

// Checks if the user is fully registered to a list of event days
export function isRegistered<T extends { id: number, day: string }[]>(
  userRegistrations: Registration[],
  activitiesTurns: T,
  eventDays: EventDay[]
) {
  // Extracts all the turns the user has registered for
  const registeredTurns = new Set(userRegistrations.map(registration => registration.turn))

  // Get unique days where the user has registered turns
  const registeredDays = new Set(
    activitiesTurns
      .filter(turn => registeredTurns.has(turn.id))
      .map(turn => turn.day)
  )

  // Check if the user is registered for ALL the specified event days
  return eventDays.every(eventDay => registeredDays.has(eventDay.date))
}
