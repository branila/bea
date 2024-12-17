<script lang="ts">
   const { data } = $props()
   const { activity } = data
</script>

<div class="container">
    <div class="inner-container">
        <h1>{activity?.name}</h1>

        {#each activity.capacity as turn, i}
            <div class="info">
                <span>
                    {#if activity.turns != 1}
                        Turno {i + 1}
                    {:else}
                        Posti rimanenti
                    {/if}
                </span>
                <span>
                    {#if activity.turns != 1}
                        {#if turn == 0}
                            Esaurito
                        {:else}
                            {turn} posti rimanenti
                        {/if}
                    {:else}
                        {#if turn == 0}
                            Esaurito
                        {:else}
                            {turn}
                        {/if}
                    {/if}
                </span>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        min-height: calc(100svh - 200px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h1 {
        color: var(--red);
        filter: brightness(1.4);
        font-size: calc(20px + 1.5vw);
        margin-bottom: 20px;
    }

    .inner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        background-color: var(--grey);
        gap: 20px;
        width: min(400px, 100%);
        border-radius: 15px;
    }

    .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: calc(10px + 0.5vw)
    }
</style>
