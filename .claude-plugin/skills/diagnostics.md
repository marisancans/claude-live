---
name: diagnostics
description: Show claude-live hook health — recent log entries, success/failure rates per target, and last errors
trigger: explicit
---

Show a diagnostics report for claude-live hooks.

## Log location

Logs are written to `~/.config/claude-live/logs/YYYY-MM-DD.jsonl` — one JSON line per hook fire.

## Steps

1. Read today's log file: `~/.config/claude-live/logs/<today>.jsonl`
   - If it doesn't exist, also try yesterday's
   - If no logs exist at all, report: "No hook logs found — hooks may not be firing"

2. Parse each line as JSON with fields: `ts`, `session_id`, `hook_event_name`, `tool_name`, `targets[]`
   - Each target entry has: `url`, `ok` (bool), `ms`, optionally `error`

3. Report:

```
claude-live diagnostics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Log: ~/.config/claude-live/logs/<date>.jsonl
Entries: <N> hooks fired

Targets:
  http://localhost:43451   ✓ 142/150  (94%)  avg 3ms
  http://192.168.1.50:43451  ✗ 0/150   (0%)  — connection_error

Last 5 entries:
  14:23:01  PreToolUse    Bash         ✓ 2ms
  14:23:00  PreToolUse    Read         ✓ 3ms
  14:22:58  PostToolUse   Bash         ✓ 2ms
  ...

Recent errors (if any):
  14:20:11  PostToolUse  Bash  http://192.168.1.50:43451  connection_error
```

4. If all targets are failing: suggest running `/claude-live start` or checking `/claude-live status`
5. If no log file: suggest the user check that the plugin is enabled with `/reload-plugins`

Use the Read tool to read the log file and Bash for `date` if needed. Keep output compact.
