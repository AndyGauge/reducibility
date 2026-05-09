<script>
  import { base } from '$app/paths';

  /** @type {{ slug: string }} */
  let { slug } = $props();
</script>

<a class="qr" href="{base}/qr/{slug}.svg" target="_blank" rel="noopener" aria-label="QR code for this page">
  <img src="{base}/qr/{slug}.svg" alt="" />
</a>

<style>
  .qr {
    position: fixed;
    bottom: 0.9rem;
    right: 0.9rem;
    width: 64px;
    height: 64px;
    z-index: 50;
    background: var(--bg);
    padding: 4px;
    border: 1px solid var(--rule);
    box-shadow: 0 2px 10px rgba(20, 17, 13, 0.12);
    transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1),
                box-shadow 220ms ease;
    cursor: zoom-in;
  }
  .qr:hover {
    transform: scale(2.6);
    transform-origin: bottom right;
    box-shadow: 0 8px 28px rgba(20, 17, 13, 0.22);
  }
  .qr img {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 720px) {
    .qr { width: 48px; height: 48px; bottom: 0.6rem; right: 0.6rem; }
    .qr:hover { transform: scale(3.2); }
  }

  @media print { .qr { position: static; } }
</style>
