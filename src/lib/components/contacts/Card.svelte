<script lang="ts">
  let {
    title,
    description,
    contact,
    href,
    src
  }: {
    title: string;
    description: string;
    contact: string;
    href: string;
    src: string;
  } = $props();
</script>

<div class="card">
    <div class="title">
        <img {src} alt="Card icon" />

        <h1>{title}</h1>
    </div>

    <div class="infos">
        <p>{description}</p>

        <a {href}>{contact}</a>
    </div>
</div>

<style>
    .card {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 40px;
        padding: 30px;
        border-radius: 15px;
        width: calc(100% / 4 - 20px);
        min-height: calc((100svh / 2) - 140px);
        width: 100%;
        background-color: var(--grey);
        color: var(--white);
    }

    .title {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    img {
        height: max(28px, 20px + 1vw);
        width: max(28px, 20px + 1vw);
        filter: invert();
    }

    h1 {
        font-size: max(24px, 16px + 1.5vw);
    }

    .infos {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30px;
    }


    p {
        font-size: max(12px, 16px + 0.75vw);
        font-weight: normal;
    }

    a {
        font-size: max(12px, 16px + 0.75vw);
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        flex-shrink: 1; /* magic fuckery because text wrap didn't work */
    }

    @media (max-width: 900px) {
        .card {
            width: 100%;
        }
    }
</style>
