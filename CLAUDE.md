# claude-live

Real-time Claude Code activity visualizer. Zero-dependency Node.js server serving frontend from disk, pure event passthrough via SSE.

## Architecture

- **Backend:** Node.js (zero dependencies), serves SSE API + static frontend from disk
- **Event Sources:** JSONL file tailing (primary, zero-config) + POST /hook (legacy, for plugin users)
- **Storage:** None — pure event passthrough, no persistence
- **Frontend:** React 18 + PixiJS v8 (TypeScript, Vite)
- **Transport:** SSE at `/events`
- **CLI:** `bin/cli.js` — starts the server

## Branch Strategy

> ⚠️ **THIS IS THE ONLY CORRECT WAY TO RELEASE. DO NOT DEVIATE.**
> Working directly on `main` or `dev` is WRONG and will break the release pipeline.
> Before starting ANY work, confirm with the user that a feature branch has been created from `dev`.
> If not — stop, create the branch, then proceed.

- **`main`** — production branch. CI auto-builds and commits `client/dist/` on every push. Plugin users install from here.
- **`dev`** — integration branch. All feature branches merge here first.
- **feature branches** — ALL new work starts from `dev` as a new branch, PRs back to `dev`.
- Never commit `client/dist/` manually — CI handles it on `main`.

**THE ONLY CORRECT FLOW:**
```
git checkout dev && git pull origin dev
git checkout -b feature/my-feature
# ... do work ...
# PR feature/my-feature → dev
# PR dev → main
# CI builds dist and releases to plugin users
```

`feature/xyz` → PR → `dev` → PR → `main` → CI builds dist → plugin users get it.

## Dev Workflow

```bash
# Start a new feature (MANDATORY — never work on main or dev directly)
git checkout dev && git pull origin dev
git checkout -b feature/my-feature

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
- `index.js` — HTTP server: POST /hook, GET /events (SSE), static files, starts JSONL scanner
- `transcript-parser.js` — Parses JSONL transcript lines into RawEvent format
- `session-scanner.js` — Watches ~/.claude/projects/ for active sessions, tails JSONL files

### Hook (`bin/`)
- `hook.js` — Reads stdin JSON, POSTs to localhost:43451/hook (legacy, for plugin hooks)
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

```bash
# Server unit tests (parser + scanner, 30 tests)
npm run test:server

# Frontend typecheck
cd client && npx tsc --noEmit

# Replay a real session through the parser
node test/replay-session.js --stats
node test/replay-session.js --compare   # show tool_response shapes

# Manual hook test (legacy)
echo '{"session_id":"test","tool_name":"Read"}' | node bin/hook.js
```

## Browser Testing (Playwright MCP)

Playwright MCP is configured for headless browser testing. Use it to verify the frontend:

```
# In Claude Code, the Playwright MCP tools are available:
# browser_navigate, browser_snapshot, browser_take_screenshot,
# browser_click, browser_type, browser_console_messages, etc.

# Typical test flow:
# 1. Start server: node server/index.js
# 2. Start Vite: cd client && npm run dev
# 3. Navigate: browser_navigate to http://localhost:7979
# 4. Take screenshot: browser_take_screenshot
# 5. Check console: browser_console_messages
# 6. Interact: browser_click, browser_type
```

Setup (already done, persisted in .claude.json):
```bash
npx playwright install chromium
claude mcp add playwright -- npx @playwright/mcp@latest --headless
```
