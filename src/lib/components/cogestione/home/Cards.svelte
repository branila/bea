<script lang="ts">
  import Card from '$components/cogestione/home/Card.svelte'

  const { isRegistered }: { isRegistered: boolean } = $props()
</script>

<div class="cards">

    {#if isRegistered}
        <Card
            title="Iscrizione"
            description="Visualizza le attività a cui ti sei iscritto alla cogestione"
            href="/cogestione/registration"
            buttonText="Visualizza"
        />
    {:else}
        <Card
            title="Iscriviti"
            description="A nessuno piace dover rimanere in classe durante la cogestione. Iscriviti dai."
            href="/cogestione/registration"
            buttonText="Iscriviti"
        />
    {/if}

    <Card
        title="Attività"
        description="Non hai la più pallida idea di che cosa fare? Scopri le attività di questa cogestione"
        href="/activities"
        buttonText="Scopri"
    />

    <Card
        title="Ticket"
        description="Visualizza il tuo ticket personale per l'ingresso alla cogestione"
        href="/cogestione/ticket"
        buttonText="Visualizza"
    />

    <Card
        title="Assistenza"
        description="Hai urgente bisogno di aiuto? Contattaci subito e ti salviamo noi"
        href="/contacts"
        buttonText="Contattaci"
    />
</div>

<style>
    .cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100%;
        gap: 40px;
    }

    @media (max-width: 900px) {
        .cards {
            gap: 20px;
        }
    }

    @media (max-width: 750px) {
        .cards {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .cards {
            gap: 20px;
        }
    }
</style>
