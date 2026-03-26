# claude-live

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity as an orbital solar system.

![claude-live demo](claude-live-demo.gif)

**[Try the demo](https://marisancans.github.io/claude-live/)** (no install needed)

## Install

```bash
claude plugin marketplace add marisancans/claude-live
```

That's it. Events are recorded automatically in the background as you work.

## Use

```bash
# View the visualization whenever you want
claude-live start
```

## How It Works

Sessions appear as star systems. Files orbit as planets -- the more a file is touched, the larger it grows. Tool calls animate between nodes:

- **Read / Grep / Glob** -- scanner at the file, data streams back to core
- **Edit / Write** -- ink beam fires from core to file
- **Bash** -- terminal window appears at the node
- **Subagents** -- satellite systems tethered to their parent

Multiple Claude sessions show as separate star systems. Prompts fly inward, responses fly outward. Context compaction triggers an implosion/rebirth effect.

Under the hood: the plugin writes every event to a local SQLite database (~5ms per write, no server needed). When you run `claude-live start`, a lightweight Rust server polls the database and streams events to a PixiJS frontend via WebSocket.

## CLI

```bash
claude-live start       # Open visualization in browser
claude-live stop        # Stop the server
claude-live status      # Show server + database stats
claude-live share       # Share via Cloudflare tunnel
claude-live update      # Self-update
```

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
cd client && npm install && cd ..

cargo run -- start              # Rust server on :43451
cd client && npm run dev        # Vite hot-reload on :5173
cargo test                      # Run tests
```

## License

MIT
