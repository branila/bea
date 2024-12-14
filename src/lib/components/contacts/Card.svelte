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

    <p>{description}</p>

    <a {href}>{contact}</a>
</div>

<style>
    .card {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 10px;
        padding: 30px;
        border-radius: 15px;
        min-height: calc(50svh - 140px);
        background-color: var(--grey);
        color: var(--white);
        width: 50%;
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

    p {
        font-size: max(12px, 16px + 1vw);
        font-weight: normal;
    }

    a {
        font-size: max(12px, 16px + 0.75vw);
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    a:hover {
        color: var(--yellow);
        text-decoration: underline;
    }

    @media (max-width: 1300px) {
        .card {
            min-height: calc(50svh - 60px);
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        .card {
            padding: 15px;
        }
    }
</style>
