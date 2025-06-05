<script lang="ts">
  import type { PageData } from './$types';
  
  const { data }: { data: PageData } = $props();
  const { students, registrations, eventDays } = data;

  // Create a map of user email to their activities grouped by day
  const userActivitiesByDay = new Map<string, Map<string, Array<{name: string, startTime: string}>>>();
  
  registrations.forEach((reg) => {
    if (!userActivitiesByDay.has(reg.userEmail)) {
      userActivitiesByDay.set(reg.userEmail, new Map());
    }
    
    const userDays = userActivitiesByDay.get(reg.userEmail)!;
    const dayKey = reg.day;
    
    if (!userDays.has(dayKey)) {
      userDays.set(dayKey, []);
    }
    
    userDays.get(dayKey)!.push({
      name: reg.activityName,
      startTime: reg.startTime
    });
  });

  // Sort activities within each day by start time
  userActivitiesByDay.forEach((dayMap) => {
    dayMap.forEach((activities) => {
      activities.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
  });

  // Function to get activities for a student on a specific day
  function getStudentActivitiesForDay(studentEmail: string, day: string): string {
    const dayActivities = userActivitiesByDay.get(studentEmail);
    if (!dayActivities || !dayActivities.has(day)) {
      return "-";
    }
    
    const activities = dayActivities.get(day)!;
    return activities.map(a => a.name).join(', ');
  }

  // Function to format date for column headers
  function formatDayHeader(day: string): string {
    return new Date(day).toLocaleDateString('it-IT', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }
</script>

{#snippet row(columns: string[])}
  <div class="row">
    {#each columns as column}
      <div class="cell">{column}</div>
    {/each}
  </div>
{/snippet}

<div class="container">
  <h1>Classe {students[0]?.class || ''}</h1>
  <div class="table" style="--day-count: {eventDays.length}">
    <div class="row head-row">
      <div class="cell">Nome</div>
      {#each eventDays as day}
        <div class="cell">{formatDayHeader(day)}</div>
      {/each}
    </div>
    {#each students as student}
      {@render row([
        `${student.surname} ${student.name}`,
        ...eventDays.map(day => getStudentActivitiesForDay(student.email, day))
      ])}
    {/each}
  </div>
</div>

<style>
  h1 {
    margin-bottom: 40px;
  }
  .table {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .head-row .cell {
    font-weight: bold !important;
  }
  .row {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    font-size: max(16px, 10px + 0.5vw);
    min-height: calc(20px + 2vw);
    padding: 20px;
  }
  .cell {
    font-weight: normal;
    width: calc(100% / (1 + var(--day-count, 2))); /* Dynamic width based on number of columns */
    min-width: 150px; /* Minimum width to prevent too narrow columns */
  }
  .cell:last-child {
    text-align: left;
  }
  .row:nth-child(odd) {
    background-color: var(--grey);
  }
</style>