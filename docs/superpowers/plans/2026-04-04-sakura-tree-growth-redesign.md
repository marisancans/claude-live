# Sakura Tree Growth Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `SpaceColonizationTree` so each event grows exactly 1 node, the tree expands infinitely with a seed-derived odd personality, and events always produce independent visible animations.

**Architecture:** All changes are in `client/src/sakura/SpaceColonizationTree.ts`. A `TreePersonality` struct (derived deterministically from the seed) controls lean, hotspot clustering, gnarliness, and wind drift. Growth rate is fixed by selecting only the single best SCA candidate per step instead of growing all simultaneously.

**Tech Stack:** TypeScript, Three.js v8, Space Colonization Algorithm (Runions 2007)

---

## Files

- Modify: `client/src/sakura/SpaceColonizationTree.ts` — all changes

---

## Task 1: Type scaffolding — TreePersonality + TreeNode.lastPerturbation

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Add `TreePersonality` interface and update `TreeNode`**

In `SpaceColonizationTree.ts`, replace the `TreeNode` interface and add `TreePersonality` directly below the Types section comment:

```ts
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TreePersonality {
  leanAngle: number        // radians 0–0.44 (0–25°) — how much the whole tree tilts
  leanDirection: number    // radians 0–2π — direction of lean
  gnarliness: number       // 0.8–2.5 — multiplier on gnarl strength at all depths
  windDriftX: number       // -0.06 to 0.06 — horizontal tropism component X
  windDriftZ: number       // -0.06 to 0.06 — horizontal tropism component Z
  hotspots: THREE.Vector3[] // 2–4 attractor cluster centers in base-dome world space (s=1)
}

export interface TreeNode {
  id: number
  position: THREE.Vector3
  parentId: number | null
  childIds: number[]
  radius: number
  depth: number
  distFromRoot: number
  direction: THREE.Vector3
  segmentVertexStart: number
  createdAtEvent: number
  lastPerturbation: THREE.Vector3  // accumulated drift vector (set after node creation)
}
```

- [ ] **Step 2: Add personality field to class + remove `GNARL_STRENGTH` constant**

Remove the line:
```ts
const GNARL_STRENGTH     = 0.14     // random perturbation for organic curves
```

Add two new constants after `GNARL_STRENGTH`'s former location:
```ts
const DOME_EXPAND_INTERVAL = 50     // expand dome every N events
const DOME_EXPAND_RATE     = 0.04   // how much to grow envelopeScale each interval
```

Change:
```ts
const TROPISM_START_DEPTH = 4       // start drooping after this depth
```
to:
```ts
const TROPISM_START_DEPTH = 2       // start drooping after this depth (sooner = whole-tree bend)
```

In the class body, add `private personality!: TreePersonality` alongside the other private fields:
```ts
private personality!: TreePersonality
```

- [ ] **Step 3: Update `createNode` to initialize `lastPerturbation`**

In `createNode`, add `lastPerturbation` to the node literal:
```ts
private createNode(position: THREE.Vector3, direction: THREE.Vector3, parent: TreeNode): TreeNode {
  const node: TreeNode = {
    id: this.nextNodeId++,
    position: position.clone(),
    parentId: parent.id,
    childIds: [],
    radius: TIP_RADIUS,
    depth: parent.depth + 1,
    distFromRoot: parent.distFromRoot + SEGMENT_LENGTH,
    direction: direction.clone(),
    segmentVertexStart: -1,
    createdAtEvent: this.eventCounter,
    lastPerturbation: new THREE.Vector3(),  // caller sets this after creation
  }
  parent.childIds.push(node.id)
  this.nodes.push(node)
  this.nodeMap.set(node.id, node)
  return node
}
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean (no errors). The `personality` field is non-null asserted with `!` so it won't error until we call methods that use it.

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): add TreePersonality type + lastPerturbation to TreeNode"
```

---

## Task 2: Personality derivation — seeded, deterministic

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Add `gaussRng()` helper method**

Add this private method to the class, after `scatterAttractors`:

```ts
/** Box-Muller transform using the seeded RNG. Produces std-normal variate. */
private gaussRng(): number {
  const u = Math.max(1e-10, this.rng.random())
  const v = this.rng.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
```

- [ ] **Step 2: Add `derivePersonality()` method**

Add after `gaussRng()`:

```ts
private derivePersonality(): TreePersonality {
  const leanAngle     = this.rng.random(0.44, 0.05)       // 3–25° in radians
  const leanDirection = this.rng.random(Math.PI * 2, 0)
  const gnarliness    = this.rng.random(2.5, 0.8)
  const windDriftX    = (this.rng.random() - 0.5) * 0.12
  const windDriftZ    = (this.rng.random() - 0.5) * 0.12

  // 2–4 hotspot cluster centers in base-dome world space (envelopeScale=1)
  const hotspotCount = 2 + Math.floor(this.rng.random() * 3)
  const hotspots: THREE.Vector3[] = []
  const rxz = DOME_RADIUS_XZ, ry = DOME_RADIUS_Y, cy = DOME_CENTER_Y
  for (let i = 0; i < hotspotCount; i++) {
    let x = 0, y = 0, z = 0, tries = 0
    do {
      x = (this.rng.random() * 2 - 1) * rxz
      y = (this.rng.random() * 2 - 1) * ry + cy
      z = (this.rng.random() * 2 - 1) * rxz
      tries++
    } while ((x * x / (rxz * rxz) + (y - cy) * (y - cy) / (ry * ry) + z * z / (rxz * rxz) > 1 || y < 15) && tries < 50)
    hotspots.push(new THREE.Vector3(x, y, z))
  }

  return { leanAngle, leanDirection, gnarliness, windDriftX, windDriftZ, hotspots }
}
```

- [ ] **Step 3: Call `derivePersonality` at the start of `init()`**

In `init()`, add as the very first line before `scatterAttractors`:

```ts
private init() {
  this.personality = this.derivePersonality()
  this.scatterAttractors(INITIAL_ATTRACTORS)
  // ... rest unchanged
```

Also update the root node in `init()` to set `lastPerturbation` and apply the seed-derived trunk tilt (3–8° in personality's lean direction):

```ts
  // Root: slight seed-derived tilt so trunk doesn't start perfectly vertical
  const tiltMag = 0.052 + this.personality.leanAngle * 0.15  // ~3° base
  const rootDir = new THREE.Vector3(
    Math.sin(tiltMag) * Math.cos(this.personality.leanDirection),
    Math.cos(tiltMag),
    Math.sin(tiltMag) * Math.sin(this.personality.leanDirection),
  ).normalize()
  const root: TreeNode = {
    id: this.nextNodeId++,
    position: new THREE.Vector3(0, 0, 0),
    parentId: null,
    childIds: [],
    radius: TRUNK_BASE_RADIUS,
    depth: 0,
    distFromRoot: 0,
    direction: rootDir,
    segmentVertexStart: -1,
    createdAtEvent: 0,
    lastPerturbation: new THREE.Vector3(),
  }
  this.nodes.push(root)
  this.nodeMap.set(root.id, root)
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): derive seed-based tree personality (lean, gnarliness, hotspots, wind)"
```

---

## Task 3: Growth rate — single best-candidate per event

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Replace the multi-node grow loop in `growOneStep` with single-best selection**

In `growOneStep`, find the section labelled `// Step 3: Grow — ALL associated nodes extend simultaneously` and replace everything from that comment through the end of the method (up to but not including `this.commitGeometry()` and `return result`) with:

```ts
    // Step 3: Grow — SINGLE best node (most attractor associations, tie-break by depth)
    let bestNodeId = -1, bestCount = 0, bestDepth = -1
    for (const [nodeId, attPositions] of associations.entries()) {
      const n = this.nodeMap.get(nodeId)!
      if (attPositions.length > bestCount ||
          (attPositions.length === bestCount && n.depth > bestDepth)) {
        bestNodeId = nodeId
        bestCount = attPositions.length
        bestDepth = n.depth
      }
    }
    if (bestNodeId < 0) {
      this.commitGeometry()
      return result
    }

    const node = this.nodeMap.get(bestNodeId)!
    const attPositions = associations.get(bestNodeId)!

    // Average normalized direction toward associated attractors
    const avgDir = new THREE.Vector3()
    for (const ap of attPositions) {
      avgDir.add(new THREE.Vector3().subVectors(ap, node.position).normalize())
    }
    avgDir.divideScalar(attPositions.length).normalize()

    // Organic gnarl (random perturbation) — depth-weighted, replaced in Task 6
    avgDir.x += (this.rng.random() - 0.5) * 0.14
    avgDir.y += (this.rng.random() - 0.5) * 0.07
    avgDir.z += (this.rng.random() - 0.5) * 0.14

    // Tropism
    if (node.depth > TROPISM_START_DEPTH) {
      const tropismFactor = Math.min(1, (node.depth - TROPISM_START_DEPTH) / 10)
      avgDir.y -= TROPISM_STRENGTH * tropismFactor
    }

    avgDir.normalize()

    const newPos = node.position.clone().addScaledVector(avgDir, SEGMENT_LENGTH)
    const newNode = this.createNode(newPos, avgDir, node)
    newNode.lastPerturbation = new THREE.Vector3()  // set properly in Task 6

    // Collect new node ID for sap pulse
    newNodeIds.push(newNode.id)

    // Step 4: Kill attractors within kill distance of the new node
    const killDist2 = KILL_DISTANCE * KILL_DISTANCE
    for (const att of this.attractors) {
      if (!att.active) continue
      if (newNode.position.distanceToSquared(att.position) < killDist2) {
        att.active = false
      }
    }

    // Step 5: Update radii (pipe model — walk from new node to root)
    this.updateRadiiToRoot(newNode)

    // Step 6: Write tube geometry for new segment
    this.writeSegment(newNode)

    // Step 7: Update ancestor ring geometry (radii changed from pipe model)
    this.updateAncestorGeometry(newNode)

    // Step 8: Flower position (deeper branches only, if requested)
    if (emitFlowers && newNode.depth >= FLOWER_MIN_DEPTH) {
      pendingFlowers.push({ pos: newNode.position.clone(), dir: newNode.direction.clone() })
    }

    // Step 9: Refill attractors if running low
    const activeCount = this.attractors.filter(a => a.active).length
    if (activeCount < REFILL_THRESHOLD) {
      this.envelopeScale += 0.12
      this.scatterAttractors(REFILL_BATCH)
    }
```

The original Steps 4–9 loop blocks that referenced the old `newNodes` array are **deleted** — they are fully replaced by the single-node equivalents above.

- [ ] **Step 2: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Visual verify — 1 node per event**

Open browser at `http://localhost:7979/#/sakura`. Open debug panel (bottom-left "sakura" button). If the tree shows "vertex cap reached", click "reset". Then:
1. Check stats: nodes=1, events=0
2. Click "Read" once → nodes should be 2, events=1
3. Click "Read" 9 more times → nodes should be 11, events=10
4. Confirm each click adds exactly 1 node

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): grow 1 node per event — single best-candidate SCA selection"
```

---

## Task 4: Infinite growth — periodic dome expansion + trunk-phase refill

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Add periodic dome expansion at the start of `growOneStep`**

At the very start of `growOneStep`, after `this.eventCounter++`, add:

```ts
    // Periodic dome expansion so the tree always has new frontier
    if (this.eventCounter % DOME_EXPAND_INTERVAL === 0) {
      this.envelopeScale += DOME_EXPAND_RATE
    }
```

- [ ] **Step 2: Add attractor refill to the trunk phase**

In the trunk phase block (`if (associations.size === 0) {`), add a refill check before `return result`:

```ts
    if (associations.size === 0) {
      const trunkNode = this.growTrunkUpward()
      newNodeIds.push(trunkNode.id)
      if (emitFlowers && trunkNode && trunkNode.depth >= FLOWER_MIN_DEPTH) {
        pendingFlowers.push({ pos: trunkNode.position.clone(), dir: trunkNode.direction.clone() })
      }
      // Refill attractors in trunk phase too (was only in SCA phase before)
      const activeCount = this.attractors.filter(a => a.active).length
      if (activeCount < REFILL_THRESHOLD) {
        this.envelopeScale += 0.12
        this.scatterAttractors(REFILL_BATCH)
      }
      this.commitGeometry()
      return result
    }
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Visual verify — tree grows beyond initial dome**

Open debug panel, reset, then click "Read" 200 times using the replay function or by clicking rapidly. After 200 events, verify:
- nodes ≈ 201 (1 per event)
- The tree has grown taller/wider than the initial ~66 unit dome height
- No vertex cap warning in the stats

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): infinite growth — periodic dome expansion + trunk-phase attractor refill"
```

---

## Task 5: Hotspot-clustered scatter + lean shear

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Replace `scatterAttractors` with hotspot-aware version**

Replace the entire `scatterAttractors` method:

```ts
private scatterAttractors(count: number) {
  const s   = this.envelopeScale
  const rxz = DOME_RADIUS_XZ * s
  const ry  = DOME_RADIUS_Y  * s
  const cy  = DOME_CENTER_Y  * s

  // Lean shear factors (applied to every attractor position)
  const leanX = Math.sin(this.personality.leanAngle) * Math.cos(this.personality.leanDirection)
  const leanZ = Math.sin(this.personality.leanAngle) * Math.sin(this.personality.leanDirection)

  const hotspotCount = Math.floor(count * 0.6)
  const uniformCount = count - hotspotCount

  // --- 60% hotspot-clustered ---
  let added = 0, attempts = 0
  const sigma = rxz * 0.3
  while (added < hotspotCount && attempts < hotspotCount * 30) {
    attempts++
    const hs = this.personality.hotspots[Math.floor(this.rng.random() * this.personality.hotspots.length)]
    const hx = hs.x * s, hy = hs.y * s, hz = hs.z * s

    const x = hx + this.gaussRng() * sigma
    const y = hy + this.gaussRng() * sigma * 0.5
    const z = hz + this.gaussRng() * sigma

    const nx = x / rxz, ny = (y - cy) / ry, nz = z / rxz
    if (nx * nx + ny * ny + nz * nz > 1) continue
    if (y < 12) continue

    // Apply lean shear
    const fx = x + (y - cy) * leanX
    const fz = z + (y - cy) * leanZ
    this.attractors.push({ position: new THREE.Vector3(fx, y, fz), active: true })
    added++
  }

  // --- 40% uniform fill ---
  let uAdded = 0
  while (uAdded < uniformCount) {
    const x = (this.rng.random() * 2 - 1) * rxz
    const y = (this.rng.random() * 2 - 1) * ry + cy
    const z = (this.rng.random() * 2 - 1) * rxz
    const nx = x / rxz, ny = (y - cy) / ry, nz = z / rxz
    if (nx * nx + ny * ny + nz * nz > 1) continue
    if (y < 12) continue

    const fx = x + (y - cy) * leanX
    const fz = z + (y - cy) * leanZ
    this.attractors.push({ position: new THREE.Vector3(fx, y, fz), active: true })
    uAdded++
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Visual verify — asymmetric canopy + lean**

Reset tree, fire 100 events via debug panel. Observe:
- Tree should lean visibly in one direction (not straight up)
- Canopy should be denser on one or two sides (hotspot clusters) rather than perfectly symmetrical
- Each session (after reset) looks the same (deterministic from seed 23399)

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): hotspot-clustered attractor scatter with lean shear for odd silhouette"
```

---

## Task 6: Depth-weighted gnarl + accumulated drift (S-curves)

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Add `gnarlForDepth()` helper**

Add this private method after `gaussRng()`:

```ts
/** Returns gnarl strength for a given node depth — heavier on trunk, lighter on tips. */
private gnarlForDepth(depth: number): number {
  const g = this.personality.gnarliness
  if (depth <= 5)  return (0.35 + Math.min(depth, 5) * 0.02) * g  // 0.35–0.45 × gnarliness
  if (depth <= 12) return 0.18 * g
  return 0.10 * g
}
```

- [ ] **Step 2: Replace flat gnarl + add accumulated drift in `growOneStep`**

In the single-node grow block from Task 3, replace the gnarl lines:
```ts
    // Organic gnarl (random perturbation) — depth-weighted, applied in Task 6
    avgDir.x += (this.rng.random() - 0.5) * 0.14
    avgDir.y += (this.rng.random() - 0.5) * 0.07
    avgDir.z += (this.rng.random() - 0.5) * 0.14
```

With:
```ts
    // Depth-weighted gnarl + accumulated drift (S-curves from parent perturbation)
    const gnarl = this.gnarlForDepth(node.depth)
    const rx = (this.rng.random() - 0.5) * gnarl
    const ry_p = (this.rng.random() - 0.5) * gnarl * 0.5
    const rz = (this.rng.random() - 0.5) * gnarl

    // Inherit 20% of parent's last perturbation for flowing S-curves
    const drift = node.lastPerturbation
    avgDir.x += rx + drift.x * 0.2
    avgDir.y += ry_p + drift.y * 0.2
    avgDir.z += rz + drift.z * 0.2
```

And replace the placeholder `newNode.lastPerturbation = new THREE.Vector3()` with:
```ts
    newNode.lastPerturbation = new THREE.Vector3(
      rx + drift.x * 0.2,
      ry_p + drift.y * 0.2,
      rz + drift.z * 0.2,
    )
```

- [ ] **Step 3: Also set `lastPerturbation` on trunk nodes in `growTrunkUpward`**

In `growTrunkUpward`, after calling `createNode`:
```ts
    const node = this.createNode(newPos, dir, tip)
    node.lastPerturbation = new THREE.Vector3()  // trunk drift stays zero — already has direction noise
    this.updateRadiiToRoot(node)
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 5: Visual verify — gnarled branching**

Reset + fire 100 events. Observe:
- Trunk and primary branches should show visible sharp bends and S-curves, not straight lines
- Higher branches should be smoother than the trunk
- Two trees with different seeds should look distinctly different (change `23399` to `99999` in `SakuraApp.ts` line `this.tree = new SpaceColonizationTree(23399)` temporarily to compare, then revert)

- [ ] **Step 6: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): depth-weighted gnarl + accumulated drift for S-curve branching"
```

---

## Task 7: Wind tropism — horizontal component + earlier onset

**Files:**
- Modify: `client/src/sakura/SpaceColonizationTree.ts`

- [ ] **Step 1: Add horizontal wind component to tropism in `growOneStep`**

In the single-node grow block, replace the tropism section:
```ts
    // Tropism
    if (node.depth > TROPISM_START_DEPTH) {
      const tropismFactor = Math.min(1, (node.depth - TROPISM_START_DEPTH) / 10)
      avgDir.y -= TROPISM_STRENGTH * tropismFactor
    }
```

With:
```ts
    // Tropism — gravity droop + horizontal wind drift (starts earlier = whole-tree bend)
    if (node.depth > TROPISM_START_DEPTH) {
      const tropismFactor = Math.min(1, (node.depth - TROPISM_START_DEPTH) / 10)
      avgDir.y -= TROPISM_STRENGTH * tropismFactor
      avgDir.x += this.personality.windDriftX * tropismFactor
      avgDir.z += this.personality.windDriftZ * tropismFactor
    }
```

(`TROPISM_START_DEPTH` was already changed from 4 to 2 in Task 1.)

- [ ] **Step 2: Typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Visual verify — whole-tree character**

Reset + fire 150 events. Observe:
- Branches should droop and drift consistently toward the wind direction (visible from depth 2+)
- The overall tree form should feel weathered — a distinct lean, asymmetric crown, gnarled branching throughout
- Sap pulses should appear on every debug event click with no visible cancellation of previous pulses (verify by clicking 5 times quickly and watching all 5 pulses travel the branches independently)

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): horizontal wind tropism from personality — whole-tree consistent drift"
```

---

## Task 8: Final integration verification

- [ ] **Step 1: Full typecheck**

```bash
cd /Users/marisancans/src/claude-live/client && npx tsc --noEmit
```

Expected: clean, zero errors.

- [ ] **Step 2: Node-count regression check**

In the browser debug panel:
1. Click "reset" (or the red reset button if capped)
2. Verify: nodes=1, events=0, segments=0
3. Click "Read" exactly 20 times (one at a time, waiting for stats to update)
4. Verify: nodes=21, events=20, segments=20
5. No vertex cap warning should appear

- [ ] **Step 3: Infinite growth check**

Use "replay saved" to feed 200+ real events from history (or click 200 times). After 200 events:
- nodes ≈ 201, no vertex cap
- `envelopeScale` has grown (tree should be noticeably larger than at event 50)

- [ ] **Step 4: Animation independence check**

Click 5 debug buttons in rapid succession (Read, Edit, Bash, Grep, Prompt). Verify:
- 5 separate sap pulse animations appear simultaneously on the tree
- None cancel the others (all 5 travel to completion)
- Stats show events incremented by 5

- [ ] **Step 5: Revert any temporary seed changes**

If `SakuraApp.ts` was modified with a test seed, revert:
```ts
this.tree = new SpaceColonizationTree(23399)
```

- [ ] **Step 6: Final commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SpaceColonizationTree.ts
git commit -m "feat(sakura): tree growth redesign complete — 1 node/event, infinite growth, odd organic shapes"
```
