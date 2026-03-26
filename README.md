# claude-live

### **[Live Demo](https://marisancans.github.io/claude-live/)**

Real-time visualization of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) activity. Watch your coding sessions come alive as an orbital solar system -- files orbit as planets, tool calls fire as directional lasers, and parallel sessions glow as separate star systems.

<p align="center">

<video src="https://github.com/marisancans/claude-live/raw/main/claude-live-demo.mp4" autoplay loop muted playsinline width="100%"></video>

**[Install](#install)** | **[How It Works](#how-it-works)**

</p>

---

## What Is This?

Every time Claude Code reads a file, runs a command, or edits code, `claude-live` captures that event and renders it in real time:

- **Sessions** appear as glowing star systems -- each Claude Code session gets its own orbital cluster
- **Files** orbit their session's core as planets. The more a file is touched, the larger it grows
- **Tool calls** fire as animated projectiles between the core and file nodes:
  - `Read` / `Grep` / `Glob` -- scanner animation at the file, then data packets stream back to core
  - `Edit` / `Write` -- ink beam fires from core to file
  - `Bash` -- mini terminal window appears at the target node
  - `WebFetch` -- wave pulse radiates outward
- **Prompts** fly in from outside the viewport toward the session core
- **Responses** stream outward from the core and fly off-screen
- **Compaction** triggers a gravitational collapse (implosion) followed by a rebirth explosion
- **Subagents** spawn as satellite nodes tethered to their parent session

Multiple Claude Code sessions (even across different projects) appear as separate star systems, dynamically spaced.

## Live Demo

A simulated demo runs on GitHub Pages with synthetic events -- no server needed:

**https://marisancans.github.io/claude-live/**

## Install

### Plugin Marketplace (Recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. All events are recorded to a local SQLite database. Run `claude-live start` whenever you want to view the visualization.

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
# 1. Use Claude Code normally -- events are recorded automatically via hooks
claude "refactor the auth module"

# 2. Open the visualization whenever you want
claude-live start
```

That's it. If you installed via the plugin marketplace, hooks are already wired. Otherwise, see [Manual Hook Setup](#manual-hook-setup).

## How It Works

```
                                    SQLite DB
                                 (~/.local/share/
                                  claude-live/events.db)

Claude Code hooks ──► hook-wrapper.sh ──► claude-live hook ──► [SQLite write]
                       (detects OS/arch,                         │
                        execs binary)                            │ polls every 100ms
                                                                 ▼
                                              claude-live start ──► Browser (PixiJS v8)
                                              (reads DB, serves     via WebSocket
                                               frontend from disk)
```

1. **Claude Code hooks** fire on every tool use. The hook wrapper script detects your platform and execs the right binary
2. **`claude-live hook`** reads the JSON event from stdin, normalizes it, and writes it to a local SQLite database. No server needed -- this runs in ~5ms and exits
3. **`claude-live start`** (run whenever you want to look) starts a local server that polls the database for new events and pushes them to the browser via WebSocket
4. **Browser** (React + PixiJS v8) renders the orbital visualization with GPU-accelerated animations

### Key design decisions

- **No server required for event collection** -- hooks write directly to SQLite via the binary. Events accumulate whether or not you're watching
- **Single binary per platform** (~5MB) + shared frontend assets (~25MB). No Node.js, no npm, no curl, no runtime dependencies
- **Cross-platform** -- Linux (amd64/arm64), macOS (amd64/arm64), Windows (amd64)
- **SQLite WAL mode** enables concurrent writes from hooks and reads from the server without locking

## Usage

```bash
# Start the visualization (opens browser)
claude-live start

# Stop the server
claude-live stop

# Check server status and database stats
claude-live status

# Share with teammates via Cloudflare tunnel
claude-live share
```

## CLI Reference

| Command | Description |
|---------|-------------|
| `start [--static-dir PATH]` | Start visualization server, open browser |
| `stop` | Stop running server |
| `status` | Show server status + database stats |
| `stats` | Print database statistics as JSON |
| `hook [--db PATH]` | Receive event from stdin, write to database |
| `inject <file> [--db PATH]` | Feed test events from JSON file into database |
| `record -o <file> [--db PATH]` | Record live events to JSON file |
| `replay <file> [--speed N] [--db PATH]` | Replay recorded events into database |
| `update` | Self-update from GitHub releases |
| `share` | Share via Cloudflare tunnel |
| `version` | Show version info |

## Manual Hook Setup

If not using the plugin marketplace, add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse":        [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "PostToolUse":       [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "Stop":              [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "Notification":      [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "UserPromptSubmit":  [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "SessionStart":      [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "SessionEnd":        [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "SubagentStart":     [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "SubagentStop":      [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "PermissionRequest": [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "PreCompact":        [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}],
    "PostCompact":       [{"hooks":[{"type":"command","command":"/path/to/claude-live hook","async":true}]}]
  }
}
```

Replace `/path/to/claude-live` with the actual binary path for your platform.

## Visualization Guide

| Visual | Meaning |
|--------|---------|
| Orbiting circle | File node (Read/Edit/Write/Grep/Glob target) |
| Spinning dashed ring | Agent / subagent node |
| Diamond shape | Ephemeral node (Bash, WebFetch, Stop, Notification) |
| Green scanner to core | Read / Grep / Glob (data flowing in) |
| Blue ink beam to node | Edit / Write (changes flowing out) |
| Orange terminal | Bash command executing |
| Amber core ring | Session awaiting permission / user input |
| Tether line | Parent to child session link |
| Implosion + explosion | Context compaction (PreCompact to PostCompact) |
| Words flying inward | User prompt submitted |
| Words flying outward | Agent response |

## Remote Access

```bash
# Share via Cloudflare tunnel (requires cloudflared + server running)
claude-live start
claude-live share
```

## Development

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live

# Install frontend deps
cd client && npm install && cd ..

# Run Rust server (serves frontend from client/dist/)
cargo run -- start

# Frontend hot-reload dev mode
cd client && npm run dev    # Vite on :5173, proxies to :43451
```

### Architecture

```
├── src/                    # Rust backend
│   ├── main.rs             # CLI (clap) + entry point
│   ├── server.rs           # Axum router, ServeDir, DB polling, /api/stats
│   ├── websocket.rs        # WebSocket handler + heartbeat
│   ├── hook.rs             # POST /hook (also writes to SQLite)
│   ├── normalize.rs        # Raw event to normalized event
│   ├── storage.rs          # SQLite WAL, polling, snapshots, stats
│   ├── paths.rs            # Cross-platform data dir, pidfile utilities
│   ├── broadcast.rs        # WebSocket fan-out
│   ├── update.rs           # Self-update from GitHub releases
│   └── share.rs            # Cloudflare tunnel
├── client/src/             # Frontend (React + PixiJS v8)
│   ├── App.tsx             # React root, WebSocket, HUD
│   ├── StatsDialog.tsx     # Database stats dialog
│   ├── store.ts            # State management (FIFO node eviction)
│   ├── canvas-pixi/        # PixiJS rendering
│   │   ├── PixiApp.ts      # Application bootstrap
│   │   ├── PixiScene.tsx   # React <> PixiJS bridge
│   │   ├── layers/         # World, Edge, Background layers
│   │   ├── objects/        # Cluster, Node visual objects
│   │   ├── effects/        # Projectiles, snakes, compaction FX
│   │   ├── animation/      # Camera controller, animation manager
│   │   └── shaders/        # Custom GPU shaders
│   ├── events/             # EventBus + EventProcessor
│   └── constants.ts        # Single source of truth for radii/capacities
├── bin/
│   └── hook-wrapper.sh     # POSIX sh: detects OS/arch, execs right binary
├── .claude-plugin/         # Plugin marketplace config + hook definitions
└── tests/                  # Rust integration + unit tests
```

### Testing

```bash
# Rust tests
cargo test

# Frontend typecheck
cd client && npx tsc --noEmit

# Feed test events directly to database
claude-live inject test-events.json

# Or pipe a single event
echo '{"session_id":"test","hook_event_name":"PreToolUse","tool_name":"Read"}' | claude-live hook
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
