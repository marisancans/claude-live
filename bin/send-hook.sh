#!/bin/sh
# claude-live hook forwarder — reads URL from config with precedence:
#   1. CLAUDE_LIVE_URL env var (override)
#   2. .claude/claude-live.json (project)
#   3. ~/.config/claude-live/config.json (global)
#   4. http://localhost:43451 (default)

URL=""

# Project-level config
if [ -f ".claude/claude-live.json" ]; then
  URL=$(cat .claude/claude-live.json 2>/dev/null | grep -o '"url" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')
fi

# Global config fallback
if [ -z "$URL" ] && [ -f "$HOME/.config/claude-live/config.json" ]; then
  URL=$(cat "$HOME/.config/claude-live/config.json" 2>/dev/null | grep -o '"url" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')
fi

# Env var override
if [ -n "$CLAUDE_LIVE_URL" ]; then
  URL="$CLAUDE_LIVE_URL"
fi

# Default
URL="${URL:-http://localhost:43451}"

curl -sf -X POST "$URL/hook" -H 'Content-Type: application/json' -d @- 2>/dev/null || true
