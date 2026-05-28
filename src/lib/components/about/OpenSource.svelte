<script lang="ts">
    import OutlinedButton from '$components/reusables/OutlinedButton.svelte'
</script>

<div class="opensource">
    <div class="left">
        <h2>Open Source</h2>
        <p>Bea è completamente open source. Esplora il codice, contribuisci, adattalo. Mettici una stella.</p>
    </div>

    <div class="button-wrap">
        <OutlinedButton href="https://github.com/branila/bea">
            github.com/branila/bea
        </OutlinedButton>
    </div>
</div>

<style>
    .opensource {
        background-color: var(--grey);
        border-radius: 15px;
        padding: 40px;
        display: flex;
        align-items: center;
        gap: 60px;
    }

    .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
    }

    h2 {
        font-size: max(20px, 20px + 1.5vw);
    }

    p {
        font-size: max(12px, 12px + 0.4vw);
        font-weight: normal;
        line-height: 1.35;
        opacity: 0.6;
        max-width: 380px;
    }

    @media (max-width: 900px) {
        .opensource {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
        }
    }

    @media (max-width: 600px) {
        .opensource {
            padding: 20px;
        }
    }
</style>
