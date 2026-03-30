# claude-live

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity as an orbital solar system.

![claude-live demo](claude-live-demo.gif)

**[Try the demo](https://marisancans.github.io/claude-live/)** (no install needed)

## Install

```bash
npm install -g claude-live
```

No additional configuration needed. The server automatically detects active Claude Code sessions by watching `~/.claude/projects/`.

## Use

```bash
claude-live          # Start server (foreground)
claude-live start    # Start server in background
```

Open http://localhost:43451 in your browser. Sessions appear automatically as you use Claude Code.

If you have the plugin installed, you can also use the slash command inside Claude Code:

```
/claude-live:server          # Check status, auto-start if needed
/claude-live:server stop     # Stop the server
/claude-live:server restart  # Restart the server
/claude-live:server logs     # Show last 30 log lines
```

## How It Works

The server watches Claude Code's session transcript files (`~/.claude/projects/`) and tails them in real time. No hooks or additional configuration required.

Sessions appear as star systems. Files orbit as planets -- the more a file is touched, the larger it grows. Tool calls animate between nodes:

- **Read / Grep / Glob** -- scanner at the file, data streams back to core
- **Edit / Write** -- ink beam fires from core to file
- **Bash** -- terminal window appears at the node
- **Subagents** -- satellite systems tethered to their parent

Multiple Claude sessions show as separate star systems. Prompts fly inward, responses fly outward. Context compaction triggers an implosion/rebirth effect.

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
