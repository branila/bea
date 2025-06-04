<script lang="ts">
  import Register from '$components/cogestione/registration/Register.svelte'
  import type { PageServerData } from './$types'
  import Registration from '$components/cogestione/registration/Registration.svelte'
  import { isRegistered } from '$lib/utils/is-registered'

  const { data }: { data: PageServerData } = $props()
  const { userRegistrations, activitiesTurns, eventDays } = data

  let allActivitiesTurns: typeof activitiesTurns = $state([])

  $effect(() => {
    const setAllActivitiesTurns = async () => {
      allActivitiesTurns = await fetch('/api/activities')
        .then(response => response.json())
        .then(data => data.activitiesTurns)
    }

    setAllActivitiesTurns()
  })
</script>

<div class="container">
    <!-- Checks if the user is fully registered to every event day -->
    {#if isRegistered(userRegistrations, allActivitiesTurns, eventDays)}
        <Registration {...data} />
    {:else}
        <Register {...data}/>
    {/if}
</div>

<style>
    .container {
        min-height: calc(100svh - 200px);
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
        }
    }
</style>
