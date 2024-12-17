<script lang="ts">
  import Card from '$components/contacts/Card.svelte'
</script>

<div class="cards">
    <div class="box">
        <Card
            title="Problemi"
            description="Segnala problemi o malfunzionamenti della piattaforma. Rispondiamo in ordine di gravità, dando la precedenza alle catastrofi."
            contact="bea@branila.it"
            href="mailto:bea@branila.it"
            src="/images/contacts/alert.svg"
        />

        <Card
            title="Instagram"
            description="Dai un'occhiata al nostro profilo instagram per ricevere aggiornamenti e per ricordarci che dobbiamo ancora rispondere alla tua domanda."
            contact="@noidellesperia"
            href="https://www.instagram.com/noidellesperia/"
            src="/images/contacts/instagram.svg"
        />
    </div>

    <div class="box">
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
</div>

<style>
    .cards {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .box {
        display: flex;
        gap: 40px;
    }

    @media (max-width: 1300px) {
        .box {
            flex-direction: column;
        }
    }

    @media (max-width: 600px) {
        .cards {
            gap: 20px;
        }

        .box {
            gap: 20px;
        }
    }

</style>
