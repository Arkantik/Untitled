#!/usr/bin/env bash
# Verify a generated file tree is real: no empty files, install succeeds.
# Run after any scaffolding step. Exit non-zero on failure.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
FAIL=0

echo "Checking for empty files..."
EMPTY=$(find . -type f -size 0 \
  -not -path './.git/*' -not -path './node_modules/*' -not -name '.gitkeep' 2>/dev/null)
if [ -n "$EMPTY" ]; then
  echo "Empty files found. These pass an existence check and fail at import or install time:"
  echo "$EMPTY"
  FAIL=1
else
  echo "  none"
fi

echo "Checking for placeholder markers left in committed files..."
MARKER="TODO""-REPLACE"
LEFT=$(grep -rln "$MARKER" --exclude-dir=.git --exclude-dir=node_modules \
  --exclude="$(basename "$0")" . 2>/dev/null)
if [ -n "$LEFT" ]; then echo "$LEFT"; FAIL=1; else echo "  none"; fi

INSTALL_CMD="${INSTALL_CMD:-}"
if [ -n "$INSTALL_CMD" ]; then
  echo "Running install: $INSTALL_CMD"
  $INSTALL_CMD || { echo "Install failed."; FAIL=1; }
else
  echo "Set INSTALL_CMD to also verify the install, e.g. INSTALL_CMD='pnpm install' $0"
fi

[ "$FAIL" -eq 0 ] && echo "Scaffold OK" || echo "Scaffold check failed"
exit $FAIL
