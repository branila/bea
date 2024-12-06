<script lang="ts">
  import Header from '$components/contacts/Header.svelte'
  import Cards from '$components/contacts/Cards.svelte'
</script>

<svelte:head>
    <meta name="description" content="Better Esperia Access contact page"/>
    <title>Bea - Contacts 🔗</title>
</svelte:head>

<main>
    <Header/>
    <Cards/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    @media (max-width: 600px) {
        main {
            gap: 20px;
        }
    }
</style>
