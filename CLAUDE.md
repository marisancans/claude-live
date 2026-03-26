# claude-live

Real-time Claude Code activity visualizer. Single Rust binary serving frontend from disk, backed by SQLite.

## Architecture

- **Backend:** Rust (axum + tokio), serves WebSocket API + static frontend from disk
- **Storage:** SQLite (WAL mode) at `~/.local/share/claude-live/events.db`
- **Frontend:** React 18 + PixiJS v8 (TypeScript, Vite)
- **Transport:** WebSocket at `/ws`, hook ingestion via CLI stdin or `POST /hook`
- **CLI:** clap-based with subcommands for server lifecycle, debugging, and management

## Dev Workflow

```bash
# Run Rust server (serves client/dist/ from disk)
cargo run -- start

# Frontend dev with hot reload
cd client && npm run dev   # Vite on :5173
cargo run -- start         # Server on :43451 (hardcoded)

# Run all tests
cargo test

# Frontend typecheck
cd client && npx tsc --noEmit
```

## Key Files

### Rust Backend (`src/`)
- `main.rs` — CLI entry, subcommand dispatch
- `server.rs` — Axum router, ServeDir for frontend, DB polling, /api/stats
- `websocket.rs` — WebSocket upgrade, per-client message loop
- `hook.rs` — POST /hook handler, also writes to SQLite
- `normalize.rs` — Event normalization (RawEvent → NormalizedEvent)
- `storage.rs` — SQLite WAL mode, polling, snapshot loading, stats queries
- `paths.rs` — Cross-platform data dir, DB path, pidfile utilities
- `broadcast.rs` — Fan-out events to WS clients

### Frontend (`client/src/`)
- `App.tsx` — React root, WebSocket connection, HUD
- `store.ts` — Client-side state management (sessions, nodes, edges)
- `types.ts` — TypeScript types (RawEvent, GraphNode, Cluster)
- `canvas-pixi/` — PixiJS v8 rendering (layers, objects, effects, animation)
- `events/` — EventBus + EventProcessor (state→visual bridge)

## Conventions

- Database: ~/.local/share/claude-live/events.db (SQLite, WAL mode)
- Server port: 43451 (hardcoded, started on-demand via `claude-live start`)
- Event buffer: 50 events per session loaded as snapshot on server start
- Frontend in `client/dist/`, served from disk via tower-http ServeDir
- Hook events received via binary stdin (`claude-live hook`), written to SQLite
- POST /hook endpoint kept for backwards compat and remote/LAN use
- WebSocket messages are JSON with `type` field: `event`, `heartbeat`, `version_available`

## Testing

- Rust: `cargo test` (unit + integration tests in `tests/`)
- Frontend: `cd client && npx tsc --noEmit` (typecheck only, no unit tests)
- Manual: `claude-live hook --db test.db` to feed test events directly to SQLite
