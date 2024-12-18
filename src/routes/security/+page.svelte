<script lang="ts">
    import QrScanner from 'qr-scanner'
    import { onMount } from 'svelte'
    import SimpleButton from '$components/reusables/SimpleButton.svelte'
    import type { Ticket, User, Registration } from '$types/db'

    const { data } = $props()

    let videoElement: HTMLVideoElement | undefined = $state(undefined)

    let scanner: QrScanner

    let showPopup = $state(false)

    let popupColor = $state('var(--green)')

    function handleSubmit() {
        const ticketId = document.querySelector('input')!.value

        handleScan(ticketId)
    }

    let response: {
      ticket: Ticket
      user: User,
      registration: Registration
    } | undefined | null = $state(undefined)

    async function handleScan(ticketId: string) {
        // Stops the scanner from scassare il cazzo
        scanner.stop()

        ticketId = ticketId.toUpperCase()

        // Ticket validation
        const regexp = /^[A-Z1-9]{3}$/
        if (!regexp.test(ticketId)) {
            alert("Codice QR non valido.")
            return
        }

        showPopup = true

        try {
            const data = await fetch('/api/get-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            })

            response = await data.json()
        } catch (error) {
            popupColor = 'var(--red)'
            alert(`Errore durante la richiesta. Vai a cercare Branila. ${error}`)
            return
        }

        if (!response) {
          popupColor = 'var(--red)'
        }

        if (response?.ticket.authenticator) {
          popupColor = 'var(--red)'
        }
    }

    function markPresence() {
        fetch('/api/mark-presence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId: response!.ticket.id })
        })

        response = undefined

        showPopup = false

        scanner.start()
    }

    function closePopup() {
        response = undefined
        showPopup = false
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
    {#if showPopup}
        <div class="popup"
            style:background-color={popupColor}
        >
            {#if response == undefined}
                <div>Caricamento...</div>
            {:else if response.ticket == null}
                <div>Sembra che l'utente non esista.</div>
            {:else}
                <div class="heading">
                    {#if response.ticket.authenticator}
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

                        {response.user.surname} {response.user.name}
                    </div>

                    <div class="info">
                        <span class="name">Classe:</span>

                        {response.user.class}
                    </div>

                    <div class="info">
                        <span class="name">Ruolo:</span> <br>
                        {response.user.roles.join(', ')}
                    </div>

                    <div class="info">
                        <span class="name">Attività:</span> <br>

                        {#if response.registration.expand!.firstActivity!.turns == 1}
                            {response.registration.expand!.firstActivity!.name}
                        {:else}
                            {response.registration.expand!.firstActivity!.name},
                            {response.registration.expand!.secondActivity!.name} e
                            {response.registration.expand!.thirdActivity!.name}
                        {/if}
                    </div>

                    {#if response.ticket.authenticator}
                        <div class="info">
                            <span class="name">Scannerizzato da:</span> <br>
                            {response.ticket.expand!.authenticator!.name}
                        </div>
                    {/if}
                </div>

                <div class=".popup-btn">
                    {#if !response.ticket.authenticator}
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
