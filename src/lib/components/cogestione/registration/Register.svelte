<script lang="ts">
    import type { PageData } from '../../../../routes/cogestione/registration/$types'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'
    import { isRegistered } from '$lib/utils/is-registered'
    import { fade, slide } from 'svelte/transition'

    const {
        activitiesTurns,
        eventDays,
        userRegistrations,
        user,
    }: {
        activitiesTurns: PageData['activitiesTurns']
        eventDays: PageData['eventDays']
        userRegistrations: PageData['userRegistrations']
        user: PageData['user']
    } = $props()

    // Turn start time type
    type StartTime = (typeof activitiesTurns)[number]['start']

    // Group of turns by start time
    type TurnsByStartTime = Record<StartTime, typeof activitiesTurns>

    // Event day date type
    type EventDay = (typeof eventDays)[number]['date']

    // Turns grouped by start time for each event day
    type GroupedTurns = Record<EventDay, TurnsByStartTime>

    // Team member interface
    type TeamMember = {
        email: string
        isValid: boolean
        error: string | null
    }

    // Team registration data
    type TeamRegistration = {
        name: string
        tournamentTurn: number
        members: TeamMember[]
        nameError: string | null
    }

    // Groups turns by their start time for each event day
    function getGroupedTurns(): GroupedTurns {
        // Maps each date to its corresponding turns grouped by start time
        const groupedTurns: GroupedTurns = {}

        eventDays.forEach((eventDay) => {
            // Filters turns for the current event day
            const turnsForDay = activitiesTurns.filter(
                (turn) => turn.day === eventDay.date,
            )

            // Groups turns by their start time
            const turnsByStart: TurnsByStartTime = {}

            turnsForDay.forEach((turn) => {
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
            if (selectedTurnId == null) {
                // If no activity is selected, we can't determine what comes next
                break
            }

            // Find the selected turn to get its duration
            const selectedTurn = activitiesTurns.find(
                (turn) => turn.id === selectedTurnId,
            )

            if (selectedTurn) {
                const duration = getActivityDuration(
                    selectedTurn.start,
                    selectedTurn.end,
                )

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

        if (selectedTurnId === null) {
            // If deselecting, clear all subsequent selections
            for (let i = changedSlotIndex + 1; i < selectedActivities[day].length; i++) {
                selectedActivities[day][i] = null
            }
            return
        }

        // Clear all selections in slots that would be occupied by this activity
        // and all subsequent selections
        for (let i = changedSlotIndex + 1; i < selectedActivities[day].length; i++) {
            selectedActivities[day][i] = null
        }
    }

    function isTeamActivity(turnId: (typeof activitiesTurns)[number]['id'] | null) {
        if (!turnId) return false
        return activitiesTurns.find((turn) => turn.id === turnId)?.type === 'team'
    }

    function getSelectedTurn(turnId: (typeof activitiesTurns)[number]['id'] | null) {
        if (!turnId) return null
        return activitiesTurns.find((turn) => turn.id === turnId) || null
    }

    // Email validation function
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\.studente[0-9]*@itispaleocapa\.it$/
        return emailRegex.test(email)
    }

    // Initialize team registration for a specific day and slot
    function initializeTeamRegistration(
        tournamentTurn: number,
        minMembers: number
    ): TeamRegistration {
        const members: TeamMember[] = []
        // Create slots for additional members (minMembers - 1 because current user is already included)
        const additionalMembersNeeded = minMembers - 1

        for (let i = 0; i < additionalMembersNeeded; i++) {
            members.push({
                email: '',
                isValid: false,
                error: null
            })
        }

        return {
            name: '',
            tournamentTurn,
            members,
            nameError: null
        }
    }

    // Check if user exists and is not already registered
    async function checkUserAvailability(
        email: string,
        day: EventDay
    ): Promise<{ exists: boolean; available: boolean; message?: string }> {
        try {
            const response = await fetch('/api/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, day })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            return await response.json()
        } catch (error) {
            console.error('Error checking user:', error)
            return {
                exists: false,
                available: false,
                message: 'Errore nel controllo utente'
            }
        }
    }

    // Check if team name is available
    async function checkTeamNameAvailability(
        teamName: string,
        day: EventDay
    ): Promise<{ available: boolean; message?: string }> {
        try {
            const response = await fetch('/api/check-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName, day })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            return await response.json()
        } catch (error) {
            console.error('Error checking team name:', error)

            return {
                available: false,
                message: 'Errore nel controllo nome squadra'
            }
        }
    }

    // Debounce function
    function debounce(func: Function, wait: number) {
        let timeout: ReturnType<typeof setTimeout>

        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }

            clearTimeout(timeout);

            timeout = setTimeout(later, wait)
        }
    }

    // Check if email is already used in the current team
    function isEmailDuplicateInTeam(
        day: EventDay,
        slotIndex: number,
        memberIndex: number,
        email: string
    ): boolean {
        const teamReg = teamRegistrations[day][slotIndex]
        if (!teamReg) return false

        // Check against other members (excluding the current one being edited)
        return teamReg.members.some(
            (member, index) =>
                index !== memberIndex &&
                member.email.toLowerCase() === email.toLowerCase(),
        )
    }

    // Handle member email change with debounced validation
    const debouncedEmailCheck = debounce(
        async (
            day: EventDay,
            slotIndex: number,
            memberIndex: number,
            email: string
        ) => {
            if (!email.trim()) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = null
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
                return
            }

            // Check if it's the user's own email
            if (email.toLowerCase() === user.email.toLowerCase()) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = 'Inserisci soltanto le email degli altri membri!'
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
                return
            }

            // Check if email is already used in this team
            if (isEmailDuplicateInTeam(day, slotIndex, memberIndex, email)) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = 'Ma ce la fai? Questo utente è già nella squadra...'
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
                return
            }

            // Check if email is valid
            if (!isValidEmail(email.toLowerCase())) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = 'Email non valida'
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
                return
            }

            // Check if user exists and is available
            const result = await checkUserAvailability(email, day)

            if (!result.exists) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = 'Utente non trovato'
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
            } else if (!result.available) {
                teamRegistrations[day][slotIndex].members[memberIndex].error = result.message || 'Ops, questo utente è già registrato'
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = false
            } else {
                teamRegistrations[day][slotIndex].members[memberIndex].error = null
                teamRegistrations[day][slotIndex].members[memberIndex].isValid = true
            }
        },
        1000
    )

    // Handle team name change with debounced validation
    const debouncedTeamNameCheck = debounce(
        async (day: EventDay, slotIndex: number, teamName: string) => {
            if (!teamName.trim()) {
                teamRegistrations[day][slotIndex].nameError = null
                return
            }

            const result = await checkTeamNameAvailability(teamName, day)

            if (!result.available) {
                teamRegistrations[day][slotIndex].nameError =
                    result.message || 'Nome squadra già esistente'
            } else {
                teamRegistrations[day][slotIndex].nameError = null
            }
        },
        1000
    )

    // Handle member email input
    function handleMemberEmailChange(
        day: EventDay,
        slotIndex: number,
        memberIndex: number,
        email: string
    ) {
        teamRegistrations[day][slotIndex].members[memberIndex].email = email
        debouncedEmailCheck(day, slotIndex, memberIndex, email)
    }

    // Handle team name input
    function handleTeamNameChange(
        day: EventDay,
        slotIndex: number,
        teamName: string
    ) {
        teamRegistrations[day][slotIndex].name = teamName
        debouncedTeamNameCheck(day, slotIndex, teamName)
    }

    // Add a new member to the team
    function addTeamMember(day: EventDay, slotIndex: number) {
        teamRegistrations[day][slotIndex].members.push({
            email: '',
            isValid: false,
            error: null
        })
    }

    // Remove a member from the team
    function removeTeamMember(
        day: EventDay,
        slotIndex: number,
        memberIndex: number
    ) {
        teamRegistrations[day][slotIndex].members.splice(memberIndex, 1)
    }

    function handleSelectionChange(day: EventDay, slotIndex: number) {
        clearInvalidSelections(day, slotIndex)

        const selectedTurnId = selectedActivities[day][slotIndex]
        const selectedTurn = getSelectedTurn(selectedTurnId)

        // Initialize team registration if it's a team activity
        if (
            selectedTurn &&
            selectedTurn.type === 'team' &&
            selectedTurn.minTeamMembers
        ) {
            if (!teamRegistrations[day]) {
                teamRegistrations[day] = {}
            }

            // Always reinitialize team registration when selection changes
            // This resets the form to the base state with minimum required members
            teamRegistrations[day][slotIndex] = initializeTeamRegistration(
                selectedTurn.id,
                selectedTurn.minTeamMembers
            )
        } else {
            // Clean up team registration if switching away from team activity
            if (teamRegistrations[day] && teamRegistrations[day][slotIndex]) {
                delete teamRegistrations[day][slotIndex];
            }
        }
    }

    // Check if selected activities cover the entire event day period
    function checkEventDayCoverage(day: EventDay): boolean {
        const eventDayData = eventDays.find((ed) => ed.date === day)
        if (!eventDayData) return false

        const daySelections = selectedActivities[day];
        const selectedTurns = daySelections
            .map(turnId =>
                turnId !== null
                    ? activitiesTurns.find((turn) => turn.id === turnId)
                    : null
            )
            .filter(turn => turn !== null)

        if (selectedTurns.length === 0) return false

        // Sort selected turns by start time
        selectedTurns.sort((a, b) => a!.start.localeCompare(b!.start))

        // Check if first turn starts at eventDay.start
        const firstTurn = selectedTurns[0]!
        if (firstTurn.start !== eventDayData.start) {
            return false
        }

        // Check if last turn ends at eventDay.end
        const lastTurn = selectedTurns[selectedTurns.length - 1]!
        if (lastTurn.end !== eventDayData.end) {
            return false
        }

        // Check if there are no gaps between consecutive turns
        for (let i = 0; i < selectedTurns.length - 1; i++) {
            const currentTurn = selectedTurns[i]!
            const nextTurn = selectedTurns[i + 1]!

            if (currentTurn.end !== nextTurn.start) {
                return false
            }
        }

        return true
    }

    // Check if all required fields are filled and valid
    function checkCanSubmit(): boolean {
        // Check if at least one activity is selected for each day
        let hasSelectionForEachDay = true

        for (const day of eventDays) {
            if (isRegistered(userRegistrations, activitiesTurns, [day])) {
                continue // Skip days where user is already registered
            }

            const daySelections = selectedActivities[day.date];
            const hasSelection = daySelections.some(
              (selection) => selection !== null
            )

            if (!hasSelection) {
                hasSelectionForEachDay = false
                break
            }

            // Check if selected activities cover the entire event day period
            if (!checkEventDayCoverage(day.date)) {
                return false
            }
        }

        if (!hasSelectionForEachDay) {
            return false
        }

        // Check team registrations validity
        for (const day of eventDays) {
            if (isRegistered(userRegistrations, activitiesTurns, [day])) {
                continue // Skip days where user is already registered
            }

            const daySelections = selectedActivities[day.date]

            for ( let slotIndex = 0; slotIndex < daySelections.length; slotIndex++ ) {
                const selectedTurnId = daySelections[slotIndex]

                if (selectedTurnId === null) continue

                const selectedTurn = getSelectedTurn(selectedTurnId)

                if (selectedTurn && selectedTurn.type === 'team') {
                    const teamReg = teamRegistrations[day.date]?.[slotIndex]

                    if (!teamReg) return false

                    // Check team name
                    if (!teamReg.name.trim() || teamReg.nameError) {
                        return false
                    }

                    // Check minimum members (accounting for current user)
                    const totalMembers = teamReg.members.length + 1 // +1 for current user
                    if (totalMembers < selectedTurn.minTeamMembers!) {
                        return false
                    }

                    // Check that all members are valid
                    for (const member of teamReg.members) {
                        if (
                            !member.email.trim() ||
                            !member.isValid ||
                            member.error
                        ) {
                            return false
                        }
                    }
                }
            }
        }

        return true;
    }

    const groupedTurns = getGroupedTurns()

    let canSubmit = $state(false)

    let selectedActivities: Record<EventDay, (number | null)[]> = $state({})

    // Team registrations state
    let teamRegistrations: Record<
        EventDay,
        Record<number, TeamRegistration>
    > = $state({})

    eventDays.forEach((day) => {
        const timeSlots = getTimeSlots(day.date)

        // Initialize with enough slots for all possible time slots
        selectedActivities[day.date] = new Array(timeSlots.length).fill(null)
        teamRegistrations[day.date] = {}
    })

    // Update canSubmit whenever selections or team registrations change
    $effect(() => {
        canSubmit = checkCanSubmit()
    })

    // Registration state
    let isSubmitting = $state(false)
    let submitError = $state<string | null>(null)
    let submitSuccess = $state<string | null>(null)

    type CleanedUpTeamRegistrations = {
      team: string,
      tournamentTurn: number,
      members: string[] // Members emails
    }[]

    function cleanUpTeamRegistrations(
      rawTeamRegistrations: typeof teamRegistrations
    ): CleanedUpTeamRegistrations {
        const cleanedUpTeamRegistrations: CleanedUpTeamRegistrations = []

        Object.keys(rawTeamRegistrations).forEach(day => {
          Object.values(rawTeamRegistrations[day]).forEach(teamRegistration => {
            const membersEmails: string[] = []

            teamRegistration.members.forEach(member => {
              membersEmails.push(member.email)
            })

            cleanedUpTeamRegistrations.push({
              team: teamRegistration.name,
              tournamentTurn: teamRegistration.tournamentTurn,
              members: membersEmails
            })
          })
        })

        return cleanedUpTeamRegistrations
    }

    function cleanUpSelectedActivities(
      rawSelectedActivities: typeof selectedActivities
    ): number[] {
      const cleanedUpSelectedActivities: number[] = []

      for (const date in rawSelectedActivities) {
        const activitiesForDate = rawSelectedActivities[date]

        for (const activity of activitiesForDate) {
          if (activity !== null) {
            cleanedUpSelectedActivities.push(activity)
          }
        }
      }

      return cleanedUpSelectedActivities
    }

    // Submit registration
    async function submitRegistration() {
        if (!canSubmit || isSubmitting) return

        isSubmitting = true
        submitError = null
        submitSuccess = null

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedActivities: cleanUpSelectedActivities(selectedActivities),
                    teamRegistrations: cleanUpTeamRegistrations(teamRegistrations)
                })
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Errore durante la registrazione')
            }

            submitSuccess = result.message || 'Registrazione completata con successo!'

            window.location.href = '/cogestione/registration'
        } catch (error) {
            console.error('Registration error:', error)
            submitError = error instanceof Error ? error.message : 'Errore durante la registrazione'
        } finally {
            isSubmitting = false
        }
    }

    $effect(() => {
        console.log('Selected activities: ' + JSON.stringify(selectedActivities))
        console.log('Team registrations: ' + JSON.stringify(teamRegistrations))
    })

    $effect(() => {
        console.log('Selected activities: ' + JSON.stringify(selectedActivities))
        console.log('Team registrations: ' + JSON.stringify(teamRegistrations))
    })
</script>

<div class="container">
    <h1>Iscriviti alla cogestione</h1>


    <h2 style:color="var(--red)">{submitError}</h2>
    <h2>{submitSuccess}</h2>

    <div class="registrations">
        {#each eventDays as eventDay, i}
            {#if !isRegistered( userRegistrations, activitiesTurns, [eventDays[i]], )}
                <div class="registration">
                    <h2>
                        {formatDate(eventDay.date)}

                        <span class="unbold">
                            ({formatTime(eventDay.start)} - {formatTime(
                                eventDay.end,
                            )})
                        </span>
                    </h2>

                    {#each getTimeSlots(eventDay.date) as timeSlot, slotIndex}
                        {#if shouldShowTimeSlot(eventDay.date, slotIndex)}
                            {@render turnRegistration(
                                groupedTurns[eventDay.date][timeSlot],
                                slotIndex,
                                eventDay.date,
                                timeSlot,
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
            title={canSubmit
                ? ''
                : 'Compila tutti i campi per inviare la registrazione'}

            onclick={submitRegistration}
        >
            { isSubmitting ? ' Caricamento' : 'Registrati' }
        </SimpleButton>
    </div>
</div>

{#snippet turnRegistration(
    possibleTurns: typeof activitiesTurns,
    slotIndex: number,
    day: EventDay,
    timeSlot: string,
)}
    <div class="turn-registration" transition:slide={{ duration: 250 }}>
        <h3>
            Attività {getVisibleSlotIndices(day).indexOf(slotIndex) + 1}
            <span class="unbold">
                ({formatTime(timeSlot)}{#if selectedActivities[day][slotIndex]}
                  &nbsp;- {formatTime(getSelectedTurn(selectedActivities[day][slotIndex])!.end)}
                {/if}):
            </span>
        </h3>

        <select
            data-turn={slotIndex}
            data-day={day}
            bind:value={selectedActivities[day][slotIndex]}
            onchange={() => handleSelectionChange(day, slotIndex)}
        >
            {#if selectedActivities[day][slotIndex] == null}
                <option value={null}>Seleziona un'attività</option>
            {/if}

            {#each possibleTurns as turn}
                <option value={turn.id}>
                    {turn.activity}
                    (durata: {getActivityDuration(turn.start, turn.end)}h)
                </option>
            {/each}
        </select>

        {#if isTeamActivity(selectedActivities[day][slotIndex])}
            <div class="team-registration" transition:slide={{ duration: 600 }}>
                {@render teamRegistrationForm(
                    day,
                    slotIndex,
                    getSelectedTurn(selectedActivities[day][slotIndex]),
                )}
            </div>
        {/if}
    </div>
{/snippet}

{#snippet teamRegistrationForm(
    day: EventDay,
    slotIndex: number,
    selectedTurn: any,
)}
    {#if selectedTurn && teamRegistrations[day] && teamRegistrations[day][slotIndex]}
        <!-- Team name section -->
        <div class="team-name-section">
            <h4>Nome Squadra:</h4>

            {#if teamRegistrations[day][slotIndex].nameError}
                <div class="error-message" transition:slide={{ duration: 250 }}>
                    {teamRegistrations[day][slotIndex].nameError}
                </div>
            {/if}

            <input
                id="team-name-{day}-{slotIndex}"
                type="text"
                placeholder="Inserisci il nome della squadra"
                value={teamRegistrations[day][slotIndex].name}
                oninput={(e) =>
                    handleTeamNameChange(
                        day,
                        slotIndex,
                        (e.target as HTMLInputElement).value,
                    )}
            />
        </div>

        <!-- Team Members Section -->
        <div class="team-members-section">
            <!-- Current user (captain) -->
            <div class="member-input-group captain">
                <h5>Membro 1 (tu):</h5>
                <div class="captain-email">
                    {user.email}
                </div>
            </div>

            <!-- Additional team members -->
            {#each teamRegistrations[day][slotIndex].members as member, memberIndex}
                <div class="member-input-group" transition:slide={{ duration: 300 }}>
                    <h5>Membro {memberIndex + 2}:</h5>

                    {#if member.error}
                        <div class="error-message" transition:slide={{ duration: 250 }}>
                            {member.error}
                        </div>
                    {/if}

                    <div class="member-input-container">
                        <input
                            type="email"
                            placeholder="Email Istituzionale"
                            bind:value={member.email}
                            class:valid={member.isValid}
                            class:invalid={member.error !== null}
                            oninput={(e) => {
                                handleMemberEmailChange(
                                    day,
                                    slotIndex,
                                    memberIndex,
                                    (e.target as HTMLInputElement).value,
                                );
                            }}
                        />

                        {#if teamRegistrations[day][slotIndex].members.length > Math.max(0, selectedTurn.minTeamMembers - 1)}
                            <button
                                transition:fade={{ duration: 300 }}
                                type="button"
                                class="remove-member-btn"
                                onclick={() =>
                                    removeTeamMember(
                                        day,
                                        slotIndex,
                                        memberIndex,
                                    )}
                            >
                                ✕
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}

            {#if teamRegistrations[day][slotIndex].members.length < selectedTurn.maxTeamMembers - 1}
                <button
                    type="button"
                    class="add-member-btn"
                    onclick={() => addTeamMember(day, slotIndex)}
                >
                    Aggiungi Membro
                </button>
            {/if}
        </div>
    {/if}
{/snippet}

<style>
    .container {
        min-height: calc(100svh - 200px);
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h1 {
        font-size: max(20px, 10px + 1.2vw);
        height: 50px;
        color: var(--red);
        filter: brightness(1.2);
        display: flex;
        align-items: center;
    }

    .submission {
        height: 50px;
        display: flex;
        justify-content: flex-end;
    }

    .registrations {
        display: flex;
        gap: 30px;
        width: 100%;
    }

    .registration {
        height: 100%;
        width: 100%;
        padding: 25px;
        display: flex;
        flex-direction: column;
        background-color: var(--grey);
        border-radius: 15px;
        gap: 20px;
        overflow-y: auto;
    }

    .registration h2 {
        font-size: max(16px, 10px + 0.8vw);
        color: var(--white);
        margin-bottom: 0;
    }

    .unbold {
        font-weight: normal;
    }

    .turn-registration {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0 0 20px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .turn-registration:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .turn-registration h3 {
        font-size: max(14px, 10px + 0.6vw);
        color: var(--white);
        margin: 0;
    }

    .turn-registration select {
        padding: max(12px, 5px + 0.8vw);
        padding-right: 45px;
        background-color: var(--white);
        color: var(--black);
        border-radius: 10px;
        font-weight: bold;
        width: 100%;
        border: 0;
        cursor: pointer;
        font-size: max(13px, 10px + 0.4vw);
        transition: 0.2s;

        /* Arrow */
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 15px top 50%;
        background-size: 8px auto;
    }

    .turn-registration select:hover {
        color: var(--red);
        transition: 0.2s;
    }

    .turn-registration select:focus {
        outline: 2px solid var(--red);
        outline-offset: 2px;
    }

    /* Team Registration Styles */
    .team-registration {
        margin-top: 15px;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .team-name-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .team-name-section h4 {
        font-size: max(13px, 10px + 0.5vw);
        color: var(--white);
        margin: 0;
    }

    .team-name-section input {
        padding: max(10px, 5px + 0.6vw);
        background-color: var(--white);
        color: var(--black);
        border: 0;
        border-radius: 8px;
        font-weight: bold;
        font-size: max(13px, 10px + 0.4vw);
        transition: 0.2s;
    }

    .team-name-section input:focus {
        outline: 2px solid var(--red);
        outline-offset: 2px;
    }

    .team-name-section input:hover {
        color: var(--red);
    }

    .team-members-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .member-input-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .member-input-group h5 {
        font-size: max(12px, 10px + 0.4vw);
        color: var(--white);
        margin: 0;
    }

    .member-input-group.captain h5 {
        color: var(--white);
    }

    .member-input-container {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .member-input-container input {
        flex: 1;
        padding: max(10px, 5px + 0.6vw);
        background-color: var(--white);
        color: var(--black);
        border: 0;
        border-radius: 8px;
        font-weight: bold;
        font-size: max(12px, 10px + 0.3vw);
        transition: 0.2s;
    }

    .member-input-container input:focus {
        outline: 2px solid var(--red);
        outline-offset: 2px;
    }

    .member-input-container input:hover:not(:disabled) {
        color: var(--red);
    }

    .member-input-container input:disabled {
        background-color: var(--grey);
        color: var(--white);
        opacity: 0.6;
        cursor: not-allowed;
    }

    .member-input-container input.valid {
        border: 2px solid var(--white);
    }

    .member-input-container input.invalid {
        border: 2px solid var(--red);
    }

    .captain-email {
        padding: max(10px, 5px + 0.6vw);
        padding-right: 45px;
        background-color: var(--grey);
        color: var(--white);
        font-weight: bold;
        width: 100%;
        border: 0;
        font-size: max(13px, 10px + 0.4vw);
        opacity: 0.6;
        padding-left: 0;
    }

    .remove-member-btn {
        padding: max(12px, 5px + 0.8vw);
        background-color: var(--red);
        color: var(--white);
        border: 0;
        border-radius: 6px;
        font-weight: bold;
        font-size: max(11px, 8px + 0.3vw);
        cursor: pointer;
        transition: 0.2s;
        white-space: nowrap;
    }

    .remove-member-btn:hover {
        background-color: var(--red);
        filter: brightness(1.2);
    }

    .add-member-btn {
        padding: max(10px, 5px + 0.6vw);
        background-color: var(--white);
        color: var(--black);
        border: 0;
        border-radius: 8px;
        font-weight: bold;
        font-size: max(12px, 10px + 0.3vw);
        cursor: pointer;
        transition: 0.2s;
        align-self: flex-start;
        margin-top: 6px;
    }

    .add-member-btn:hover {
        color: var(--red);
    }

    .error-message {
        color: var(--red);
        font-size: max(16px, 10px + 0.4vw);
        filter: brightness(1.3);
        margin-top: 4px;
    }

    /* Mobile Responsiveness */
    @media (max-width: 800px) {
        .registrations {
            flex-direction: column;
            gap: 20px;
        }

        .registration {
            padding: 20px;
        }

        .turn-registration {
            padding: 0 0 15px 0;
        }

        .turn-registration:last-child {
            padding-bottom: 0;
        }

        .team-registration {
            padding: 0;
        }
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
        }

        h1 {
            height: 40px;
            font-size: max(16px, 12px + 1vw);
        }

        .submission {
            height: 40px;
        }

        .registrations {
            gap: 15px;
        }

        .registration {
            padding: 15px;
            gap: 15px;
        }

        .registration h2 {
            font-size: max(16px, 10px + 0.6vw);
        }

        .turn-registration {
            padding: 0 0 12px 0;
        }

        .turn-registration:last-child {
            padding-bottom: 0;
        }

        .turn-registration select {
            padding: max(10px, 5px + 0.6vw);
            padding-right: 40px;
            background-size: 7px auto;
        }

        .team-registration {
            padding: 0;
            gap: 15px;
        }

        .captain-email {
            padding: max(10px, 5px + 0.6vw);
            padding-right: 40px;
        }

        .team-name-section input {
            padding: max(10px, 5px + 0.6vw);
        }

        .member-input-container {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        .member-input-container input {
            padding: max(10px, 5px + 0.6vw);
        }

        .remove-member-btn {
            align-self: flex-end;
            padding: max(10px, 5px + 0.6vw);
            font-size: max(10px, 8px + 0.2vw);
            height: 100%;
        }

        .add-member-btn {
            padding: max(6px, 4px + 0.4vw) max(12px, 8px + 0.6vw);
            font-size: max(11px, 9px + 0.3vw);
        }

        .error-message {
            font-size: max(10px, 8px + 0.2vw);
        }
    }
</style>
