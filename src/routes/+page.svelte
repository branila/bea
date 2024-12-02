<script lang="ts">
  import Carousel from "$components/home/Carousel.svelte"
  import Hero from "$components/home/Hero.svelte"
</script>

<svelte:head>
    <title>Bea - Home 🔥</title>
    <meta name="description" content="Better Esperia Access homepage"/>
</svelte:head>

<main>
    <div class="header">
        <Carousel/>
        <Hero/>
    </div>

    <div class="cards">
        CARDS
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .header {
        display: flex;
        gap: 40px;
        min-height: calc (100svh - 80px);
    }

    .cards {
        height: 300px;
        background-color: var(--red)
    }
</style>
