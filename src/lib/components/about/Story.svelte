<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import typewriter from '$lib/utils/typewriter'

    let mounted = $state(false)

    let clicks = 0
    let showEgg = $state(false)
    let eggTimer: NodeJS.Timeout

    function handlePhotoClick() {
        if (++clicks < 14) return

        showEgg = true
        eggTimer = setTimeout(() => {
          showEgg = false
          clicks = 0
        }, 2000)
    }

    onMount(() => {
        mounted = true
        return () => clearTimeout(eggTimer)
    })
</script>

<div class="story">
    <button class="photo-wrap" class:egg-active={showEgg} onclick={handlePhotoClick}>
        <img class="main" src="/images/about/about.jpg" alt="Il team di Better Esperia Access" />

        {#if showEgg}
            <img class="egg" src="/images/about/easteregg.jpeg" transition:fade={{ duration: 200 }} alt="Easter egg" />
        {/if}
    </button>

    <div class="text">
        {#key mounted}
            <h2 in:typewriter={{ speed: 50 }}>La nostra storia</h2>
        {/key}

        <div class="body">
            <p>
                Nel dicembre 2023, decidemmo di costruire qualcosa di speciale per
                la nostra scuola. Notti insonni, caffeina, e la determinazione di chi
                lavora per un'intera comunità.
                Quando oltre un migliaio di studenti si iscrissero alle attività della cogestione
                grazie alla nostra piattaforma, capimmo che ne era valsa la pena.
            </p>
            <p>
                Vedere una cosa che hai costruito funzionare è un'emozione difficile da descrivere.
                BEA è nata dall'orgoglio di chi ama l'Esperia, e dalla convinzione che gli studenti
                possano lasciare qualcosa di duraturo.
            </p>
        </div>
    </div>
</div>

<style>
    .story {
        display: flex;
        gap: 40px;
        min-height: calc(100svh - 460px);
    }

    .photo-wrap {
        position: relative;
        flex: 1.2;
        border-radius: 15px;
        overflow: hidden;
        border: none;
        padding: 0;
        background: none;
        cursor: pointer;
    }

    .photo-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        display: block;
        filter: brightness(0.9);
        transition: transform 0.2s, filter 0.2s;
    }

    .egg {
        position: absolute;
        inset: 0;
    }

    /* Hover zoom only on the main image, only when not clicking */
    .photo-wrap:not(.egg-active):hover:not(:active) .main {
        transform: scale(1.2);
        filter: brightness(1);
    }

    /* Click on both images */
    .photo-wrap:active img {
        transform: scale(1.1);
    }

    .text {
        flex: 1;
        background-color: var(--grey);
        border-radius: 15px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        padding-block: 40px;
    }

    h2 {
        color: var(--red);
        filter: brightness(1.4);
        font-size: max(20px, 24px + 1.25vw);
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    p {
        font-weight: normal;
        line-height: 1.4;
        font-size: calc(18px + 0.5vw);
    }

    @media (max-width: 1200px) {
        .story {
            flex-direction: column;
            height: auto;
        }

        .photo-wrap {
            height: 300px;
        }
    }

    @media (max-width: 600px) {
        .story {
            min-height: calc(100svh - 140px);
            gap: 20px;
        }

        .photo-wrap {
            flex: none; /* disabilita flex-grow: 1.2, usa solo l'altezza esplicita */
            height: 28svh;
        }

        .text {
            flex: 1;
            padding: 20px;
            gap: 16px;
            justify-content: flex-start;
        }

        .body {
            margin-top: auto;
        }
    }
</style>
