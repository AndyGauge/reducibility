<script>
  import { base } from '$app/paths';
  import { mdBlock } from 'sveltekitbook/md';
  import { renderProse } from '$lib/prose.js';
  import { entriesAlphabetical, slugify } from '$lib/glossary.js';
  import { TITLE } from '$lib/config.js';

  const entries = entriesAlphabetical();

  function render(body) {
    return renderProse(body, mdBlock);
  }
</script>

<svelte:head>
  <title>Glossary — {TITLE}</title>
</svelte:head>

<main class="page">
  <div class="page-inner">
    <header class="top">
      <a class="mark vt-title" href="{base}/">{TITLE}</a>
      <nav class="top-nav">
        <a href="{base}/contents">Contents</a>
      </nav>
    </header>

    <h1 class="title">Glossary</h1>
    <p class="lede">
      Quick definitions of terms used across the book. Anywhere a term shows up
      underlined in the prose, it links to its entry here.
    </p>

    <dl class="entries">
      {#each entries as [canonical, entry] (canonical)}
        <div class="entry" id={slugify(canonical)}>
          <dt>
            <span class="term">{canonical}</span>
            {#if entry.aliases?.length}
              <span class="aliases">
                also: {entry.aliases.join(' · ')}
              </span>
            {/if}
          </dt>
          <dd>{@html render(entry.body)}</dd>
        </div>
      {/each}
    </dl>

    <footer class="bottom">
      <a class="back" href="{base}/">← Back to cover</a>
      <a class="back right" href="{base}/contents">Contents →</a>
    </footer>
  </div>
</main>

<style>
  .page {
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  .page-inner {
    max-width: 880px;
    margin: 0 auto;
    padding: 4vw 5vw 6vw;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: var(--muted);
    margin-bottom: 3rem;
  }
  .mark {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1rem;
    letter-spacing: 0;
    text-transform: none;
    color: var(--ink);
  }
  .top-nav { display: flex; gap: 0.9rem; }
  .top-nav :global(a) {
    border-bottom: 1px solid transparent;
    transition: border-color 160ms ease, color 160ms ease;
  }
  .top-nav :global(a:hover) { color: var(--ink); border-bottom-color: var(--ink); }

  .title {
    font-family: var(--serif);
    font-style: italic;
    font-weight: 300;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    line-height: 0.97;
    letter-spacing: -0.025em;
    color: var(--ink);
    margin: 0 0 1rem;
  }

  .lede {
    font-family: var(--serif);
    font-style: italic;
    font-weight: 300;
    font-size: clamp(1rem, 1.3vw, 1.2rem);
    color: var(--muted);
    max-width: 56ch;
    margin: 0 0 3rem;
    line-height: 1.5;
  }

  .entries {
    display: grid;
    gap: 2rem;
    margin: 0;
  }

  .entry {
    display: grid;
    grid-template-columns: minmax(11rem, 1fr) 3fr;
    gap: 0.5rem 2rem;
    padding-top: 1.4rem;
    border-top: 1px solid var(--rule);
    scroll-margin-top: 2rem;
  }
  .entry:first-of-type { border-top: none; padding-top: 0; }

  .entry:target .term {
    background: rgba(192, 90, 60, 0.18);
    padding: 0 0.3rem;
  }

  dt {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .term {
    font-family: var(--serif);
    font-style: italic;
    font-weight: 300;
    font-size: 1.2rem;
    color: var(--ink);
    align-self: start;
  }

  .aliases {
    font-family: var(--sans);
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--muted);
    line-height: 1.5;
  }

  dd {
    margin: 0;
    font-family: var(--serif);
    font-weight: 300;
    font-size: 1rem;
    line-height: 1.55;
    color: var(--ink);
  }
  dd :global(p) { margin: 0 0 0.7em; }
  dd :global(p:last-child) { margin-bottom: 0; }
  dd :global(strong) { font-weight: 500; }
  dd :global(.glossary-link) {
    color: var(--accent);
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  }
  dd :global(.glossary-link:hover) {
    border-bottom-color: var(--accent);
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
    font-family: var(--sans);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--muted);
  }
  .back { transition: color 160ms ease; }
  .back:hover { color: var(--ink); }
  .back.right { text-align: right; }

  @media (max-width: 720px) {
    .entry {
      grid-template-columns: 1fr;
      gap: 0.4rem;
    }
  }
</style>
