# claude-live

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity as an orbital solar system.

![claude-live demo](claude-live-demo.gif)

**[Try the demo](https://marisancans.github.io/claude-live/)** (no install needed)

## Install

```bash
claude plugin marketplace add marisancans/claude-live
```

That's it. Events stream automatically in the background as you work.

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

Under the hood: the plugin sends every event to a lightweight Node.js server (pure passthrough, no persistence). The server broadcasts events to a PixiJS frontend via Server-Sent Events (SSE).

## CLI

```bash
claude-live start       # Open visualization in browser
claude-live stop        # Stop the server
claude-live status      # Show server status
```

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
