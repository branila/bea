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
      Le iscrizioni sono attualmente chiuse
    </h2>

    <p class="inline">
      Per eventuali problematiche contattare il
      <a class="link" href="/contacts">supporto</a>.
    </p>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  h1 {
    color: var(--red);
    filter: brightness(1.4)
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
    width: min(600px, 100%)
  }

  .link {
    text-decoration: underline;
  }
</style>
