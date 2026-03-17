---
allowed-tools: Bash(pkill:*), Bash(curl:*), Bash(npx:*), Bash(cat:*), Bash(ps:*)
description: Control and inspect the claude-live visualizer server
---

Manage the claude-live server based on the user's argument: $ARGUMENTS

## Subcommands

- **no argument / status**: Show a dashboard — is server running, port, uptime of process, last lines of /tmp/claude-live.log, URL
- **stop / kill**: Run `pkill -f "node.*claude-live"` and confirm
- **start**: Check `curl -sf http://localhost:43451/buffer`, start with `npx claude-live@latest >/tmp/claude-live.log 2>&1 &` if not running
- **restart**: Stop then start
- **logs**: Show last 30 lines of `/tmp/claude-live.log`
- **open**: Open `http://localhost:43451` in browser via `xdg-open` or `open`

## Status dashboard format (default)

Run these commands and display results in a compact block:
1. `curl -sf http://localhost:43451/buffer >/dev/null 2>&1 && echo "● running" || echo "○ stopped"`
2. `ps -eo pid,etime,cmd | grep "node.*claude-live" | grep -v grep`
3. `tail -5 /tmp/claude-live.log 2>/dev/null || echo "(no log)"`

Show: status, PID + uptime if running, last log lines, and the URL `http://localhost:43451`
