<script lang="ts">
    import Sidenav from '$components/cogestione/Sidenav.svelte'

    let { children, data } = $props()

    const { user, activity } = data
</script>

<svelte:head>
    <title>Bea - Cogestione 🎈</title>
</svelte:head>

<main>
    <Sidenav {user} {activity} />

    <div class="container">
        {@render children()}
    </div>
</main>

<style>
    main {
        display: flex;
        min-height: calc(100svh - 200px);
        gap: 20px;
    }

    @media (max-width: 600px) {
        main {
            height: calc(100svh - 140px);
        }
    }
</style>
