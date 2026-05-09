// One-stop prose renderer: math + glossary + markdown.
//
// Pipeline:
//   text → mathify    → swap $$...$$ for math sentinels (KaTeX HTML stored)
//        → glossarify → swap [[term]] for glossary sentinels (link HTML stored)
//        → md/mdBlock → HTML-escape + bold/em/links substitution
//        → unglossarify → restore link HTML
//        → unmathify    → restore math HTML
//
// The two sentinel families ({\x01KX{i}\x01} and {\x01GL{i}\x01}) survive
// HTML escaping unchanged and don't collide with each other.

import katex from 'katex';
import { lookup, slugify } from './glossary.js';

const S = '\x01';
const MATH_PH  = (i) => `${S}KX${i}${S}`;
const GLOSS_PH = (i) => `${S}GL${i}${S}`;
const MATH_RE  = new RegExp(`${S}KX(\\d+)${S}`, 'g');
const GLOSS_RE = new RegExp(`${S}GL(\\d+)${S}`, 'g');
const WRAPPED_MATH_RE = new RegExp(`<p>${S}KX(\\d+)${S}</p>`, 'g');

const GLOSSARY_BASE = '/glossary';

function renderMath(tex) {
  return katex.renderToString(tex, {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore',
    output: 'html'
  });
}

function mathify(text) {
  if (!text) return { text: '', html: [] };
  const html = [];
  const out = String(text).replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    const i = html.length;
    html.push(renderMath(tex.trim()));
    return MATH_PH(i);
  });
  return { text: out, html };
}

function glossarify(text, base) {
  if (!text) return { text: '', html: [] };
  const html = [];
  // [[target]]            → look up "target", display "target"
  // [[target|display]]    → look up "target", display "display"  (MediaWiki style)
  // [[plurals|s|...]] → first segment is target, second is display, rest ignored
  const out = String(text).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, display) => {
    target = target.trim();
    display = (display ?? target).trim();
    const canonical = lookup.get(target.toLowerCase());
    if (!canonical) return display;
    const i = html.length;
    html.push(
      `<a class="glossary-link" href="${base}#${slugify(canonical)}" data-term="${canonical}">${display}</a>`
    );
    return GLOSS_PH(i);
  });
  return { text: out, html };
}

function unmathify(rendered, html) {
  if (!html.length) return rendered;
  return rendered
    .replace(WRAPPED_MATH_RE, (_, i) => html[parseInt(i, 10)] ?? '')
    .replace(MATH_RE, (_, i) => html[parseInt(i, 10)] ?? '');
}

function unglossarify(rendered, html) {
  if (!html.length) return rendered;
  return rendered.replace(GLOSS_RE, (_, i) => html[parseInt(i, 10)] ?? '');
}

/**
 * Run a renderer (md or mdBlock) over text with math + glossary support.
 * Pass { glossaryBase } to override the default `/glossary` link target.
 */
export function renderProse(text, render, { glossaryBase = GLOSSARY_BASE } = {}) {
  if (!text) return '';
  const m = mathify(text);
  const g = glossarify(m.text, glossaryBase);
  const html = render(g.text);
  return unmathify(unglossarify(html, g.html), m.html);
}
