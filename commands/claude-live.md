---
allowed-tools: Bash(pkill:*), Bash(curl:*), Bash(npx:*), Bash(ps:*), Bash(tail:*)
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

## Status output (default and after start)

Run these and display in a compact summary:

```
curl -sf http://localhost:43451/buffer >/dev/null 2>&1 && echo "● running on port 43451 — http://localhost:43451" || echo "○ stopped"
ps -eo pid,etime,cmd | grep "node.*claude-live" | grep -v grep
tail -5 /tmp/claude-live.log 2>/dev/null
```

Show: running/stopped, port (always 43451), PID and uptime if running, last 5 log lines.
