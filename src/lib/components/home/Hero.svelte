<script lang="ts">
  import typewriter from '$lib/utils/typewriter'

  import PocketBase from 'pocketbase'

  import SimpleButton from '$components/reusables/SimpleButton.svelte'

  import { onMount } from 'svelte'

  let mounted = $state(false)
  onMount(() =>  mounted = true)

  async function auth() {
    const pb = new PocketBase('https://dash.pb.dev.bea.branila.it')

    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'oidc'
    })

    pb.authStore.save(authData.token, authData.record)

    document.cookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    window.location.href = '/cogestione'
  }
</script>

<main>
  <div class="top">
    <div>Benvenuto su</div>

    {#key mounted}
      <div class="accent" in:typewriter={{ speed: 50 }}>
        Better Esperia

        {#if mounted && window.innerWidth > 900}
          <br>
        {/if}

        Access
      </div>
    {/key}
  </div>

  <div class="bottom">
    <div class="description">
      <span class="description-accent">Bea</span>
      è la piattaforma del
      <span class="description-accent">Comitato Studentesco Esperia</span>
      per la gestione delle iscrizioni e degli accessi durante la
      <span class="description-accent">cogestione</span>
      del nostro istituto. Come lo facciamo noi non lo fa nessuno.
    </div>

    <SimpleButton onclick={auth}>Accedi alla piattaforma</SimpleButton>
  </div>
</main>

<style>
  main {
    background-color: var(--grey);
    min-height: calc(100svh - 200px);
    width: 45%;
    border-radius: 15px;
    padding: 40px;
    font-size: max(24px, 16px + 1vw);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 30px;
  }

  .top {
    font-size: max(12px, 16px + 1.5vw);
  }

  .accent {
    color: var(--red);
    font-size: max(24px, 32px + 2.5vw);
    margin-top: 15px;
    filter: brightness(1.2);
  }

  .bottom {
    display: flex;
    flex-direction: column;
    gap: 30px;
    font-size: max(18px, 10px + 1vw);
  }

  .description {
    font-weight: normal;
  }

  .description-accent {
    color: var(--red);
    filter: brightness(1.2);
  }

  @media (max-width: 900px) {
    main {
      width: 100%;
      padding: 20px;
      min-height: calc((100svh - 160px) * (1.75 / 3) - 40px);
      gap: 10px;
    }

    .bottom {
      gap: 20px;
    }
  }

  @media (max-width: 600px) {
    main {
      min-height: calc((100svh - 120px) * (1.75 / 3) - 20px);
    }
  }
</style>
