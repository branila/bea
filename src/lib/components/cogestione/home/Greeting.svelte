<script lang="ts">
   const { name } = $props()
</script>

<header>
    <h2>Ciao {name},</h2>

    <h1>Ci sei proprio mancato un sacco</h1>
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h2 {
        font-size: max(20px, 12px + 1.25vw);
    }

    h1 {
        color: var(--red);
        filter: brightness(1.4);
        font-size: max(30px, 18px + 1.5vw);
    }
</style>
