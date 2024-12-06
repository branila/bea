<script lang="ts">
    import '../app.css'

    import Navbar from '$components/Navbar.svelte'
    import Footer from '$components/Footer.svelte'

    let { children } = $props()
</script>

<svelte:head>
  <link rel="preload" href="/marsden/marsden-bold.woff2" as="font" type="font/woff2"/>
  <link rel="preload" href="/marsden/marsden-regular.woff2" as="font" type="font/woff2"/>
  <meta name="keywords" content="bea, better esperia access, baratro e apocalisse"/>
  <title>Bea 🔥</title>
</svelte:head>

<div class="container">
    <Navbar/>

    <div class="content">
        {@render children()}
    </div>

    <Footer />
</div>

<style>
    .container {
        background-color: var(--black);
        color: var(--white);
        padding-inline: 40px;
      }

    .content {
        min-height: calc(100svh - 130px);
    }

    @media (max-width: 600px) {
        .container {
            padding-inline: 20px;
        }
    }
</style>
