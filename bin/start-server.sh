#!/bin/sh
# claude-live server launcher — reads URL from config with precedence:
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

# Only auto-start server if pointing to localhost
case "$URL" in
  http://localhost:*|http://127.0.0.1:*)
    curl -sf "$URL/buffer" >/dev/null 2>&1 || (npx claude-live@latest >/tmp/claude-live.log 2>&1 &)
    ;;
esac
