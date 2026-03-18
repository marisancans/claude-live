# Agent Animation Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route animation origins to agent stars when actions originate from agent sessions, creating visual connection between agents and their operations.

**Architecture:** Add session-to-agent mapping in the visualization state. When creating animations (projectiles), check if the originating session is an agent and route the animation origin from that agent's star position instead of the cluster core. Hook into agent lifecycle (spawn/terminate) to register/unregister sessions.

**Tech Stack:** TypeScript, Canvas 2D rendering, Vite (client build)

---

## File Structure

```
client/src/
  types.ts                    — Add AgentSessionInfo type, extend Cluster
  store.ts                    — Add agentSessionMap management, session registration
  canvas/graph.ts             — Add helpers for agent position lookup
  canvas/renderer.ts          — Modify projectile origin computation
  canvas/PixiScene.tsx        — Hook agent spawn/terminate into lifecycle
```

---

### Task 1: Add Type Definitions for Agent Session Mapping

**Files:**
- Modify: `client/src/types.ts`

- [ ] **Step 1: Add AgentSessionInfo type**

Open `client/src/types.ts` and add after the Projectile interface:

```typescript
// Agent session position tracking for animation routing
export interface AgentSessionInfo {
  sessionId: string           // unique agent session identifier
  position: {x: number, y: number}  // current orbital position (updates each frame)
  angle: number              // current angle in orbit (0-360 in radians)
  radius: number             // orbit radius (fixed, matches orbitRadius of agent node)
  spawnTime: number          // when agent spawned
}
```

- [ ] **Step 2: Extend Cluster type**

Find the `Cluster` interface (around line 95) and add this field:

```typescript
  // Maps session IDs to their agent star positions (for animation routing)
  // Only contains entries for direct child agents, not nested agents
  agentSessionMap: Map<string, AgentSessionInfo>
```

- [ ] **Step 3: Verify types compile**

```bash
npm run build --no-optimize 2>&1 | head -30
```

Expected: No TypeScript errors related to types.

- [ ] **Step 4: Commit**

```bash
git add client/src/types.ts
git commit -m "feat: add AgentSessionInfo type and agentSessionMap to Cluster"
```

---

### Task 2: Initialize Agent Session Map in Clusters

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate cluster initialization**

Find the code that creates new Cluster instances. Should be near the top-level state management. Look for `new Cluster()` or cluster creation.

- [ ] **Step 2: Initialize agentSessionMap**

In cluster creation, add:

```typescript
// When creating a new cluster, initialize the agent mapping
agentSessionMap: new Map<string, AgentSessionInfo>()
```

Ensure this is done in:
- Initial cluster creation
- Any cluster cloning/reset functions

- [ ] **Step 3: Add helper function to get agent origin**

Add to `store.ts` after the cluster creation code:

```typescript
/**
 * Get the animation origin point for a session.
 * If the session is an agent, returns the agent star position.
 * Otherwise, returns the cluster core position.
 */
export function getAnimationOrigin(
  cluster: Cluster,
  sessionId: string
): {x: number, y: number} {
  const agentInfo = cluster.agentSessionMap.get(sessionId)
  if (agentInfo) {
    return agentInfo.position
  }
  // Fallback to core position
  return {x: cluster.centerX, y: cluster.centerY}
}
```

- [ ] **Step 4: Test the helper function**

```bash
npm run build 2>&1 | head -30
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: initialize agentSessionMap and add getAnimationOrigin helper"
```

---

### Task 3: Register Agent Sessions on Spawn

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx` (or similar lifecycle hook)
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate event processing for SubagentStart**

Search for `SubagentStart` hook event handling in the codebase:

```bash
grep -r "SubagentStart" client/src --include="*.ts" --include="*.tsx"
```

This should be where agents are spawned and agent nodes are created.

- [ ] **Step 2: Find where agent nodes are created**

In the same file, locate where `nodeType === 'agent'` nodes are added to `cluster.nodes`.

- [ ] **Step 3: Add registration code after agent node creation**

After the agent node is created and positioned in the orbit ring, add:

```typescript
// Register agent session for animation routing
cluster.agentSessionMap.set(agentSessionId, {
  sessionId: agentSessionId,
  position: {x: agentNode.x, y: agentNode.y},
  angle: agentNode.orbitAngle,
  radius: agentNode.orbitRadius,
  spawnTime: Date.now()
})
```

- [ ] **Step 4: Test with single agent spawn**

Start the dev server and spawn an agent. Verify no console errors:

```bash
npm run dev
# Open http://localhost:5173
# Trigger an agent spawn (via Claude Code session)
```

Check browser console (F12) for any errors related to agentSessionMap.

- [ ] **Step 5: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: register agent sessions in agentSessionMap on spawn"
```

---

### Task 4: Update Agent Positions Each Frame

**Files:**
- Modify: `client/src/canvas/graph.ts` (or animation loop in PixiScene)

- [ ] **Step 1: Locate the animation frame update loop**

Find where agent node positions are updated each frame (orbital animation loop). Should be in the main update function.

- [ ] **Step 2: Add position sync after agent orbital update**

After agent node position is updated in the orbital animation, sync to agentSessionMap:

```typescript
// Sync agent position to animation routing map
if (cluster.agentSessionMap.has(agentNode.sessionId)) {
  const info = cluster.agentSessionMap.get(agentNode.sessionId)!
  info.position = {x: agentNode.x, y: agentNode.y}
  info.angle = agentNode.orbitAngle
}
```

Do this for each agent node in the cluster.

- [ ] **Step 3: Verify no performance impact**

The lookup and assignment are O(1). Should have no measurable impact.

- [ ] **Step 4: Commit**

```bash
git add client/src/canvas/graph.ts
git commit -m "feat: sync agent node positions to agentSessionMap each frame"
```

---

### Task 5: Modify Projectile Rendering to Use Agent Origin

**Files:**
- Modify: `client/src/canvas/renderer.ts`

- [ ] **Step 1: Locate projectile rendering code**

Find the projectile loop around line 445:

```typescript
for (const p of projectiles) {
  const ox = p.cluster.centerX, oy = p.cluster.centerY
  const nx = p.node.x, ny = p.node.y
  const from = p.inbound ? { x: nx, y: ny } : { x: ox, y: oy }
```

- [ ] **Step 2: Import getAnimationOrigin**

At the top of renderer.ts, add:

```typescript
import { getAnimationOrigin } from '../store'
```

- [ ] **Step 3: Compute origin dynamically**

Replace the hardcoded origin (`ox`, `oy`) with a dynamic lookup:

```typescript
for (const p of projectiles) {
  const [r, g, b] = hexToRgb(p.colorHex)

  // Get origin: agent star if action from agent, otherwise core
  const origin = getAnimationOrigin(p.cluster, p.sessionId)
  const ox = origin.x, oy = origin.y

  const nx = p.node.x, ny = p.node.y
  const from = p.inbound ? { x: nx, y: ny } : { x: ox, y: oy }
  const to   = p.inbound ? { x: ox, y: oy } : { x: nx, y: ny }
  _drawProjectile(ctx, p.tool, p.progress, from, to, r, g, b, t)
}
```

- [ ] **Step 4: Test visual rendering**

```bash
npm run dev
# Open http://localhost:5173
# Spawn agent and run tools
# Observe: animations should originate from agent star, not core
```

- [ ] **Step 5: Commit**

```bash
git add client/src/canvas/renderer.ts
git commit -m "feat: route animation origins through getAnimationOrigin"
```

---

### Task 6: Clean Up on Agent Termination

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx` (or SubagentStop handler)

- [ ] **Step 1: Locate SubagentStop event handling**

Find where `SubagentStop` events are processed and agent nodes are removed.

- [ ] **Step 2: Add cleanup after agent removal**

After the agent node is removed from `cluster.nodes`, add:

```typescript
// Unregister agent session from animation routing
cluster.agentSessionMap.delete(agentSessionId)
```

This ensures that when an agent terminates:
1. Agent star disappears from visualization (already handled)
2. Agent session mapping is cleaned up (new)
3. Future animations won't try to route to a non-existent agent

- [ ] **Step 3: Test agent termination**

```bash
npm run dev
# Spawn agent, run tools
# Wait for agent to complete
# Verify: agent star disappears AND no console errors
```

- [ ] **Step 4: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: clean up agentSessionMap on agent termination"
```

---

### Task 7: Handle Edge Cases — Orphaned Entries

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Add cleanup helper**

Add this function to `store.ts`:

```typescript
/**
 * Remove orphaned agent entries from the map.
 * Call this periodically or when a cluster's nodes change.
 */
export function cleanupOrphanedAgents(cluster: Cluster): void {
  const validSessionIds = new Set<string>()

  // Collect all agent session IDs that have active nodes
  for (const node of cluster.nodes.values()) {
    if (node.nodeType === 'agent') {
      validSessionIds.add(node.sessionId || '')
    }
  }

  // Remove entries for agents that no longer have nodes
  for (const sessionId of cluster.agentSessionMap.keys()) {
    if (!validSessionIds.has(sessionId)) {
      cluster.agentSessionMap.delete(sessionId)
    }
  }
}
```

- [ ] **Step 2: Call cleanup in update loop (optional)**

This is defensive; cleanup should happen naturally via Task 6. Only add if issues arise during testing.

- [ ] **Step 3: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: add cleanupOrphanedAgents helper for consistency"
```

---

### Task 8: Manual Visual Testing

**Files:**
- None (integration testing)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:5173`.

- [ ] **Step 2: Test single agent with core operations**

In Claude Code:
1. Run a tool (Read, Bash, etc.)
2. Observe animation originates from core

- [ ] **Step 3: Test single agent with agent-spawned operations**

1. Spawn an agent (via @agent in Claude Code)
2. Agent runs tools
3. **Expected:** animations originate from agent star (orange/yellow), not blue core

- [ ] **Step 4: Test multiple concurrent agents**

1. Spawn 2-3 agents in sequence
2. Each agent runs tools
3. **Expected:** each animation originates from correct agent star
4. **Expected:** when agent terminates, animations from that agent stop

- [ ] **Step 5: Test agent star orbital motion**

While agents are active:
1. Watch agent stars orbit in the ring
2. **Expected:** animations smoothly follow agent star as it orbits
3. **Expected:** no lag or jitter

- [ ] **Step 6: Pass all tests**

If all tests pass, document results and move to completion.

- [ ] **Step 7: Commit test observations**

```bash
git commit --allow-empty -m "test: verified agent animation routing across scenarios"
```

---

### Task 9: Performance Verification

**Files:**
- None (profiling)

- [ ] **Step 1: Open DevTools**

Press F12 → Performance tab.

- [ ] **Step 2: Record with 5+ agents active**

1. Spawn 5+ agents
2. Run multiple concurrent tools
3. Record a 5-second trace

- [ ] **Step 3: Check metrics**

Look for:
- No dropped frames (60 FPS or close)
- Session map lookups should be instant (O(1))
- No GC pauses during agent operations

- [ ] **Step 4: Verify acceptability**

If performance is acceptable, move to completion. If not, profile and optimize.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "perf: verified no regression with concurrent agents"
```

---

### Task 10: Final Integration & Cleanup

**Files:**
- Review: all modified files

- [ ] **Step 1: Run full test suite**

```bash
npm run build
npm run test 2>&1 | tail -20
```

Expected: All tests pass, no errors.

- [ ] **Step 2: Code review checklist**

Review changes across all files:
- [ ] Agent session map initialization is consistent
- [ ] Origin lookup uses fallback (core position) correctly
- [ ] Cleanup happens on termination (no memory leaks)
- [ ] No hardcoded cluster center assumptions remain
- [ ] Types are properly imported/exported

- [ ] **Step 3: Final commit summary**

Create a summary commit:

```bash
git log --oneline -10
# Should see commits from Tasks 1-9
```

- [ ] **Step 4: Done**

All tasks complete. Agent animation routing is implemented and tested.

---

## Success Criteria (from spec)

- [x] Animations from agent sessions originate at agent star position
- [x] Animations from core sessions originate at core position (unchanged)
- [x] Animation destinations (ring nodes) remain consistent
- [x] Agent star removal clears animations from that session
- [x] No performance regression with 5+ concurrent agents
- [x] Visual clarity: users can see which agent is acting

## Notes

- Agent stars already spawn in the orbit ring (pre-existing feature)
- Session IDs are globally unique (sourced from Claude Code hooks)
- Map entries are ephemeral (in-memory only, no persistence)
- Animations still reach the same core ring destinations
- No changes to animation effects, colors, or timing
