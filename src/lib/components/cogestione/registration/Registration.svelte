<script lang="ts">
    import type { Registration } from '$types/db'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'

    const { registration }: {
        registration: Registration | undefined
    } = $props()

    const activities = [
        registration!.expand!.firstActivity!.name,
        registration!.expand!.secondActivity!.name,
        registration!.expand!.thirdActivity!.name,
    ]
</script>

<div class="container">

    <div class="heading">
        <h1>La tua iscrizione</h1>

        <div class="problems">
            Ci sono problemi con la tua iscrizione? <a href="/contacts">Contattaci</a> e facciamo una magia.
        </div>
    </div>

    <div class="table">
        <div class="row">
            <div class="name">Appello</div>
            <div class="time">8:00 - 8:30</div>
        </div>

        {#each activities as activity, i}
            <div class="row">
                <div class="name">{activity}</div>
                <div class="time">{8 + i}:30 - {8 + i + 1}:30</div>
            </div>
        {/each}

        <div class="row">
            <div class="name">Contrappello</div>
            <div class="time">11:30 - 12:00</div>
        </div>
    </div>

    <div class="btn-container">
        <SimpleButton href="/cogestione/ticket">Visualizza Ticket</SimpleButton>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding-top: 30px;
        min-height: calc(100svh - 200px);
    }

    .heading {
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h1 {
        font-size: max(30px, 12px + 2vw);
        color: var(--red);
        filter: brightness(1.4);
        width: min(600px, 100%);
    }

    .problems {
        font-size: max(18px, 10px + 0.75vw);
        font-weight: normal;
        line-height: 1.2;
    }

    .problems a {
        color: var(--red);
        filter: brightness(1.4);
        text-decoration: underline;
        font-weight: bold;
    }

    .table {
        display: flex;
        flex-direction: column;
    }

    .row {
        min-height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding-inline: max(10px, 5px + 1.5vw);
        font-size: max(14px, 10px + 0.5vw);
        border-radius: 15px;
    }

    .row:nth-child(odd) {
        background-color: var(--grey);
    }

    .btn-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
            gap: 20px;
        }
    }
</style>
