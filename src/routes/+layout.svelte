<script lang="ts">
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";

    let { children } = $props();

    import "../app.css";
</script>

<div class="container">
    <Navbar />

    <div class="content">
        {@render children()}
    </div>

    <Footer />
</div>

<style>
    .container {
        background-color: var(--light);
        color: var(--dark);
        padding-inline: 40px;
    }

    .content {
        min-height: calc(100svh - 110px);
    }

    @media (max-width: 600px) {
        .container {
            padding-inline: 20px;
        }
    }
</style>
