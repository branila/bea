
<script lang="ts">
    import QrScanner from 'qr-scanner'
    import { onMount } from 'svelte'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'
    import type { Ticket, User, Registration, Scan } from '$types'

    let videoElement: HTMLVideoElement | undefined = $state(undefined)
    let scanner: QrScanner

    let popup = $state({
        show: false,
        color: 'var(--green)'
    })

    function handleSubmit() {
        const ticketId = document.querySelector('input')!.value

        handleScan(ticketId)
    }

    function isTicketValid(ticketId: string) {
        const regexp = /^[A-Z1-9]{4}$/

        return regexp.test(ticketId)
    }

    let scanResponse: {
      success: boolean,
      error?: string,
      ticket?: Ticket,
      user?: User,
      registrations?: {
        activity: string,
        start: string,
        end: string,
        }[],
      scan?: {
          ticket: string;
          date: string;
          authenticator: {
              name: string;
              surname: string;
          },
          createdAt: string;
      },
    } | undefined = $state()

    async function handleScan(ticketId: string) {
        // Stops the scanner from scassare il cazzo
        scanner.pause()

        ticketId = ticketId.toUpperCase()

        // Ticket validation
        if (!isTicketValid(ticketId)) {
            alert(`Il codice ${ticketId} non è valido. Se pensi che questo sia un errore contatta Branila.`)

            await scanner.start()

            return
        }

        try {
            const data = await fetch('/api/fetch-infos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            })

            scanResponse = await data.json()
        } catch (error) {
            alert(`Errore durante la ricerca del ticket. Se il problema persiste vai a cercare Branila. ${error}`)

            closePopup()
        }

        if (!scanResponse) {
            alert(`Errore durante la ricerca del ticket. Se il problema persiste vai a cercare Branila.`)

            closePopup()
        }

        if (scanResponse?.scan) {
            popup.color = 'var(--blue)'
            popup.show = true

            return
        }

        if (scanResponse?.success) {
            popup.color = 'var(--green)'
            popup.show = true

            return
        }

        popup.show = true
        popup.color = 'var(--red)'

        return
    }

    let presenceResponse: {
      success: boolean,
      error?: string
    } | undefined = $state()

    async function markPresence() {
        try {
            const data = await fetch('/api/mark-presence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId: scanResponse?.ticket!.id })
            })

            presenceResponse = await data.json()
        } catch (error) {
            alert(`Errore durante l'impostazione della presenza. Se il problema persiste vai a cercare Branila. ${error}`)
        }

        if (!presenceResponse?.success) {
            alert(`Errore durante l'impostazione della presenza. Se il problema persiste vai a cercare Branila. ${presenceResponse!.error}`)
        }

        closePopup()
    }

    function closePopup() {
        popup.show = false
        scanResponse = undefined
        presenceResponse = undefined
        scanner.start()
    }

    function formatTime(time: string) {
      return time.slice(0, -3)
    }

    onMount(() => {
        scanner = new QrScanner(
            videoElement as HTMLVideoElement,
            (result) => handleScan(result.data), {}
        )

        scanner.start()

        return () => {
            scanner.stop()
        }
    })
</script>

<div class="container">
    {#if popup.show}
        <div class="popup"
            style:background-color={popup.color}
        >
            {#if scanResponse == undefined}
                <div class="heading">
                    <h1>Caricamento...</h1>

                    <button class="close" onclick={closePopup}>
                        <img src="/images/navbar/close.svg" alt="Close">
                    </button>
                </div>

            {:else if !scanResponse.success}
                <div class="error">
                    <div class="heading">
                        <h1>Ops!</h1>

                        <button class="close" onclick={closePopup}>
                            <img src="/images/navbar/close.svg" alt="Close">
                        </button>

                    </div>

                    <div class="error-message">
                        {scanResponse.error}
                    </div>
                </div>
            {:else}
                <div class="heading">
                    {#if scanResponse.scan}
                        <h1>
                            Ticket già scannerizzato!
                        </h1>
                    {:else}
                        <h1>Nuovo utente</h1>
                    {/if}

                    <button class="close" onclick={closePopup}>
                        <img src="/images/navbar/close.svg" alt="Close">
                    </button>
                </div>

                <div class="infos">
                    <div class="info">
                        <span class="name">Cognome e nome:</span> <br>

                        {scanResponse.user!.surname} {scanResponse.user!.name}
                    </div>

                    <div class="info">
                        <span class="name">Classe:</span>

                        {scanResponse.user!.class}
                    </div>

                    <div class="info">
                        <span class="name">Ruolo:</span> <br>
                        {scanResponse.user!.roles.join(', ')}
                    </div>

                    <div class="info">
                        <span class="name">Attività:</span> <br>

                        {#if scanResponse.registrations?.length !== 0}
                            {#each scanResponse.registrations! as registration, index}
                                {registration.activity}
                                ({formatTime(registration.start)} - {formatTime(registration.end)}){#if index !== scanResponse.registrations!.length - 1},&nbsp;{/if}
                            {/each}
                        {:else}
                            Il bro non si è registrato
                        {/if}
                    </div>

                    {#if scanResponse.scan}
                        <div class="info">
                            <span class="name">Scannerizzato da:</span> <br>
                            {scanResponse.scan.authenticator!.surname} {scanResponse.scan.authenticator!.name}
                        </div>

                        <div class="info">
                            <span class="name">Alle ore:</span> <br>
                            {new Date(scanResponse.scan.createdAt).toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    {/if}
                </div>

                <div class=".popup-btn">
                    {#if !scanResponse.scan?.authenticator}
                        <SimpleButton onclick={markPresence}>Segna presente</SimpleButton>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}

    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoElement}></video>

    <div class="bottom">
        <input type="text" placeholder="Codice Ticket" maxlength="4" required>
        <SimpleButton onclick={handleSubmit}>Invia</SimpleButton>
    </div>
</div>

<style>
    .error {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .container {
        height: calc(100svh - 200px);
        width: 100%;
    }

    video {
        height: calc(100% - 60px);
        object-fit: cover;
        width: 100%;
        margin-bottom: 15px;
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    .popup {
        z-index: 5000;
        position: absolute;
        padding: 30px;
        width: calc(100vw - 40px);
        min-height: calc(60svh);
        bottom: 20px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
    }

    .heading {
        display: flex;
        justify-content: space-between;
        align-items: start;
    }

    .heading h1 {
        font-size: 24px;
        font-weight: bold;
    }

    .heading .close img {
        width: 30px;
        height: 30px;
    }

    .close {
        background: none;
        border: none;
        filter: invert(1);
    }

    .infos {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .info {
        width: 100%;
        max-width: 100%;
        font-weight: normal;
        font-size: 20px;
        text-wrap: break-all;
        box-sizing: border-box;
    }

    .name {
        font-weight: bold;
    }

    input {
        width: 100%;
        height: 100%;
        padding: max(10px, 5px + 0.5vw);
        font-size: max(16px, 10px + 0.5vw);
        border-radius: 15px;
        border: 0;
    }


    @media (max-width: 600px) {
        .container {
            height: calc(100svh - 140px);
        }
    }
</style>
