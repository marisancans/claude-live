# claude-live

Real-time Claude Code activity visualizer. Single Rust binary with embedded frontend.

## Architecture

- **Backend:** Rust (axum + tokio), serves WebSocket API + embedded static frontend
- **Frontend:** React 18 + PixiJS v8 (TypeScript, Vite)
- **Transport:** WebSocket at `/ws`, hook ingestion at `POST /hook`
- **CLI:** clap-based with subcommands for server lifecycle, debugging, and management

## Dev Workflow

```bash
# Run Rust server (serves embedded frontend)
cargo run -- start

# Frontend dev with hot reload
cd client && npm run dev   # Vite on :5173
cargo run -- start         # Server on :43451

# Run all tests
cargo test

# Frontend typecheck
cd client && npx tsc --noEmit
```

## Key Files

### Rust Backend (`src/`)
- `main.rs` — CLI entry, subcommand dispatch
- `server.rs` — Axum router, static file serving
- `websocket.rs` — WebSocket upgrade, per-client message loop
- `hook.rs` — POST /hook handler
- `normalize.rs` — Event normalization (RawEvent → NormalizedEvent)
- `snapshot.rs` — Session snapshot computation for new WS clients
- `session.rs` — SessionManager with rolling buffers
- `broadcast.rs` — Fan-out events to WS clients

### Frontend (`client/src/`)
- `App.tsx` — React root, WebSocket connection, HUD
- `store.ts` — Client-side state management (sessions, nodes, edges)
- `types.ts` — TypeScript types (RawEvent, GraphNode, Cluster)
- `canvas-pixi/` — PixiJS v8 rendering (layers, objects, effects, animation)
- `events/` — EventBus + EventProcessor (state→visual bridge)

## Conventions

- Server port: 43451 (default)
- Event buffer: 50 events per session, 11min timeout
- Frontend builds to `client/dist/`, embedded into Rust binary via `rust-embed`
- All hook events POST to `/hook` as JSON, normalized server-side
- WebSocket messages are JSON with `type` field: `event`, `snapshot`, `heartbeat`, `version_available`

## Testing

- Rust: `cargo test` (unit + integration tests in `tests/`)
- Frontend: `cd client && npx tsc --noEmit` (typecheck only, no unit tests)
- Manual: `claude-live inject <file.json>` to feed test events
