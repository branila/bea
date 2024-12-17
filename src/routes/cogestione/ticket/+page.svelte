<script lang="ts">
    import QRCode from 'qrcode'
    import { onMount } from 'svelte'

    const { data } = $props()
    const { user, ticket } = data

    let innerWidth: number = $state(0)
    let qrcodeCanvas: HTMLCanvasElement | undefined = $state(undefined)

    let show = $state(false)

    function setQR(innerWidth: number) {
        QRCode.toCanvas(qrcodeCanvas, ticket!.id, {
            width: Math.min(innerWidth - 180, 250),
            margin: 1,
            color: {
                dark: '#000',
                light: '#fff'
            }
        }, (error: Error | undefined | null) => {
            if (error) {
                console.error('Errore nella generazione del QR Code:', error)
            }
        })

        show = true
    }

    $effect(() => {
        setQR(innerWidth)
    })
</script>

<svelte:window
    bind:innerWidth
></svelte:window>

<div class="container">
    {#if show}
        <div class="ticket">
            <div class="header">
                <h1>Cogestione Invernale 2024</h1>
                <h3>Without cogestione there is no Esperia</h3>
            </div>

            <div class="body">
                <h2>Ce l'hai fatta!</h2>

                <div class="box top-box">
                    <div class="info">
                        <h3>Data:</h3>
                        <p>21 Dicembre 2024</p>
                    </div>

                    <div class="info">
                        <h3>Orario:</h3>
                        <p>08:00 - 12:00</p>
                    </div>

                    <div class="info">
                        <h3>Studente:</h3>
                        <p>{`${user.surname} ${user.name}`}</p>
                    </div>

                    <div class="info">
                        <h3>Ruolo:</h3>
                        <p>{user.roles.join(', ')}</p>
                    </div>
                </div>

                <div class="box qr-box">
                    <h2>Il tuo qrcode personale</h2>

                <canvas bind:this={qrcodeCanvas}></canvas>

                <h2>{ticket.id}</h2>
            </div>

                <div class="warning">
                    <h2>⚠️ Importante:</h2>
                    <p>Questo QR Code è strettamente personale e diventa invalido dopo la scansione. Per evitare problemi, non condividetelo con altri. Fate i bravi.</p>
                </div>
            </div>


        <div class="footer">
            Per assistenza: bea@branila.it • Telegram: @branilaa
        </div>
    {:else}
        <h1 class="loading">Caricamento...</h1>
    {/if}
</div>

<style>
  .container {
    min-height: calc(100svh - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: calc(20px + 1vw);
  }

  h2 {
    font-size: calc(15px + 1vw);
  }

  h3 {
    font-size: calc(10px + 1vw);
  }

  p {
    font-size: calc(10px + 0.75vw);
  }

  .ticket {
    width: min(500px, 100%);
    border-radius: 15px;
  }

  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    justify-content: center;
    background-color: var(--red);
    padding: calc(10px + 1vw);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .header h3 {
    font-weight: normal;
  }

  .body {
    border: 3px solid var(--grey);
    padding: calc(10px + 1vw);
  }

  .box {
    background-color: var(--grey);
    border-radius: 15px;
    padding: calc(10px + 1vw);
    margin-block: calc(10px + 1vw);
  }

  .top-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: calc(15px + 1.5vw);
  }

  .box p {
    font-weight: normal;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(10px + 1vw);
    margin-bottom: 40px;
  }

  .ticket-id {
    padding-inline: 20px;
    padding-block: 15px;
    border-radius: 15px;
    background-color: #333333;
  }

  .warning {
    background-color: #fff3cd;
    border-left: 4px solid var(--yellow);
    padding: 15px;
    margin-block: 20px;
    color: var(--black);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .warning p {
    font-weight: normal;
  }

  .footer {
    background-color: var(--red);
    color: white;
    padding: 10px;
    text-align: center;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .loading {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .container {
      min-height: calc(100svh - 140px);
      justify-content: flex-start;
    }

    .top-box {
      grid-template-columns: 1fr;
    }

    .ticket {
        width: min(500px, 100%);
    }
  }
</style>
