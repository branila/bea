<script lang="ts">
  import type { Registration, User, Activity } from '$types/db'
  import { Roles } from '$types/db'
  import hasRole from '$lib/utils/hasRole'

  let {
    user,
    activity
  }: {
    user: User,
    activity: Activity | undefined
  } = $props()

  interface Route {
    name: string
    href: string
    icon: string
    allowed: boolean
  }

  const routes: Route[] = [
    {
      name: 'Iscrizione',
      href: '/cogestione/registration',
      icon: '/images/cogestione/sidenav/registration.png',
      allowed: !hasRole(user, Roles.Staff, Roles.Docente)
    },
    {
      name: 'Ticket',
      href: '/cogestione/ticket',
      icon: '/images/cogestione/sidenav/ticket.png',
      allowed: !hasRole(user, Roles.Staff, Roles.Docente)
    },
    {
      name: 'Admin',
      href: '/cogestione/admin',
      icon: '/images/cogestione/sidenav/admin.png',
      allowed: hasRole(user, Roles.Admin)
    },
    {
      name: `Classe ${user.class}`,
      href: `/cogestione/classes/${user.class}`,
      icon: '/images/cogestione/sidenav/class.png',
      allowed: hasRole(user, Roles.Rappresentante, Roles.Admin)
    },
    {
      name : activity?.name || '',
      href: `/cogestione/activities/${activity?.id}`,
      icon: '/images/cogestione/sidenav/activity.png',
      allowed: !!activity && hasRole(user, Roles.Organizzatore)
    },
    {
      name: 'Sicurezza',
      href: '/cogestione/security',
      icon: '/images/cogestione/sidenav/security.png',
      allowed: hasRole(user, Roles.Security, Roles.Staff, Roles.Admin)
    },
    {
      name: 'Staff',
      href: '/cogestione/staff',
      icon: '/images/cogestione/sidenav/staff.png',
      allowed: hasRole(user, Roles.Staff, Roles.Admin)
    }
  ]
</script>

{#snippet route(name: string, href: string, icon: string)}
    <a {href} class="route">
        <img src={icon} alt="Route {name} icon">
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

    {@render route('Logout', '/logout', '/images/cogestione/sidenav/logout.png')}
</aside>

<style>
    aside {
        background-color: var(--grey);
        width: max(200px, 100px + 10vw);
        padding: 30px;
        min-height: 100%;
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

    .name {
        font-weight: normal;
        font-size: max(15px, 10px + 0.5vw);
    }

    img {
        height: max(20px, 10px + 0.75vw);
        width: max(20px, 10px + 0.75vw);
        filter: invert();
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

        .name, .title {
            display: none;
        }
    }
</style>
