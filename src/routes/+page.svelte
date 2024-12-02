<script lang="ts">
  import Carousel from "$components/home/Carousel.svelte"
  import Hero from "$components/home/Hero.svelte"
</script>

<svelte:head>
    <title>Bea - Home 🔥</title>
    <meta name="description" content="Better Esperia Access homepage"/>
</svelte:head>

<main>
    <Carousel/>
    <Hero/>
</main>

<style>
   main {
       display: flex;
       gap: 40px;
       height: calc (100svh - 80px);
   }
</style>
