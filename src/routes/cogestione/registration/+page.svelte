<script lang="ts">
  import Register from '$components/cogestione/registration/Register.svelte'
  import type { PageServerData } from './$types'
  import Registration from '$components/cogestione/registration/Registration.svelte'
  import { isRegistered } from '$lib/utils/is-registered'

  const { data }: { data: PageServerData } = $props()
  const { userRegistrations, activitiesTurns, eventDays } = data
</script>

<div class="container">
    <!-- Checks if the user is fully registered to every event day -->
    {#if isRegistered(userRegistrations, activitiesTurns, eventDays)}
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
