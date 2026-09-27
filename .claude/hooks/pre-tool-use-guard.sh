#!/usr/bin/env bash
# PreToolUse hook for Bash. Exit 2 blocks the call and returns stderr to the agent.
INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)
[ -z "$CMD" ] && exit 0

block() { echo "$1" >&2; exit 2; }

case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*)
    block "Refusing a recursive delete of a root or home path." ;;
  *"git push --force"*|*"git push -f"*)
    block "Force push blocked by hook. Ask the user first, then run it yourself." ;;
  *"git reset --hard"*)
    block "Hard reset blocked by hook. It destroys uncommitted work. Confirm with the user." ;;
  *"git checkout ."*|*"git restore ."*)
    block "Blanket discard of working tree changes blocked. Name specific paths." ;;
esac

# Anything creating files must not use touch: it produces empty files that break installs.
case "$CMD" in
  "touch "*|*" touch "*)
    block "Do not scaffold with touch. It creates 0-byte files that pass existence checks and break installs. Write files with content." ;;
esac
exit 0
