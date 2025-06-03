<script lang="ts">
  import { onMount } from 'svelte'

  const { name } = $props()

  let greetings = [
    'Ci sei mancato',
    'È bello rivederti',
    'Ti stavamo aspettando',
    'Dove sei stato fin\'ora?',
    'Finalmente sei tornato',
    'Caparezza o Frankie Hi-NRG?',
    'È quel momento dell\'anno'
  ]

  let greeting = $state('.')

  onMount(() => {
    greeting = greetings[Math.floor(Math.random() * greetings.length)]
  })
</script>

<header>
    <h2>Ciao {name},</h2>
    <h1>{greeting}</h1>
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
    }

    h2 {
        margin-bottom: 20px;
        font-size: max(20px, 12px + 1.25vw);
    }

    h1 {
        color: var(--red);
        filter: brightness(1.4);
        font-size: max(30px, 18px + 1.5vw);
    }
</style>
