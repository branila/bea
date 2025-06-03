<script lang="ts">
    import SimpleButton from "$components/reusables/SimpleButton.svelte";

    const {
        name,
        details,
        image,
    }: {
        name: string;
        details: string;
        image?: string | null;
    } = $props();
</script>

<div class="card">
    <div class="image-container">
        <img src={image} alt={name} />
    </div>
    <div class="content">
        <h1>{name}</h1>
        <div class="text">
            {@html details}
        </div>
    </div>
    <div class="button-container">
        <SimpleButton accent="var(--red)" href={"/cogestione/registration"}>
            Iscriviti
        </SimpleButton>
    </div>
</div>

<style>
    .card {
        padding: 20px;
        border-radius: 15px;
        display: flex;
        gap: 20px;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        width: 100%;
        background-color: var(--grey);
    }

    h1 {
        font-size: max(30px, 18px + 1.25vw);
        margin-bottom: max(15px, 10px + 0.25vh);
    }

    .text {
        font-size: max(16px, 10px + 0.75vw);
        font-weight: normal;
    }

    /* I'm sorry for this shit */
    .text :global(.description),
    .text :global(.location),
    .text :global(.days),
    .text :global(.days li) {
        font-weight: normal;
    }

    .text :global(.days li) {
        list-style-type: none;
    }

    .content {
        margin-bottom: auto;
    }

    .image-container {
        width: 30%; /* Takes up 40% of the card width */
        flex-shrink: 0;
    }

    img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        object-fit: cover;
        object-position: center center;
    }

    @media (max-width: 900px) {
        .card {
            flex-direction: column;
            flex-wrap: wrap;
        }

        .image-container {
            width: 100%;
        }
    }
    .button-container {
        margin-left: auto;
        display: flex;
        align-items: flex-end;
    }

    
</style>
