<script lang="ts">
   const { user } = $props()
</script>

<header>
    <h2>Ciao {user.name},</h2>

    <h1>Ti stavamo aspettando</h1>
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
