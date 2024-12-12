<script lang="ts">
  import Card from '$components/cogestione/home/Card.svelte'
  import { type Registration } from '$types/db'

  const { registration }: {
    registration: Registration | undefined
  } = $props()
</script>

<div class="cards">

    {#if registration}
        <Card
            title="Iscrizione"
            description="Visualizza le attività a cui ti sei iscritto alla cogestione"
            href="/cogestione/registration"
            buttonText="Visualizza"
        />
    {:else}
        <Card
            title="Iscriviti"
            description="Iscriviti alle attività della cogestione. È gratis, lo giuriamo"
            href="/cogestione/registration"
            buttonText="Iscriviti"
        />
    {/if}

    <Card
        title="Ticket"
        description="Visualizza il tuo ticket personale per l'ingresso alla cogestione"
        href="/cogestione/ticket"
        buttonText="Visualizza"
    />

    <Card
        title="Instagram"
        description="Segui la nostra pagina su instagram per rimanere aggiornato sulla cogestione"
        href="https://www.instagram.com/noidellesperia/"
        buttonText="Seguici"
    />

    <Card
        title="Assistenza"
        description="Hai urgente bisogno di aiuto? Contattaci subito e ti salviamo noi"
        href="mailto:comitato.studentesco@itispaleocapa.it"
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
