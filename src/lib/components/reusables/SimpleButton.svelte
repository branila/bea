<script lang="ts">
  import { type Snippet } from 'svelte'

  let {
    href = '#',
    accent = 'var(--red)',
    children,
    onclick = () => {},
    type = 'button',
    disabled = false,
    title = '',
    action,
  }: {
    href?: string
    accent?: string
    onclick?: (() => void)
    children: Snippet<[]>
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean,
    title?: string
    action?: string
  } = $props()

  let hovered = $state(false)
</script>

<a {href}>
    <button
        {type} {onclick} {title}
        class:disabled
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        style:color={hovered ? accent : 'var(--black)'}
    >
        <span>{@render children()}</span>
        <img src="/images/cogestione/arrow-right.png" alt="Vai">
    </button>
</a>

<style>
    button {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--white);
        padding: max(10px, 5px + 0.5vw);
        padding-top: max(12px, 7px + 0.5vw); /* For vertical alignment */
        border-radius: 15px;
        font-size: max(16px, 10px + 0.5vw);
        cursor: pointer;
        border: 0;
    }

    .disabled {
        cursor: not-allowed;
        background-color: var(--grey);
    }

    .disabled span {
        color: var(--white);
    }

    .disabled img {
        filter: invert();
    }

    button:hover {
        filter: brightness(1.4);
    }

    img {
        height: 20px;
    }

    button:not(.disabled):hover > img {
        /* Changes the color of the icon to red */
        filter: brightness(0) saturate(100%) invert(17%) sepia(32%) saturate(6275%) hue-rotate(349deg) brightness(100%) contrast(90%);
    }
</style>
