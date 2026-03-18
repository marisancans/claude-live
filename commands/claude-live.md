---
allowed-tools: Bash(pkill:*), Bash(curl:*), Bash(npx:*), Bash(ps:*), Bash(tail:*), Bash(grep:*), Bash(sed:*), Bash(mkdir:*), Bash(rm:*), Bash(cat:*)
description: Control and inspect the claude-live visualizer server
---

Manage the claude-live server. The server always runs on port 43451.

User's argument: $ARGUMENTS

## Subcommands

- **no argument / status**: Run the status checks below and display results
- **stop**: Run `pkill -f "node.*claude-live"` and confirm stopped
- **start**: Start with `npx claude-live@latest >/tmp/claude-live.log 2>&1 &`, wait 1s, then show status
- **restart**: Stop then start
- **logs**: Show `tail -30 /tmp/claude-live.log`
- **config**: Display current endpoint URL (shows which config source is active)
- **config `<url>`**: Set global endpoint URL, auto-create `~/.config/claude-live/` if needed
- **config reset**: Reset to default endpoint (`http://localhost:43451`), delete global config file

## Status output (default and after start)

Run these and display in a compact summary:

```
curl -sf http://localhost:43451/buffer >/dev/null 2>&1 && echo "● running on port 43451 — http://localhost:43451" || echo "○ stopped"
ps -eo pid,etime,cmd | grep "node.*claude-live" | grep -v grep
tail -5 /tmp/claude-live.log 2>/dev/null
```

Show: running/stopped, port (always 43451), PID and uptime if running, last 5 log lines.

## Config Management

The `/claude-live config` subcommands manage where hooks send events.

### Display current URL
```
/claude-live config
```
Output example: `● Configured: http://192.168.1.50:43451 (from global config)`

Possible sources shown:
- "from environment (CLAUDE_LIVE_URL)"
- "from project config (.claude/claude-live.json)"
- "from global config (~/.config/claude-live/config.json)"
- "default (localhost:43451)"

### Set global URL
```
/claude-live config http://192.168.1.50:43451
```
Output: `✓ URL set to http://192.168.1.50:43451`

Behavior:
- Validates URL format (must start with http:// or https://)
- Auto-creates `~/.config/claude-live/` directory if needed
- Writes to `~/.config/claude-live/config.json`
- Shows error if validation fails or write fails

Valid URLs:
- `http://example.com`
- `http://192.168.1.50:9000`
- `https://api.example.com:443`

Invalid URLs:
- `localhost:43451` (no http://)
- `http://` (no host)
- `ftp://example.com` (not http/https)

### Reset to default
```
/claude-live config reset
```
Output: `✓ Reset to default (localhost:43451)`

Behavior:
- Deletes `~/.config/claude-live/config.json` if it exists
- Doesn't affect project config or env var (those still take precedence if set)

## Implementation

Parse $ARGUMENTS and execute the appropriate subcommand:

```bash
# Handle config subcommands
if [[ "$ARGUMENTS" == "config" ]] || [[ "$ARGUMENTS" == config* ]]; then
  if [[ "$ARGUMENTS" == "config reset" ]]; then
    # Reset to default
    rm -f "$HOME/.config/claude-live/config.json"
    echo "✓ Reset to default (localhost:43451)"
  elif [[ "$ARGUMENTS" == "config" ]]; then
    # Display current URL
    URL_SOURCE="default"
    URL="http://localhost:43451"

    if [ -n "$CLAUDE_LIVE_URL" ]; then
      URL="$CLAUDE_LIVE_URL"
      URL_SOURCE="from environment (CLAUDE_LIVE_URL)"
    elif [ -f ".claude/claude-live.json" ]; then
      PROJECT_URL=$(grep -o '"url" *: *"[^"]*"' .claude/claude-live.json 2>/dev/null | head -1 | sed 's/.*: *"//;s/"//')
      if [ -n "$PROJECT_URL" ]; then
        URL="$PROJECT_URL"
        URL_SOURCE="from project config (.claude/claude-live.json)"
      fi
    elif [ -f "$HOME/.config/claude-live/config.json" ]; then
      GLOBAL_URL=$(grep -o '"url" *: *"[^"]*"' "$HOME/.config/claude-live/config.json" 2>/dev/null | head -1 | sed 's/.*: *"//;s/"//')
      if [ -n "$GLOBAL_URL" ]; then
        URL="$GLOBAL_URL"
        URL_SOURCE="from global config (~/.config/claude-live/config.json)"
      fi
    fi

    echo "● Configured: $URL ($URL_SOURCE)"
  else
    # Set URL
    NEW_URL="${ARGUMENTS#config }"

    # Validate URL format
    if ! echo "$NEW_URL" | grep -q '^https\?://[^/]'; then
      echo "✗ Invalid URL format: must start with http:// or https://"
      exit 1
    fi

    # Create directory
    mkdir -p "$HOME/.config/claude-live/" || {
      echo "✗ Failed to create ~/.config/claude-live/ directory"
      exit 1
    }

    # Write config
    if ! cat > "$HOME/.config/claude-live/config.json" <<EOF
{
  "url": "$NEW_URL"
}
EOF
    then
      echo "✗ Failed to write config file"
      exit 1
    fi

    echo "✓ URL set to $NEW_URL"
  fi
fi
```
