<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'

  let currentSlide = $state(-1)
  const slidesNumber = 8

  let interval: number
  const duration = 10000

  const images = [...Array(slidesNumber).keys()].map(i => `/images/home/${i}.jpg`)

  onMount(() => {
    currentSlide = 0 // triggers the transition

    interval = setInterval(() => {
      nextSlide()
    }, 10000)

    return () => clearInterval(interval)
  })

  function resetInterval() {
    clearInterval(interval)

    interval = setInterval(() => {
      currentSlide = ++currentSlide % slidesNumber
    }, duration)
  }

  function nextSlide() {
    currentSlide = ++currentSlide % slidesNumber

    resetInterval()
  }
</script>

<svelte:head>
  {#each images as image}
    <link rel="preload" href={image} as="image">
  {/each}
</svelte:head>

<button class="container" onclick={nextSlide}>
    {#if currentSlide >= 0}
        <img
            src={`/images/home/${currentSlide}.jpg`}
            alt={`Immagine ${currentSlide}`}
            in:fade={{duration: 500}}
        />
    {/if}
</button>

<style>
    .container {
        height: calc(100svh - 200px);
        width: 55%;
        border-radius: 15px;
        overflow: hidden;
        border: 0;
        cursor: pointer;
        background-color: transparent;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 15px;
        filter: brightness(0.9);
        transition: 0.2s;
    }

    img:hover {
        filter: brightness(1);
        transform: scale(1.2);
        transition: 0.2s;
    }

    img:active {
        transform: scale(1.1);
        transition: 0.2s;
    }

    @media (max-width: 900px) {
        .container {
            width: 100%;
            height: calc((100svh - 160px) * (1.25/3))
        }
    }
</style>
