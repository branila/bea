<script lang="ts">
  import type { PageData } from '../../../../routes/cogestione/registration/$types'
  import SimpleButton from '$components/reusables/SimpleButton.svelte'
    import OutlinedButton from '$components/reusables/OutlinedButton.svelte';
    import { goto } from '$app/navigation';

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

  let showPopup = $state(false)
  let passphrase = $state('')

  function openPopup() {
    showPopup = true
    passphrase = ''
  }

  function closePopup() {
    showPopup = false;
    passphrase = ''
  }

  function handleBackdropClick(event: MouseEvent) {
    // Chiude il popup solo se si clicca sullo sfondo, non sul contenuto
    if (event.target === event.currentTarget) {
      closePopup()
    }
  }

  async function handleSubmit() {
    closePopup()

    const response = await fetch('/api/delete-registration')
      .then(res => res.json())

      if (!response.ok) {
        alert('Errore durante l\'eliminazione della registrazione. Riprova più tardi.')
        return
      }

      window.location.href = "/cogestione/registration"
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
        {#each eventDays as eventDay, index}
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

                        {#if index == 0}
                            <div class="time">12:30 - 13:00</div>
                        {:else}
                            <div class="time">11:30 - 12:00</div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <div class="btn-container">
        <OutlinedButton onclick={openPopup}>Elimina</OutlinedButton>
        <SimpleButton href="/cogestione/ticket">Visualizza Ticket</SimpleButton>
    </div>
</div>

{#if showPopup}
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="popup-backdrop" onclick={handleBackdropClick}>
    <div class="popup-content">
      <h2 class="popup-title">Elimina registrazione</h2>

      <p class="popup-description">
          Sicuro di voler eliminare la tua registrazione? Scrivi "trecento lettere letteratura fine" per confermare.
      </p>

      <div class="input-section">
        <input
          type="text"
          bind:value={passphrase}
          placeholder="Passphrase"
          class="popup-input"
        />

        {#if passphrase.toLowerCase() == 'trecento lettere letteratura fine'}
        <button class="submit-button" onclick={handleSubmit}>
          Invia
        </button>
        {/if}
      </div>

      <!-- Bottone chiudi -->
      <button class="close-button" onclick={closePopup}>
        ✕
      </button>
    </div>
  </div>
{/if}

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
        gap: 20px;
    }

    @media (max-width: 600px) {
        .container {
            min-height: calc(100svh - 140px);
            padding-top: 15px;
            gap: 20px;
        }

        .btn-container {
            flex-direction: column-reverse;
            align-items: end;
        }
    }

      .popup-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .popup-content {
        background: var(--grey);
        border-radius: 8px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .popup-title {
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: var(--red);
        filter: brightness(1.2);
      }

      .popup-description {
        margin: 0 0 20px 0;
        color: var(--white);
        line-height: 1.5;
      }

      .input-section {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .popup-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .popup-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      .submit-button {
        background-color: var(--red);
        filter: brightness(1.1);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .submit-button:hover {
        filter: brightness(1);
      }

      .close-button {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #999;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }

      .close-button:hover {
        background-color: #f0f0f0;
        color: #333;
      }
</style>
