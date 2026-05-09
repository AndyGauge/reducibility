<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { flat, chapters } from '$lib/outline.js';
  import { createPager } from 'sveltekitbook/gestures';
  import { TITLE, AUTHOR, YEAR } from '$lib/config.js';

  let dragOffset = $state(0);
  let dragging = $derived(dragOffset !== 0);

  function start() {
    goto(base + '/' + flat[0].num);
  }

  const pager = createPager({
    onNext: start,
    onPrev: () => {},
    setOffset: (v) => {
      dragOffset = Math.min(0, v);
    }
  });

  function key(e) {
    if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') start();
  }
</script>

<svelte:window onkeydown={key} />

<main
  class="cover"
  class:dragging
  onwheel={pager.onWheel}
  ontouchstart={pager.onTouchStart}
  ontouchmove={pager.onTouchMove}
  ontouchend={pager.onTouchEnd}
  ontouchcancel={pager.onTouchCancel}
  style:transform="translateX({dragOffset}px)"
>
  <div class="meta top">
    <span>{AUTHOR ? `${AUTHOR} · ` : ''}{YEAR}</span>
  </div>

  <div class="title-block">
    <h1 class="vt-title">{TITLE}</h1>
    <p class="sub">
      Twenty-one NP-complete problems, twenty-one programming languages.
      A polyglot tour of the original landscape Karp drew in 1972.
    </p>
    <p class="cite">
      After Richard M. Karp, <em>Reducibility Among Combinatorial Problems</em>,
      in R. E. Miller &amp; J. W. Thatcher (eds.),
      <em>Complexity of Computer Computations</em>,
      Plenum Press, New York, 1972, pp. 85–103.
    </p>
    <p class="counter">{chapters.length} chapters · {flat.length} sections.</p>
  </div>

  <div class="meta bottom">
    <button onclick={start}>Begin&nbsp;→</button>
    <nav class="cover-nav">
      <a href="{base}/glossary">Glossary</a>
      <a href="{base}/contents">Contents</a>
    </nav>
    <span class="hint">Enter, arrow, swipe, or scroll · [ ] for chapter</span>
  </div>
</main>

<style>
  .cover {
    position: relative;
    height: 100vh;
    height: 100dvh;
    padding: 5vw 7vw;
    display: grid;
    grid-template-rows: auto 1fr auto;
    transition: transform 320ms cubic-bezier(0.2, 0.9, 0.3, 1);
    touch-action: pan-y;
    will-change: transform;
  }

  .cover.dragging { transition: none; }

  .meta {
    font-family: var(--sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .title-block { align-self: center; max-width: 1100px; }

  h1 {
    font-family: var(--serif);
    font-weight: 300;
    font-style: italic;
    font-size: clamp(3.5rem, 12vw, 12rem);
    line-height: 0.9;
    letter-spacing: -0.035em;
    color: var(--ink);
  }

  .sub {
    font-family: var(--serif);
    font-style: italic;
    font-weight: 300;
    font-size: clamp(1rem, 1.4vw, 1.3rem);
    color: var(--ink);
    margin-top: 1.6rem;
    max-width: 52ch;
    line-height: 1.4;
  }

  .cite {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(0.78rem, 0.95vw, 0.9rem);
    color: var(--muted);
    margin-top: 1.4rem;
    max-width: 60ch;
    line-height: 1.5;
    border-left: 2px solid var(--accent);
    padding-left: 1rem;
  }

  .counter {
    font-family: var(--sans);
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 1.6rem;
  }

  button {
    font-family: var(--sans);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    padding: 1rem 1.6rem;
    background: var(--ink);
    color: var(--bg);
    transition: background 200ms ease;
  }
  button:hover { background: var(--accent); }

  .hint {
    font-family: var(--sans);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .cover-nav {
    display: flex;
    gap: 0.9rem;
    font-family: var(--sans);
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .cover-nav :global(a) {
    border-bottom: 1px solid transparent;
    transition: color 160ms ease, border-color 160ms ease;
  }
  .cover-nav :global(a:hover) {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }
</style>
