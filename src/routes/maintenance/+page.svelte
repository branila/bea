<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { goto } from '$app/navigation'

  const { data } = $props()
  const { opening } = data

  let timeLeft = $state({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  let interval: NodeJS.Timeout

  function calculateTimeLeft() {
    const now = new Date().getTime()
    const openingTime = new Date(opening).getTime()
    const difference = openingTime - now

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    } else {
      // Il countdown è finito, reindirizza alla pagina della cogestione
      clearInterval(interval)
      goto('/cogestione')
    }
  }

  onMount(() => {
    calculateTimeLeft()
    interval = setInterval(calculateTimeLeft, 1000)
  })

  onDestroy(() => {
    if (interval) {
      clearInterval(interval)
    }
  })
</script>

<svelte:head>
  <meta name="description" content="Better Esperia Access homepage" />
  <title>Bea - Home 🔥</title>
</svelte:head>

<main>
  <div class="header">
    <h1 class="center">Siamo in manutenzione</h1>
    <h2>
      Le iscrizioni aprono tra:
    </h2>

    <div class="countdown">
      <div class="time-unit">
        <span class="number">{timeLeft.days.toString().padStart(2, '0')}</span>
        <span class="label">giorni</span>
      </div>
      <div class="separator">:</div>
      <div class="time-unit">
        <span class="number">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span class="label">ore</span>
      </div>
      <div class="separator">:</div>
      <div class="time-unit">
        <span class="number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span class="label">minuti</span>
      </div>
      <div class="separator">:</div>
      <div class="time-unit">
        <span class="number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span class="label">secondi</span>
      </div>
    </div>

    <p class="inline">
        Seguite <a class="link" href="https://www.instagram.com/branilaa?igsh=bDI0bnhmbzFtaGM4">@branilaa</a> su instagram 🫶
    </p>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  h1 {
    color: var(--red);
    filter: brightness(1.4)
  }

  .inline {
    display: inline;
    font-size: max(16px, 10px + 0.6vw)
  }

  .header {
    display: flex;
    gap: 40px;
    min-height: calc(100svh - 200px);
    align-content: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    width: min(600px, 100%)
  }

  .link {
    text-decoration: underline;
  }

  .countdown {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .number {
    font-size: 3rem;
    font-weight: bold;
    color: var(--red, #ff4444);
    filter: brightness(1.2);
    line-height: 1;
    filter: brightness(1.2);
  }

  .label {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .separator {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--red, #ff4444);
    filter: brightness(1.2);
    margin: 0 5px;
  }

  @media (max-width: 600px) {
    .countdown {
      gap: 15px;
    }

    .number {
      font-size: 2.5rem;
    }

    .separator {
      font-size: 2rem;
    }

    .label {
      font-size: 0.8rem;
    }
  }
</style>
