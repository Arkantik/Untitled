#!/usr/bin/env bash
# PostToolUse hook for Write and Edit. Warns without blocking.
INPUT=$(cat)
FILE=$(printf '%s' "$INPUT" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0

if [ ! -s "$FILE" ]; then
  echo "Warning: $FILE is empty. An empty file passes an existence check and fails at install or import time." >&2
fi

case "$FILE" in
  *.env|*.env.*|*credentials*|*secrets*)
    echo "Warning: $FILE looks like a secrets file. Confirm it is gitignored." >&2 ;;
esac

if grep -qE '(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)' "$FILE" 2>/dev/null; then
  echo "Warning: $FILE contains something shaped like a live credential. Do not commit it." >&2
fi
exit 0
