<script lang="ts">
  import PocketBase, {type RecordModel} from "pocketbase";

  const {data} = $props();

  let error = $state(false);

  async function auth() {
    const pb = new PocketBase(data.pbInstance);
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      pb.authStore.save(authData!.token, authData!.record);

      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: true,
        sameSite: "strict",
      });

      window.location.href = "/cogestione";
    } catch {
      error = true;
    }
  }
</script>

<div class="container">
  <div class="inner-container">
    <div class="heading">
      <h1>Login</h1>

      {#if error}
        <h3 class="error">
          Ops, pare che ci sia stato un errore. <br /> Se il problema persiste, contatta
          l'assistenza.
        </h3>
      {:else}
        <h3>Accedi con il tuo account istituzionale</h3>
      {/if}
    </div>

    {#if error}
      <a href="/contacts">
        <button> contatta l'assistenza </button>
      </a>
    {:else}
      <button onclick={auth}>Accedi con google</button>
    {/if}
  </div>
</div>

<style>
  .container {
    min-height: calc(100svh - 200px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  .inner-container {
    display: flex;
    flex-direction: column;
    gap: calc(40px + 4vw);
    background-color: var(--grey);
    padding: calc(40px + 4vw);
    border-radius: 15px;
  }

  .heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  h1 {
    font-size: max(24px, 32px + 2.5vw);
    color: var(--red);
    filter: brightness(1.4);
  }

  h3 {
    font-size: max(16px, 10px + 0.75vw);
    text-align: center;
    max-width: calc(500px);
    line-height: 1.2;
  }

  .error {
    color: var(--red);
    filter: brightness(1.4);
  }

  button {
    padding-block: calc(10px + 1vw);
    padding-top: calc(12px + 1vw); /* Vertically center the text */
    padding-inline: calc(20px + 2vw);
    font-size: max(16px, 10px + 0.75vw);
    cursor: pointer;
    background-color: var(--white);
    border: 3px solid black;
    transition: 0.2s;
    border-radius: 15px;
  }

  a {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  button:hover {
    border: 3px solid var(--red);
    color: var(--red);
  }

  @media (max-width: 600px) {
    .container {
      min-height: calc(100svh - 140px);
    }
  }
</style>
