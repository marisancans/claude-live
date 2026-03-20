# claude-live v1.0 — Rust Backend Rewrite

## Goal

Rewrite the Node.js Express backend in Rust and ship claude-live as a single static binary with embedded frontend assets. Add a full CLI, WebSocket transport, multi-user support, and CI/CD pipeline for cross-platform distribution.

## Architecture

```
claude-live (single Rust binary, ~5-10MB)
├── CLI layer (clap)
│   ├── start [--port 43451] [--bind 0.0.0.0] [--token <secret>]
│   ├── stop
│   ├── status / sessions / health
│   ├── inject <file.json>
│   ├── record -o <file.json> / replay <file.json> [--speed 2x]
│   ├── logs [--follow]
│   ├── update
│   ├── share (cloudflare tunnel wrapper)
│   ├── reset
│   └── version
├── HTTP server (axum + tokio)
│   ├── POST /hook (receives Claude Code events)
│   ├── GET /ws (WebSocket upgrade)
│   ├── GET /api/* (management endpoints for CLI commands)
│   ├── GET /* (serves embedded frontend assets)
│   └── middleware: optional token auth
├── Core engine
│   ├── SessionManager — event buffers (50 per session), 11min cleanup
│   ├── EventNormalizer — port of server/index.js normalizeEvent()
│   ├── SnapshotBuilder — port of computeSessionSnapshot(), nodeKeyFor(), nodeTypeFor(), labelFor(), TOOL_COLOR_HEX
│   └── Broadcaster — fan-out raw normalized events to all WebSocket clients (client builds graph)
├── Storage (rusqlite, always-on)
│   └── record/replay event persistence
└── Embedded assets (rust-embed)
    └── client/dist/* (Vite build output, gzip-compressed)
```

## Transport: SSE → WebSocket

Replace EventSource with a WebSocket connection at `/ws`. Benefits:
- Bidirectional (future: send commands from UI)
- Single connection for events + management messages
- Better reconnection semantics

Message format: JSON, same event shape as current SSE data. Server sends:
- `{"type": "event", "data": {...}}` — hook events
- `{"type": "snapshot", "data": {...}}` — initial state on connect
- `{"type": "heartbeat"}` — keepalive
- `{"type": "version_available", "version": "0.6.0"}` — update notification

## CLI Commands

### Server lifecycle
- `claude-live start` — start server (foreground by default, `--daemon` for background)
- `claude-live stop` — POST /api/stop to running server, graceful shutdown
- `claude-live status` — GET /api/status → running, pid, port, uptime, connected clients

### Session inspection
- `claude-live sessions` — GET /api/sessions → list active sessions
- `claude-live health` — GET /api/health → memory, buffer sizes, ws client count
- `claude-live reset` — POST /api/reset → clear all session buffers

### Debug toolkit
- `claude-live inject <file.json>` — POST events from file to /hook
- `claude-live record -o <file.json>` — connect to /ws, stream events to file until ctrl+c
- `claude-live replay <file.json> [--speed 2x]` — replay recorded events with original timing
- `claude-live logs [--follow]` — tail structured log output (tracing)

### Meta
- `claude-live update` — check GitHub releases, download new binary, replace self
- `claude-live share` — start cloudflare tunnel, print public URL
- `claude-live version` — version + build info + target triple

## Multi-User / Remote Access

- `--bind 0.0.0.0` enables LAN access (default: 127.0.0.1)
- `--token <secret>` requires token for WebSocket handshake and /hook POST
- `claude-live share` wraps `cloudflared tunnel` for remote access across networks
  - Prints shareable URL
  - Requires cloudflared installed (optional dependency, not bundled)

## CI/CD Pipeline (GitHub Actions)

### On push to main
- `cargo clippy` + `cargo test`
- `cd client && npm ci && npx tsc --noEmit`

### On tag (v*)
1. Build frontend: `npm ci && npm run build`
2. Cross-compile Rust (with embedded client/dist):
   - `x86_64-unknown-linux-musl` (static)
   - `aarch64-unknown-linux-musl` (static)
   - `x86_64-apple-darwin`
   - `aarch64-apple-darwin` (Apple Silicon)
   - `x86_64-pc-windows-msvc`
3. Compress: `.tar.gz` (unix), `.zip` (windows)
4. Create GitHub Release with all artifacts
5. `cargo publish` to crates.io
6. Update Homebrew tap formula (`marisancans/homebrew-tap`)

Cross-compilation via `cross` or `cargo-zigbuild`. Musl targets produce fully static binaries.

## Distribution Channels

| Channel | Install command | Auto-updates |
|---------|----------------|--------------|
| Plugin marketplace | `claude plugin marketplace add marisancans/claude-live` | Via marketplace |
| Homebrew | `brew install marisancans/tap/claude-live` | `brew upgrade` |
| Cargo | `cargo install claude-live` | `cargo install` (recompile) |
| Direct download | `curl -sSfL .../install.sh \| sh` | `claude-live update` |

## Update Mechanism

- Server checks GitHub releases API on startup (cached, max once per 24h)
- If newer version found → sends `version_available` message over WebSocket
- Frontend shows subtle badge in UI: "v0.6.0 available"
- `claude-live update` downloads binary for current platform, replaces self
- User restarts manually (or `claude-live stop && claude-live start`)

## Frontend Changes (Minimal)

- Replace `EventSource` in App.tsx with WebSocket client (auto-reconnect with exponential backoff)
- Add update notification badge in UI
- Add token auth: if server rejects WS with 401, prompt for token (stored in localStorage)
- All PixiJS rendering, store, animation system unchanged

## Project Structure

```
claude-live/
├── src/                        # Rust source
│   ├── main.rs                 # CLI entry (clap)
│   ├── server.rs               # Axum routes, WebSocket handler
│   ├── session.rs              # SessionManager, buffers, cleanup
│   ├── normalize.rs            # Event normalization
│   ├── snapshot.rs             # Session snapshot computation (nodeKeyFor, nodeTypeFor, colors)
│   ├── broadcast.rs            # WebSocket fan-out
│   ├── storage.rs              # SQLite record/replay
│   ├── update.rs               # Self-update from GitHub releases
│   ├── share.rs                # Cloudflare tunnel wrapper
│   └── assets.rs               # rust-embed static file serving
├── client/                     # Frontend (existing)
│   ├── src/
│   ├── dist/                   # Built by CI, embedded into binary
│   └── vite.config.ts
├── hooks/                      # Claude Code hook configs
├── tests/                      # Rust integration tests
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + test on push
│       └── release.yml         # Cross-compile + publish on tag
├── Cargo.toml
├── package.json                # Frontend deps only
└── README.md
```

## Key Rust Dependencies

- `axum` — HTTP/WebSocket server
- `tokio` — async runtime
- `clap` — CLI argument parsing
- `rust-embed` — embed static assets in binary
- `serde` / `serde_json` — JSON handling
- `tracing` / `tracing-subscriber` — structured logging
- `rusqlite` — SQLite for record/replay
- `ureq` — lightweight sync HTTP client for update checks (avoids pulling in full hyper stack twice)
- `sha2` — SHA256 checksum verification for self-update
- `uuid` — session IDs

## Data Model

### Normalized Event (Rust struct)

Port of `normalizeEvent()` from `server/index.js`. All fields:

```rust
struct NormalizedEvent {
    session_id: String,
    hook_event_name: String,       // PreToolUse, PostToolUse, Stop, Notification, etc.
    tool_name: Option<String>,     // Read, Edit, Write, Bash, Grep, Glob, WebFetch, etc.
    tool_input: Option<Value>,     // serde_json::Value — varies by tool
    tool_result: Option<Value>,    // PostToolUse only
    file_path_loaded: Option<String>, // mapped from raw.file_path (InstructionsLoaded)
    message: Option<String>,       // Notification message
    timestamp: String,             // ISO 8601
}
```

Hook event names: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `Stop`, `Notification`, `PermissionRequest`, `SubagentStart`, `SubagentStop`, `UserPromptSubmit`, `PreCompact`, `PostCompact`, `SessionStart`, `SessionEnd`, `InstructionsLoaded`, `WorktreeCreate`, `WorktreeRemove`.

### Snapshot Builder (port of `computeSessionSnapshot()`)

Builds lightweight state snapshots sent on WebSocket connect. Logic:
- `nodeKeyFor(event)` → unique key per file/tool (e.g. `"file:/path/to/file"`)
- `nodeTypeFor(event)` → file, bash, web, stop, notification, tool
- `labelFor(event)` → display label (filename, command excerpt, etc.)
- `TOOL_COLOR_HEX` map — full set including all hook event types (use client's 18-entry map, not the incomplete 8-entry server map)

### SSE Backward Compatibility

`GET /events` (SSE) is **dropped**. The Rust server only serves WebSocket at `/ws`. This is a clean break — the frontend migration to WebSocket happens in the same release. No deprecation period needed since this is a local dev tool with a single client.

## Daemon Mode

`claude-live start --daemon`:
- Forks process, writes PID to `~/.claude-live/pid`
- Stdout/stderr redirected to `~/.claude-live/claude-live.log`
- `claude-live stop` reads PID file, sends SIGTERM, waits for graceful shutdown
- `claude-live status` reads PID file, checks if process is alive
- If PID file is stale (process dead), commands clean it up automatically

## Self-Update Security

- GitHub releases include SHA256 checksum file (`claude-live-<target>.sha256`)
- `claude-live update` downloads binary + checksum, verifies before replacing
- Binary replacement uses atomic rename (write to temp, rename over self)

## Configurable Constants

These server defaults are configurable via CLI flags:
- `--buffer-size 50` (events per session buffer)
- `--session-timeout 660` (seconds, default 11 minutes)

## What Stays the Same

- Hook format and `/hook` POST API (backward compatible)
- Event normalization logic (1:1 port from JS)
- Session buffer semantics (defaults unchanged)
- Snapshot computation logic (1:1 port)
- All frontend rendering, store, types, animation
- Port 43451 default
