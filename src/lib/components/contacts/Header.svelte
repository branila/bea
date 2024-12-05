<header>
    <h1>
        Contattaci
    </h1>

    <p>
        Hai domande, problemi o <span class="accent">dubbi esistenziali</span>
        di natura cosmica? Contattaci e <span class="accent">ti salviamo noi</span>.
        Il comitato è qui per fare <span class="accent">miracoli</span>.
    </p>
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(50vh - 100px);
        gap: 20px;
        background-color: var(--grey);
        border-radius: 15px;
        padding: 40px;
    }

    header h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--red);
        font-size: max(24px, 32px + 2.5vw);
        filter: brightness(1.2);
    }

    header p {
        line-height: 1.2;
        font-size: max(12px, 16px + 1vw);
        width: min(100%, 1000px);
        text-align: center;
    }

    .accent {
        color: var(--red);
        filter: brightness(1.2);
    }

    @media (max-width: 600px) {
        header {
            gap: 10px;
            padding: 20px;
        }
    }
</style>
