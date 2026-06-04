<script lang="ts">
    import SimpleButton from "$components/reusables/SimpleButton.svelte";

    const {
        name,
        description,
        details,
        image,
        activityType,
    }: {
        name: string;
        description: string;
        details: string;
        image?: string | null;
        activityType: string;
    } = $props();
</script>

<div class="page">
    <a href="/activities" class="back">← Tutte le attività</a>

    <div class="hero">
        {#if image}
            <img src={image} alt={name} />
        {:else}
            <div class="hero-placeholder"></div>
        {/if}
        <div class="hero-overlay">
            {#if activityType && activityType !== 'individual'}
                <span class="badge">A squadre</span>
            {/if}
            <h1>{name}</h1>
            {#if description}
                <p class="description">{description}</p>
            {/if}
        </div>
    </div>

    <div class="content">
        <div class="details">
            {@html details}
        </div>
        <div class="cta">
            <SimpleButton accent="var(--red)" href="/cogestione/registration">
                Iscriviti
            </SimpleButton>
        </div>
    </div>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--white);
        text-decoration: none;
        font-size: max(14px, 10px + 0.35vw);
        opacity: 0.7;
        transition: opacity 0.15s;
        width: fit-content;
    }

    .back:hover {
        opacity: 1;
    }

    .hero {
        position: relative;
        height: clamp(260px, 45vh, 500px);
        overflow: hidden;
        border-radius: 15px;
        background-color: var(--grey);
    }

    .hero img,
    .hero-placeholder {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
    }

    .hero-placeholder {
        background-color: var(--grey);
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 32px 40px;
        gap: 10px;
    }

    .badge {
        display: inline-block;
        background-color: var(--red);
        color: var(--white);
        font-size: max(11px, 8px + 0.25vw);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 4px 10px;
        border-radius: 20px;
        width: fit-content;
    }

    h1 {
        font-size: clamp(28px, 4vw, 52px);
        color: var(--white);
        line-height: 1.1;
    }

    .description {
        font-size: max(14px, 11px + 0.3vw);
        font-weight: normal;
        opacity: 0.8;
        line-height: 1.4;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .details {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .details :global(.detail-container) {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .details :global(.detail-container h2) {
        font-size: max(11px, 8px + 0.25vw);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--red);
        filter: brightness(1.4);
        font-weight: 700;
        margin-bottom: 2px;
    }

    .details :global(.detail-container p),
    .details :global(.detail-container ul) {
        background-color: var(--grey);
        border-radius: 12px;
        padding: 20px 24px;
    }

    .details :global(.description) {
        font-weight: normal;
        line-height: 1.7;
        font-size: max(16px, 13px + 0.5vw);
    }

    .details :global(.days) {
        list-style: none;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: max(15px, 10px + 0.4vw);
        font-weight: normal;
    }

    .details :global(.days > li) {
        font-weight: 600;
    }

    .details :global(.days > li > ul) {
        list-style: none;
        padding-left: 0;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .details :global(.days > li > ul > li) {
        font-weight: normal;
        padding: 6px 12px;
        background-color: rgba(255,255,255,0.05);
        border-radius: 6px;
        border-left: 3px solid var(--red);
    }

    .cta {
        display: flex;
        justify-content: flex-end;
    }

    @media (max-width: 600px) {
        .hero-overlay {
            padding: 20px;
        }
    }
</style>
