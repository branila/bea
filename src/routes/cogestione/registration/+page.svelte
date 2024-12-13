<script lang="ts">
  import Register from '$components/cogestione/registration/Register.svelte'
  import Registration from '$components/cogestione/registration/Registration.svelte'

  const { data } = $props()
</script>

<div class="container">
    {#if data.registration}
        <Registration {...data}/>
    {:else}
        <Register {...data}/>
    {/if}
</div>

<style>
    .container {
        height: calc(100svh - 200px);
    }

    @media (max-width: 600px) {
        .container {
            height: calc(100svh - 140px);
            padding-top: 15px;
        }
    }
</style>
