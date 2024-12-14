<script lang="ts">
  import { enhance } from '$app/forms'
  import type { Activity, ActivityId } from '$types/db'
  import SimpleButton from '$components/reusables/SimpleButton.svelte'

  let { activities }: {
    activities: Activity[],
  } = $props()

  const activityTurns = ['firstActivity', 'secondActivity', 'thirdActivity']

  let registration: ActivityId[] = $state(['', '', ''])

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const turn = +target.dataset.turn!
    const activity = target.value

    // If the user selects the default option, we don't need to do anything
    if (!target.value) return

    if (getActivity(activity).turns == 1) {
      // If the activity is a single-turn activity, we need to set the same activity for all turns
      registration = registration.map((_, i) => activity)
    } else {
      registration[turn] = activity

      // If the activity is a multi-turn activity, we need to remove the single-turn activities from the other turns
      registration = registration.map(activity => {
        if (activity == '') return ''
        return getActivity(activity).turns == 1 ? '' : activity
      })
    }
  }

  function getActivity(id: string): Activity {
    return activities.find(activity => activity.id === id)!
  }
</script>

{#snippet select(turn: number)}
    <select
        name={activityTurns[turn]}
        id={activityTurns[turn]}
        bind:value={registration[turn]}
        data-turn={turn}
        onchange={handleChange}
        required
    >
        <option value="">Seleziona un'attività</option>

        <!-- Renders the options sorted by the number of turns of the activity -->
        {@render options(activities.sort((a, b) => b.turns - a.turns), turn)}
    </select>
{/snippet}

{#snippet options(activities: Activity[], turn: number)}
    {#each activities.filter(activity => activity.capacity[turn] !== 0) as activity}
        <option value={activity.id}>
            {#if activity.turns == 1}
                {activity.name} - (8:30 - 11:30)
            {:else}
                {activity.name} - ({8 + turn}:30 - {8 + turn + 1}:30)
            {/if}
        </option>
    {/each}
{/snippet}

<div class="container">
    <h1>Iscriviti alla cogestione</h1>

    <form method="post" use:enhance>
        {#each Array(3) as _, turn}
            <div class="turn">
                <h2>Turno {turn + 1}</h2>

                {@render select(turn)}
            </div>
        {/each}

        <SimpleButton type="submit">Iscriviti</SimpleButton>
    </form>
</div>

<style>
    .container {
        height: calc(100svh - 200px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    h1 {
        font-size: max(30px, 12px + 2vw);
        color: var(--red);
        filter: brightness(1.2);
        margin-bottom: 40px;
        width: min(600px, 100%);
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 40px;
        width: min(600px, 100%);
    }

    .turn {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    select {
        padding: max(13px, 5px + 0.75vw);
        background-color: var(--white);
        color: var(--black);
        border-radius: 15px;
        font-weight: bold;
        width: min(600px, 100%);
        border: 0;
        cursor: pointer;
        font-size: max(16px, 10px + 0.5vw);

        /* Arrow */
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 20px top 50%;
        background-size: 10px auto;
    }

    form :global(button) {
        margin-top: 10px;
    }

    @media (max-width: 600px) {
        .container {
            justify-content: start
        }

        h1 {
            margin-bottom: 20px;
        }

        form {
            gap: 30px;
        }

        .turn {
            gap: 20px;
        }
    }
</style>
