<script lang="ts">
    import type { Activity } from '$types'
    import Card from '$components/activities/activity/Card.svelte'
    const { data } = $props()

    const { activity }: { activity: Activity } = data
</script>

<div class="container">
    {#if !activity}
        <p>Attività non trovata</p>
    {:else}
    <Card
        name={activity.name}
        details={activity.details}
        image={`/images/activities/${activity.image}`}
    />
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