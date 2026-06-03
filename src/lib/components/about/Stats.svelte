<script lang="ts">
    import { Tween } from 'svelte/motion'
    import { cubicOut } from 'svelte/easing'

    const stats = [
        { tween: new Tween(0, { duration: 1400, easing: cubicOut }), target: 1600, suffix: '+', label: 'Utenti' },
        { tween: new Tween(0, { duration: 1400, easing: cubicOut }), target: 2200, suffix: '+', label: 'Iscrizioni' },
        { tween: new Tween(0, { duration: 900,  easing: cubicOut }), target: 3,    suffix: '',  label: 'Edizioni'  },
    ]

    // Svelte action: called automatically by "use:animate" with the bound DOM node.
    function animate(node: HTMLElement) {
        const io = new IntersectionObserver(([{ isIntersecting }]) => {
            // Fire once the element is at least 40% visible in the viewport.
            if (isIntersecting) {
                stats.forEach(s => s.tween.set(s.target)) // Start all count-up animations
                io.disconnect() // Observe only once
            }
        }, { threshold: 0.4 })

        io.observe(node) // Start watching the element

        return { destroy: () => io.disconnect() } // Cleanup if the component unmounts
    }
</script>

<div class="stats" use:animate>
    {#each stats as stat, i}
        {#if i > 0}<div class="divider"></div>{/if}
        <div class="stat">
            <div class="number">{Math.round(stat.tween.current)}{stat.suffix}</div>
            <div class="label">{stat.label}</div>
        </div>
    {/each}
</div>

<style>
    .stats {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: var(--grey);
        border-radius: 15px;
        padding: 40px;
        gap: 20px;
        height: 220px;
        box-sizing: border-box;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        flex: 1;
        text-align: center;
    }

    .number {
        font-size: max(40px, 56px + 2.5vw);
        color: var(--red);
        filter: brightness(1.4);
        line-height: 1;
        min-width: 3ch;
    }

    .label {
        font-size: max(12px, 14px + 0.5vw);
        font-weight: normal;
        opacity: 0.5;
    }

    .divider {
        width: 1px;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.15);
        flex-shrink: 0;
    }

    @media (max-width: 600px) {
        .stats {
            flex-direction: column;
            align-items: stretch;
            background-color: transparent;
            padding: 0;
            height: auto;
            gap: 12px;
        }

        .stat {
            background-color: var(--grey);
            border-radius: 15px;
            padding: 24px 40px;
        }

        .number {
            font-size: max(40px, 10vw);
        }

        .divider {
            display: none;
        }
    }
</style>
