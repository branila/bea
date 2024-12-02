<script lang="ts">
    import typewriter from '$lib/utils/typewriter'
    import { onMount } from 'svelte'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'

    let mounted = $state(false)
    onMount(() => { mounted = true })
</script>

<main>
    <div class="top">
        <div>Benvenuto su</div>

        {#key mounted}
            <div class="accent" in:typewriter={{ speed: 50 }}>
                Better Esperia Access
            </div>
        {/key}
    </div>

    <div class="bottom">
        <div class="description">
            <span class="description-accent">Bea</span>
            è la piattaforma del
            <span class="description-accent">Comitato Studentesco Esperia</span>
            per la gestione delle iscrizioni e degli accessi durante la
            <span class="description-accent">cogestione</span>
            del nostro istituto.
            Come la facciamo noi non la fa nessuno.
        </div>

        <SimpleButton>Accedi alla piattaforma</SimpleButton>
    </div>
</main>

<style>
    main {
        background-color: var(--grey);
        height: calc(100svh - 200px);
        width: 45%;
        border-radius: 15px;
        padding: 35px;
        font-size: max(24px, 16px + 1vw);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30px;
    }

    .top {
        font-size: max(24px, 16px + 1.5vw);
    }

    .accent {
        color: var(--red);
        font-size: max(48px, 32px + 3vw);
        margin-top: 15px;
    }

    .bottom {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .description {
        font-weight: normal;
    }

    .description-accent {
        color: var(--red);
        filter: brightness(1.2);
    }
</style>
