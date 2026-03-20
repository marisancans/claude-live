# claude-live

### **[▶ Live Demo](https://marisancans.github.io/claude-live/)**

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity. Watch your coding sessions come alive as an orbital solar system — files orbit as planets, tool calls fire as directional lasers, and parallel sessions glow as separate star systems.

<p align="center">

<!-- TODO: Replace with actual recording -->
<!-- Use: asciinema, vhs (https://github.com/charmbracelet/vhs), or screen recording -->
<!-- Recommended: 80x24 terminal + browser side-by-side, ~30s showing a real coding session -->

![claude-live demo](https://via.placeholder.com/800x450.png?text=Demo+GIF+—+see+CONTRIBUTING.md+for+recording+instructions)

**[Install](#install)** · **[How It Works](#how-it-works)**

</p>

---

## What Is This?

Every time Claude Code reads a file, runs a command, or edits code, `claude-live` captures that event and renders it in real time:

- **Sessions** appear as glowing star systems — each Claude Code session gets its own orbital cluster
- **Files** orbit their session's core as planets. The more a file is touched, the larger it grows
- **Tool calls** fire as animated projectiles between the core and file nodes:
  - `Read` / `Grep` / `Glob` → scanner animation at the file, then data packets stream back to core
  - `Edit` / `Write` → ink beam fires from core to file
  - `Bash` → mini terminal window appears at the target node
  - `WebFetch` → wave pulse radiates outward
- **Prompts** fly in from outside the viewport toward the session core
- **Responses** stream outward from the core and fly off-screen
- **Compaction** triggers a gravitational collapse (implosion) followed by a rebirth explosion
- **Subagents** spawn as satellite nodes tethered to their parent session

Multiple Claude Code sessions (even across different projects) appear as separate star systems, dynamically spaced.

## Live Demo

A simulated demo runs on GitHub Pages with synthetic events — no server needed:

**https://marisancans.github.io/claude-live/**

## Install

### Plugin Marketplace (Recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. Open `http://localhost:43451` during a Claude Code session.

### Homebrew (macOS / Linux)

```bash
brew install marisancans/tap/claude-live
```

### Cargo

```bash
cargo install claude-live
```

### Direct Download

```bash
curl -sSfL https://github.com/marisancans/claude-live/releases/latest/download/install.sh | sh
```

## Quick Start

```bash
# 1. Start the visualization server
claude-live start

# 2. Use Claude Code normally — events flow automatically
claude "refactor the auth module"

# 3. Open http://localhost:43451 in your browser
```

That's it. If you installed via the plugin marketplace, hooks are already wired. Otherwise, see [Manual Hook Setup](#manual-hook-setup).

## How It Works

```
┌──────────────┐     POST /hook      ┌──────────────┐    WebSocket     ┌──────────────┐
│  Claude Code  │ ──────────────────▶ │  claude-live  │ ──────────────▶ │   Browser     │
│  (hooks)      │   JSON events       │  (Rust server)│   real-time     │  (PixiJS v8)  │
└──────────────┘                      └──────────────┘                  └──────────────┘
```

1. **Claude Code hooks** fire on every tool use, sending a JSON payload to the local server
2. **Rust server** (axum + tokio) normalizes events, manages session state, and fans out to WebSocket clients
3. **Browser** (React + PixiJS v8) renders the orbital visualization with GPU-accelerated animations

The entire server is a single static binary (~25MB) with the frontend embedded. No Node.js, no npm, no runtime dependencies.

## Usage

```bash
# Start with defaults (port 43451, localhost only)
claude-live start

# Custom port + LAN access
claude-live start --port 8080 --bind 0.0.0.0

# Require authentication
claude-live start --token mysecret

# Share with teammates via Cloudflare tunnel
claude-live share
```

## CLI Reference

| Command | Description |
|---------|-------------|
| `start` | Start server (foreground) |
| `stop` | Stop running server |
| `status` | Show server status |
| `sessions` | List active sessions |
| `health` | Detailed diagnostics |
| `reset` | Clear all session buffers |
| `inject <file>` | Feed test events from JSON file |
| `record -o <file>` | Record events to SQLite file |
| `replay <file>` | Replay recorded events |
| `update` | Self-update from GitHub releases |
| `share` | Share via Cloudflare tunnel |
| `version` | Show version info |

### Start Options

| Flag | Default | Description |
|------|---------|-------------|
| `--port` | `43451` | Server port |
| `--bind` | `127.0.0.1` | Bind address (`0.0.0.0` for LAN) |
| `--token` | — | Require auth token |
| `--buffer-size` | `50` | Events per session buffer |
| `--session-timeout` | `660` | Session timeout (seconds) |

## Manual Hook Setup

If not using the plugin marketplace, add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":        [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PostToolUse":       [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Stop":              [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "Notification":      [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "UserPromptSubmit":  [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PreCompact":        [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PostCompact":       [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "SessionStart":      [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "SubagentStart":     [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "SubagentStop":      [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}],
    "PermissionRequest": [{"hooks":[{"type":"command","command":"curl -sf -X POST http://localhost:43451/hook -H 'Content-Type: application/json' -d @- 2>/dev/null || true","async":true}]}]
  }
}
```

## Visualization Guide

| Visual | Meaning |
|--------|---------|
| Orbiting circle | File node (Read/Edit/Write/Grep/Glob target) |
| Spinning dashed ring | Agent / subagent node |
| Diamond shape | Ephemeral node (Bash, WebFetch, Stop, Notification) |
| Green scanner → core | Read / Grep / Glob (data flowing in) |
| Blue ink beam → node | Edit / Write (changes flowing out) |
| Orange terminal | Bash command executing |
| Amber core ring | Session awaiting permission / user input |
| Tether line | Parent → child session link |
| Implosion + explosion | Context compaction (PreCompact → PostCompact) |
| Words flying inward | User prompt submitted |
| Words flying outward | Agent response |

## Remote Access

```bash
# LAN — other machines on your network can watch
claude-live start --bind 0.0.0.0 --token myteamtoken

# Internet — share via Cloudflare tunnel (requires cloudflared)
claude-live share
```

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live

# Install frontend deps
cd client && npm install && cd ..

# Run Rust server (serves embedded frontend from client/dist/)
cargo run -- start

# Frontend hot-reload dev mode
cd client && npm run dev    # Vite on :7979, proxies to :43451
```

### Architecture

```
├── src/                    # Rust backend
│   ├── main.rs             # CLI (clap) + entry point
│   ├── server.rs           # Axum HTTP/WS router
│   ├── websocket.rs        # WebSocket handler
│   ├── hook.rs             # POST /hook event ingestion
│   ├── normalize.rs        # Raw → normalized event
│   ├── snapshot.rs         # Session snapshot for new clients
│   ├── session.rs          # Session manager + rolling buffers
│   ├── broadcast.rs        # WebSocket fan-out
│   ├── storage.rs          # SQLite record/replay
│   ├── update.rs           # Self-update from GitHub
│   └── share.rs            # Cloudflare tunnel
├── client/src/             # Frontend (React + PixiJS v8)
│   ├── App.tsx             # React root, WebSocket, HUD
│   ├── store.ts            # State management (FIFO node eviction)
│   ├── canvas-pixi/        # PixiJS rendering
│   │   ├── PixiApp.ts      # Application bootstrap
│   │   ├── PixiScene.tsx   # React ↔ PixiJS bridge
│   │   ├── layers/         # World, Edge, Background layers
│   │   ├── objects/        # Cluster, Node visual objects
│   │   ├── effects/        # Projectiles, snakes, compaction FX
│   │   ├── animation/      # Camera controller, animation manager
│   │   └── shaders/        # Custom GPU shaders
│   ├── events/             # EventBus + EventProcessor
│   ├── simulation/         # Orbital physics
│   └── constants.ts        # Single source of truth for radii/capacities
└── tests/                  # Rust integration + unit tests
```

### Testing

```bash
# Rust tests (32 tests)
cargo test

# Frontend typecheck
cd client && npx tsc --noEmit

# Inject test events
claude-live inject test-events.json
```

## Updating

```bash
# Self-update (downloads latest from GitHub releases)
claude-live update

# Or via package manager
brew upgrade claude-live
cargo install claude-live
```

## License

MIT
