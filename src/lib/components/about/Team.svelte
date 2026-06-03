<script lang="ts">
    import typewriter from '$lib/utils/typewriter'

    const members = [
        { name: 'Stefan Branila', role: 'Fondatore & Lead Developer', github: 'branila' },
        { name: 'Davide Vanoncini', role: 'DevOps & Infrastructure', github: 'Vano2903' },
        { name: 'Alex Locatelli Giannino', role: 'Developer', github: 'Alex-Loca' },
    ] as const

    let visible = $state(false)

    function onVisible(node: HTMLElement) {
        const io = new IntersectionObserver(([{ isIntersecting }]) => {
            if (isIntersecting) { visible = true; io.disconnect() }
        }, { threshold: 0.2 })
        io.observe(node)
        return { destroy: () => io.disconnect() }
    }
</script>

<div class="section" use:onVisible>
    {#key visible}
        <h2 in:typewriter={{ speed: 40 }}>Il team</h2>
    {/key}

    <div class="cards">
        {#each members as member, i}
            <div class="card" class:visible style="--delay: {i * 130}ms">
                <div class="ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <div class="info">
                    <div class="role">{member.role}</div>
                    <div class="name">{member.name}</div>
                    <a class="gh" href="https://github.com/{member.github}" target="_blank" rel="noopener noreferrer">
                        github.com/{member.github}
                    </a>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h2 {
        font-size: max(20px, 24px + 1.5vw);
    }

    .cards {
        display: flex;
        gap: 20px;
    }

    .card {
        position: relative;
        overflow: hidden;
        flex: 1;
        background-color: var(--grey);
        border-radius: 15px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        min-height: 200px;
        opacity: 0;
    }

    .card.visible {
        animation: rise 500ms ease-out var(--delay, 0ms) both;
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .ghost {
        position: absolute;
        top: -20px;
        right: 5px;
        font-size: max(110px, 120px + 3vw);
        line-height: 1;
        opacity: 0.05;
        pointer-events: none;
        user-select: none;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: relative;
    }

    .role {
        font-size: max(10px, 10px + 0.3vw);
        color: var(--red);
        filter: brightness(1.4);
        font-weight: normal;
    }

    .name {
        font-size: max(18px, 18px + 1vw);
        line-height: 1.1;
    }

    .gh {
        font-size: max(10px, 10px + 0.25vw);
        font-weight: normal;
        opacity: 0.4;
        margin-top: 4px;
        transition: opacity 0.15s;
    }

    .gh:hover {
        opacity: 1;
        text-decoration: underline;
    }

    @media (max-width: 900px) {
        h2 {
            text-align: center;
        }

        .cards {
            flex-direction: column;
        }

        .card {
            min-height: 160px;
        }
    }

    @media (max-width: 600px) {
        .section {
            margin-top: 20px;
        }

        .cards {
            gap: 15px;
        }

        .card {
            padding: 20px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .card {
            opacity: 1;
            animation: none;
        }
    }
</style>
