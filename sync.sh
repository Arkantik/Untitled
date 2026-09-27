#!/usr/bin/env bash
# Keep registered projects in sync with this shell.
#
# push updates only files that already exist in the project, so a project that deleted
# a skill it does not need never has it resurrected. --add-new introduces genuinely new files.
set -uo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REG="$SRC/.shell-projects"

OWNED=(.claude/skills .claude/agents .claude/hooks scripts AGENTS.md \
       docs/decisions/0000-template.md docs/tickets/_template.md)

usage() {
  cat <<'USAGE'
usage:
  sync.sh register <path>        track a project
  sync.sh forget <path>          stop tracking it
  sync.sh list                   show tracked projects
  sync.sh check                  report drift in every tracked project
  sync.sh push [--add-new] [path]  copy shell-owned files out (all projects, or one)
  sync.sh pull <path> <file>     bring one improved file back upstream
  sync.sh prefs                  print a paste-ready block for claude.ai settings

push only updates files the project already has. --add-new also copies files
it is missing, which is how a newly written skill reaches existing projects.
A project that deliberately removed a skill lists it in .claude/.shell-ignore
so --add-new does not bring it back.
USAGE
}

projects() { [ -f "$REG" ] && grep -v '^#' "$REG" | grep -v '^[[:space:]]*$' || true; }

# every shell-owned file, as paths relative to the shell root
owned_files() {
  for p in "${OWNED[@]}"; do
    if [ -d "$SRC/$p" ]; then
      find "$SRC/$p" -type f -print0 | while IFS= read -r -d '' f; do echo "${f#"$SRC"/}"; done
    elif [ -f "$SRC/$p" ]; then
      echo "$p"
    fi
  done
}

cmd_register() {
  local path; path=$(cd "${1:?path required}" && pwd)
  [ -d "$path/.claude" ] || { echo "Not a shell project (no .claude/): $path" >&2; exit 1; }
  touch "$REG"
  grep -qxF "$path" "$REG" 2>/dev/null && { echo "Already tracked: $path"; exit 0; }
  echo "$path" >> "$REG"
  echo "Tracking $path"
}

cmd_forget() {
  local path; path=$(cd "${1:?path required}" && pwd)
  [ -f "$REG" ] || exit 0
  grep -vxF "$path" "$REG" > "$REG.tmp" && mv "$REG.tmp" "$REG"
  echo "Stopped tracking $path"
}

cmd_list() { projects || echo "No projects registered."; }

# Files whose absence is a deliberate per-project choice, not drift.
# Deploy targets are pruned at bootstrap. Anything else a project chose to remove
# goes in its .claude/.shell-ignore, one path or prefix per line.
intentional_absence() {
  local rel="$1" proj="${2:-}"
  case "$rel" in
    .claude/skills/ship/targets/*) return 0 ;;
  esac
  local ig="$proj/.claude/.shell-ignore"
  [ -n "$proj" ] && [ -f "$ig" ] || return 1
  while IFS= read -r pat; do
    case "$pat" in ''|'#'*) continue ;; esac
    case "$rel" in $pat|$pat/*|"$pat"*) return 0 ;; esac
  done < "$ig"
  return 1
}

cmd_check() {
  local any=0
  while IFS= read -r proj; do
    [ -d "$proj" ] || { echo "MISSING  $proj"; any=1; continue; }
    local behind=0 ahead=0 absent=0
    while IFS= read -r rel; do
      local a="$SRC/$rel" b="$proj/$rel"
      if [ ! -f "$b" ]; then
        intentional_absence "$rel" "$proj" || absent=$((absent+1))
        continue
      fi
      if ! cmp -s "$a" "$b"; then
        if [ "$a" -nt "$b" ]; then behind=$((behind+1)); else ahead=$((ahead+1)); fi
      fi
    done < <(owned_files)

    if [ $behind -eq 0 ] && [ $ahead -eq 0 ]; then
      printf 'ok       %s' "$proj"
      [ $absent -gt 0 ] && printf '  (%d shell file(s) not installed here)' "$absent"
      echo
    else
      any=1
      printf 'drift    %s  (%d behind, %d ahead)\n' "$proj" "$behind" "$ahead"
      while IFS= read -r rel; do
        local a="$SRC/$rel" b="$proj/$rel"
        [ -f "$b" ] || continue
        if ! cmp -s "$a" "$b"; then
          if [ "$a" -nt "$b" ]; then echo "           behind: $rel"
          else echo "           AHEAD:  $rel  (pull this back before pushing)"; fi
        fi
      done < <(owned_files)
    fi
    if [ $absent -gt 0 ]; then
      while IFS= read -r rel; do
        [ -f "$proj/$rel" ] && continue
        intentional_absence "$rel" "$proj" && continue
        echo "           not installed: $rel  (sync.sh push --add-new adds it)"
      done < <(owned_files)
    fi
  done < <(projects)
  [ "$any" -eq 0 ] && echo "All tracked projects match the shell."
  return 0
}

cmd_push() {
  local add_new=0 only=""
  for a in "$@"; do
    case "$a" in --add-new) add_new=1 ;; *) only=$(cd "$a" && pwd) ;; esac
  done

  local targets
  if [ -n "$only" ]; then targets="$only"; else targets=$(projects); fi
  [ -z "$targets" ] && { echo "No projects to push to."; exit 0; }

  while IFS= read -r proj; do
    [ -d "$proj" ] || { echo "skip $proj (missing)"; continue; }
    local n=0 added=0 warned=0
    while IFS= read -r rel; do
      local a="$SRC/$rel" b="$proj/$rel"
      if [ -f "$b" ]; then
        cmp -s "$a" "$b" && continue
        if [ "$b" -nt "$a" ]; then
          echo "  WARN  $rel is newer in the project. Skipped. Use: sync.sh pull $proj $rel"
          warned=$((warned+1)); continue
        fi
        mkdir -p "$(dirname "$b")"; cp "$a" "$b"; n=$((n+1))
      elif [ "$add_new" -eq 1 ]; then
        intentional_absence "$rel" "$proj" && continue
        mkdir -p "$(dirname "$b")"; cp "$a" "$b"; added=$((added+1))
      fi
    done < <(owned_files)
    chmod +x "$proj/.claude/hooks/"*.sh "$proj/scripts/"*.sh 2>/dev/null
    printf '%s  updated %d, added %d, skipped %d\n' "$proj" "$n" "$added" "$warned"
  done <<< "$targets"
}

cmd_pull() {
  local proj rel
  proj=$(cd "${1:?project path required}" && pwd)
  rel="${2:?file path relative to project root required}"
  [ -f "$proj/$rel" ] || { echo "No such file: $proj/$rel" >&2; exit 1; }
  mkdir -p "$(dirname "$SRC/$rel")"
  cp "$proj/$rel" "$SRC/$rel"
  echo "Pulled $rel upstream. Commit it here, then: sync.sh push"
}

cmd_prefs() {
  local f="$SRC/.claude/skills/unslop/SKILL.md"
  [ -f "$f" ] || { echo "No unslop skill found." >&2; exit 1; }
  cat <<'HDR'
Paste the block below into claude.ai Settings, under user preferences.
This is the one place that cannot be synced automatically. Re-run this after
editing the unslop skill so the two do not drift.
-----------------------------------------------------------------------
HDR
  sed -n '/^## Content/,$p' "$f" | grep '^- ' | sed 's/^- //' | sed 's/^/- /'
  echo "-----------------------------------------------------------------------"
}

case "${1:-}" in
  register) shift; cmd_register "$@" ;;
  forget)   shift; cmd_forget "$@" ;;
  list)     cmd_list ;;
  check)    cmd_check ;;
  push)     shift; cmd_push "$@" ;;
  pull)     shift; cmd_pull "$@" ;;
  prefs)    cmd_prefs ;;
  *) usage; exit 1 ;;
esac
