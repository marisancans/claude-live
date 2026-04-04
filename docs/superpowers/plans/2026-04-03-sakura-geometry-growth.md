# Sakura Geometry Rewrite + Live Growth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace TubeGeometry with custom vertex-ring BufferGeometry, replace single-plane petals with crossed-quad pairs, and add incremental live tree growth from events.

**Architecture:** Three sequential phases: (1) custom branch geometry generator, (2) crossed-quad petal system, (3) incremental TreeBuilder + growth animation. Each phase produces a working tree — no broken intermediate states.

**Tech Stack:** Three.js r183 custom BufferGeometry, existing sakura ShaderMaterial pipeline

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `client/src/sakura/BranchGeometry.ts` | Create | Custom BufferGeometry builder with vertex rings, taper, gnarliness |
| `client/src/sakura/BranchRenderer.ts` | Modify | Use BranchGeometry instead of TubeGeometry, remove junction spheres |
| `client/src/sakura/PetalSystem.ts` | Rewrite | Crossed-quad pairs, growth-aware blossom allocation |
| `client/src/sakura/shaders/bark.vert.glsl` | Modify | Add `uGrowth` uniform for growth animation |
| `client/src/sakura/TreeBuilder.ts` | Rewrite | `IncrementalTreeBuilder` class with `addPath()` |
| `client/src/sakura/types.ts` | Modify | Add growth fields, GrowthAction type |
| `client/src/sakura/SakuraApp.ts` | Modify | Growth tick loop, incremental sync, start empty |
| `client/src/sakura/SignalSystem.ts` | Modify | Trigger growth for events with file paths |

---

## Task 1: Custom Branch BufferGeometry Builder

**Files:**
- Create: `client/src/sakura/BranchGeometry.ts`

This is the core geometry improvement — vertex rings with taper and gnarliness instead of TubeGeometry.

- [ ] **Step 1: Create BranchGeometry.ts**

Create `client/src/sakura/BranchGeometry.ts`:

```typescript
import * as THREE from 'three'

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function makeRandom(seed: string) {
  let state = hashString(seed) || 1
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface BranchGeometryOptions {
  /** CatmullRomCurve3 defining the branch path */
  curve: THREE.CatmullRomCurve3
  /** Radius at the base of the branch */
  baseRadius: number
  /** How much radius tapers from base to tip (0-1) */
  taper: number
  /** How much the branch twists/bends randomly */
  gnarliness: number
  /** Rotational twist along the branch axis (radians) */
  twist: number
  /** Number of sections (rings) along the branch */
  sections: number
  /** Vertices per ring (higher = smoother cross-section) */
  segments: number
  /** Seed for deterministic randomness */
  seedKey: string
  /** Radius of the parent branch at the fork point (for junction blending) */
  parentRadius?: number
}

/**
 * Generate custom BufferGeometry for a branch using vertex rings.
 * Produces natural-looking bark with taper, gnarliness, and smooth junctions.
 */
export function buildBranchGeometry(options: BranchGeometryOptions): THREE.BufferGeometry {
  const {
    curve, baseRadius, taper, gnarliness, twist,
    sections, segments, seedKey, parentRadius,
  } = options

  const rng = makeRandom(`branch:${seedKey}`)
  const rngRange = (min: number, max: number) => min + (max - min) * rng()

  const vertexCount = (sections + 1) * (segments + 1) + 2 // +2 for cap centers
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const indices: number[] = []

  // Accumulated orientation for gnarliness
  const orientation = new THREE.Euler(0, 0, 0)
  const orientationQ = new THREE.Quaternion()

  let vi = 0 // vertex index

  for (let i = 0; i <= sections; i++) {
    const t = i / sections

    // Sample curve at this section
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()

    // Compute radius with taper
    let sectionRadius: number
    if (i === sections) {
      sectionRadius = baseRadius * 0.02 // near-zero at tip
    } else {
      sectionRadius = baseRadius * (1 - taper * t)
      // Junction blend: if parentRadius given, first ring matches parent surface
      if (parentRadius && i === 0) {
        sectionRadius = Math.min(sectionRadius, parentRadius * 0.85)
      }
    }

    // Add gnarliness — random orientation perturbation
    if (i > 0) {
      const gnarl = gnarliness * Math.max(1, 1 / Math.sqrt(Math.max(sectionRadius, 0.1)))
      orientation.x += rngRange(-gnarl, gnarl)
      orientation.z += rngRange(-gnarl, gnarl)
    }
    orientationQ.setFromEuler(orientation)

    // Build frame: tangent → normal/binormal
    const up = Math.abs(tangent.y) > 0.99
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(0, 1, 0)
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()
    const binormal = new THREE.Vector3().crossVectors(normal, tangent).normalize()

    // Apply twist
    const twistAngle = twist * t
    const cosT = Math.cos(twistAngle)
    const sinT = Math.sin(twistAngle)
    const twistedNormal = normal.clone().multiplyScalar(cosT).add(binormal.clone().multiplyScalar(sinT))
    const twistedBinormal = normal.clone().multiplyScalar(-sinT).add(binormal.clone().multiplyScalar(cosT))

    // Generate ring vertices
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2

      // Vertex position on the ring
      const ringOffset = twistedNormal.clone().multiplyScalar(Math.cos(angle) * sectionRadius)
        .add(twistedBinormal.clone().multiplyScalar(Math.sin(angle) * sectionRadius))

      // Apply gnarliness rotation
      ringOffset.applyQuaternion(orientationQ)

      const vertex = point.clone().add(ringOffset)
      const vertexNormal = ringOffset.clone().normalize()

      positions[vi * 3] = vertex.x
      positions[vi * 3 + 1] = vertex.y
      positions[vi * 3 + 2] = vertex.z
      normals[vi * 3] = vertexNormal.x
      normals[vi * 3 + 1] = vertexNormal.y
      normals[vi * 3 + 2] = vertexNormal.z
      uvs[vi * 2] = t              // v = along length
      uvs[vi * 2 + 1] = j / segments  // u = around ring

      vi++
    }

    // Generate indices connecting this ring to the next
    if (i < sections) {
      const ringStart = i * (segments + 1)
      const nextRingStart = (i + 1) * (segments + 1)
      for (let j = 0; j < segments; j++) {
        const a = ringStart + j
        const b = ringStart + j + 1
        const c = nextRingStart + j + 1
        const d = nextRingStart + j
        indices.push(a, b, c)
        indices.push(a, c, d)
      }
    }
  }

  // Base cap (close the bottom)
  const baseCenterIdx = vi
  const basePoint = curve.getPointAt(0)
  positions[vi * 3] = basePoint.x
  positions[vi * 3 + 1] = basePoint.y
  positions[vi * 3 + 2] = basePoint.z
  const baseTangent = curve.getTangentAt(0).normalize()
  normals[vi * 3] = -baseTangent.x
  normals[vi * 3 + 1] = -baseTangent.y
  normals[vi * 3 + 2] = -baseTangent.z
  uvs[vi * 2] = 0
  uvs[vi * 2 + 1] = 0.5
  vi++

  for (let j = 0; j < segments; j++) {
    indices.push(baseCenterIdx, j + 1, j)
  }

  // Tip cap
  const tipCenterIdx = vi
  const tipPoint = curve.getPointAt(1)
  positions[vi * 3] = tipPoint.x
  positions[vi * 3 + 1] = tipPoint.y
  positions[vi * 3 + 2] = tipPoint.z
  const tipTangent = curve.getTangentAt(1).normalize()
  normals[vi * 3] = tipTangent.x
  normals[vi * 3 + 1] = tipTangent.y
  normals[vi * 3 + 2] = tipTangent.z
  uvs[vi * 2] = 1
  uvs[vi * 2 + 1] = 0.5
  vi++

  const tipRingStart = sections * (segments + 1)
  for (let j = 0; j < segments; j++) {
    indices.push(tipCenterIdx, tipRingStart + j, tipRingStart + j + 1)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()

  return geometry
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/BranchGeometry.ts
git commit -m "feat(sakura): custom BufferGeometry branch builder — vertex rings, taper, gnarliness"
```

---

## Task 2: Replace TubeGeometry in BranchRenderer

**Files:**
- Modify: `client/src/sakura/BranchRenderer.ts`

Replace `TubeGeometry` calls with `buildBranchGeometry()`. Remove junction sphere creation — child branches now connect directly to parent surface.

- [ ] **Step 1: Update BranchRenderer to use BranchGeometry**

In `client/src/sakura/BranchRenderer.ts`:

Add import at top:
```typescript
import { buildBranchGeometry } from './BranchGeometry'
```

In `buildBranches()`, replace the geometry creation for each branch. Find:
```typescript
    const segments = Math.max(14, Math.min(36, 30 - spec.depth * 2))
    const radialSegments = spec.depth <= 1 ? 14 : spec.depth <= 3 ? 12 : 8
    const geometry = new THREE.TubeGeometry(curve, segments, spec.radius, radialSegments, false)
```

Replace with:
```typescript
    const sections = Math.max(12, Math.min(32, 28 - spec.depth * 2))
    const segments = spec.depth <= 1 ? 12 : spec.depth <= 3 ? 10 : 8
    const taper = spec.branchType === 'root' ? 0.5 : spec.branchType === 'folder' ? 0.65 : 0.8
    const gnarliness = spec.branchType === 'root' ? 0.015 : 0.03 + spec.depth * 0.015
    const twist = hashUnit(spec.id) * 1.5
    // Find parent branch radius for junction blending
    const parentBranch = layout.branches.find(b => b.toPath === spec.fromPath)
    const parentRadius = parentBranch?.radius

    const geometry = buildBranchGeometry({
      curve,
      baseRadius: spec.radius,
      taper,
      gnarliness,
      twist,
      sections,
      segments,
      seedKey: spec.id,
      parentRadius,
    })
```

Note: `buildBranches` needs to accept the full `layout` (already does) to look up parent branch radius.

Next, **remove junction sphere creation**. Find the entire junction collar section (starting with `// Junction collars` comment through the end of the junction loop) and remove it entirely. The return type stays the same but `junctions` is always empty:

Replace the junction section with:
```typescript
  const junctions: JunctionVisual[] = []
  // Junctions are handled by interpolated branch connections — no separate spheres needed
```

- [ ] **Step 2: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Tree should render with smoother, more natural branches. No junction spheres — branches connect directly.

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/BranchRenderer.ts
git commit -m "feat(sakura): use custom BufferGeometry branches, remove junction spheres"
```

---

## Task 3: Crossed-Quad Petal System

**Files:**
- Modify: `client/src/sakura/PetalSystem.ts`

Replace single-plane petals with crossed-quad pairs (two perpendicular quads per petal). This eliminates the edge-on invisibility problem.

- [ ] **Step 1: Rewrite PetalSystem to use crossed quads**

In `client/src/sakura/PetalSystem.ts`, in the constructor, change the geometry and how instances are allocated.

Replace the geometry creation:

Find:
```typescript
    const geometry = new THREE.PlaneGeometry(3.0, 3.6)
```

Replace with:
```typescript
    // Crossed-quad geometry: two perpendicular planes sharing a center
    // This ensures the petal reads as 3D volume from every camera angle
    const geo1 = new THREE.PlaneGeometry(2.8, 3.4)
    const geo2 = new THREE.PlaneGeometry(2.8, 3.4)
    // Rotate second plane 90 degrees around Y axis
    geo2.rotateY(Math.PI / 2)
    // Merge into one geometry
    const geometry = mergeBufferGeometries([geo1, geo2])
    geo1.dispose()
    geo2.dispose()
```

Add a helper function at the top of the file (after imports):
```typescript
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
```

If `mergeBufferGeometries` isn't available or causes issues, manually merge:
```typescript
function createCrossedQuadGeometry(width: number, height: number): THREE.BufferGeometry {
  const half = width / 2
  const hh = height / 2
  // Plane 1: facing Z
  // Plane 2: facing X (rotated 90 deg)
  const positions = new Float32Array([
    // Plane 1
    -half, -hh, 0,   half, -hh, 0,   half, hh, 0,   -half, hh, 0,
    // Plane 2
    0, -hh, -half,   0, -hh, half,   0, hh, half,   0, hh, -half,
  ])
  const normals = new Float32Array([
    // Plane 1 normals (Z)
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Plane 2 normals (X)
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
  ])
  const uvs = new Float32Array([
    0, 0,  1, 0,  1, 1,  0, 1,
    0, 0,  1, 0,  1, 1,  0, 1,
  ])
  const indices = [
    0, 1, 2,  0, 2, 3,  // plane 1 front
    0, 2, 1,  0, 3, 2,  // plane 1 back
    4, 5, 6,  4, 6, 7,  // plane 2 front
    4, 6, 5,  4, 7, 6,  // plane 2 back
  ]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  return geo
}
```

Replace the `PlaneGeometry` creation with:
```typescript
    const geometry = createCrossedQuadGeometry(2.8, 3.4)
```

Since the material is already DoubleSide, both faces of each quad render. The crossed geometry means at least one face is visible from any angle.

Since each petal is now TWO quads but still ONE instance, the instance count stays the same. No capacity changes needed.

- [ ] **Step 2: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Petals should be visible from all camera angles. No more edge-on disappearing.

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/PetalSystem.ts
git commit -m "feat(sakura): crossed-quad petals — visible from every angle"
```

---

## Task 4: Add Growth Types

**Files:**
- Modify: `client/src/sakura/types.ts`

- [ ] **Step 1: Add growth-related types**

In `client/src/sakura/types.ts`, add after the `TreeLayout` interface:

```typescript
export interface GrowthAction {
  type: 'branch' | 'blossom'
  path: string
  parentPath: string | null
  spec: TreeBranch | BlossomAnchor
}
```

Update `BranchVisual` to include growth fields:

```typescript
export interface BranchVisual {
  spec: TreeBranch
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  curve: THREE.CatmullRomCurve3
  pulse: number
  contamination: number
  pulseColor: THREE.Color
  growthProgress: number     // 0 = not born, 1 = fully grown
  growthTarget: number       // what we're animating toward
  growthStartTime: number    // when growth began (elapsed time)
  growthDuration: number     // 2-3 seconds
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npx tsc --noEmit
```

Expected: errors in files that create BranchVisual without the new fields — that's fine, Task 5 fixes them.

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/types.ts
git commit -m "feat(sakura): add growth types — GrowthAction, BranchVisual growth fields"
```

---

## Task 5: Add uGrowth to Bark Vertex Shader

**Files:**
- Modify: `client/src/sakura/shaders/bark.vert.glsl`
- Modify: `client/src/sakura/BranchRenderer.ts`

- [ ] **Step 1: Add uGrowth uniform to bark vertex shader**

In `client/src/sakura/shaders/bark.vert.glsl`, add uniform after the existing ones:

```glsl
uniform float uGrowth; // 0 = collapsed to base, 1 = fully grown
```

In `main()`, after `vUv = uv;` and before the breathing line, add growth collapse logic:

```glsl
  // Growth animation — collapse vertices beyond growth front to tip of visible section
  float v = uv.x; // v = along length (0 at base, 1 at tip)
  if (v > uGrowth) {
    // Collapse this vertex toward the growth front
    // Find where the growth front is on the curve
    float collapse = smoothstep(uGrowth, uGrowth + 0.05, v);
    // Scale radius to zero at growth front
    vec3 center = position - normal * length(position - vec3(position.x, position.y, position.z)); // approximate
    // Simpler: just shrink the displacement from center axis
    float radiusScale = 1.0 - collapse;
    // We can't easily find the curve center in the vertex shader
    // Instead: scale the entire vertex toward (0, growthY, 0)
    // But we don't know growthY...
    // Simplest approach: just discard/hide by setting position offscreen
    // Actually: the cleanest approach is to set position = previous ring position
    // For now: scale position.xz toward 0 (branch axis) and clamp y
  }
```

Actually, the cleanest growth approach for a custom BufferGeometry: **don't use the shader**. Instead, when creating geometry in `buildBranchGeometry`, parameterize which sections are visible. On growth tick, rebuild the visible portion of the geometry (update only vertex positions, not indices). This is simpler and more correct.

**Revised approach — CPU-side growth:**

In `BranchGeometry.ts`, add a function:

```typescript
export function updateBranchGrowth(
  geometry: THREE.BufferGeometry,
  curve: THREE.CatmullRomCurve3,
  growthProgress: number, // 0-1
  sections: number,
  segments: number,
  baseRadius: number,
  taper: number,
): void {
  const positions = geometry.attributes.position as THREE.BufferAttribute
  const arr = positions.array as Float32Array

  const visibleSections = Math.floor(growthProgress * sections)
  const tipT = growthProgress
  const tipPoint = curve.getPointAt(Math.min(tipT, 1))

  for (let i = 0; i <= sections; i++) {
    const t = i / sections
    for (let j = 0; j <= segments; j++) {
      const vi = i * (segments + 1) + j
      if (t > growthProgress) {
        // Collapse to tip point
        arr[vi * 3] = tipPoint.x
        arr[vi * 3 + 1] = tipPoint.y
        arr[vi * 3 + 2] = tipPoint.z
      }
      // else: keep original position (already set during initial build)
    }
  }
  positions.needsUpdate = true
}
```

This collapses unborn sections to the growth tip. As `growthProgress` increases, they unfurl to their final positions. Simple, correct, no shader complexity.

- [ ] **Step 2: Add uGrowth uniform to BranchRenderer (for potential shader use later) and set growth fields**

In `client/src/sakura/BranchRenderer.ts`, in `makeBarkMaterial()`, add uniform:
```typescript
      uGrowth: { value: 1.0 }, // 1.0 = fully grown by default
```

In `buildBranches()`, when creating BranchVisual, add growth fields:
```typescript
    branches.set(spec.id, {
      spec,
      mesh,
      material,
      curve,
      pulse: 0,
      contamination: 0,
      pulseColor: new THREE.Color('#e8a88a'),
      growthProgress: 1.0,      // existing branches start fully grown
      growthTarget: 1.0,
      growthStartTime: 0,
      growthDuration: 2.5,
    })
```

- [ ] **Step 3: Typecheck**

```bash
cd client && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/BranchGeometry.ts client/src/sakura/BranchRenderer.ts client/src/sakura/shaders/bark.vert.glsl
git commit -m "feat(sakura): growth animation — CPU-side vertex collapse + shader uniform"
```

---

## Task 6: Incremental TreeBuilder

**Files:**
- Rewrite: `client/src/sakura/TreeBuilder.ts`

The current `buildTreeLayout()` builds everything at once. Add an `IncrementalTreeBuilder` class that can add paths one at a time.

- [ ] **Step 1: Add IncrementalTreeBuilder class**

At the end of `client/src/sakura/TreeBuilder.ts` (keeping all existing functions), add:

```typescript
export class IncrementalTreeBuilder {
  readonly layout: TreeLayout = {
    nodes: new Map(),
    branches: [],
    blossomAnchors: new Map(),
    tipPaths: [],
    maxDepth: 0,
  }

  private rootWeight = 100 // estimated; doesn't change layout stability
  private rootPosition = new THREE.Vector3()
  private trunkDirection = new THREE.Vector3(0, 1, 0)
  private lean = new THREE.Vector3()
  private trunkBuilt = false

  constructor(private seedKey: string) {
    const leanRng = makeRandom(`${seedKey}:lean`)
    const leanAngle = rand(leanRng, 0, Math.PI * 2)
    const leanStrength = rand(leanRng, 0.07, 0.18)
    this.lean = new THREE.Vector3(Math.cos(leanAngle) * leanStrength, 0, Math.sin(leanAngle) * leanStrength)
    this.trunkDirection = new THREE.Vector3(this.lean.x, 1, this.lean.z).normalize()
  }

  /**
   * Add a file path to the tree. Creates all missing ancestor branches.
   * Returns GrowthAction[] for branches/blossoms that need to be created.
   */
  addPath(filePath: string, rootPath: string): GrowthAction[] {
    const actions: GrowthAction[] = []

    // Parse path into segments: "client/src/App.tsx" → ["client", "client/src", "client/src/App.tsx"]
    const parts = filePath.split('/').filter(Boolean)
    const segments: { path: string; name: string; isFile: boolean }[] = []
    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join('/')
      segments.push({ path, name: parts[i], isFile: i === parts.length - 1 })
    }

    // Ensure trunk exists
    if (!this.trunkBuilt) {
      this.buildTrunk(rootPath)
      this.trunkBuilt = true
    }

    // Walk the path, creating missing branches
    let parentPath: string = rootPath
    let parentPosition = this.rootPosition.clone()
    let parentDirection = this.trunkDirection.clone()
    let depth = 0

    // Find the trunk endpoint
    const trunkBranch = this.layout.branches.find(b => b.isSyntheticRoot)
    if (trunkBranch) {
      parentPosition = trunkBranch.curvePoints[trunkBranch.curvePoints.length - 1].clone()
    }

    for (const segment of segments) {
      depth++
      this.layout.maxDepth = Math.max(this.layout.maxDepth, depth)

      // Already exists?
      if (this.layout.nodes.has(segment.path)) {
        const existing = this.layout.nodes.get(segment.path)!
        parentPath = segment.path
        parentPosition = existing.position.clone()
        // Recover direction from the branch
        const branch = this.layout.branches.find(b => b.toPath === segment.path)
        if (branch && branch.curvePoints.length >= 2) {
          const pts = branch.curvePoints
          parentDirection = pts[pts.length - 1].clone().sub(pts[pts.length - 2]).normalize()
        }
        continue
      }

      // Create new branch for this segment
      const rng = makeRandom(`${this.seedKey}:${segment.path}`)
      const branchType: 'folder' | 'file' = segment.isFile ? 'file' : 'folder'
      const weight = segment.isFile ? 1 : 5
      const radius = branchRadius(depth, branchType, weight, this.rootWeight)
      const length = branchLength(depth, branchType, weight, this.rootWeight, rng)

      // Compute direction using the same radial spread algorithm
      const basis = makeBasis(parentDirection)
      const canopy = clamp((depth + 1) / 6, 0, 1)
      const childAngle = hashString(`${this.seedKey}:${segment.path}:angle`) / 4294967296 * Math.PI * 2
      const spread = THREE.MathUtils.lerp(0.4, 1.6, canopy) + 0.3
      const radialU = Math.cos(childAngle) * spread
      const radialV = Math.sin(childAngle) * spread
      const upward = branchType === 'folder'
        ? THREE.MathUtils.lerp(0.85, 0.1, canopy)
        : THREE.MathUtils.lerp(0.4, -0.15, canopy)
      const continuation = depth <= 1 ? 0.92 : depth <= 2 ? 0.65 : 0.4
      const droop = branchType === 'folder'
        ? clamp((depth - 1) * 0.06, 0, 0.22)
        : clamp(0.1 + depth * 0.07, 0.1, 0.45)

      const childDirection = parentDirection.clone()
        .multiplyScalar(continuation)
        .add(new THREE.Vector3(0, 1, 0).multiplyScalar(upward))
        .add(basis.u.clone().multiplyScalar(radialU))
        .add(basis.v.clone().multiplyScalar(radialV))
        .add(this.lean.clone().multiplyScalar(0.12 + canopy * 0.18))
        .add(new THREE.Vector3(0, -1, 0).multiplyScalar(droop))
        .normalize()

      const childPosition = parentPosition.clone().add(childDirection.clone().multiplyScalar(length))

      // Bezier control points
      const bend = (branchType === 'folder' ? 5.2 : 2.7) * (0.94 + canopy * 0.55)
      const ctrl1 = parentPosition.clone()
        .lerp(childPosition, 0.28)
        .add(new THREE.Vector3(0, upward * bend * 0.68, 0))
        .add(basis.u.clone().multiplyScalar(radialU * bend * 0.3))
        .add(basis.v.clone().multiplyScalar(radialV * bend * 0.3))
      const ctrl2 = parentPosition.clone()
        .lerp(childPosition, 0.74)
        .add(basis.u.clone().multiplyScalar(radialU * bend * 0.15))
        .add(basis.v.clone().multiplyScalar(radialV * bend * 0.15))
        .add(new THREE.Vector3(0, branchType === 'folder' ? bend * 0.16 : -bend * 0.08, 0))

      const branchId = `${parentPath}->${segment.path}`
      const branchSpec: TreeBranch = {
        id: branchId,
        fromPath: parentPath,
        toPath: segment.path,
        curvePoints: [parentPosition.clone(), ctrl1, ctrl2, childPosition.clone()],
        depth,
        radius,
        subtreeWeight: weight,
        branchType,
      }
      this.layout.branches.push(branchSpec)

      // Create node
      this.layout.nodes.set(segment.path, {
        id: segment.path,
        path: segment.path,
        type: branchType,
        depth,
        position: childPosition.clone(),
        parentPath,
        children: [],
        branchId,
        subtreeWeight: weight,
      })

      // Update parent's children list
      const parentNode = this.layout.nodes.get(parentPath)
      if (parentNode) parentNode.children.push(segment.path)

      actions.push({ type: 'branch', path: segment.path, parentPath, spec: branchSpec })

      // If file, add blossom
      if (segment.isFile) {
        this.layout.tipPaths.push(segment.path)
        const anchor: BlossomAnchor = {
          path: segment.path,
          position: childPosition.clone(),
          direction: childDirection.clone(),
          depth,
          scale: clamp(1.02 - depth * 0.05, 0.42, 1.02),
        }
        this.layout.blossomAnchors.set(segment.path, anchor)
        actions.push({ type: 'blossom', path: segment.path, parentPath: segment.path, spec: anchor })
      }

      parentPath = segment.path
      parentPosition = childPosition
      parentDirection = childDirection
    }

    return actions
  }

  private buildTrunk(rootPath: string) {
    const trunkRng = makeRandom(`${this.seedKey}:trunk`)
    const trunkLength = branchLength(0, 'root', this.rootWeight, this.rootWeight, trunkRng, true)
    const groundPosition = new THREE.Vector3(0, 0, 0)
    this.rootPosition = groundPosition.clone().add(this.trunkDirection.clone().multiplyScalar(trunkLength))

    const rootBranchId = `__ground__->${rootPath}`
    const rootCtrl1 = groundPosition.clone()
      .lerp(this.rootPosition, 0.32)
      .add(new THREE.Vector3(this.lean.x * 12, 4.5, this.lean.z * 12))
    const rootCtrl2 = groundPosition.clone()
      .lerp(this.rootPosition, 0.74)
      .add(new THREE.Vector3(this.lean.x * 18, 2.2, this.lean.z * 18))

    const trunkSpec: TreeBranch = {
      id: rootBranchId,
      fromPath: '__ground__',
      toPath: rootPath,
      curvePoints: [groundPosition.clone(), rootCtrl1, rootCtrl2, this.rootPosition.clone()],
      depth: 0,
      radius: branchRadius(0, 'root', this.rootWeight, this.rootWeight, true),
      subtreeWeight: this.rootWeight,
      branchType: 'root',
      isSyntheticRoot: true,
    }
    this.layout.branches.push(trunkSpec)

    this.layout.nodes.set(rootPath, {
      id: rootPath,
      path: rootPath,
      type: 'folder',
      depth: 0,
      position: this.rootPosition.clone(),
      parentPath: null,
      children: [],
      branchId: rootBranchId,
      subtreeWeight: this.rootWeight,
    })
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/TreeBuilder.ts
git commit -m "feat(sakura): IncrementalTreeBuilder — addPath() grows tree from events"
```

---

## Task 7: Wire Growth into SakuraApp + SignalSystem

**Files:**
- Modify: `client/src/sakura/SakuraApp.ts`
- Modify: `client/src/sakura/SignalSystem.ts`

- [ ] **Step 1: Update SakuraApp to use IncrementalTreeBuilder**

In `client/src/sakura/SakuraApp.ts`:

Add import:
```typescript
import { IncrementalTreeBuilder } from './TreeBuilder'
import { buildBranchGeometry, updateBranchGrowth } from './BranchGeometry'
```

Replace `ColonyVisual` creation in `createColony()` — instead of building full layout, create an empty IncrementalTreeBuilder:

Replace the `createColony` method:
```typescript
  private createColony(projectState: ProjectVisualState, signature: string): ColonyVisual {
    const tree = projectState.tree!
    const group = new THREE.Group()
    const treeBuilder = new IncrementalTreeBuilder(projectState.project.id)

    // Build trunk immediately
    treeBuilder.addPath('.', tree.rootPath)
    const trunkSpec = treeBuilder.layout.branches[0]
    if (trunkSpec) {
      this.growBranch(group, trunkSpec, new Map(), 0, 0) // instant trunk
    }

    return {
      id: projectState.project.id,
      rootPath: tree.rootPath,
      signature,
      group,
      activity: projectState.activity,
      layout: treeBuilder.layout,
      branches: new Map(),
      junctions: [],
      petalInstanceIds: [],
      heat: 0.12,
      contamination: 0,
      boost: 0,
      idleOffset: hashUnit(projectState.project.id) * Math.PI * 2,
      treeBuilder, // store for incremental growth
    }
  }
```

Add `treeBuilder` to `ColonyVisual` in types.ts:
```typescript
  treeBuilder?: IncrementalTreeBuilder
```

Add a `growBranch` helper method:
```typescript
  private growBranch(
    group: THREE.Group,
    spec: TreeBranch,
    branches: Map<string, BranchVisual>,
    elapsed: number,
    duration: number, // 0 = instant
  ) {
    const curve = new THREE.CatmullRomCurve3(spec.curvePoints.map(p => p.clone()), false, 'catmullrom', 0.45)
    const sections = Math.max(12, Math.min(32, 28 - spec.depth * 2))
    const segments = spec.depth <= 1 ? 12 : spec.depth <= 3 ? 10 : 8
    const taper = spec.branchType === 'root' ? 0.5 : spec.branchType === 'folder' ? 0.65 : 0.8
    const gnarliness = spec.branchType === 'root' ? 0.015 : 0.03 + spec.depth * 0.015

    const geometry = buildBranchGeometry({
      curve,
      baseRadius: spec.radius,
      taper,
      gnarliness,
      twist: hashUnit(spec.id) * 1.5,
      sections,
      segments,
      seedKey: spec.id,
    })

    const material = makeBarkMaterial(hashUnit(spec.id))
    material.uniforms.uDepth.value = spec.depth
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.renderOrder = 2
    group.add(mesh)

    const startGrown = duration === 0 ? 1.0 : 0.0
    branches.set(spec.id, {
      spec, mesh, material, curve,
      pulse: 0, contamination: 0, pulseColor: new THREE.Color('#e8a88a'),
      growthProgress: startGrown,
      growthTarget: 1.0,
      growthStartTime: elapsed,
      growthDuration: duration || 2.5,
    })
  }
```

Import `makeBarkMaterial` from BranchRenderer if not already imported.

- [ ] **Step 2: Update SignalSystem to trigger growth**

In `client/src/sakura/SignalSystem.ts`, in the `route()` method, before routing to effects, add growth:

```typescript
    // Growth: if this event has a file path, grow the tree
    const GROWTH_TOOLS = new Set(['Read', 'Edit', 'Write', 'Grep', 'Glob'])
    if (GROWTH_TOOLS.has(tool) && directPath && colony.treeBuilder) {
      const actions = colony.treeBuilder.addPath(directPath, colony.rootPath)
      for (const action of actions) {
        if (action.type === 'branch') {
          // Notify SakuraApp to create branch geometry with growth animation
          this.onGrowth?.(colony, action)
        } else if (action.type === 'blossom') {
          // Notify SakuraApp to allocate petal cluster
          this.onBlossom?.(colony, action)
        }
      }
    }
```

Add callback fields to SignalSystem constructor:
```typescript
  onGrowth?: (colony: ColonyVisual, action: GrowthAction) => void
  onBlossom?: (colony: ColonyVisual, action: GrowthAction) => void
```

- [ ] **Step 3: Wire growth callbacks in SakuraApp**

After creating SignalSystem:
```typescript
    this.signalSystem.onGrowth = (colony, action) => {
      const spec = action.spec as TreeBranch
      this.growBranch(colony.group, spec, colony.branches, this.elapsed, 2.5)
    }
    this.signalSystem.onBlossom = (colony, action) => {
      const anchor = action.spec as BlossomAnchor
      const ids = this.petalSystem.allocateCluster(anchor)
      colony.petalInstanceIds.push(...ids)
    }
```

- [ ] **Step 4: Add growth animation to tick loop**

In `tick()`, after updating branch uniforms, add growth tick:

```typescript
    // Growth animation
    for (const colony of this.colonies.values()) {
      for (const branch of colony.branches.values()) {
        if (branch.growthProgress < branch.growthTarget) {
          const t = (this.elapsed - branch.growthStartTime) / branch.growthDuration
          const eased = Math.min(1, 1 - Math.pow(1 - Math.min(t, 1), 4)) // easeOutQuart
          branch.growthProgress = eased
          branch.material.uniforms.uGrowth.value = eased
          // CPU-side vertex collapse for unborn sections
          // (call updateBranchGrowth if using CPU approach)
        }
      }
    }
```

- [ ] **Step 5: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Tree should start with just the trunk. Fire a Read event via debug panel — a branch should grow from the trunk to the target file over 2-3 seconds.

- [ ] **Step 6: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SakuraApp.ts client/src/sakura/SignalSystem.ts client/src/sakura/types.ts
git commit -m "feat(sakura): live tree growth — events grow branches in real-time"
```

---

## Implementation Order

| Task | What | Depends On |
|------|------|------------|
| 1 | Custom BufferGeometry builder | Nothing |
| 2 | Replace TubeGeometry in BranchRenderer | Task 1 |
| 3 | Crossed-quad petals | Nothing |
| 4 | Growth types | Nothing |
| 5 | Growth animation (shader + geometry) | Tasks 1, 4 |
| 6 | Incremental TreeBuilder | Task 4 |
| 7 | Wire growth into SakuraApp + SignalSystem | Tasks 2, 3, 5, 6 |

Tasks 1, 3, 4 are independent. Task 6 is independent of 1-3 but needs 4. Tasks 2, 5 need 1. Task 7 needs everything.
