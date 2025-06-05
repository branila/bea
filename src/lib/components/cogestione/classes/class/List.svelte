<script lang="ts">
  import type { PageData } from '../../../../../routes/cogestione/registration/$types'
  import SimpleButton from '$components/reusables/SimpleButton.svelte'

  const { userRegistrations, eventDays } : {
    userRegistrations: PageData['userRegistrations'],
    eventDays: PageData['eventDays']
  } = $props()

  $effect(() => {
    console.log(userRegistrations)
  })

  function formatTime(time: string): string {
    return time.slice(0, -3)
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
    })
  }

  function getRegistrationsForDay(day: string): typeof userRegistrations {
    return userRegistrations.filter(registration => {
      return registration.day === day
    })
  }
</script>

<div class="container">
    <div class="heading">
        <h1>La tua iscrizione</h1>

        <div class="problems">
            Ci sono problemi con la tua iscrizione? <a href="/contacts">Contattaci</a> e facciamo una magia.
        </div>
    </div>

    <div class="tables">
        {#each eventDays as eventDay}
            <div class="table">
                <div class="row event-day">
                    {formatDate(eventDay.date)}
                </div>

                {#if getRegistrationsForDay(eventDay.date)[0].activity != 'Assente'}
                    <div class="row">
                        <div class="name">Appello</div>
                        <div class="time">08:00 - 08:30</div>
                    </div>
                {/if}

                {#each getRegistrationsForDay(eventDay.date) as registration}
                    <div class="row">
                        <div class="name">{registration.activity}</div>
                        <div class="time">{formatTime(registration.start)} - {formatTime(registration.end)}</div>
                    </div>
                {/each}

                {#if getRegistrationsForDay(eventDay.date)[0].activity != 'Assente'}
                    <div class="row">
                        <div class="name">Contrappello</div>
                        <div class="time">11:30 - 12:00</div>
                    </div>
                {/if}
            </div>
        {/each}
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

    .tables {
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

    .table {
        display: flex;
        flex-direction: column;
    }

    .event-day {
        font-size: max(20px, 16px + 0.4vw) !important;
        justify-content: center !important;
    }

    .row {
        min-height: 50px;
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
