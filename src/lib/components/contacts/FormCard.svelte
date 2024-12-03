<script lang="ts">
  import SimpleButton from "$components/reusables/SimpleButton.svelte";

  let {
    title,
    description,
    color,
    border,
    src,
    action
  }: {
    title: string;
    description: string;
    color: string;
    border: string;
    src: string;
    action: string;
  } = $props();
</script>

<div class="card" style:background-color={color} style:border-color={border}>
  <div class="title-row">
    <img {src} alt="" />
    <h1>{title}</h1>
  </div>

  <p>{description}</p>

  <form {action} method="post">
    <input type="text" name="report" id="report" required/>
    <SimpleButton accent="var(--red)">Invia</SimpleButton>
  </form>
</div>

<style>
  .card {
    padding: 20px;
    border-radius: 15px;
    border: 3px solid;
    display: flex;
    gap: 20px;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% / 4 - 20px);
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  img {
    height: max(24px, 16px + 1.5vw);  
    width: max(24px, 16px + 1.5vw);  
    object-fit: fill;    
    filter: invert(1);           
  }

  h1 {
    font-size: max(24px, 16px + 1.5vw);
  }

  p {
    font-size: max(16px, 10px + 0.75vw);
    font-weight: normal;
  }

  @media (max-width: 900px) {
    .card {
      width: 100%;
    }
  }

  #report {
    background-color: var(--black);
    display: block;
    width: 100%;
    border: 1px solid var(--white);
    border-radius: 7.5px;
    text-transform: none;
    color: var(--white);
    margin-bottom: 15px;
    font-size: max(16px, 10px + 0.75vw);
    font-weight: normal;
    padding: 2.5px;
  }

  
</style>
