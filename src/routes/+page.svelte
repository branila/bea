<script lang="ts">
  import Carousel from '$components/home/Carousel.svelte'
  import Hero from '$components/home/Hero.svelte'
  import Card from '$components/home/Card.svelte'
</script>

<svelte:head>
    <meta name="description" content="Better Esperia Access homepage"/>
    <title>Bea - Home 🔥</title>
</svelte:head>

<main>
    <div class="header">
        <Carousel/>
        <Hero/>
    </div>

    <div class="cards">
        <Card
            title="Problemi"
            description="Vuoi contattarci per segnalare un problema o un malfunzionamento?"
            color="var(--red)"
            buttonText="Contattaci"
            href="/contacts"
        />

        <Card
            title="Sicurezza"
            description="Sei un membro della sicurezza della cogestione e vuoi accedere all'area riservata?"
            color="var(--blue)"
            buttonText="Accedi"
            href="/cogestione/security"
        />

        <Card
            title="Ticket"
            description="Vuoi visualizzare il tuo ticket personale per l'ingresso alla cogestione?"
            color="var(--green)"
            buttonText="Visualizza"
            href="/cogestione/ticket"
        />
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
        min-height: calc(100svh - 200px);
    }

    .cards {
        display: flex;
        gap: 40px;
    }

    @media (max-width: 900px) {
        main {
            gap: 20px;
        }

        .header {
            flex-direction: column;
        }

        .cards {
            flex-direction: column;
        }
    }

    @media (max-width: 600px) {
        .header {
            gap: 20px;
        }

        .cards {
            gap: 20px;
        }
    }
</style>
