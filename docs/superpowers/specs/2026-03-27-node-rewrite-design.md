# claude-live Node.js Rewrite

## Goal

Replace the Rust server with a zero-dependency Node.js server. Pure passthrough — receive events, broadcast via SSE, serve static frontend.

## Architecture

```
hook event (stdin) → node hook.js → POST localhost:43451/hook
                                          ↓
                                    server.js
                                    - POST /hook → SSE broadcast
                                    - GET /events → SSE stream
                                    - GET /* → static files (client/dist/)
                                          ↓
                                    SSE EventSource → browser
```

## Components

### `server/index.js` (~60 lines)

Zero-dependency Node.js HTTP server using built-in `http` and `fs` modules.

**Routes:**
- `POST /hook` — receives JSON event, broadcasts to all SSE clients, returns `{"ok":true}`
- `GET /events` — SSE endpoint, `Content-Type: text/event-stream`, sends `data: {json}\n\n` for each event as it arrives
- `GET /*` — serve static files from `client/dist/` with correct MIME types

**No buffer, no storage, no state beyond the set of connected SSE clients.** Events arrive via POST, immediately broadcast to all connected SSE clients, done.

**Heartbeat:** Send SSE comment (`: heartbeat\n\n`) every 15 seconds to keep connections alive.

**Port:** 43451 (hardcoded).

### `bin/hook.js` (~15 lines)

Reads JSON from stdin, POSTs to `http://localhost:43451/hook`. Silent on failure (never blocks Claude Code).

Uses Node built-in `http.request` — no dependencies.

### `bin/hook-wrapper.sh`

```sh
#!/bin/sh
exec node "${CLAUDE_PLUGIN_ROOT}/bin/hook.js" 2>/dev/null || true
```

### `bin/hook-wrapper.bat`

```bat
@node "%CLAUDE_PLUGIN_ROOT%\bin\hook.js" 2>nul
```

### Frontend change

Replace WebSocket connection with `EventSource`:
- `new EventSource('/events')` instead of `new WebSocket('/ws')`
- `eventsource.onmessage = (e) => processEvent(JSON.parse(e.data))`
- Remove reconnection logic (EventSource auto-reconnects natively)
- Remove heartbeat handling (SSE handles this)
- No snapshot on connect — frontend starts empty, populates as events arrive

## What gets deleted

- All Rust code: `src/`, `Cargo.toml`, `Cargo.lock`, `target/`
- SQLite, WAL mode, polling, snapshots, stats
- CLI subcommands: start, stop, status, hook, stats, inject, record, replay, update, share
- Cross-compilation CI: `build-binaries` matrix, `cross`, platform packaging
- npm platform packages: `npm/claude-live-linux-x64/` etc., all 5 platform dirs
- `npm/claude-live/bin/claude-live.js` (the platform shim)
- `npm/claude-live/bin/postinstall.js`
- GitHub release binary artifacts
- `publish-npm` CI job (platform packages)
- `publish-crate` CI job
- `src/update.rs` (self-update)
- `src/share.rs` (cloudflare tunnel)

## What remains

- `server/index.js` — the entire backend
- `bin/hook.js` — stdin-to-POST bridge
- `bin/hook-wrapper.sh` + `bin/hook-wrapper.bat` — one-liner wrappers
- `client/` — frontend (React + PixiJS), unchanged except WebSocket → SSE swap
- `.claude-plugin/` — plugin metadata + hooks.json (unchanged)
- `commands/claude-live.md` — skill file (update `start` command)
- `package.json` — root, now also the npm package (no separate npm/ dir)

## npm package

The root `package.json` becomes the publishable npm package. No platform packages needed.

```json
{
  "name": "claude-live",
  "version": "2.0.0",
  "bin": { "claude-live": "bin/cli.js" },
  "files": ["server/", "bin/", "client/dist/", ".claude-plugin/", "commands/"],
  "scripts": { "start": "node server/index.js" }
}
```

`bin/cli.js` — minimal CLI: `node server/index.js` (just starts the server). No clap, no subcommands.

## Plugin delivery

Marketplace source stays as git (or npm — both work now since there's no binary). The plugin directory contains everything needed: JS server, hook scripts, frontend dist, plugin metadata.

## CI simplification

- `build-frontend` — unchanged (vite build)
- `ci` — `npm test` + typecheck
- `release` — build frontend, publish to npm, deploy demo to GitHub Pages
- Delete: `build-binaries`, `publish-crate`, `publish-npm` (platform packages), binary packaging

## Event format

Unchanged. `hook.js` passes stdin JSON through to POST /hook. `server.js` broadcasts it verbatim to SSE clients. The frontend already knows how to parse these events.

No normalization on the server — the frontend handles everything. If the frontend needs fields stripped or truncated, it does it client-side.
