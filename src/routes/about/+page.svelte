<script lang="ts">
    import Stats from '$components/about/Stats.svelte'
    import Story from '$components/about/Story.svelte'
    import Team from '$components/about/Team.svelte'
    import OpenSource from '$components/about/OpenSource.svelte'
</script>

<svelte:head>
    <meta name="description" content="La storia di Better Esperia Access e del team che l'ha costruita"/>
    <title>Bea - Chi siamo</title>
</svelte:head>

<main>
    <Story/>
    <Stats/>
    <Team/>
    <OpenSource/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding-bottom: 40px;
    }

    @media (max-width: 600px) {
        main {
            gap: 20px;
            padding-bottom: 20px;
        }
    }
</style>
