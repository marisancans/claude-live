# claude-live

**[Try the live demo](https://marisancans.github.io/claude-live/)** — no install needed

![claude-live demo](claude-live-demo.gif)

Real-time visualization of Claude Code activity as a 3D orbital system.

## Install

### Claude Code Marketplace (recommended)

Search for **claude-live** in the Claude Code marketplace, or run inside Claude Code:

```
/plugins install marisancans/claude-live
```

This gives you the `/claude-live:server` slash command to manage the server from within Claude Code.

### npm (standalone)

```bash
npm install -g claude-live
```

## Use

```bash
claude-live          # Start server (foreground)
claude-live start    # Start server in background
```

Open http://localhost:43451 in your browser. Sessions appear automatically as you use Claude Code.

With the plugin installed, manage the server from inside Claude Code:

```
/claude-live:server          # Check status, auto-start if needed
/claude-live:server stop     # Stop the server
/claude-live:server restart  # Restart the server
/claude-live:server logs     # Show last 30 log lines
```

## How It Works

The server watches Claude Code's session transcript files (`~/.claude/projects/`) and tails them in real time. No hooks or additional configuration required.

Each Claude Code session appears as an orbiting star system. Every tool call creates a node — the more events a session generates, the larger it grows. Multiple sessions show as separate star systems. Prompts pulse outward, context compaction triggers an implosion/rebirth effect.

## Server Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/hook` | POST | Receive hook events (legacy/plugin), broadcast to SSE clients |
| `/events` | GET | SSE stream for the frontend |
| `/health` | GET | Health check — returns `{"ok":true,"version":"X.Y.Z","clients":<N>,"port":43451}` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| No activity in browser | Make sure Claude Code is running, check `~/.claude/projects/` has `.jsonl` files |
| Server not reachable | Run `claude-live` to start it |
| `clients: 0` in `/health` | Open http://localhost:43451 in your browser |

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
npm install

node server/index.js            # Node.js server on :43451
cd client && npm run dev        # Vite hot-reload on :7979
cd client && npx tsc --noEmit   # Type check frontend
npm run test:server             # Run server tests
```

## License

MIT
