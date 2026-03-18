# Claude Live Config System Design

**Date:** 2026-03-18
**Author:** Claude Code
**Status:** Approved

## Overview

Add user-friendly configuration management for the claude-live visualizer endpoint URL. Users can set global (persistent across sessions) or project-level endpoints without manual file editing or environment variables.

## Problem

Currently, users must:
- Manually edit `~/.config/claude-live/config.json` or `.claude/claude-live.json`
- Set `CLAUDE_LIVE_URL` environment variables
- Discover these mechanisms on their own

This is not discoverable and has friction.

## Solution

**Three components:**

### 1. Wrapper Script (`bin/send-hook.sh`) — Already Implemented

The script already reads config with proper precedence:
1. Environment override: `CLAUDE_LIVE_URL` (highest priority)
2. Project-level: `.claude/claude-live.json`
3. Global: `~/.config/claude-live/config.json`
4. Default: `http://localhost:43451` (lowest priority)

No changes needed here.

### 2. Update `/hooks/hooks.json` (Root Hooks)

Update all hooks in the root `/hooks/hooks.json` (14 hook types) to call `bin/send-hook.sh` for event forwarding.

**Exception: SessionStart hook** has two commands:
1. Health check: `curl -sf http://localhost:43451/buffer >/dev/null 2>&1 || (npx claude-live@latest >/tmp/claude-live.log 2>&1 &)` — **KEEP AS-IS** (auto-starts server on localhost if not running)
2. Event forward: `curl -sf -X POST http://localhost:43451/hook ...` — **REPLACE WITH** `bin/send-hook.sh`

**For all other hooks** (InstructionsLoaded, WorktreeCreate, WorktreeRemove, PreToolUse, PostToolUse, Stop, Notification, PermissionRequest, SubagentStart, SubagentStop, SessionEnd, PostToolUseFailure, UserPromptSubmit, PreCompact, PostCompact):

Replace:
```json
"command": "curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true"
```

With:
```json
"command": "bin/send-hook.sh"
```

**Do not update** `/.claude-plugin/hooks/hooks.json` — that's a subset for plugin-only mode and inherits from the root version.

### 3. Extend `/claude-live` Command

Add new subcommands to the existing `commands/claude-live.md` command:

- **`/claude-live config`** — Display current URL (shows which config source is active: env var, project, global, or default)
- **`/claude-live config <url>`** — Set global URL, auto-create `~/.config/claude-live/` if needed, persist across sessions
- **`/claude-live config reset`** — Reset to `http://localhost:43451` (deletes global config file)

Command behavior:
- Auto-create `~/.config/claude-live/` directory if it doesn't exist
- Validate URL format before saving (must start with `http://` or `https://`)
  - Validation scope: URL must have a scheme (http/https) and a host. No DNS resolution required.
  - Valid examples: `http://example.com`, `http://192.168.1.50:9000`, `https://api.example.com:443`
  - Invalid examples: `localhost:43451` (no scheme), `http://` (no host)
- Provide feedback: `✓ URL set to http://my-remote:43451`
- On error: show descriptive message (e.g., "Invalid URL format" or "Failed to write config file")

## Data Flow

### Config Setting
1. User runs `/claude-live config http://my-remote:43451`
2. Command validates URL format
3. Command creates `~/.config/claude-live/` if needed
4. Command writes to `~/.config/claude-live/config.json`
5. Command shows confirmation: `✓ URL set to http://my-remote:43451`

### Hook Execution (Any Hook)
1. Claude Code session event occurs (e.g., SessionStart, PreToolUse)
2. Hook runs `bin/send-hook.sh` (or runs health-check curl for SessionStart's first hook)
3. `bin/send-hook.sh` reads config precedence:
   - Environment var `CLAUDE_LIVE_URL` (if set)
   - Project config `.claude/claude-live.json` (if exists)
   - Global config `~/.config/claude-live/config.json` (if exists)
   - Default: `http://localhost:43451`
4. `bin/send-hook.sh` POSTs event to configured URL
5. Hook succeeds silently (failures are ignored)

## Config File Format

Simple JSON for both global and project-level:

```json
{
  "url": "http://192.168.1.50:43451"
}
```

## Error Handling

### In `bin/send-hook.sh` (Wrapper Script)
- If config file is malformed JSON, silently fall back to default (localhost)
- Wrapper script always succeeds; curl failures are silent (per existing pattern)
- Use regex extraction `grep -o '"url" *: *"[^"]*"'` — tolerates minor JSON variations

### In `/claude-live config` Command
- **Invalid URL format** (no `http://` or `https://`): Show error, don't save
- **Config directory creation fails** (e.g., permission denied): Show error with path
- **Config file write fails** (e.g., permission denied): Show error with path
- **Config file is malformed**: Show warning, can still read via CLI
- **Config directory exists but is a file** (not a directory): Show error
- **~/.config/claude-live doesn't exist yet**: Auto-create it silently on first config write

## Testing

### Config Priority Tests
- Set global config, start new session, verify hook forwards to correct URL
- Set global config, set project config (`.claude/claude-live.json`), verify project config takes precedence
- Set project config, set env var (`CLAUDE_LIVE_URL`), verify env var takes precedence over project
- Run `/claude-live config reset`, verify default (localhost) is used in next session

### SessionStart Hook Tests
- With server not running: `/claude-live config http://192.168.1.50:43451`, then SessionStart hook
  - Verify health check still auto-starts local server (not affected by remote config)
  - Verify event forward goes to configured URL
- With server already running: `/claude-live config http://192.168.1.50:43451`, trigger SessionStart
  - Verify event forward goes to configured URL without stopping local server

### Config Command Tests
- `/claude-live config` with no config file set: Shows default (localhost:43451)
- `/claude-live config http://192.168.1.50:43451`: Sets global config, shows confirmation
- `/claude-live config` after setting: Shows the configured URL
- `/claude-live config reset`: Removes config file, `/claude-live config` shows default again
- `/claude-live config invalid-url`: Shows error, doesn't save
- `/claude-live config http://example.com`: Should accept valid URLs

### Config File Resilience Tests
- Malformed JSON in `~/.config/claude-live/config.json`: Wrapper script falls back to default
- Missing `url` key in config: Wrapper script falls back to default
- Empty config file: Wrapper script falls back to default
- Permission denied on config file read: Wrapper script falls back to default silently

## Files to Modify

1. `/hooks/hooks.json` — Update 13 hook types (all except SessionStart's first command):
   - Replace event-forwarding curl commands with `bin/send-hook.sh`
   - Keep SessionStart health-check curl command as-is (hardcoded localhost)
   - Updated hooks: InstructionsLoaded, WorktreeCreate, WorktreeRemove, PreToolUse, PostToolUse, Stop, Notification, PermissionRequest, SubagentStart, SubagentStop, SessionEnd, PostToolUseFailure, UserPromptSubmit, PreCompact, PostCompact

2. `commands/claude-live.md` — Extend existing command:
   - Add new subcommands: `config`, `config <url>`, `config reset`
   - Implement URL validation and config file management
   - Update description and subcommand list
   - Do NOT modify existing start/stop/logs/status functionality

## Special Note: SessionStart Health Check

The SessionStart hook has two commands:

**Command 1: Health Check** (stays hardcoded to localhost)
```sh
curl -sf http://localhost:43451/buffer >/dev/null 2>&1 || (npx claude-live@latest >/tmp/claude-live.log 2>&1 &)
```
This checks if the server is running on localhost and auto-starts it if not. This must stay hardcoded because:
- It serves the purpose of auto-starting the server only when pointing to localhost
- If pointing to a remote server, we don't want to auto-start a local instance
- The `start-server.sh` script already implements this precedence check

**Command 2: Event Forwarding** (replaced with `bin/send-hook.sh`)
```sh
curl -sf -X POST http://localhost:43451/hook ...  # OLD
bin/send-hook.sh                                    # NEW
```
This sends the SessionStart event to the configured URL.

## Success Criteria

- User can discover `/claude-live` as a discoverable command with config subcommands
- User can set/view/reset the endpoint URL without manual file editing
- Settings persist across sessions
- Project-level config can override global config
- Environment variable can override all file-based configs
- SessionStart health check auto-starts local server regardless of remote config
- All other hooks forward events to the configured URL
