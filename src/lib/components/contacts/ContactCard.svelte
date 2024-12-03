<script lang="ts">
  let {
    title,
    description,
    contact,
    color,
    href,
    border,
    src
  }: {
    title: string;
    description: string;
    contact: string;
    color: string;
    href: string;
    border: string;
    src: string;
  } = $props();
</script>

<div class="card" style:background-color={color} style:border-color={border}>
  <div class="title-row">
    <img {src} alt="" />
    <h1>{title}</h1>
  </div>

  <p>{description}</p>

  <a {href}>{contact}</a>
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

  a {
    font-size: max(20px, 12px + 0.75vw);
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    flex-shrink: 1; /* magic fuckery because text wrap didn't work */
  }

  a:hover {
    color: var(--blue);
    transition: 0.2s;
  }

  @media (max-width: 900px) {
    .card {
      width: 100%;
    }
  }
</style>
