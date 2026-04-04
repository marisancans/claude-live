# Visual Overhaul v2 — Premium Rendering Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform claude-live from prototype-quality to premium, cinematic space visualization. Every change must be prototyped in a standalone PixiJS page and approved before integration.

**Architecture:** Post-processing filter pipeline on top of improved base rendering. The philosophy: don't just make better shapes — make the *compositing* premium.

**Tech Stack:** PixiJS v8 (filters, blend modes, RenderTexture, custom shaders), `pixi-filters` package for bloom/etc.

**Prototype approach:** Each task creates a standalone PixiJS prototype page at `test/prototypes/<name>.html` that imports PixiJS from CDN and demonstrates the visual change in isolation. User reviews via Playwright screenshot or browser. Only after approval does the change get integrated into the main app.

---

## Phase 1: Post-Processing Pipeline (Highest Impact, Transforms Everything)

This single phase upgrades the entire scene at once. A bloom filter + color grading + vignette applied to the world layer makes everything look cinematic instantly — nodes, projectiles, effects, all benefit.

### Task 1: Prototype — Bloom + Color Grading + Vignette

**Files:**
- Create: `test/prototypes/post-processing.html`

**What to build:** A standalone PixiJS v8 page with:
- Dark background (`#0a0a14`)
- A few bright sprite circles (simulating session cores and nodes)
- A few dim sprites (simulating background nodes)
- Additive blend glow sprites behind the bright ones
- `AdvancedBloomFilter` on the container — only bright things bloom
- Custom color grading filter: ACES tonemapping, slight warm shadows/cool highlights split toning, subtle vignette
- Very subtle chromatic aberration (0.003 intensity, radial from center)
- Subtle film grain overlay (animated noise at 0.02 opacity)

**The prototype shows:** Same scene with and without post-processing (toggle key). The difference should be dramatic.

- [ ] **Step 1: Create prototype HTML with PixiJS CDN**

```html
<!-- test/prototypes/post-processing.html -->
<!-- Loads PixiJS v8 + pixi-filters from CDN -->
<!-- Creates a scene with bright/dim sprites -->
<!-- Applies: bloom, color grading, vignette, chromatic aberration, grain -->
<!-- Press SPACE to toggle post-processing on/off for comparison -->
```

The prototype must include:
- 3 "session core" bright sprites (different colors: orange, blue, green — matching model colors)
- 8 "node" sprites orbiting them at different distances
- Orbit ring Graphics (thin dashed circles)
- A "meteor shower" of particle sprites flowing between cores
- The post-processing filter chain applied to the scene container
- SPACE key toggles filters on/off
- FPS counter in corner

- [ ] **Step 2: Show prototype to user via Playwright screenshot + browser**

Take screenshot, ask user to open in browser, get feedback.

- [ ] **Step 3: Iterate based on feedback**

Adjust bloom threshold, color grading intensity, grain amount until approved.

- [ ] **Step 4: Commit prototype**

```bash
git add test/prototypes/post-processing.html
git commit -m "prototype: post-processing pipeline — bloom, color grading, vignette"
```

---

### Task 2: Integrate Post-Processing into Main App

**Files:**
- Install: `pixi-filters` package (or vendor the specific filters needed)
- Modify: `client/src/canvas-pixi/PixiApp.ts` — apply filter chain to world layer
- Create: `client/src/canvas-pixi/filters/PostProcessing.ts` — encapsulate the filter stack

- [ ] **Step 1: Install pixi-filters**

```bash
cd client && npm install pixi-filters
```

- [ ] **Step 2: Create PostProcessing module**

Encapsulates the full filter chain:
- AdvancedBloomFilter (threshold: 0.5, bloomScale: 0.5, blur: 8)
- ColorGradingFilter (custom: ACES tonemap, split toning, contrast 1.1)
- VignetteFilter (size: 0.3, amount: 0.15)
- ChromaticAberrationFilter (offset: 0.003, radial: true)

All values tunable. Expose a `setEnabled(boolean)` toggle.

- [ ] **Step 3: Apply to world layer in PixiApp.init()**

```typescript
this.worldLayer.container.filters = [postProcessing.filterChain]
```

- [ ] **Step 4: Typecheck + visual verify + commit**

```bash
git commit -m "feat: add post-processing pipeline — bloom, color grading, vignette"
```

---

## Phase 2: Node Textures (Canvas2D Gradients)

### Task 3: Prototype — Premium Node Textures

**Files:**
- Create: `test/prototypes/nodes.html`

**What to build:** Standalone PixiJS v8 page showing all node types side by side:

**File nodes (planets):**
- Canvas2D radial gradient body — soft edge, subtle upper-left highlight for 3D depth
- Additive blend glow halo behind (larger, softer)
- Very subtle surface texture: faint noise pattern baked into the body texture
- Color per tool type (new palette)

**Ephemeral nodes (crystals):**
- Diamond shape with gradient fill (brighter top, darker bottom)
- Sharp edge highlight (thin bright stroke)
- Small glow halo (tighter than file nodes)
- Faceted look: subtle inner lines suggesting crystal structure

**Agent nodes:**
- Keep plasma core (already premium)
- Upgrade dashed ring: glow behind each dash segment
- Add faint outer halo

**Session cores:**
- Keep PlasmaCore shader
- Upgrade core glow: multi-layer Canvas2D radial gradient with model-specific colors
- Add very faint corona wisps: 4-6 thin additive sprites slowly rotating

Show each type in a grid with labels. Include the post-processing pipeline from Task 1 so we see them in context.

- [ ] **Step 1: Create prototype**
- [ ] **Step 2: Show to user, get feedback**
- [ ] **Step 3: Iterate**
- [ ] **Step 4: Commit prototype**

---

### Task 4: Integrate Node Textures

**Files:**
- Create: `client/src/canvas-pixi/textures/GradientTextures.ts`
- Modify: `client/src/canvas-pixi/textures/NodeTextures.ts`
- Modify: `client/src/canvas-pixi/objects/NodeObject.ts` — add `blendMode: 'add'` to glow sprites

- [ ] **Step 1: Implement GradientTextures module** (Canvas2D → Texture factories)
- [ ] **Step 2: Replace NodeTextures** to use gradient versions
- [ ] **Step 3: Add additive blend to all glow sprites**
- [ ] **Step 4: Typecheck + visual verify + commit**

---

## Phase 3: Background — Depth and Atmosphere

### Task 5: Prototype — Living Background

**Files:**
- Create: `test/prototypes/background.html`

**What to build:** Standalone PixiJS page showing:

**Star layers (3 depth levels):**
- Far layer: 300 tiny dim stars (size 1-2px), drift at 0.3x camera speed. Colors: warm white `#fff4e0` to cool blue `#c8d8ff`
- Mid layer: 100 medium stars (size 2-4px), drift at 0.6x. 30% twinkle (alpha oscillation)
- Near layer: 20 bright stars (size 3-6px), drift at 0.9x. Subtle glow halos with additive blend

Each star is a Sprite from a Canvas2D radial gradient texture. NOT Graphics circles.

**Nebula clouds (2-3 layers):**
- Large (400-600px) soft gradient blobs using Canvas2D textures
- `blendMode: 'add'` or `'screen'`
- Alpha 0.06-0.12 (more visible than current 0.02)
- Colors: warm purple `#2a1028`, cool teal `#081a30`, deep indigo `#100828`
- Drift slowly (0.03-0.08 px/frame), wrap when off-screen

**Vignette:**
- Canvas2D radial gradient texture covering full screen
- Clear center, dark edges (`#050510` at 0.5 alpha)
- Applied as top-most background sprite

Include parallax: drag/pan the "camera" (mouse drag) and see background layers move at different speeds.

- [ ] **Step 1: Create prototype**
- [ ] **Step 2: Show to user, get feedback**
- [ ] **Step 3: Iterate**
- [ ] **Step 4: Commit prototype**

---

### Task 6: Integrate Background

**Files:**
- Modify: `client/src/canvas-pixi/layers/BackgroundLayer.ts`

- [ ] **Step 1: Replace static starfield with layered star sprites**
- [ ] **Step 2: Replace static nebula with drifting additive blobs**
- [ ] **Step 3: Add parallax in tick() using camera position from WorldLayer**
- [ ] **Step 4: Typecheck + visual verify + commit**

---

## Phase 4: Orbit Rings + Connections

### Task 7: Prototype — Orbit Rings and Energy Lines

**Files:**
- Create: `test/prototypes/orbits.html`

**What to build:**

**Orbit rings:**
- Drawn in batch Graphics each frame (no separate objects to destroy/recreate)
- Dashed strokes (dash 8px, gap 6px) with animated dashOffset for "flowing" feel
- Slight eccentricity (0.9 aspect ratio) for elliptical orbits
- Inner ring: alpha 0.06, outer: alpha 0.03
- Very faint glow: draw the ring twice — once at width 3, alpha 0.02 (blur), then at width 0.6 (crisp)

**Energy connections (session→session tethers):**
- Curved bezier lines (not straight)
- Animated traveling dots (small bright sprites moving along the curve)
- Subtle glow behind the line (additive blend, alpha 0.05)
- Dot color matches the session

**Node→node edges:**
- Very faint curved lines, alpha 0.04
- Slight perpendicular offset based on index (so parallel edges don't overlap)

- [ ] **Step 1: Create prototype**
- [ ] **Step 2: Show to user, get feedback**
- [ ] **Step 3: Iterate**
- [ ] **Step 4: Commit prototype**

---

### Task 8: Integrate Orbit Rings

**Files:**
- Modify: `client/src/canvas-pixi/layers/WorldLayer.ts`
- Modify: `client/src/canvas-pixi/objects/ClusterObject.ts` — remove orbit ring Graphics

- [ ] **Step 1: Remove ClusterObject orbit ring destruction/recreation**
- [ ] **Step 2: Draw all orbit rings in WorldLayer.batchGfx each frame**
- [ ] **Step 3: Typecheck + visual verify + commit**

---

## Phase 5: Color Palette + HUD

### Task 9: Prototype — Color Palette

**Files:**
- Create: `test/prototypes/palette.html`

**What to build:** PixiJS page showing the full color palette in action:
- All tool types as nodes in a row with labels
- Session cores in model colors (Opus orange, Sonnet blue, Haiku green)
- Background with new nebula colors
- Post-processing applied
- Side-by-side: old palette (left) vs new palette (right)

**Proposed palette:**
```
Background:     #050510 (blue-black)
Read:           #7ec8e3 (soft cyan)
Edit:           #f4845f (warm coral)
Write:          #e8a44a (amber)
Bash:           #4ecdc4 (teal)
Grep/Glob:      #a78bfa (lavender)
WebFetch:       #f472b6 (pink)
Agent:          #c084fc (purple)
Star warm:      #fff4e0
Star cool:      #c8d8ff
HUD primary:    #80d4e7 (soft cyan)
HUD secondary:  #4a6670 (blue-gray)
HUD accent:     #4ecdc4 (teal)
```

- [ ] **Step 1: Create prototype with old vs new comparison**
- [ ] **Step 2: Show to user, get feedback**
- [ ] **Step 3: Iterate colors until approved**
- [ ] **Step 4: Commit prototype**

---

### Task 10: Integrate Color Palette + HUD

**Files:**
- Modify: `client/src/constants.ts` — tool colors
- Modify: `client/src/index.css` — HUD colors
- Modify: `client/src/canvas-pixi/PixiApp.ts` — background color

- [ ] **Step 1: Update all color constants**
- [ ] **Step 2: Update CSS variables**
- [ ] **Step 3: Typecheck + visual verify + commit**

---

## Phase 6: Canvas 2D Text Overlay

### Task 11: Prototype — Text Overlay

**Files:**
- Create: `test/prototypes/text-overlay.html`

**What to build:** PixiJS page with a Canvas2D text layer on top:
- PixiJS canvas renders nodes, orbits, glows (no text)
- Separate Canvas2D on top renders all labels
- Both share the same coordinate system
- Pan/zoom the PixiJS canvas and text follows perfectly
- Show: session labels (10px, all-caps, letter-spaced), node labels (7px), action labels (fade effect)

- [ ] **Step 1: Create prototype**
- [ ] **Step 2: Show to user, get feedback**
- [ ] **Step 3: Iterate**
- [ ] **Step 4: Commit prototype**

---

### Task 12: Integrate Text Overlay

**Files:**
- Create: `client/src/canvas-pixi/layers/TextOverlay.ts`
- Modify: `client/src/canvas-pixi/PixiScene.tsx`
- Modify: `client/src/canvas-pixi/objects/NodeObject.ts` — remove Text
- Modify: `client/src/canvas-pixi/objects/ClusterObject.ts` — remove Text

- [ ] **Step 1: Create TextOverlay class**
- [ ] **Step 2: Remove all PixiJS Text from NodeObject and ClusterObject**
- [ ] **Step 3: Wire into render loop**
- [ ] **Step 4: Typecheck + visual verify + commit**

---

## Phase 7: Ambient Animation (Breathing Universe)

### Task 13: Add Life to Everything

**Files:**
- Modify: `client/src/canvas-pixi/objects/NodeObject.ts`
- Modify: `client/src/canvas-pixi/objects/ClusterObject.ts`

No prototype needed — these are parameter tweaks:

- [ ] **Step 1: Node breathing**

All nodes subtly pulse scale: `1 + 0.04 * sin(time * 0.8 + seed)`. Glow pulse slightly more: `1 + 0.06 * sin(time * 0.5 + seed)`.

- [ ] **Step 2: Core corona wisps**

4-6 very faint additive sprites around each session core, slowly rotating at different speeds (0.01-0.03 rad/frame). Use soft glow texture. Alpha 0.03-0.06.

- [ ] **Step 3: Activity response**

On event, node glow briefly flares: alpha 0.4→0.7→0.4 over 400ms (ease-out). Core scale briefly pulses 1.0→1.15→1.0 over 300ms.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: ambient breathing animation — nodes pulse, cores flare on activity"
```

---

## Implementation Order

| Phase | What | Effort | Impact | Depends On |
|---|---|---|---|---|
| **1** | Post-processing pipeline | Medium | **Transforms everything** | Nothing |
| **2** | Node textures (Canvas2D gradients) | Medium | High — nodes stop looking flat | Nothing |
| **3** | Background (depth, parallax, drift) | Low | High — ambient life | Nothing |
| **4** | Orbit rings (batch draw, no flicker) | Low | Medium — fixes jitter | Nothing |
| **5** | Color palette + HUD | Low | Medium — cohesive theme | Nothing |
| **6** | Canvas 2D text overlay | Medium | High — kills flickering | Nothing |
| **7** | Ambient animation | Very low | Medium — organic feel | Phases 2-3 |

All phases are independent — can be done in any order. Phase 1 has the highest single-step impact because it upgrades the entire scene at once.

---

## Prototype Workflow

For every visual change:
1. Build standalone PixiJS prototype in `test/prototypes/`
2. Take Playwright screenshot + user opens in browser
3. Iterate until approved
4. Only then integrate into main app
5. Take before/after comparison screenshots

This prevents wasted work on visual changes that don't look right.
