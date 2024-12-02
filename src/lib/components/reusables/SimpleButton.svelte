<script lang="ts">
  import { type Snippet } from 'svelte'

  let {
    href= '#',
    children,
    onclick = () => {}
  }: {
    href?: string
    onclick?: (() => void)
    children: Snippet<[]>
  } = $props()
</script>

<a {href}>
    <button {onclick}>
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
        transition: 0.3s;
    }

    button:hover {
        border-color: var(--red);
        color: var(--red);
        filter: brightness(2)
    }

</style>
