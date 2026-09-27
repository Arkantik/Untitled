#!/usr/bin/env bash
# Copy the shell into a target repo. Never overwrites an existing file.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_TARGET="coolify"
POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    --target=*) DEPLOY_TARGET="${arg#*=}" ;;
    --keep-all-targets) DEPLOY_TARGET="__all__" ;;
    --global)
      # Install the cross-project skills once, machine-wide. Claude Code reads
      # ~/.claude/skills in addition to a repo's .claude/skills.
      GDIR="${HOME}/.claude/skills"
      mkdir -p "$GDIR"
      SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
      for sk in unslop commit research perf; do
        if [ -d "$SRC_DIR/.claude/skills/$sk" ]; then
          rm -rf "${GDIR:?}/$sk"
          cp -r "$SRC_DIR/.claude/skills/$sk" "$GDIR/$sk"
          echo "global  $sk"
        fi
      done
      echo ""
      echo "Installed to $GDIR. These apply in every repo on this machine and are"
      echo "edited in one place. They do not travel to other machines, to CI, or to"
      echo "anyone who clones a client repo. Anything that must travel stays per-repo."
      exit 0 ;;
    -h|--help)
      echo "usage: bootstrap.sh /path/to/project [--target=coolify|docker-compose|vercel|handoff|custom]"
      echo "       --keep-all-targets   copy every deploy target reference"
      echo "       --global             install cross-project skills to ~/.claude/skills instead"
      exit 0 ;;
    *) POSITIONAL+=("$arg") ;;
  esac
done
TARGET="${POSITIONAL[0]:?usage: bootstrap.sh /path/to/project [--target=NAME]}"

[ -d "$TARGET" ] || { echo "No such directory: $TARGET" >&2; exit 1; }

case "$DEPLOY_TARGET" in
  coolify|docker-compose|vercel|handoff|custom|__all__) ;;
  *) echo "Unknown target: $DEPLOY_TARGET" >&2; exit 1 ;;
esac

copied=0; skipped=0
while IFS= read -r -d '' f; do
  rel="${f#"$SRC"/}"
  case "$rel" in bootstrap.sh|sync.sh|shell.manifest|README.md|.shell-projects|.git/*) continue;; esac
  dest="$TARGET/$rel"
  if [ -e "$dest" ]; then
    if [ "$rel" = "CLAUDE.md" ] && [ ! -e "$dest.shell" ]; then
      cp "$f" "$dest.shell"
      echo "keep   CLAUDE.md (yours), shell version at CLAUDE.md.shell for merging"
    else
      echo "skip   $rel (exists)"
    fi
    skipped=$((skipped+1))
  else
    mkdir -p "$(dirname "$dest")"
    cp "$f" "$dest"
    echo "copy   $rel"
    copied=$((copied+1))
  fi
done < <(find "$SRC" -type f -print0)

# Keep only the deploy target this project uses. Unused ones are context you pay for.
TDIR="$TARGET/.claude/skills/ship/targets"
if [ "$DEPLOY_TARGET" != "__all__" ] && [ -d "$TDIR" ]; then
  for f in "$TDIR"/*.md; do
    name=$(basename "$f" .md)
    case "$name" in
      _template) continue ;;
      "$DEPLOY_TARGET") continue ;;
      *) rm -f "$f" ;;
    esac
  done
  [ "$DEPLOY_TARGET" = "custom" ] && cp "$TDIR/_template.md" "$TDIR/custom.md" 2>/dev/null || true
  for cm in "$TARGET/CLAUDE.md" "$TARGET/CLAUDE.md.shell"; do
    [ -f "$cm" ] || continue
    sed -i.bak "s|^- Deploy target: .*|- Deploy target: $DEPLOY_TARGET|" "$cm" 2>/dev/null || true
    rm -f "$cm.bak"
  done
fi

chmod +x "$TARGET/.claude/hooks/"*.sh "$TARGET/scripts/"*.sh 2>/dev/null || true

cat <<EOF

Copied $copied files, skipped $skipped. Deploy target: $DEPLOY_TARGET

Next, in order:

  1. Run /start-project in a Claude Code session. It fills the placeholders, and on an
     existing project it reads them out of the codebase instead of asking.
     Or by hand: fill the placeholders in $TARGET/CLAUDE.md. The commands table first: every command
     must run as written. Nothing else in the shell works if that table is wrong.
  2. Read .claude/skills/ship/targets/$DEPLOY_TARGET.md and correct anything that does not
     match how this project actually deploys. The traps section is worth filling in as you hit them.
  3. Delete the skills you do not need. An unused skill is context you pay for every session.
     provisioning-safety only applies if the project creates infrastructure for users.
  4. Write your first three non-negotiables in CLAUDE.md, each with an evidence path.
  5. Set last_audit in docs/.foundation-state to today.
  6. Start a Claude Code session and confirm the session-start hook output appears.
  7. Back in the shell: ./sync.sh register $TARGET, so future improvements reach this project.
EOF
