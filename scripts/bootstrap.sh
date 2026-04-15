#!/usr/bin/env bash
# One-command bootstrap: create the repo, push, enable Pages.
# Requires: gh CLI (https://cli.github.com) authenticated to your GitHub account.
set -euo pipefail

REPO_NAME="${1:-hon-tracker}"
VISIBILITY="${2:-public}"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI not found. Install from https://cli.github.com and run 'gh auth login' first." >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  git init -b main
  git add .
  git commit -m "Initial commit — The Heavenly HON"
fi

gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push

# Enable Pages with workflow-based deploy
gh api -X POST "repos/{owner}/$REPO_NAME/pages" \
  -f "build_type=workflow" >/dev/null 2>&1 || true

OWNER=$(gh api user --jq .login)
SITE="https://${OWNER}.github.io/${REPO_NAME}/"

cat <<EOF

Repo pushed. Pages will finish building in ~1 minute.

Next steps:
  1. Open: https://github.com/settings/personal-access-tokens/new?target_name=${OWNER}&repository_names=${REPO_NAME}&contents=write&metadata=read&description=HON+Tracker
  2. Scope to the '${REPO_NAME}' repo with Contents: Read & write, Metadata: Read-only.
  3. Visit your site: ${SITE}
  4. Go to the Admin tab, paste the PAT, and start adding HONs.

EOF
