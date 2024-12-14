<script lang="ts">
    import { onMount } from 'svelte'
    import QRCode from 'qrcode'

    let { data } = $props()
    let qrCodeCanvas: HTMLCanvasElement | null = null;

    onMount(() => {
        if (qrCodeCanvas) {
            QRCode.toCanvas(qrCodeCanvas, data.user.id, {
                width: 200,
                margin: 1,
                color: {
                    dark: '#000',
                    light: '#fff'
                }
            }, (error: Error | null | undefined) => {
                if (error) {
                  console.error('Errore nella generazione del QR Code:', error);
                }
            })
        }
    })
</script>

<div class="qr-container">
  <canvas bind:this={qrCodeCanvas}></canvas>
</div>

<style>
  .qr-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: calc(100svh - 200px)
  }

  canvas {
    width: 20px;
    height: 20px;
  }
</style>
