<script lang='ts'>
  import type {User, Activity} from '$types'
  import hasRoles from '$lib/utils/hasRoles'
  import {page} from '$app/stores'

  let {
    user,
    organizerActivity,
  }: {
    user: User
    organizerActivity: Activity | undefined
  } = $props()

  interface Route {
    name: string
    href: string
    icon: string
    allowed: boolean
  }

  function encodeActivityName(activity: Activity | undefined): string {
    return activity ? encodeURIComponent(activity.name.toLowerCase()) : '';
  }

  const routes: Route[] = [
    {
      name: 'Home',
      href: '/cogestione',
      icon: '/home.svg',
      allowed: !!user,
    },
    {
      name: 'Iscrizione',
      href: '/cogestione/registration',
      icon: '/registration.svg',
      allowed: !hasRoles(user, 'docente'),
    },
    {
      name: 'Ticket',
      href: '/cogestione/ticket',
      icon: '/ticket.svg',
      allowed: !hasRoles(user, 'docente'),
    },
    {
      name: 'Admin',
      href: '/cogestione/admin',
      icon: '/admin.svg',
      allowed: hasRoles(user, 'amministratore'),
    },
    {
      name: `Classe ${user.class}`,
      href: `/cogestione/classes/${user.class}`,
      icon: '/class.svg',
      allowed: hasRoles(user, 'rappresentante', 'amministratore'),
    },
    {
      name: organizerActivity?.name || '',
      href: `/cogestione/activities/${organizerActivity?.name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: '/activity.svg',
      allowed: !!organizerActivity && hasRoles(user, 'organizzatore'),
    },
    {
      name: 'Sicurezza',
      href: '/security',
      icon: '/security.svg',
      allowed: hasRoles(user, 'sicurezza', 'amministratore'),
    },
    {
      name: 'Classi',
      href: '/cogestione/classes',
      icon: '/staff.svg',
      allowed: hasRoles(user, 'amministratore', 'docente'),
    },
  ]

  async function logout() {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      window.location.href = '/cogestione/login'
    }
  }
</script>

{#snippet route(name: string, href: string, icon: string)}
  <a {href} class="route" class:active={$page.url.pathname === href}>
    <img src={`/images/cogestione/sidenav/${icon}`} alt="Route {name} icon" />
    <div class="name">{name}</div>
  </a>
{/snippet}

<aside>
  <div class="top">
    <a href="/cogestione" class="title">Cogestione</a>

    <div class="routes">
      {#each routes as { name, href, icon, allowed }}
        {#if allowed}
          {@render route(name, href, icon)}
        {/if}
      {/each}
    </div>
  </div>

  <button onclick={logout} class="route logout">
    <img src="/images/cogestione/sidenav/logout.svg" alt="Logout icon" />
    <div class="name">Logout</div>
  </button>
</aside>

<style>
  aside {
    background-color: var(--grey);
    width: max(200px, 100px + 10vw);
    padding: 30px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 30px;
  }

  .top {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .title {
    font-size: max(20px, 12px + 1.25vw);
  }

  .routes {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .route {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: max(12px, 6px + 1vw);
    color: var(--white);
  }

  .logout {
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  .name {
    font-weight: normal;
    font-size: max(15px, 10px + 0.5vw);
  }

  .route:hover {
    color: var(--red);
    filter: brightness(1.4);
  }

  .active :global(.name) {
    color: var(--red);
    filter: brightness(1.4);
  }

  img {
    height: 20px;
    width: max(20px, 10px + 0.75vw);
    filter: invert();
    user-select: none;
    aspect-ratio: 1 / 1;
  }

  .route:hover > img {
    /* Changes the color of the icon to red */
    filter: brightness(0) saturate(100%) invert(17%) sepia(32%) saturate(6275%)
      hue-rotate(349deg) brightness(140%) contrast(90%);
  }

  .active :global(img) {
    /* Changes the color of the icon to red */
    filter: brightness(0) saturate(100%) invert(17%) sepia(32%) saturate(6275%)
      hue-rotate(349deg) brightness(140%) contrast(90%);
  }

  @media (max-width: 600px) {
    aside {
      padding: 20px;
      width: auto;
      gap: 20px;
    }

    .top {
      gap: 20px;
    }

    .name,
    .title {
      display: none;
    }
  }
</style>
