<script lang="ts">
    import SimpleButton from '$components/reusables/SimpleButton.svelte'

    let { title, description, href, buttonText }: {
        title: string,
        description: string,
        href: string,
        buttonText: string
    } = $props()
</script>

<div class="card">
    <h1>{title}</h1>

    <div class="description">
        {description}
    </div>

    <SimpleButton {href} accent="var(--red)">{buttonText}</SimpleButton>
</div>

<style>
    .card {
        background-color: var(--grey);
        border-radius: 15px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: space-between;
        align-items: flex-end;
    }

    h1 {
        font-size: max(30px, 18px + 1.25vw);
        width: 100%;
    }

    .description {
        font-size: max(18px, 10px + 1vw);
        font-weight: normal;
        width: 100%;
    }

    @media (max-width: 600px) {
        .card {
            padding: 15px;
            gap: 15px;
        }
    }
</style>
