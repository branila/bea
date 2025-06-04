<script lang="ts">
  import SimpleButton from '$components/reusables/SimpleButton.svelte'

  const { name, description, href, image }: {
        name: string,
        description: string,
        href: string,
        image?: string | null
    } = $props()
</script>

<div class="card">
    <a {href} class="image">
        <img src={image} alt={name} />
    </a>
    <div class="content">
        <h1>{name}</h1>
        <p>{description}</p>
    </div>
    <div class="button-container">
      <SimpleButton {href} accent="var(--red)">Visualizza</SimpleButton>
    </div>
    
</div>

<style>
    .card {
        padding: 20px;
        border-radius: 15px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% / 4 - 15px);
        background-color: var(--grey);
    }

    h1 {
        font-size: max(30px, 18px + 1.25vw);
        margin-bottom: max(15px, 10px + 0.25vh);
    }

    p {
        font-size: max(16px, 10px + 0.75vw);
        font-weight: normal;
    }

    .content {
        margin-bottom: auto;
    }

    @media (max-width: 900px) {
        .card {
            width: 100%;
        }
    }

    .button-container {
        margin-left: auto;
    }

    img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        object-fit: cover;
        object-position: center center;
    }
</style>
