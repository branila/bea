<script lang="ts">
  import OutlinedButton from '$components/reusables/OutlinedButton.svelte'

  let {
    title,
    description,
    color,
    buttonText,
    href,
  }: {
    title: string,
    description: string,
    color: string
    buttonText: string,
    href: string,
  } = $props()
</script>

<div  class="card" style:background-color={color}>
    <h1>{title}</h1>

    <p>{description}</p>

    <OutlinedButton accent="var(--white)" {href}>
        {buttonText}
    </OutlinedButton>
</div>

<style>
    .card {
        padding: 20px;
        border-radius: 15px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% / 3 - 20px);
    }

    h1 {
        font-size: max(24px, 16px + 1.5vw);
    }

    p {
        font-size: max(16px, 10px + 0.75vw);
        font-weight: normal;
    }

    @media (max-width: 900px) {
        .card {
            width: 100%;
        }
    }
</style>
