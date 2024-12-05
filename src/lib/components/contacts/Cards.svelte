<script lang="ts">
  import Card from "$components/contacts/Card.svelte"
</script>

<div class="cards">
    <Card
        title="Problemi"
        description="Segnala problemi o malfunzionamenti della piattaforma. Rispondiamo in ordine di gravità, dando la precedenza alle catastrofi."
        contact="cogestione@itispaleocapa.it"
        href="mailto:cogestione@itispaleocapa.it"
        src="/images/contacts/alert.svg"
    />

    <Card
        title="Instagram"
        description="Dai un'occhiata al nostro profilo instagram per ricevere aggiornamenti e per ricordarci che dobbiamo ancora rispondere alla tua domanda."
        contact="@noidellesperia"
        href="https://www.instagram.com/noidellesperia/"
        src="/images/contacts/instagram.svg"
    />

    <Card
        title="Email"
        description="Scrivi qualcosa di intelligente al comitato studentesco. Rispondiamo soltanto alle email con meno di due errori grammaticali."
        contact="comitato.studentesco@itispaleocapa.it"
        href="mailto:comitato.studentesco@itispaleocapa.it"
        src="/images/contacts/email.svg"
    />

    <Card
        title="Telegram"
        description="Hai una domanda o un dubbio? Contatta un amministratore su telegram e scoprirai se potevi arrivarci da solo"
        contact="@branilaa"
        href="https://t.me/branilaa"
        src="/images/contacts/telegram.svg"
    />
</div>

<style>
    .cards {
        height: 50%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
        align-items: center;
    }

    @media (max-width: 1300px) {
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
