<script lang="ts">
  import Register from '$components/cogestione/registration/Register.svelte'
  import Registration from '$components/cogestione/registration/Registration.svelte'

  const { data, form } = $props()
</script>

<div class="container">
    {#if data.registration && !form?.error}
        <Registration {...data}/>
    {:else}
        <Register activities={data.activities} {form}/>
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
