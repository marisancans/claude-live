# PixiJS v8 Migration Design

**Date:** 2026-03-19
**Status:** Draft

## Context

The visualizer currently uses raw HTML5 Canvas 2D (`CanvasRenderingContext2D`) despite the component being named `PixiScene.tsx` and PixiJS v7 being installed but unused. At scale (6 clusters × 50 nodes each), the renderer becomes sluggish due to thousands of redundant draw calls per frame, no scene graph, and fully imperative frame-by-frame redraws.

The goal is a proper rewrite to **PixiJS v8** (WebGPU + WebGL2) with:
- A retained-mode scene graph — persistent objects instead of full redraws each frame
- Clean separation of event logic from animation logic via an Event Bus
- GPU-accelerated particle effects redesigned for PixiJS strengths
- Lines/connections between objects via a dedicated EdgeLayer
- A parallel renderer approach so the old Canvas 2D renderer stays working during development

---

## Architecture

### Event Flow

```
SSE hook event arrives
  → EventProcessor.handle(rawEvent)
      → mutates pure state (clusters/nodes in store.ts)
      → emits typed domain event on EventBus
          e.g. bus.emit('tool:used', { sessionId, nodeKey, tool, colorHex })

AnimationManager listens:
  bus.on('tool:used', ...) → creates ProjectileObject, adds to scene
  bus.on('node:created', ...) → creates NodeObject, adds to ClusterObject
  bus.on('prompt:submitted', ...) → creates SnakeObject

Ticker runs each frame (dt-corrected):
  CameraController.tick(dt)
  clusters.forEach(c => c.tick(dt))   // ClusterObject updates all children
  projectiles.forEach(p => p.tick(dt)) // ProjectileObject updates its PixiJS objects
  EdgeLayer.redraw(clusters)           // redraws all connection lines
```

### Scene Graph

```
Application (PixiJS v8)
├── backgroundLayer          // screen-space, no camera transform
│   ├── StarfieldSprite      // RenderTexture, refreshed every ~90 frames
│   ├── NebulaGraphics       // Graphics with radial fills
│   └── ShootingStarPool     // ParticleSystem, pooled Particle objects
├── worldLayer               // camera container — pan/zoom via pivot/scale
│   ├── EdgeLayer            // Graphics — redrawn each frame for connections
│   ├── ClusterContainer[]   // one per session
│   │   ├── TrailTexture     // RenderTexture trail stamp
│   │   ├── OrbitRingGraphics[] // redrawn only when ring membership changes
│   │   ├── CoreSprite       // Sprite + GlowFilter
│   │   ├── CoreLabel        // Text
│   │   └── NodeObject[]     // one per GraphNode
│   │       ├── NodeSprite   // colored circle/diamond
│   │       ├── NodeLabel    // Text
│   │       └── ImpactGraphics // drawn only when active
│   ├── SnakeObject[]        // PromptSnake/ResponseSnake
│   └── ProjectileObject[]   // in-flight animations
└── uiLayer                  // screen-space UI, always on top
```

### Key Design Principles

- **Objects own their PixiJS containers** — NodeObject creates and destroys its own `Container`, adds/removes itself from the scene. No external renderer touches its internals.
- **EventBus decouples data from visuals** — `store.ts` emits events, `AnimationManager` listens. Neither knows about the other.
- **AnimationManager is the only thing that creates PixiJS objects** in response to events. State mutations (store.ts) never touch PixiJS.
- **EdgeLayer** is a single `Graphics` object redrawn each frame — zero object allocation per frame for lines.
- **Real deltaTime** — `app.ticker` provides `dt` in seconds. All animation constants expressed as per-second rates.

---

## File Structure

### New files

```
client/src/
├── events/
│   ├── EventBus.ts           // typed mitt-based event emitter
│   └── EventProcessor.ts     // SSE RawEvent → state mutations + bus.emit()
└── canvas-pixi/              // parallel to existing canvas/ directory
    ├── PixiScene.tsx          // React component — mounts PixiJS app
    ├── PixiApp.ts             // Application setup, layer creation
    ├── layers/
    │   ├── BackgroundLayer.ts
    │   ├── WorldLayer.ts
    │   └── EdgeLayer.ts
    ├── objects/
    │   ├── ClusterObject.ts
    │   ├── NodeObject.ts
    │   ├── SnakeObject.ts
    │   ├── TrailObject.ts
    │   └── projectiles/
    │       ├── ProjectileObject.ts   // base class
    │       ├── ReadProjectile.ts
    │       ├── GrepProjectile.ts     // ParticleSystem pellets
    │       ├── GlobProjectile.ts
    │       ├── EditProjectile.ts
    │       ├── WriteProjectile.ts
    │       ├── BashProjectile.ts
    │       ├── WebFetchProjectile.ts
    │       └── DefaultProjectile.ts
    └── animation/
        ├── AnimationManager.ts       // EventBus subscriber, owns all anim objects
        └── CameraController.ts      // auto-fit, pan/zoom on WorldLayer
```

### Modified files

- `client/src/types.ts` — strip animation fields (`impactTime`, `marks[]`, `actionFade`, `actionLabel`, `impactType`) from `GraphNode`; these move into `NodeObject`
- `client/src/store.ts` — **dual-path during parallel phase**: keep existing animation state mutations for the old Canvas 2D renderer (`promptSnakes`, `compacting`, `coreLabelFade`, etc.); additionally emit domain events on EventBus when the PixiJS renderer is active. After migration validates and old renderer is deleted, remove all animation state from `store.ts` and `types.ts` entirely. Do NOT break old renderer during Phases 1–3.
- `client/index.html` — feature flag: `?renderer=pixi` loads `canvas-pixi/PixiScene.tsx`, default loads existing `canvas/PixiScene.tsx`
- `client/vite.config.ts` — ensure PixiJS v8 is bundled correctly

### Kept as-is

- `client/src/canvas/` — entire existing Canvas 2D renderer, untouched
- `client/src/utils/spline.ts` — SplinePath Bezier math, renderer-agnostic
- `server/` — SSE server, untouched

### Deleted (after migration validates)

- `client/src/canvas/PixiScene.tsx`, `renderer.ts`, `background.ts`, `renderer/utils.ts`, `graph.ts`

---

## Feature Flag

URL param switches renderer:
- `http://localhost:5173/` — existing Canvas 2D renderer (default, unchanged)
- `http://localhost:5173/?renderer=pixi` — new PixiJS v8 renderer

Both renderers subscribe to the same SSE stream and share `store.ts` state. The EventBus wires up only when the PixiJS renderer is active.

Implementation in `App.tsx` (or equivalent entry):
```tsx
const renderer = new URLSearchParams(location.search).get('renderer')
return renderer === 'pixi' ? <PixiScene /> : <OldPixiScene />
// where OldPixiScene = canvas/PixiScene.tsx renamed
```

---

## PixiJS v8 Specifics

### Setup changes from v7
- `new Application()` is now async — `await app.init({ ... })`
- `Graphics` API uses method chaining with terminal `fill()`/`stroke()` per path segment: `g.rect(x, y, w, h).fill(color)`
- Filters come from `pixi-filters` (NOT `@pixi/filter-*` which targets v7): `import { GlowFilter } from 'pixi-filters'`
- `ParticleContainer` (v7) is replaced by `ParticleSystem` with `Particle` objects (NOT `addChild(sprite)`)
- `RenderTexture.create({ width, height })` for offscreen buffers

### Package changes
```json
// Remove:
"pixi.js": "^7.4.0"
// Add:
"pixi.js": "^8.0.0"
"pixi-filters": "^6.0.0"
```

---

## Projectile Redesign (PixiJS strengths)

Old approach: imperative Canvas 2D drawing each frame (e.g., 16 individual arc calls for Grep).

New approach — each tool type gets a `ProjectileObject` subclass that owns PixiJS objects:

| Tool | Old | New |
|---|---|---|
| Grep | 16 manual pellets w/ gradient trails | `ParticleSystem` with 16 `Particle` pellets, `BlurFilter` trail |
| Read | Box scanner + data packets | `Graphics` scan box + `ParticleSystem` packets |
| Bash | Manual terminal window draw | `Container` with `RenderTexture` terminal + scanline `Graphics` |
| Edit | Gradient beam + ink blob | `Graphics` beam + `Sprite` with dissolve blend mode |
| Write | Glowing tube + 5 packets | `Graphics` tube + `ParticleSystem` |
| WebFetch | Sine wave | `Graphics` redrawn each tick (cheap) |
| Default | Gradient dot trail | `Sprite` with motion blur filter |

Impact effects on nodes (scan, morph, spark, ping, fade, fail) move from `renderer.ts` into `NodeObject.playImpact(type)` — the node owns its impact `Graphics` and animates it internally.

---

## EdgeLayer — Connections Between Objects

`EdgeLayer` is a single `Graphics` object in `worldLayer`, redrawn each frame:

```typescript
// EdgeLayer.ts
// NOTE: In PixiJS v8, stroke() is a terminal call per path segment.
// Each moveTo/lineTo pair must be followed by its own stroke() call.
// cluster.data refers to the Cluster struct from types.ts (parentSessionId, edges are top-level fields).
redraw(clusters: Map<string, ClusterObject>) {
  this.g.clear()
  for (const cluster of clusters.values()) {
    // Draw parent→child cluster lines
    if (cluster.data.parentSessionId) {
      const parent = clusters.get(cluster.data.parentSessionId)
      if (parent) {
        this.g.moveTo(parent.x, parent.y)
            .lineTo(cluster.x, cluster.y)
            .stroke({ width: 1, color: 0xffaa44, alpha: 0.3 })
        // Each segment gets its own .stroke() — do not batch multiple segments before stroking
      }
    }
    // Future: node→node edges from cluster.data.edges[]
    for (const edge of cluster.data.edges) {
      const a = cluster.getNode(edge.from)
      const b = cluster.getNode(edge.to)
      if (a && b) {
        this.g.moveTo(a.x, a.y)
            .lineTo(b.x, b.y)
            .stroke({ width: 0.5, color: 0xffffff, alpha: 0.15 })
      }
    }
  }
}
```

Zero allocation per frame — one `clear()` + draw calls on a persistent object.

---

## CameraController

Replaces the manual `ctx.save()/translate()/scale()/restore()` pattern. Operates on `worldLayer`:

```typescript
// Bounding-box computation is identical to existing calculateClusterBounds() / calculateCameraTarget()
// in canvas/PixiScene.tsx lines 31–80 — reuse that logic directly.
//
// PixiJS pivot/position transform semantics:
//   worldLayer.pivot = the world-space point that maps to worldLayer.position on screen
//   worldLayer.position = screen-space location of the pivot point
//   worldLayer.scale = uniform zoom
//
// Equivalent to existing: ctx.translate(W/2 + offsetX, H/2 + offsetY); ctx.scale(scale, scale)
// where offsetX = (W/2 - centerX) * scale  →  pivot = (centerX, centerY), position = (W/2, H/2)
//
// Applied as:
worldLayer.pivot.set(targetCx, targetCy)   // world-space center of all clusters
worldLayer.position.set(screenW / 2, screenH / 2)
worldLayer.scale.set(targetScale)
// All three are lerped each tick at alpha = 0.15 * blendFactor (same as current)
```

Pan/zoom input (mouse drag, wheel) updates `worldLayer.position` (drag) and `worldLayer.scale` + re-centers pivot (wheel) — no manual transform matrix.

---

## AnimationManager Domain Events

```typescript
// events/EventBus.ts — typed events
type BusEvents = {
  'node:created':   { sessionId: string, node: GraphNode }
  'node:removed':   { sessionId: string, nodeKey: string }
  'tool:used':      { sessionId: string, nodeKey: string, tool: string, colorHex: string, inbound: boolean }
  'prompt:submitted': { sessionId: string, words: string[], color: string }
  'cluster:created':  { cluster: Cluster }
  'cluster:removed':  { sessionId: string }
  'compact:pre':    { sessionId: string }
  'compact:post':   { sessionId: string }
  'permission:request': { sessionId: string }
}
```

`AnimationManager` subscribes to all events and is the single point responsible for creating/destroying PixiJS animation objects.

---

## Pre-Migration Cleanup

Before touching PixiJS at all, remove dead code that would otherwise be migrated unnecessarily.

### Dependencies to remove
- `matter-js` — zero imports in the entire codebase; only referenced in stale comments in `graph.ts`
- `pixi.js: ^7.4.0` — zero actual PixiJS API usage anywhere (will be replaced by v8)

### Files to delete
- `client/src/canvas/renderer/utils.ts` — exports `hexToRgb` and `eio`, but nothing imports from this module; `renderer.ts` has its own private copies

### `store.ts` vs `store/index.ts` — resolve the duplicate
Both files implement `createStore`. All current imports resolve to `store.ts` (file beats directory). `store/index.ts` has `checkStaleSessions` not in `store.ts`, suggesting it's a newer refactor that was never switched over. **Decision:** migrate to `store/index.ts` as the canonical store, delete `store.ts`.

### Dead functions to remove
| Function | File | Reason |
|---|---|---|
| `layoutClusters` | `graph.ts` + 3 call-sites in `App.tsx` | No-op body, comment says "Matter.js" |
| `computeClusterRadii` | `graph.ts` | Never called |
| `getOrbitRadii` | `graph.ts` | Never called |
| `getNodePosition` | `renderer.ts` | Never called |
| `shortHash` | `store.ts` line 6, `constants.ts` line 52 | Never called |
| `extractLetters` | `store.ts` | Only call-site is commented out |
| `extractWords` | `store.ts` | Only call-site is the disabled ResponseSnake block |
| Commented-out ResponseSnake block | `store.ts` lines 799–810 | Disabled for performance, remove cleanly |

### Dead type fields to remove from `types.ts`
| Field | Type | Reason |
|---|---|---|
| `vx`, `vy` | `GraphNode` | Written to zero at creation, never read or mutated |
| `targetRadius`, `currentRadius` | `Cluster` | Set but never read in renderer or physics |
| `Ripple` interface | — | Comment says "not used in solar renderer" |

### Fields to keep (intentionally)
- `cluster.edges[]` — data is built and maintained; EdgeLayer in the PixiJS renderer will render it. Do NOT remove.

### Comment cleanups
- `types.ts` line 39: "PixiJS-style hex int (kept for HUD compatibility)" → remove note after migration
- `constants.ts` line 39: "Convert hex color to PixiJS integer format" → update wording
- `graph.ts` lines 20–31: stale Matter.js comments → delete

---

## Migration Phases

### Phase 1 — Infrastructure (no visuals yet)
- Upgrade pixi.js to v8, add filter packages
- Create `events/EventBus.ts` and `events/EventProcessor.ts`
- Wire feature flag in entry point
- Create `canvas-pixi/PixiApp.ts` with blank Application + layers
- `canvas-pixi/PixiScene.tsx` mounts app, shows black canvas at `?renderer=pixi`

### Phase 2 — Static scene
- `BackgroundLayer` — starfield, nebula, shooting stars
- `ClusterObject` — core sprite, orbit rings, label
- `NodeObject` — node sprite, label, orbital position from store state
- `CameraController` — auto-fit from cluster bounding box
- `EdgeLayer` — parent→child cluster lines

### Phase 3 — Animations
- `AnimationManager` wired to EventBus
- `ProjectileObject` base class + all tool subclasses
- `SnakeObject` — PromptSnake and ResponseSnake:
  - Constructor: `new SnakeObject(app, splinePath, words, color, isResponse)`
  - Reuses `utils/spline.ts` `SplinePath` (passed at construction, not recomputed)
  - Each word is a `Text` object positioned along the Bezier using existing head/tail progress model from `renderer.ts` lines 20–101
  - Signals completion via callback: `new SnakeObject(..., { onComplete: () => animMgr.removeSnake(this) })`
- `TrailObject` — RenderTexture trail stamps
- Impact effects inside `NodeObject.playImpact(type)` — owns its `ImpactGraphics`, self-clears when done

**Note on `BackgroundLayer`:** Must keep all state (stars array, initialized flag, lastW) inside the class instance — not as module-level globals. The existing `background.ts` uses module globals which break on React StrictMode double-mounts and would conflict if both renderers were ever active simultaneously.

### Phase 4 — Polish & validation
- Visual parity check against old renderer
- Performance profiling (target: <4ms frame time at full scale)
- Remove feature flag, delete old `canvas/` directory

---

## Verification

1. `?renderer=pixi` loads without errors, shows black canvas with background
2. Connect a Claude Code session — clusters appear, nodes orbit correctly
3. Run multiple sessions — clusters repel, camera auto-fits
4. Trigger tool events — projectiles animate correctly per tool type
5. Submit prompts — snake animations flow toward cluster core
6. Chrome DevTools Performance tab: frame time <4ms at 6 clusters × 50 nodes
7. Old renderer still works at default URL (no regression)
