<script lang="ts">
  import type { PageData } from '../../../../routes/cogestione/registration/$types'
  import SimpleButton from '$components/reusables/SimpleButton.svelte'
  import { isRegistered } from '$lib/utils/is-registered'

  const { activitiesTurns, eventDays, userRegistrations }: {
    activitiesTurns: PageData['activitiesTurns']
    eventDays: PageData['eventDays']
    userRegistrations: PageData['userRegistrations']
  } = $props()

  // Turn start time type
  type StartTime = typeof activitiesTurns[number]['start']

  // Group of turns by start time
  type TurnsByStartTime = Record<StartTime, typeof activitiesTurns>

  // Event day date type
  type EventDay = typeof eventDays[number]['date']

  // Turns grouped by start time for each event day
  type GroupedTurns = Record<EventDay, TurnsByStartTime>

  // Groups turns by their start time for each event day
  function getGroupedTurns(): GroupedTurns {
    // Maps each date to its corresponding turns grouped by start time
    const groupedTurns: GroupedTurns = {}

    eventDays.forEach(eventDay => {
      // Filters turns for the current event day
      const turnsForDay = activitiesTurns.filter(turn => turn.day === eventDay.date)

      // Groups turns by their start time
      const turnsByStart: TurnsByStartTime = {}

      turnsForDay.forEach(turn => {
        // If the start time does not exist in the object
        if (!turnsByStart[turn.start]) {
          // Initializes an empty array for that start time
          turnsByStart[turn.start] = []
        }

        turnsByStart[turn.start].push(turn)
      })

      // Assigns the grouped turns to the corresponding date
      groupedTurns[eventDay.date] = turnsByStart
    })

    return groupedTurns
  }

  function formatTime(time: string): string {
    return time.slice(0, -3)
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
    })
  }

  // Calculate activity duration in hours
  function getActivityDuration(start: string, end: string): number {
    const startTime = new Date(`1970-01-01T${start}`)
    const endTime = new Date(`1970-01-01T${end}`)
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  }

  // Get all available time slots for a day
  function getTimeSlots(day: EventDay): string[] {
    return Object.keys(groupedTurns[day])
  }

  // Get the list of visible slot indices for a day based on current selections
  function getVisibleSlotIndices(day: EventDay): number[] {
    const timeSlots = getTimeSlots(day)
    const visibleSlots: number[] = []
    let currentSlotIndex = 0

    while (currentSlotIndex < timeSlots.length) {
      visibleSlots.push(currentSlotIndex)

      const selectedTurnId = selectedActivities[day][currentSlotIndex]
      if (selectedTurnId === undefined) {
        // If no activity is selected, we can't determine what comes next
        break
      }

      // Find the selected turn to get its duration
      const selectedTurn = activitiesTurns.find(turn => turn.id === selectedTurnId)
      if (selectedTurn) {
        const duration = getActivityDuration(selectedTurn.start, selectedTurn.end)
        currentSlotIndex += duration
      } else {
        currentSlotIndex += 1
      }
    }

    return visibleSlots
  }

  // Check if a time slot should be visible based on current selections
  function shouldShowTimeSlot(day: EventDay, slotIndex: number): boolean {
    const visibleSlots = getVisibleSlotIndices(day)
    return visibleSlots.includes(slotIndex)
  }

  // Clear selections that are no longer valid due to duration changes
  function clearInvalidSelections(day: EventDay, changedSlotIndex: number) {
    const selectedTurnId = selectedActivities[day][changedSlotIndex]

    if (selectedTurnId === undefined) {
      // If deselecting, clear all subsequent selections
      for (let i = changedSlotIndex + 1; i < selectedActivities[day].length; i++) {
        selectedActivities[day][i] = undefined
      }
      return
    }

    // Clear all selections in slots that would be occupied by this activity
    // and all subsequent selections
    for (let i = changedSlotIndex + 1; i < selectedActivities[day].length; i++) {
      selectedActivities[day][i] = undefined
    }
  }

  function isTeamActivity(turnId: typeof activitiesTurns[number]['id'] | undefined) {
    if (!turnId) return false
    return activitiesTurns.find(turn => turn.id === turnId)?.type === 'team'
  }

  function handleSelectionChange(day: EventDay, slotIndex: number) {
    clearInvalidSelections(day, slotIndex)
  }

  const groupedTurns = getGroupedTurns()

  let canSubmit = $state(false)

  let selectedActivities: Record<EventDay, (number | undefined)[]> = $state({})

  eventDays.forEach(day => {
    const timeSlots = getTimeSlots(day.date)
    // Initialize with enough slots for all possible time slots
    selectedActivities[day.date] = new Array(timeSlots.length).fill(undefined)
  })

  $effect(() => {
    console.log('Selected activities: ' + JSON.stringify(selectedActivities))
  })
</script>

<div class="container">
    <h1>Iscriviti alla cogestione</h1>

    <div class="registrations">
        {#each eventDays as eventDay, i}
            {console.log(activitiesTurns)}

            {#if !isRegistered(userRegistrations, activitiesTurns, [eventDays[i]])}
                <div class="registration">
                    {@render registrationTitle(eventDay)}

                    {#each getTimeSlots(eventDay.date) as timeSlot, slotIndex}
                        {#if shouldShowTimeSlot(eventDay.date, slotIndex)}
                            {@render turnRegistration(
                                groupedTurns[eventDay.date][timeSlot],
                                slotIndex,
                                eventDay.date,
                                timeSlot
                            )}
                        {/if}
                    {/each}
                </div>
            {/if}
        {/each}
    </div>

    <div class="submission">
        <SimpleButton
            type="submit"
            disabled={!canSubmit}
            title={canSubmit ? '' : 'Compila tutti i campi per inviare la registrazione'}
        >
            Registrati
        </SimpleButton>
    </div>
</div>

{#snippet registrationTitle(eventDay: typeof eventDays[number])}
    <h2>
        {formatDate(eventDay.date)}

        <span class="unbold">
            ({formatTime(eventDay.start)} - {formatTime(eventDay.end)})
        </span>
    </h2>
{/snippet}

{#snippet turnRegistration(
    possibleTurns: typeof activitiesTurns,
    slotIndex: number,
    day: EventDay,
    timeSlot: string
)}
    <div class="turn-registration">
        <h3>
            Attività {getVisibleSlotIndices(day).indexOf(slotIndex) + 1}
            <span class="unbold">
                ({formatTime(timeSlot)}):
            </span>
        </h3>

        <select
            data-turn={slotIndex}
            data-day={day}
            bind:value={selectedActivities[day][slotIndex]}
            onchange={() => handleSelectionChange(day, slotIndex)}
        >
            {#if selectedActivities[day][slotIndex] === undefined}
                <option value={undefined}>Seleziona un'attività</option>
            {/if}

            {#each possibleTurns as turn}
                <option value={turn.id}>
                    {turn.activity}
                    (durata: {getActivityDuration(turn.start, turn.end)}h)
                </option>
            {/each}
        </select>

        {#if isTeamActivity(selectedActivities[day][slotIndex])}
            <div class="tournament-registration">
                Qua ci piazza il form dei tornei
            </div>
        {/if}
    </div>
{/snippet}

<style>
   .container {
       min-height: calc(100svh - 200px);
       display: flex;
       flex-direction: column;
    }

    h1 {
        font-size: max(20px, 12px + 1.25vw);
        height: 70px;
        color: var(--red);
        filter: brightness(1.2);
    }

    .submission {
        height: 70px;
        display: flex;
        align-items: end;
        justify-content: flex-end;
    }

    .registrations {
        display: flex;
        gap: 40px;
        width: 100%;
        height: calc(100svh - 340px);
    }

    .registration {
        height: 100%;
        width: 100%;
        padding: 40px;
        display: flex;
        flex-direction: column;
        background-color: var(--grey);
        border-radius: 15px;
    }

    .unbold {
        font-weight: normal;
    }

</style>
