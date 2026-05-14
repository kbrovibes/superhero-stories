#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# ── Git credentials ──────────────────────────────────────────────────────────
# Requires GITHUB_TOKEN env var set in Claude Code web settings.
# Without it, git push will fail silently rather than blocking the session.
if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "https://x-token:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
  git config --global credential.helper store
  echo "[session-start] git credentials configured from GITHUB_TOKEN"
else
  echo "[session-start] WARNING: GITHUB_TOKEN not set — git push will require manual auth"
fi

# ── Node dependencies ─────────────────────────────────────────────────────────
echo "[session-start] installing webapp dependencies..."
cd "${CLAUDE_PROJECT_DIR}/webapp"
npm install
echo "[session-start] done"
