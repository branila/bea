<script lang="ts">
    import QrScanner from 'qr-scanner'
    import { onMount } from 'svelte'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'
    import type { Ticket, User, Registration } from '$types/db'

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
        const regexp = /^[A-Z1-9]{3}$/

        return regexp.test(ticketId)
    }

    let scanResponse: {
      success: boolean,
      error?: string,
      ticket?: Ticket,
      user?: User,
      registration?: Registration
    } | undefined = $state()

    async function handleScan(ticketId: string) {
        // Stops the scanner from scassare il cazzo
        scanner.stop()

        ticketId = ticketId.toUpperCase()

        // Ticket validation
        if (!isTicketValid(ticketId)) {
            alert(`Il codice ${ticketId} non è valido. Se pensi che questo sia un errore contatta Branila.`)

            await scanner.start()

            return
        }

        popup.show = true

        try {
            const data = await fetch('/api/mark', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            })

            scanResponse = await data.json()
        } catch (error) {
            alert(`Errore durante la ricerca del ticket. Se il problema persiste vai a cercare Branila. ${error}`)

            closePopup()
        }

        if (scanResponse?.success) {
            popup.color = 'var(--green)'
            return
        }

        if (scanResponse?.error) {
            popup.color = 'var(--red)'
            return
        }

        if (scanResponse?.ticket?.authenticator) {
            popup.color = 'var(--blue)'
            return
        }
    }

    let presenceResponse: {
      success: boolean,
      error?: string
    } | undefined = $state()

    async function markPresence() {
        try {
            const data = await fetch('/api/fetch-infos', {
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

    onMount(() => {
        scanner = new QrScanner(
            videoElement as HTMLVideoElement,
            (result) => handleScan(result.data), {}
        )

        scanner.start()
    })
</script>

<div class="container">
    {#if popup.show}
        <div class="popup"
            style:background-color={popup.color}
        >
            {#if scanResponse == undefined}
                <div>Caricamento...</div>
            {:else if !scanResponse.success}
                <div>{scanResponse.error}</div>
            {:else}
                <div class="heading">
                    {#if scanResponse.ticket!.authenticator}
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

                        {#if scanResponse.registration!.expand!.firstActivity!.turns == 1}
                            {scanResponse.registration!.expand!.firstActivity!.name}
                        {:else}
                            {scanResponse.registration!.expand!.firstActivity!.name},
                            {scanResponse.registration!.expand!.secondActivity!.name} e
                            {scanResponse.registration!.expand!.thirdActivity!.name}
                        {/if}
                    </div>

                    {#if scanResponse.ticket?.authenticator}
                        <div class="info">
                            <span class="name">Scannerizzato da:</span> <br>
                            {scanResponse.ticket.expand!.authenticator!.name}
                        </div>
                    {/if}
                </div>

                <div class=".popup-btn">
                    {#if !scanResponse.ticket?.authenticator}
                        <SimpleButton onclick={markPresence}>Segna presente</SimpleButton>
                    {/if}
                </div>
            {/if}

        </div>
    {/if}

    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoElement}></video>

    <div class="bottom">
        <input type="text" placeholder="Codice Ticket" maxlength="3" required>
        <SimpleButton onclick={handleSubmit}>Invia</SimpleButton>
    </div>
</div>

<style>
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
        font-weight: normal;
        font-size: 20px;
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
