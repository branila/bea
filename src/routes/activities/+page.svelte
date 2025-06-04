<script lang="ts">
    import Header from '$components/activities/Header.svelte'
    import Card from '$components/activities/Card.svelte'
    import type { Activity } from '$types'

    const { data } = $props()

    const { activities }: { activities: Activity[] } = data
  
</script>

<svelte:head>
    <meta name="description" content="Better Esperia Access activity page"/>
    <title>Bea - Attività 📑</title>
</svelte:head>

<div class="container">
    <Header />

    <div class="cards">
        {#each activities as activity}
            <Card
                name={activity.name}
                description={activity.description}
                href={`/activities/${activity.name.toLowerCase().replace(/\s+/g, '-')}`}
                image={`/images/activities/${activity.image}`}
            />
        {/each}
    </div>
</div>

<style>
    .container {
        min-height: calc(100svh - 200px);
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
            gap: 20px;
        }
    }

    .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }
</style>