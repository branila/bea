<script lang="ts">
  import SimpleButton from '$components/reusables/SimpleButton.svelte'

  const { name, description, image }: {
        name: string,
        description: string,
        image?: string | null
    } = $props()
</script>

<div class="card">
    <img src={image} alt={name} />
    <div class="content">
        <h1>{name}</h1>
        <p>{description}</p>
    </div>
    <div class="button-container">
      <SimpleButton accent="var(--red)" href={"/cogestione/registration"}>Iscriviti</SimpleButton>
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
        width: 100%;
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

    img {
        width: 35%;
        height: auto;
        border-radius: 10px;
        object-fit: cover;
        object-position: center center;
    }

    @media (max-width: 900px) {
        .card {
            flex-direction: column;
        }

        img {
            width: 100%;
        }
    }

    .button-container {
        margin-left: auto;
    }

    
</style>