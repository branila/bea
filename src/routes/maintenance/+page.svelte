<script lang="ts">
</script>

<svelte:head>
  <meta name="description" content="Better Esperia Access homepage" />
  <title>Bea - Home 🔥</title>
</svelte:head>

<main>
  <div class="header">
    <h1 class="center">Siamo in manutenzione</h1>
    <h2>
      Le iscrizioni apriranno domani, gli utenti che si sono già iscritti
      saranno resettati e dovranno iscriversi nuovamente.
    </h2>
    <p class="inline">
      Per eventuali problemiatiche contattare il <a
        class="link"
        href="/contacts">supporto</a
      >.
    </p>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .inline {
    display: inline;
  }

  .header {
    display: flex;
    gap: 40px;
    min-height: calc(100svh - 200px);
    align-content: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
  }

  .link {
    text-decoration: underline;
  }
</style>
