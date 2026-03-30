# claude-live

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity as an orbital solar system.

![claude-live demo](claude-live-demo.gif)

**[Try the demo](https://marisancans.github.io/claude-live/)** (no install needed)

## Install

### Via Claude plugin marketplace (recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. Events stream in the background as you work.

### Via npm (manual setup)

```bash
npm install -g claude-live
```

Then add hooks to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{ "hooks": [{ "type": "command", "command": "node $(npm root -g)/claude-live/bin/hook.js", "async": true }] }],
    "PostToolUse": [{ "hooks": [{ "type": "command", "command": "node $(npm root -g)/claude-live/bin/hook.js", "async": true }] }]
  }
}
```

Run `npm root -g` to find your global node_modules path if the above doesn't work on your shell.

## Use

Once installed, use the `/claude-live:server` slash command in Claude Code:

```
/claude-live:server          # Check status, auto-start if needed
/claude-live:server stop     # Stop the server
/claude-live:server restart  # Restart the server
/claude-live:server logs     # Show last 30 log lines
/claude-live:server config   # Show current endpoint URL
/claude-live:server config http://192.168.1.50:43451  # Set remote endpoint
/claude-live:server config reset  # Reset to localhost default
```

Then open http://localhost:43451 in your browser.

## How It Works

Sessions appear as star systems. Files orbit as planets -- the more a file is touched, the larger it grows. Tool calls animate between nodes:

- **Read / Grep / Glob** -- scanner at the file, data streams back to core
- **Edit / Write** -- ink beam fires from core to file
- **Bash** -- terminal window appears at the node
- **Subagents** -- satellite systems tethered to their parent

Multiple Claude sessions show as separate star systems. Prompts fly inward, responses fly outward. Context compaction triggers an implosion/rebirth effect.

Under the hood: the plugin sends every event to a lightweight Node.js server (pure passthrough, no persistence). The server broadcasts events to a PixiJS frontend via Server-Sent Events (SSE).

## Server Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/hook` | POST | Receive hook events, broadcast to SSE clients |
| `/events` | GET | SSE stream for the frontend |
| `/health` | GET | Health check — returns `{"ok":true,"clients":<N>,"port":43451}` |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No activity in browser | Hooks not firing | Run `/reload-plugins` or check `settings.json` hooks |
| Server not reachable | Server not running | `/claude-live:server` auto-starts it |
| `clients: 0` in `/health` | Server up, no browser tab open | Open `http://localhost:43451` |
| Hook logs location | Debug delivery failures | `~/.config/claude-live/logs/YYYY-MM-DD.jsonl` |

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
npm install

node server/index.js            # Node.js server on :43451
cd client && npm run dev        # Vite hot-reload on :7979
cd client && npx tsc --noEmit   # Type check frontend
```

## License

MIT
