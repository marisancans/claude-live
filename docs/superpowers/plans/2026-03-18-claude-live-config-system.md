# Claude Live Config System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-friendly configuration management for the claude-live visualizer endpoint URL, allowing users to set global or project-level endpoints without manual file editing.

**Architecture:** Replace hardcoded localhost curl commands in hooks with calls to the existing `bin/send-hook.sh` wrapper script (which already implements config precedence). Extend the `/claude-live` command to add config subcommands for viewing, setting, and resetting the endpoint URL.

**Tech Stack:** Shell (sh), JSON, Markdown (command definition)

---

## File Structure

### Modified Files

1. **`/hooks/hooks.json`** (14 hook types)
   - Update: Replace hardcoded `curl -sf -X POST http://localhost:43451/hook ...` with `bin/send-hook.sh`
   - Hooks affected: InstructionsLoaded, WorktreeCreate, WorktreeRemove, PreToolUse, PostToolUse, Stop, Notification, PermissionRequest, SubagentStart, SubagentStop, SessionEnd, PostToolUseFailure, UserPromptSubmit, PreCompact, PostCompact
   - Special: SessionStart has two commands — keep first (health check), replace second (event forward)
   - Note: Do NOT update `/.claude-plugin/hooks/hooks.json` — it inherits from root

2. **`commands/claude-live.md`** (command definition)
   - Extend: Add three new subcommands (`config`, `config <url>`, `config reset`)
   - Implement: URL validation, config file management, precedence display
   - Preserve: Existing start/stop/logs/status subcommands unchanged

### Existing Support Files (No Changes)

- **`bin/send-hook.sh`** — Already implemented; reads config with correct precedence
- **`bin/start-server.sh`** — Already implemented; handles auto-start logic

---

## Implementation Tasks

### Task 1: Update `/hooks/hooks.json` — Replace Hardcoded Curl Commands

**Files:**
- Modify: `hooks/hooks.json` (entire structure)

- [ ] **Step 1: Backup current hooks.json**

```bash
cp hooks/hooks.json hooks/hooks.json.bak
```

- [ ] **Step 2: Update SessionStart hook (2 commands → keep first, replace second)**

In `hooks.json`, SessionStart block currently has two commands. Keep the first (health check curl), replace the second with `bin/send-hook.sh`.

Before:
```json
"SessionStart": [{
  "hooks": [
    {
      "type": "command",
      "command": "curl -sf http://localhost:43451/buffer >/dev/null 2>&1 || (npx claude-live@latest >/tmp/claude-live.log 2>&1 &)",
      "async": true
    },
    {
      "type": "command",
      "command": "curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true",
      "async": true
    }
  ]
}]
```

After:
```json
"SessionStart": [{
  "hooks": [
    {
      "type": "command",
      "command": "curl -sf http://localhost:43451/buffer >/dev/null 2>&1 || (npx claude-live@latest >/tmp/claude-live.log 2>&1 &)",
      "async": true
    },
    {
      "type": "command",
      "command": "bin/send-hook.sh",
      "async": true
    }
  ]
}]
```

- [ ] **Step 3: Update remaining 15 hooks (replace curl with bin/send-hook.sh)**

For each of these 15 hooks, replace the curl command with `bin/send-hook.sh`:
- InstructionsLoaded
- WorktreeCreate
- WorktreeRemove
- PreToolUse
- PostToolUse
- Stop
- Notification
- PermissionRequest
- SubagentStart
- SubagentStop
- SessionEnd
- PostToolUseFailure
- UserPromptSubmit
- PreCompact
- PostCompact

Pattern: Replace
```json
"command": "curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true"
```

With:
```json
"command": "bin/send-hook.sh"
```

- [ ] **Step 4: Validate JSON syntax**

```bash
python3 -m json.tool hooks/hooks.json > /dev/null && echo "✓ JSON valid" || echo "✗ JSON invalid"
```

Expected output: `✓ JSON valid`

- [ ] **Step 5: Verify no unintended changes**

```bash
diff hooks/hooks.json.bak hooks/hooks.json | head -50
```

Expected: Only curl commands replaced with `bin/send-hook.sh`, SessionStart kept, other structure unchanged

- [ ] **Step 6: Commit**

```bash
git add hooks/hooks.json && git commit -m "refactor: replace hardcoded curl with config-aware bin/send-hook.sh"
```

---

### Task 2: Extend `commands/claude-live.md` — Add Config Subcommands

**Files:**
- Modify: `commands/claude-live.md`

- [ ] **Step 1: Update allowed-tools permissions**

Update line 2 of `commands/claude-live.md`. Currently:
```
allowed-tools: Bash(pkill:*), Bash(curl:*), Bash(npx:*), Bash(ps:*), Bash(tail:*)
```

Change to:
```
allowed-tools: Bash(pkill:*), Bash(curl:*), Bash(npx:*), Bash(ps:*), Bash(tail:*), Bash(grep:*), Bash(sed:*), Bash(mkdir:*), Bash(rm:*), Bash(cat:*)
```

This grants the command permission to use grep (URL extraction), sed (string manipulation), mkdir (create config dir), rm (delete config), and cat (verify files).

- [ ] **Step 2: Read current command structure**

Review current `commands/claude-live.md` to understand:
- Allowed tools and permissions (just updated)
- Subcommand structure (status, start, stop, restart, logs)
- How to add new functionality

- [ ] **Step 3: Extend subcommands list**

Update the "Subcommands" section to include config management:

Current (lines ~10-16):
```markdown
## Subcommands

- **no argument / status**: Run the status checks below and display results
- **stop**: Run `pkill -f "node.*claude-live"` and confirm stopped
- **start**: Start with `npx claude-live@latest >/tmp/claude-live.log 2>&1 &`, wait 1s, then show status
- **restart**: Stop then start
- **logs**: Show `tail -30 /tmp/claude-live.log`
```

Add after (before Status output section):
```markdown
- **config**: Display current endpoint URL (shows which config source is active)
- **config `<url>`**: Set global endpoint URL, auto-create `~/.config/claude-live/` if needed
- **config reset**: Reset to default endpoint (`http://localhost:43451`), delete global config file
```

- [ ] **Step 4: Add Config Management section**

Add new section after Status output:

```markdown
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
```

- [ ] **Step 5: Implement config subcommand logic in command handler**

The command receives `$ARGUMENTS` (user input). Parse and implement:

```bash
# Parse subcommand
case "$ARGUMENTS" in
  ""|"status")
    # Show server status (existing behavior)
    ;;
  "start")
    # Start server (existing behavior)
    ;;
  "stop")
    # Stop server (existing behavior)
    ;;
  "restart")
    # Restart server (existing behavior)
    ;;
  "logs")
    # Show logs (existing behavior)
    ;;
  "config")
    # Display current URL
    # Implement: Show which config source is active + URL
    # Read precedence: env var > project config > global config > default
    ;;
  "config reset")
    # Reset to default
    # Implement: Delete ~/.config/claude-live/config.json
    # Show confirmation
    ;;
  "config "*)
    # Set global URL
    # Extract URL from arguments
    # Validate: Must start with http:// or https://
    # Create: ~/.config/claude-live/ if needed
    # Write: ~/.config/claude-live/config.json
    # Show: confirmation or error
    ;;
esac
```

**Implementation details:**

For config display:
```bash
URL_SOURCE="default (localhost:43451)"
if [ -n "$CLAUDE_LIVE_URL" ]; then
  URL="$CLAUDE_LIVE_URL"
  URL_SOURCE="from environment (CLAUDE_LIVE_URL)"
elif [ -f ".claude/claude-live.json" ]; then
  URL=$(grep -o '"url" *: *"[^"]*"' .claude/claude-live.json | head -1 | sed 's/.*: *"//;s/"//')
  [ -n "$URL" ] && URL_SOURCE="from project config (.claude/claude-live.json)"
elif [ -f "$HOME/.config/claude-live/config.json" ]; then
  URL=$(grep -o '"url" *: *"[^"]*"' "$HOME/.config/claude-live/config.json" | head -1 | sed 's/.*: *"//;s/"//')
  [ -n "$URL" ] && URL_SOURCE="from global config (~/.config/claude-live/config.json)"
fi
URL="${URL:-http://localhost:43451}"
echo "● Configured: $URL ($URL_SOURCE)"
```

For config set:
```bash
NEW_URL="${ARGUMENTS#config }"  # Remove "config " prefix
# Validate
if ! echo "$NEW_URL" | grep -q '^https\?://'; then
  echo "✗ Invalid URL format: must start with http:// or https://"
  exit 1
fi
# Create directory
mkdir -p "$HOME/.config/claude-live/" || {
  echo "✗ Failed to create ~/.config/claude-live/ directory"
  exit 1
}
# Write config
cat > "$HOME/.config/claude-live/config.json" <<EOF || {
  echo "✗ Failed to write config file"
  exit 1
}
{
  "url": "$NEW_URL"
}
EOF
echo "✓ URL set to $NEW_URL"
```

For config reset:
```bash
rm -f "$HOME/.config/claude-live/config.json"
echo "✓ Reset to default (localhost:43451)"
```

- [ ] **Step 6: Test config display (no config set)**

```bash
/claude-live config
```

Expected output: `● Configured: http://localhost:43451 (default)`

- [ ] **Step 7: Test config set with valid URL**

```bash
/claude-live config http://192.168.1.50:43451
```

Expected output: `✓ URL set to http://192.168.1.50:43451`

Then verify:
```bash
cat ~/.config/claude-live/config.json
```

Expected: `{"url": "http://192.168.1.50:43451"}`

- [ ] **Step 8: Test config display after set**

```bash
/claude-live config
```

Expected output: `● Configured: http://192.168.1.50:43451 (from global config (~/.config/claude-live/config.json))`

- [ ] **Step 9: Test config set with invalid URL**

```bash
/claude-live config invalid-url
```

Expected output: `✗ Invalid URL format: must start with http:// or https://`

Config file should NOT change.

- [ ] **Step 10: Test config reset**

```bash
/claude-live config reset
```

Expected output: `✓ Reset to default (localhost:43451)`

Verify file is deleted:
```bash
test -f ~/.config/claude-live/config.json && echo "✗ File exists" || echo "✓ File deleted"
```

Expected: `✓ File deleted`

Then verify:
```bash
/claude-live config
```

Expected output: `● Configured: http://localhost:43451 (default (localhost:43451))`

- [ ] **Step 11: Test env var precedence**

```bash
export CLAUDE_LIVE_URL="http://env-override:43451"
/claude-live config
```

Expected output: `● Configured: http://env-override:43451 (from environment (CLAUDE_LIVE_URL))`

Reset env var:
```bash
unset CLAUDE_LIVE_URL
```

- [ ] **Step 12: Test project config precedence**

```bash
mkdir -p .claude
echo '{"url": "http://project:43451"}' > .claude/claude-live.json
/claude-live config
```

Expected output: `● Configured: http://project:43451 (from project config (.claude/claude-live.json))`

Clean up:
```bash
rm -rf .claude
```

- [ ] **Step 13: Commit**

```bash
git add commands/claude-live.md && git commit -m "feat: add /claude-live config subcommands for endpoint configuration"
```

---

### Task 3: Integration Test — Hook Forwarding

**Objective:** Verify hooks forward to configured URL instead of hardcoded localhost

- [ ] **Step 1: Start claude-live server on localhost**

```bash
/claude-live start
sleep 2
/claude-live status
```

Expected: Server running on localhost:43451

- [ ] **Step 2: Verify hook forwarding to localhost works**

Run any command that triggers a hook (e.g., a tool use). Check logs:

```bash
/claude-live logs | tail -10
```

Expected: See recent events logged from localhost events

- [ ] **Step 3: Configure remote URL**

```bash
/claude-live config http://192.168.1.50:43451
```

Expected: `✓ URL set to http://192.168.1.50:43451`

- [ ] **Step 4: Verify hooks now forward to configured URL**

Trigger a hook (tool use). The hook should try to POST to the configured URL. Since it doesn't exist, it should fail silently (per design), but we can verify the attempt by:

- Check that `bin/send-hook.sh` is being called (not the old hardcoded curl)
- Examine hooks.json to confirm replacement happened

```bash
grep -c "bin/send-hook.sh" hooks/hooks.json
```

Expected: Should show count > 13 (multiple hooks updated)

- [ ] **Step 5: Reset config**

```bash
/claude-live config reset
/claude-live config
```

Expected: Back to default (localhost:43451)

- [ ] **Step 6: Verify backward compatibility**

Stop and restart server:

```bash
/claude-live restart
```

Expected: Server restarts normally; hooks work with default localhost

---

### Task 4: Verification Checklist

- [ ] **Step 1: Verify all files changed as expected**

```bash
git diff HEAD~2 HEAD --stat
```

Expected output shows:
- `hooks/hooks.json` modified
- `commands/claude-live.md` modified

- [ ] **Step 2: Verify JSON syntax**

```bash
python3 -m json.tool hooks/hooks.json > /dev/null && echo "✓ hooks.json valid"
```

- [ ] **Step 3: Verify config command exists and responds**

```bash
/claude-live config
```

Expected: Shows current URL without error

- [ ] **Step 4: Verify hook wrapper exists**

```bash
test -x bin/send-hook.sh && echo "✓ bin/send-hook.sh is executable"
```

- [ ] **Step 5: Run git status and verify clean state**

```bash
git status
```

Expected: No untracked files, clean working tree (after cleanup of test files)

---

## Testing Strategy

**Manual integration testing** (automated testing not practical for this feature):

1. Config display/set/reset cycle
2. Precedence testing (env var > project > global > default)
3. Hook forwarding verification
4. Error handling (invalid URLs, permission errors)
5. SessionStart health check still works (auto-start on localhost)

**Success criteria:**

- ✓ `/claude-live config` displays current URL
- ✓ `/claude-live config <url>` sets and persists URL
- ✓ `/claude-live config reset` clears config
- ✓ Config precedence respected: env var > project > global > default
- ✓ Hooks forward events to configured URL (via `bin/send-hook.sh`)
- ✓ SessionStart health check still auto-starts server on localhost
- ✓ Invalid URLs rejected with clear error message
- ✓ Config directory auto-created if needed

---

## Commits Summary

Expected commits (in order):
1. `refactor: replace hardcoded curl with config-aware bin/send-hook.sh`
2. `feat: add /claude-live config subcommands for endpoint configuration`

Total changes:
- `hooks/hooks.json`: 15 curl commands replaced with `bin/send-hook.sh` (SessionStart 2nd command + 14 other hooks)
- `commands/claude-live.md`: ~5 lines for allowed-tools + ~60 lines for config subcommands + implementation logic
