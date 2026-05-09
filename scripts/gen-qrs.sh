#!/usr/bin/env bash
# Generate per-page QR codes that link back to the deployed site.
# Output goes to static/qr/, which SvelteKit serves as-is.
#
# Run from the project root:
#   bash scripts/gen-qrs.sh
#
# Re-run whenever new pages are added; idempotent (safe to run repeatedly).

set -euo pipefail

QRGEN="$HOME/.claude/skills/qrgen/crate/target/release/qrgen"
BASE_URL="https://andygauge.github.io/reducibility"
OUT_DIR="static/qr"

if [[ ! -x "$QRGEN" ]]; then
  echo "qrgen binary not found at $QRGEN" >&2
  echo "build it with: cargo build --release --manifest-path ~/.claude/skills/qrgen/crate/Cargo.toml" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# Default look matches the book's parchment palette. Foreground is the same
# --ink as the prose, background is the page --bg.
DARK="#14110d"
LIGHT="#ece8df"

# Cover, contents, glossary
"$QRGEN" "$BASE_URL/"          "$OUT_DIR/_cover.svg"    --dark="$DARK" --light="$LIGHT" --size=256 --ec=M
"$QRGEN" "$BASE_URL/contents"  "$OUT_DIR/_contents.svg" --dark="$DARK" --light="$LIGHT" --size=256 --ec=M
"$QRGEN" "$BASE_URL/glossary"  "$OUT_DIR/_glossary.svg" --dark="$DARK" --light="$LIGHT" --size=256 --ec=M

# Chapter sections 01–63
for i in $(seq -w 1 63); do
  "$QRGEN" "$BASE_URL/$i" "$OUT_DIR/$i.svg" --dark="$DARK" --light="$LIGHT" --size=256 --ec=M
done

echo "wrote $(ls "$OUT_DIR" | wc -l | tr -d ' ') QR codes to $OUT_DIR/"
