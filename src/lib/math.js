// KaTeX bridge for sveltekitbook's md() / mdBlock().
//
// md() HTML-escapes everything and only handles **bold**, *em*, and links —
// so $$...$$ would render literally. We extract math regions before md()
// runs, leave a sentinel placeholder that survives HTML escape, run md(),
// then substitute KaTeX-rendered HTML back into the result.
//
// The sentinel is \x01 (Start of Heading), which never appears in real text,
// is not touched by md()'s escape, and is regex-safe.
//
// This project uses display-mode math only ($$...$$). Inline math ($...$)
// is intentionally NOT supported — paragraphs reference equations rather
// than embedding them. See memory/feedback_math_style.md.

import katex from 'katex';

const S = '\x01';
const PLACEHOLDER = (i) => `${S}KX${i}${S}`;
const PLACEHOLDER_RE = new RegExp(`${S}KX(\\d+)${S}`, 'g');
// When mdBlock wraps each paragraph in <p>...</p>, a display-math
// placeholder that sat alone on its own paragraph ends up as
// <p>SENTINEL</p>. We unwrap that case so the KaTeX block lands at
// block level, not inside a <p>.
const WRAPPED_RE = new RegExp(`<p>${S}KX(\\d+)${S}</p>`, 'g');

function render(tex) {
  return katex.renderToString(tex, {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore',
    output: 'html'
  });
}

/**
 * Strip $$...$$ regions out of `text`, replacing them with sentinel
 * placeholders. Returns { text, html } where html[i] is the KaTeX HTML
 * for placeholder i.
 *
 * Inline single-$ math is left untouched on purpose — the book convention
 * is display math separated from prose, with references like "the
 * inequality above."
 */
export function mathify(text) {
  if (!text) return { text: '', html: [] };
  const html = [];
  const out = String(text).replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    const i = html.length;
    html.push(render(tex.trim()));
    return PLACEHOLDER(i);
  });
  return { text: out, html };
}

/**
 * Substitute KaTeX HTML back into a rendered string. Unwraps the
 * <p>SENTINEL</p> case first so display blocks don't end up nested in
 * paragraphs.
 */
export function unmathify(rendered, html) {
  if (!html.length) return rendered;
  return rendered
    .replace(WRAPPED_RE, (_, i) => html[parseInt(i, 10)] ?? '')
    .replace(PLACEHOLDER_RE, (_, i) => html[parseInt(i, 10)] ?? '');
}

/**
 * Run a renderer (`md` or `mdBlock`) over `text` with KaTeX support
 * transparently bolted on.
 */
export function withMath(text, render, opts) {
  const { text: pre, html } = mathify(text);
  return unmathify(render(pre, opts), html);
}
