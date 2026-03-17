# claude-live

Realtime animated visualization of Claude Code activity. Watch files being read, edited, searched — rendered as a living force-directed graph.

## Quick Start

```bash
npx claude-live
```

Then add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":   [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "PostToolUse":  [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "Stop":         [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}],
    "Notification": [{"matcher":"","hooks":[{"type":"command","command":"echo \"$CLAUDE_HOOK_DATA\" | curl -s -X POST http://localhost:3141/hook -H 'Content-Type: application/json' -d @- || true"}]}]
  }
}
```

Start a Claude Code session — the graph comes alive.

## Dev Mode

```bash
git clone <repo>
cd claude-live
npm install
npm run dev
```

Open http://localhost:5173

## Custom Port

```bash
npx claude-live --port=4000
```

Update your hook URLs to match.

## What You See

- **Green nodes** = files being read
- **Blue nodes** = files being edited
- **Amber nodes** = bash commands
- **Purple nodes** = grep/glob searches
- **Pink nodes** = web fetches
- **Clusters** = separate Claude Code sessions
- **Ripples** = each event as it fires
- Nodes fade as they age (last 100 events shown)

## Requirements

- Node.js 18+
- `curl` (for the hook command)
