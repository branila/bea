<script lang="ts">
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'

  let showLinks = $state(false)

  let mounted = $state(false)
  onMount(() => mounted = true)
</script>

<nav>
    <div class="container">
        <div class="logo">
            <img src="/images/navbar/logo.svg" alt="Logo comitato studentesco">

            {#if mounted && window.outerWidth < 320}
                <a href="/" class="name">Bea</a>
            {:else if mounted}
                <a href="/" class="name">Better Esperia Access</a>
            {/if}
        </div>

        <button class="menu" onclick={() => showLinks = !showLinks }>
            {#if showLinks}
              <img src="/images/navbar/close.svg" alt="Close icon">
            {:else}
              <img src="/images/navbar/menu.svg" alt="Menu icon">
            {/if}
        </button>

        {#key showLinks}
            <div class="links" class:show-links={showLinks} transition:slide={{ duration: 150 }}>
                <a class:accent={$page.url.pathname == '/'} href="/">Home</a>
                <a class:accent={$page.url.pathname == '/contacts'} href="/contacts">Contatti</a>
                <a class:accent={$page.url.pathname == '/activities'} href="/activities">Attività</a>
                <a class:accent={$page.url.pathname == '/cogestione'} href="/cogestione">Cogestione</a>
            </div>
        {/key}
    </div>
</nav>

<style>
    nav {
        background-color: transparent;
        padding-block: 40px;
    }

    nav a:hover {
        color: var(--blue);
    }

    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--white);
        color: var(--black);
        min-height: 80px;
        border-radius: 15px;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-left: 15px;
        height: 80px
    }

    .logo img {
        height: 50px;
    }

    .logo .name {
        font-size: max(15px, 10px + 0.5vw);
        padding-top: 2px; /* Center vertically */
    }

    .links {
        display: flex;
        gap: 20px;
        padding-right: 30px;
        font-size: max(16px, 10px + 0.5vw);
    }

    .links a {
        padding-top: 2px; /* Center vertically */
    }

    .links a:hover {
        text-decoration: underline;
    }

    .accent {
        color: var(--blue);
    }

    .menu {
        background: 0;
        border: 0;
        cursor: pointer;
        display: none;
      }

    .menu img {
        height: 23px;
    }

    @media (max-width: 600px) {
        nav {
            padding-block: 20px;
        }

        .container {
            flex-wrap: wrap;
        }

        .logo img {
            height : 40px;
        }

        .links {
            width: 100%;
            flex-direction: column;
            gap: 0;
            display: none;
            padding-bottom: 5px;
        }

        .links a {
            height: 30px;
            width: 100%;
            display: flex;
            align-items: flex-start;
            padding-left: 15px;
        }

        .show-links {
            display: flex;
        }

        .menu {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 20px;
        }
    }
</style>
