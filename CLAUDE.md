# claude-live

Real-time Claude Code activity visualizer. Zero-dependency Node.js server serving frontend from disk, pure event passthrough via SSE.

## Architecture

- **Backend:** Node.js (zero dependencies), serves SSE API + static frontend from disk
- **Storage:** None — pure event passthrough, no persistence
- **Frontend:** React 18 + PixiJS v8 (TypeScript, Vite)
- **Transport:** SSE at `/events`, hook ingestion via `POST /hook`
- **CLI:** `bin/cli.js` — starts the server

## Dev Workflow

```bash
# Run server
node server/index.js

# Frontend dev with hot reload
cd client && npm run dev   # Vite on :7979
node server/index.js       # Server on :43451

# Frontend typecheck
cd client && npx tsc --noEmit
```

## Key Files

### Backend (`server/`)
- `index.js` — HTTP server: POST /hook, GET /events (SSE), static files

### Hook (`bin/`)
- `hook.js` — Reads stdin JSON, POSTs to localhost:43451/hook
- `hook-wrapper.sh` — Shell wrapper for plugin hooks
- `hook-wrapper.bat` — Windows wrapper for plugin hooks
- `cli.js` — CLI entry point (starts server)

### Frontend (`client/src/`)
- `App.tsx` — React root, SSE connection, HUD
- `store.ts` — Client-side state management (sessions, nodes, edges)
- `types.ts` — TypeScript types (RawEvent, GraphNode, Cluster)
- `canvas-pixi/` — PixiJS v8 rendering (layers, objects, effects, animation)
- `events/` — EventBus + EventProcessor (state→visual bridge)

## Conventions

- Server port: 43451 (hardcoded)
- No storage — events are broadcast immediately to SSE clients and discarded
- Frontend in `client/dist/`, served from disk via Node.js static file handler
- Hook events received via `bin/hook.js` (reads stdin, POSTs to server)
- SSE messages are JSON with `type` field: `event`

## Testing

- Frontend: `cd client && npx tsc --noEmit` (typecheck only)
- Manual: `echo '{"session_id":"test","tool_name":"Read"}' | node bin/hook.js`
