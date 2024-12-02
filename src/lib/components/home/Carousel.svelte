<script>
  import { fade } from 'svelte/transition'

  let currentSlide = $state(-1)
  const slidesNumber = 6

  const images = [...Array(slidesNumber).keys()].map(i => `/images/home/carousel/${i}.jpg`)

  $effect(() => {
    currentSlide = 0 // triggers the transition

    setInterval(() => {
        currentSlide = ++currentSlide % slidesNumber
    }, 5000)
  })
</script>

<svelte:head>
  {#each images as image}
    <link rel="preload" href={image} as="image">
  {/each}
</svelte:head>

<main>
    {#key currentSlide}
        <img src={`/images/home/carousel/${currentSlide}.jpg`} alt={`Foto cogestione ${currentSlide}`} in:fade={{duration: 500}} />
    {/key}
</main>

<style>
    main {
        height: calc(100svh - 200px);
        width: 55%;
        border-radius: 15px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 15px;
    }
</style>
