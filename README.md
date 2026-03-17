# claude-live

Realtime solar system visualization of Claude Code activity. Files orbit as planets, operations fire directional lasers, sessions glow as separate star systems.

## Install as Plugin (Recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. Open `http://localhost:43451` during a Claude Code session.

## Manual Setup

Start the server:

```bash
npx claude-live
```

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":         [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PostToolUse":        [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Stop":               [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Notification":       [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PermissionRequest":  [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}]
  }
}
```

Open `http://localhost:43451` and start a Claude Code session.

## What You See

- **File nodes** orbit their session's star at fixed radii — touched files grow slightly with each interaction
- **Directional lasers**: Read/Grep/Glob fire planet→core (inbound scan), Edit/Write/Bash fire core→planet (outbound write)
- **8 distinct effects**: reticle (Read), radar (Grep), dots (Glob), ink (Edit), burst (Write), lightning (Bash), wave (WebFetch), rings (Notification)
- **Amber core + tether line** = agent/subagent session spawned from a parent
- **Spinning amber ring** on core = session awaiting permission / user input
- **Multiple clusters** = parallel Claude Code sessions, spaced dynamically

## Dev Mode

```bash
git clone git@github.com:marisancans/claude-live.git
cd claude-live
npm install
npm run dev
```

Client: `http://localhost:5173` — Server: `http://localhost:43451`

## Requirements

- Node.js 18+
- `curl`
