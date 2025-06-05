<script lang="ts">
    import SimpleButton from "$components/reusables/SimpleButton.svelte";

    let className = $state("");
</script>

<div class="container">
    <div class="search-container">
        <h1>Ricerca classe</h1>

        <input
            bind:value={className}
            placeholder="Inserisci il nome della classe"
        />

        <div class="button-container">
            <SimpleButton
                href={`/cogestione/classes/${className}`}
                disabled={!className}
            >
                Cerca
            </SimpleButton>
        </div>
    </div>
</div>

<style>
    .container {
        font-size: calc(20px + 2vw);
        height: calc(100svh - 200px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 600px) {
        .container {
            height: calc(100svh - 140px);
        }
    }

    h1 {
        font-size: max(30px, 12px + 2vw);
        color: var(--red);
        filter: brightness(1.4);
        width: min(600px, 100%);
    }

    input {
        padding: max(10px, 5px + 0.6vw);
        background-color: var(--white);
        color: var(--black);
        border: 0;
        border-radius: 8px;
        font-weight: bold;
        font-size: max(13px, 10px + 0.4vw);
        transition: 0.2s;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }

    .search-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: min(600px, 100%);
        margin: 0 auto;
        background-color: var(--grey);
        border-radius: 15px;
        padding: 30px;
    }

    .button-container {
        margin-left: auto;
    }
</style>
