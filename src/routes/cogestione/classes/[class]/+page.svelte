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
  
  // Function to format date for table headers
  function formatDayHeader(day: string): string {
    return new Date(day).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
</script>

{#snippet studentRow(student: any, day: string)}
  <div class="row">
    <div class="cell name-cell">{student.surname} {student.name}</div>
    <div class="cell activity-cell">{getStudentActivitiesForDay(student.email, day)}</div>
  </div>
{/snippet}

<div class="container">
  <h1>Classe {students[0]?.class || ''}</h1>
  
  {#each eventDays as day}
    <div class="day-table">
      <h2>{formatDayHeader(day)}</h2>
      <div class="table">
        <div class="row head-row">
          <div class="cell name-cell">Nome</div>
          <div class="cell activity-cell">Attività</div>
        </div>
        {#each students as student}
          {@render studentRow(student, day)}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  h1 {
    margin-bottom: 40px;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: max(18px, 12px + 0.5vw);
  }
  
  .day-table {
    margin-bottom: 40px;
  }
  
  .table {
    width: 100%;
    display: flex;
    flex-direction: column;
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
  }
  
  .head-row .cell {
    font-weight: bold;
  }
  
  .name-cell {
    width: 50%;
  }
  
  .activity-cell {
    width: 50%;
  }
  
  .row:nth-child(odd) {
    background-color: var(--grey);
  }
  
  .row:nth-child(even) {
    background-color: var(--black);
  }
</style>