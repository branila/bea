<script>
  import { enhance } from '$app/forms'
</script>

<svelte:head>
    <meta name="description" content="Better Esperia Access login page"/>
    <title>Bea - Login 🔑</title>
</svelte:head>

<div class="container">
  <div class="inner-container">
    <div class="heading">
      <h1>Login</h1>

      <h3>Accedi con il tuo account istituzionale</h3>
    </div>

    <form method="POST" action="?/google" use:enhance>
      <button type="submit">
        Accedi con Google
      </button>
  </div>
</div>

<style>
  .container {
    min-height: calc(100svh - 200px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  .inner-container {
    display: flex;
    flex-direction: column;
    gap: calc(40px + 4vw);
    background-color: var(--grey);
    padding: calc(40px + 4vw);
    border-radius: 15px;
  }

  .heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  h1 {
    font-size: max(24px, 32px + 2.5vw);
    color: var(--red);
    filter: brightness(1.4);
  }

  h3 {
    font-size: max(16px, 10px + 0.75vw);
    text-align: center;
    max-width: calc(500px);
    line-height: 1.2;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  button {
    padding-block: calc(10px + 1vw);
    padding-top: calc(12px + 1vw); /* Vertically center the text */
    padding-inline: calc(20px + 2vw);
    font-size: max(16px, 10px + 0.75vw);
    cursor: pointer;
    background-color: var(--white);
    border: 3px solid black;
    transition: 0.2s;
    border-radius: 15px;
  }

  button:hover {
    border: 3px solid var(--red);
    color: var(--red);
  }

  @media (max-width: 600px) {
    .container {
      min-height: calc(100svh - 140px);
    }
  }
</style>
