# claude-live

Realtime solar system visualization of Claude Code activity. Files orbit as planets, operations fire directional lasers, sessions glow as separate star systems.

## Install

### Plugin Marketplace (Recommended)

```bash
claude plugin marketplace add marisancans/claude-live
```

Hooks are configured automatically. Open `http://localhost:43451` during a Claude Code session.

### Homebrew (macOS/Linux)

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

## Usage

```bash
# Start the server (opens browser automatically)
claude-live start

# Start with custom port and LAN access
claude-live start --port 8080 --bind 0.0.0.0

# Start with authentication
claude-live start --token mysecret

# Check status
claude-live status

# List active sessions
claude-live sessions
```

### Manual Hook Setup

If not using the plugin marketplace, add to `~/.claude/settings.json`:

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

## What You See

- **File nodes** orbit their session's star at fixed radii — touched files grow slightly with each interaction
- **Directional lasers**: Read/Grep/Glob fire planet→core (inbound scan), Edit/Write/Bash fire core→planet (outbound write)
- **8 distinct effects**: reticle (Read), radar (Grep), dots (Glob), ink (Edit), burst (Write), lightning (Bash), wave (WebFetch), rings (Notification)
- **Amber core + tether line** = agent/subagent session spawned from a parent
- **Spinning amber ring** on core = session awaiting permission / user input
- **Multiple clusters** = parallel Claude Code sessions, spaced dynamically

## CLI Reference

| Command | Description |
|---------|-------------|
| `claude-live start` | Start server (foreground) |
| `claude-live stop` | Stop running server |
| `claude-live status` | Show server status |
| `claude-live sessions` | List active sessions |
| `claude-live health` | Detailed diagnostics |
| `claude-live reset` | Clear all session buffers |
| `claude-live inject <file>` | Inject events from JSON file |
| `claude-live record -o <file>` | Record events to file |
| `claude-live replay <file>` | Replay recorded events |
| `claude-live update` | Self-update from GitHub |
| `claude-live share` | Share via cloudflare tunnel |
| `claude-live version` | Show version info |

### Start Options

```
--port <PORT>           Server port (default: 43451)
--bind <ADDR>           Bind address (default: 127.0.0.1)
--token <SECRET>        Require auth token for connections
--buffer-size <N>       Events per session buffer (default: 50)
--session-timeout <S>   Session timeout in seconds (default: 660)
```

## Remote Access

Share your visualization with teammates:

```bash
# LAN access
claude-live start --bind 0.0.0.0 --token myteamtoken

# Internet access via Cloudflare tunnel
claude-live share
```

## Dev Mode

```bash
git clone https://github.com/marisancans/claude-live.git
cd claude-live
cd client && npm install && cd ..
cargo run -- start
```

Frontend dev (hot reload):
```bash
cd client && npm run dev    # Vite dev server on :5173
cargo run -- start          # Rust server on :43451
```

## Updating

```bash
# Self-update
claude-live update

# Homebrew
brew upgrade claude-live

# Cargo
cargo install claude-live
```
