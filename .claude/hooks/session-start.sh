#!/usr/bin/env bash
# SessionStart hook. stdout is injected as context at the start of every session.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

COMMIT_THRESHOLD=50
DAY_THRESHOLD=45
SESSION_LOG_MAX=10

LATEST=$(ls -t docs/sessions/*.md 2>/dev/null | grep -v '/README\.md$' | head -1)
if [ -n "$LATEST" ]; then
  echo "=== Latest session log ($LATEST) ==="
  cat "$LATEST"
fi

echo ""
echo "=== Git state ==="
git branch --show-current 2>/dev/null
git status --short 2>/dev/null | head -15

if [ -d docs/tickets/open ]; then
  OPEN_N=$(ls docs/tickets/open/*.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$OPEN_N" -gt 0 ]; then
    echo ""
    echo "=== Ticket queue ($OPEN_N open) ==="
    grep -l '^status: ready' docs/tickets/open/*.md 2>/dev/null | head -5 | while read -r t; do
      echo "ready: $(grep -m1 '^title:' "$t" | sed 's/^title:[[:space:]]*//')"
    done
  fi
fi

NUDGES=""

LAST_CM=$(git log -1 --format=%H -- CLAUDE.md 2>/dev/null)
if [ -n "$LAST_CM" ]; then
  SINCE=$(git rev-list --count "$LAST_CM"..HEAD 2>/dev/null || echo 0)
  if [ "$SINCE" -ge "$COMMIT_THRESHOLD" ]; then
    NUDGES="$NUDGES\n- CLAUDE.md unchanged for $SINCE commits. Rules may be stale."
  fi
fi

STATE_FILE="docs/.foundation-state"
LAST_AUDIT=$(grep '^last_audit=' "$STATE_FILE" 2>/dev/null | cut -d= -f2)
if [ -n "$LAST_AUDIT" ] && [ "$LAST_AUDIT" != "YYYY-MM-DD" ]; then
  NOW=$(date +%s)
  THEN=$(date -d "$LAST_AUDIT" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$LAST_AUDIT" +%s 2>/dev/null || echo "$NOW")
  DAYS=$(( (NOW - THEN) / 86400 ))
  [ "$DAYS" -ge "$DAY_THRESHOLD" ] && NUDGES="$NUDGES\n- Last foundation audit: $DAYS days ago."
else
  NUDGES="$NUDGES\n- No foundation audit recorded yet (docs/.foundation-state)."
fi

LOG_COUNT=$(find docs/sessions -maxdepth 1 -name '*.md' ! -name 'README.md' 2>/dev/null | wc -l | tr -d ' ')
LOG_COUNT=${LOG_COUNT:-0}
[ "$LOG_COUNT" -gt "$SESSION_LOG_MAX" ] && NUDGES="$NUDGES\n- $LOG_COUNT session logs (max $SESSION_LOG_MAX). Rotation overdue."

if [ -n "$NUDGES" ]; then
  echo ""
  echo "=== Foundation drift detected ==="
  printf '%b\n' "$NUDGES"
  echo "Suggest /audit-foundation to the user before long-lived work. Do not run it unprompted."
fi
exit 0
