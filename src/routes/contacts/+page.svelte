<script lang="ts">
  import ContactCard from "$components/contacts/ContactCard.svelte";
  import FormCard from "$components/contacts/FormCard.svelte";
</script>

<main>
  <h1>Contatti</h1>

  <div class="cards">
    <FormCard
      title="Segnala"
      description="Hai avuto un problema con la piattaforma? Mandaci direttamente una segnalazione"
      color="var(--grey)"
      border="var(--red)"
      src="/images/contacts/alert.svg"
      action="?/sendReport"
    />

    <ContactCard
      title="Telegram"
      description="Scrivici personalmente un messaggio su Telegram"
      color="var(--grey)"
      contact="@branilaa"
      href="https://t.me/branilaa"
      border="var(--blue)"
      src="/images/contacts/telegram.svg"
    />

    <ContactCard
      title="Instagram"
      description="Visualizza l'account Instagram ufficiale del Comitato"
      color="var(--grey)"
      contact="@noidellesperia"
      href="https://www.instagram.com/noidellesperia/"
      border="var(--green)"
      src="/images/contacts/instagram.svg"
    />

    <ContactCard
      title="Email"
      description="Contattaci tramite posta elettronica"
      color="var(--grey)"
      contact="comitato.studentesco@itispaleocapa.it"
      href="mailto:comitato.studentesco@itispaleocapa.it"
      border="var(--yellow)"
      src="/images/contacts/mail.svg"
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .cards {
    display: flex;
    gap: 40px;
  }

  h1 {
    color: var(--red);
    font-size: max(24px, 32px + 2.5vw);
    margin-top: 15px;
    margin-bottom: 15px;
    filter: brightness(1.2);
  }

  @media (max-width: 900px) {
    main {
      gap: 20px;
    }

    .cards {
      flex-direction: column;
    }
  }

  @media (max-width: 600px) {
    .cards {
      gap: 20px;
    }
  }
</style>
