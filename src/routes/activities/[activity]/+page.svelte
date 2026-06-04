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
        description={activity.description}
        details={activity.details}
        image={activity.image ? `/images/activities/${activity.image}` : null}
        activityType={activity.type}
    />
    {/if}

</div>

<style>
    .container {
        padding-block: 24px;
    }
</style>