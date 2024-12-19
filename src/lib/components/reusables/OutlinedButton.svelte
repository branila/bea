<script lang="ts">
  import { type Snippet } from 'svelte'

  let {
    href = '#',
    accent = 'var(--red)',
    children,
    onclick = () => {}
  }: {
    href?: string
    accent?: string
    onclick?: (() => void)
    children: Snippet<[]>
  } = $props()

  let hovered = $state(false)
</script>

<a {href} data-sveltekit-reload>
    <button
        {onclick}
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        style="border-color: {hovered ? accent : 'var(--white)'}; color: {hovered ? accent : 'var(--white)'}"
    >
        {@render children()}
    </button>
</a>

<style>
    button {
        background-color: transparent;
        color: var(--white);
        border: 1px solid var(--white);
        border-radius: 15px;
        padding: 13px;
        padding-top: 14px; /* For vertical alignment */
        font-size: max(16px, 10px + 0.5vw);
        cursor: pointer;
    }

    button:hover {
        filter: brightness(2)
    }
</style>
