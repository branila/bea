<script lang="ts">
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'

  let showLinks = $state(false)
</script>

<nav>
    <div class="container">
        <div class="logo">
            <img src="/images/navbar/logo.svg" alt="Logo comitato studentesco">
            <a href="/" class="name">Better Esperia Access</a>
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
                <a class:accent={$page.url.pathname == '/contacts'} href="/contact">Contatti</a>
                <a class:accent={$page.url.pathname == '/cogestione'} href="/cogestione">Cogestione</a>
            </div>
        {/key}
    </div>
</nav>

<style>
    nav {
        background-color: var(--black);
        padding-block: 40px;
        position: sticky;
        top: 0;
        z-index: 2;
    }

    nav a:hover {
        color: var(--blue);
        transition: 0.2s;
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
        font-size: max(16px, 10px + 0.5vw);
        padding-top: 2px; /* Center vertically */
    }

    .links {
        display: flex;
        gap: 15px;
        padding-right: 30px;
        font-size: max(16px, 10px + 0.5vw);
        transition: 0.2s;
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
        padding-right: 25px;
        background: 0;
        border: 0;
        cursor: pointer;
        display: none;
      }

    .menu img {
        height: 25px;
    }

    @media (max-width: 600px) {
        nav {
            padding-block: 20px;
        }

        .container {
            flex-wrap: wrap;
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
            padding-right: 30px;
        }
    }
</style>
