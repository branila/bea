<script lang="ts">
    import Sidenav from '$components/cogestione/Sidenav.svelte'

    const { children, data } = $props()

    const { user, activity } = data
</script>

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
        gap: 40px;
    }

    .container {
        width: 100%;
        min-height: calc(100svh - 200px);
    }

    @media (max-width: 600px) {
        main {
            min-height: calc(100svh - 140px);
            gap: 20px;
        }

        .container {
            min-height: calc(100svh - 140px);
        }
    }
</style>
