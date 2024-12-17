<script lang="ts">
  import { type Registration } from '$types/db'

  const { data } = $props()
  const { students, registrations } = data

  let completeRegistrations: string[] = []

  function pushActivities(registration: Registration) {
    if (registration.expand?.firstActivity?.turns == 1) {
      completeRegistrations.push(registration.expand?.firstActivity.name)
    } else {
      completeRegistrations.push(
        `${registration.expand?.firstActivity?.name},
        ${registration.expand?.secondActivity?.name},
        ${registration.expand?.thirdActivity?.name}`
      )
    }
  }

  students.forEach(student => {
    if (registrations.some((registration: Registration) => registration.user == student.id))  {
      pushActivities(registrations.find((registration: Registration) => registration.user == student.id)!)
    } else {
      completeRegistrations.push('Non iscritto')
    }
  })
</script>

{#snippet row(columns: string[])}
    <div class="row">
        {#each columns as column}
            <div class="cell">{column}</div>
        {/each}
    </div>
{/snippet}

<div class="container">
    <h1>Classe {students[0].class}</h1>

    <div class="table">
        <div class="row head-row">
            <div class="cell">Nome</div>
            <div class="cell">Attività</div>
        </div>

        {#each students as student, i}
            {@render row([
                `${student.surname} ${student.name}`,
                `${completeRegistrations[i]}`
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
        width: 50%;
    }

    .cell:last-child {
        text-align: left;
    }

    .row:nth-child(odd) {
        background-color: var(--grey)
    }
</style>
