<script>
  import { base } from '$app/paths';

  /**
   * @type {{ slug: string, label?: string }}
   */
  let { slug, label = 'Scan to come back to this page' } = $props();
</script>

<aside class="qr-block">
  <a class="qr" href="{base}/qr/{slug}.svg" target="_blank" rel="noopener" aria-label="QR code for this page">
    <img src="{base}/qr/{slug}.svg" alt="" />
  </a>
  <p class="qr-label">{label}</p>
</aside>

<style>
  .qr-block {
    margin: 3rem 0 1rem;
    padding: 1.6rem 0 0;
    border-top: 1px dotted var(--rule);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    color: var(--muted);
    text-align: center;
  }
  .qr {
    display: block;
    width: 240px;
    height: 240px;
    background: var(--bg);
    padding: 8px;
    border: 1px solid var(--rule);
    transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1),
                box-shadow 220ms ease;
    cursor: zoom-in;
  }
  .qr:hover {
    transform: scale(1.04);
    box-shadow: 0 8px 28px rgba(20, 17, 13, 0.22);
  }
  .qr img {
    display: block;
    width: 100%;
    height: 100%;
    /* sharp edges — QR codes scan better with crisp module boundaries */
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .qr-label {
    margin: 0;
    font-family: var(--sans);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    line-height: 1.6;
    max-width: 28ch;
  }

  @media (max-width: 720px) {
    .qr { width: 200px; height: 200px; }
  }

  @media print { .qr-block { break-inside: avoid; } }
</style>
