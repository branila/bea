
<script lang="ts">
  import Greeting from '$components/cogestione/home/Greeting.svelte'
  import Cards from '$components/cogestione/home/Cards.svelte'

  const { data } = $props()
  const { user, isRegistered } = data
  const { name } = user
</script>

<svelte:head>
    <title>Bea - Cogestione 🎈</title>
</svelte:head>

<div class="container">
    <Greeting {name}/>

    <Cards {isRegistered}/>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding-top: 30px;
        min-height: calc(100svh - 200px);
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
            gap: 20px;
        }
    }
</style>
