<header>
    <h1>
        Attività
    </h1>

    <p>
        Non hai idea di cosa fare questa <span class="accent">cogestione</span>? 
        Dai un'occhiata alle <span class="accent">attività </span>
        che sono state preparate per questa edizione!<br>

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
        filter: brightness(1.4);
    }

    header p {
        line-height: 1.2;
        font-size: max(12px, 16px + 1vw);
        width: min(100%, 1000px);
        text-align: center;
    }

    .accent {
        color: var(--red);
        filter: brightness(1.4);
    }

    @media (max-width: 600px) {
        header {
            gap: 10px;
            padding: 20px;
        }
    }
</style>