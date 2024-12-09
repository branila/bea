<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$components/reusables/SimpleButton.svelte'
</script>

<svelte:head>
  <title>Bea - {$page.status}</title>
  <meta name="description" content="Errore {$page.status}"/>
</svelte:head>

<div class="error">
  <div class="container">
    <span class="status">
      {$page.status}
    </span>

    <span class="message">
      {$page.error?.message}
    </span>

    <Button href="/">Homepage</Button>
  </div>
</div>

<style>
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100svh - 200px);
    text-align: center;
    border: 3px solid var(--yellow);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .status {
    font-size: max(35px, 25px + 4vw);
    line-height: 0.7;
  }

  .message {
    font-weight: normal;
    font-size: max(20px, 10px + 2vw);
  }

  @media (max-width: 600px) {
    .error {
        height: calc(100svh - 140px);
    }
  }
</style>
