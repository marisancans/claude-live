# Sakura Geometry Rewrite + Live Growth — Design Spec

**Date:** 2026-04-03
**Status:** Approved
**Scope:** Replace TubeGeometry/PlaneGeometry with EZ-Tree-style custom BufferGeometry. Add live growth system — tree starts empty, branches grow organically as events with file paths arrive.

---

## 1. Custom BufferGeometry Branches

Replace TubeGeometry with vertex-ring generation per branch.

### Per Branch Section
- 8-12 vertices per ring (12 on trunk, 8 on twigs)
- 10-30 rings per branch (based on length/depth)
- Radius tapers: `radius *= 1 - taper * (i / sectionCount)` where taper is 0.6-0.8
- Gnarliness: accumulate small random Euler rotations between sections: `orientation.x += rng(-gnarliness, gnarliness)`, `orientation.z += rng(-gnarliness, gnarliness)`. Gnarliness increases with depth (trunk=0.02, twigs=0.12).
- Twist: rotate around branch axis by `twist * (i / sectionCount)` per section

### Vertex Layout
```
positions: Float32Array  // xyz per vertex
normals: Float32Array    // xyz per vertex (ring outward direction)
uvs: Float32Array        // u = around ring [0,1], v = along length [0,1]
indices: Uint32Array     // triangles connecting adjacent rings
```

### Junction Connections
Child branches spawn from parent's surface. The child's first vertex ring is positioned at a point interpolated along the parent branch's sections. No separate sphere geometry. The child's base radius matches the parent's surface radius at the fork point.

### Material
Same bark ShaderMaterial as current (with depth colors, normal map, lenticels), but the geometry feeding it is dramatically better. The `uv.x` mapping (along length) now maps to proper vertex positions instead of TubeGeometry's auto-UV.

---

## 2. Crossed-Quad Leaf Pairs

Each file endpoint gets a blossom cluster of crossed quad pairs.

### Per Blossom
- 6-10 crossed quad pairs per file (12-20 individual quads)
- Each pair: two PlaneGeometry quads rotated 90 degrees around their shared center
- Canvas-generated petal texture with alpha (existing approach)
- `alphaTest: 0.5`, DoubleSide
- Random scale (0.6-1.2) and rotation per pair
- Spread in a disc around the branch tip

### Why Crossed Quads
Single planes are invisible edge-on. Two perpendicular planes ensure the blossom reads from every camera angle. This is the standard real-time foliage technique.

### Implementation
- One `InstancedMesh` per quad orientation (two meshes total — one base, one rotated 90 degrees)
- Or: single InstancedMesh but each "pair" is two instances with perpendicular rotations
- Simpler: keep single InstancedMesh, but for each petal allocate TWO instances with perpendicular rotation matrices. This doubles instance count but keeps one draw call.

---

## 3. Live Growth System

### Initial State
Scene starts with just the root trunk stub. No branches, no leaves.

### Growth Trigger
When a `PreToolUse` event arrives with a file path (`Read`, `Edit`, `Write`, `Grep`, `Glob`):
1. Resolve path to ancestry: `file → parent folder → ... → project root`
2. For each segment in the chain that doesn't have a branch yet:
   - Compute branch layout (position, direction, radius, length) using the existing TreeBuilder algorithm
   - Create the BufferGeometry
   - Start growth animation: `growthProgress` from 0 → 1 over 2-3 seconds
3. For the terminal file: allocate blossom cluster, fade in during last 30% of branch growth

### Growth Animation (Vertex Shader)
```glsl
uniform float uGrowth; // 0 = collapsed, 1 = fully grown

void main() {
  float v = uv.y; // 0 at base, 1 at tip
  // Vertices beyond growth front collapse to the growth tip
  float growthV = clamp(v / max(uGrowth, 0.001), 0.0, 1.0);
  // Interpolate position between base and where it should be
  vec3 grownPos = mix(basePosition, position, step(v, uGrowth));
  // Taper radius to zero at growth front
  float radiusScale = smoothstep(uGrowth, uGrowth - 0.1, v);
  ...
}
```

The actual implementation: store the full geometry but use `uGrowth` to collapse unborn vertices to the tip of the visible section. As `uGrowth` increases, vertices unfurl to their final positions.

### Growth Easing
`growthProgress` eases with `easeOutQuart`: fast initial push, slow settling at full extension. Duration 2-3 seconds per branch, staggered 0.3s between parent and child.

### Already-Existing Paths
If the branch for a path already exists and is fully grown, skip growth — trigger normal event effect (sap flow, pulse).

### Blossom Growth
Blossoms appear during the last 30% of branch growth:
- Scale from 0 → 1 over that window
- Opacity from 0 → 1
- Slight "opening" rotation (petals start closed, unfurl)

---

## 4. Incremental TreeBuilder

The current `buildTreeLayout()` builds everything at once from a full filesystem tree. For live growth, we need incremental addition.

### New API
```typescript
class IncrementalTreeBuilder {
  private layout: TreeLayout  // grows over time
  
  constructor(seedKey: string, rootWeight: number)
  
  // Add a single path (creates all missing ancestor branches)
  addPath(filePath: string, projectTree: ProjectTreeNode): GrowthAction[]
  
  // Returns branches to create + blossoms to add
  getLayout(): TreeLayout
}

interface GrowthAction {
  type: 'branch' | 'blossom'
  path: string
  parentPath: string | null
  spec: TreeBranch | BlossomAnchor
}
```

`addPath()` walks the path segments, checks if each folder/file already exists in the layout, and for missing ones computes position/direction/radius using the same algorithm as the current TreeBuilder. Returns a list of `GrowthAction` items that SakuraApp uses to create geometry and start growth animations.

### Layout Stability
When adding new branches, existing branch positions must NOT change. The incremental builder remembers where everything is and only adds new geometry. The tree grows outward — never reshuffles.

---

## 5. Branch State

```typescript
interface BranchVisual {
  spec: TreeBranch
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  growthProgress: number      // 0 = not born, 1 = fully grown
  growthTarget: number        // what we're animating toward (1.0 when growing)
  growthStartTime: number     // when growth began (for easing)
  growthDuration: number      // 2-3 seconds
}
```

In `tick()`, for each branch with `growthProgress < growthTarget`:
```typescript
const t = (elapsed - branch.growthStartTime) / branch.growthDuration
branch.growthProgress = Math.min(branch.growthTarget, easeOutQuart(clamp(t, 0, 1)))
branch.material.uniforms.uGrowth.value = branch.growthProgress
```

---

## 6. File Changes

| File | Action | What Changes |
|------|--------|-------------|
| `TreeBuilder.ts` | **Rewrite** | `IncrementalTreeBuilder` class, `addPath()` method, same spatial algorithm |
| `BranchRenderer.ts` | **Rewrite** | `buildBranchGeometry()` with vertex rings + taper + gnarliness, `uGrowth` uniform |
| `PetalSystem.ts` | **Rewrite** | Crossed quad pairs, growth-aware (scale from 0 during branch growth) |
| `shaders/bark.vert.glsl` | **Modify** | Add `uGrowth` uniform, collapse vertices beyond growth front |
| `SakuraApp.ts` | **Modify** | Growth tick loop, incremental path addition, start with empty tree |
| `SignalSystem.ts` | **Modify** | Trigger growth via `addPath()` for events with file paths, then route effects |
| `types.ts` | **Modify** | Add `GrowthAction`, growth fields to `BranchVisual` |

---

## 7. Events Without Paths

`Bash`, `UserPromptSubmit`, `SessionStart`, `SubagentStart`, etc. — events without file paths do NOT grow the tree. They trigger effects on existing branches only (trunk pulse, canopy shimmer, etc.). If the tree is still mostly bare, these effects are subtle — just the trunk glowing.

---

## 8. Success Criteria

- Tree starts empty (just trunk stub)
- First `Read` event grows the full ancestry chain to that file — visible branch extension over 2-3s
- Subsequent events to the same file don't re-grow, just trigger effects
- Events to new files in existing folders grow only the new twig
- Branch geometry has natural taper, gnarliness, smooth junctions
- No visible square artifacts on petals (crossed quads + alpha test)
- User can watch the tree build itself during a coding session
