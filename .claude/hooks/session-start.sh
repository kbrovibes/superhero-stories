#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# ── Git credentials ──────────────────────────────────────────────────────────
# Reads token from $GITHUB_TOKEN env var, or falls back to .github-token file.
# To update the token: overwrite .github-token (it is gitignored).
TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -f "${CLAUDE_PROJECT_DIR}/.github-token" ]; then
  TOKEN=$(cat "${CLAUDE_PROJECT_DIR}/.github-token")
fi

if [ -n "$TOKEN" ]; then
  echo "https://x-token:${TOKEN}@github.com" > ~/.git-credentials
  git config --global credential.helper store
  echo "[session-start] git credentials configured"
else
  echo "[session-start] WARNING: no token found — git push will require manual auth"
fi

# ── Node dependencies ─────────────────────────────────────────────────────────
echo "[session-start] installing webapp dependencies..."
cd "${CLAUDE_PROJECT_DIR}/webapp"
npm install
echo "[session-start] done"
