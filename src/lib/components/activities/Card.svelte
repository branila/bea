<script lang="ts">
  const { name, description, href, image }: {
    name: string,
    description: string,
    href: string,
    image?: string | null
  } = $props()
</script>

<a {href} class="card">
    {#if image}
        <img src={image} alt={name} />
    {:else}
        <div class="placeholder"></div>
    {/if}
    <div class="overlay">
        <h2>{name}</h2>
        <p>{description}</p>
    </div>
</a>

<style>
    .card {
        position: relative;
        display: block;
        border-radius: 15px;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        background-color: var(--grey);
        text-decoration: none;
        color: var(--white);
    }

    img, .placeholder {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        transition: transform 0.4s ease;
    }

    .placeholder {
        background: linear-gradient(135deg, var(--grey) 0%, #2a2a2a 100%);
    }

    .card:hover img {
        transform: scale(1.05);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 18px 20px;
        gap: 6px;
    }

    h2 {
        font-size: max(15px, 11px + 0.5vw);
        line-height: 1.15;
    }

    p {
        font-size: max(12px, 9px + 0.3vw);
        font-weight: normal;
        opacity: 0.85;
        line-height: 1.4;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.3s ease, opacity 0.25s ease;
    }

    .card:hover p {
        max-height: 4em;
        opacity: 0.85;
    }
</style>
