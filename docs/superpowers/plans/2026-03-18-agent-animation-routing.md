# Agent Animation Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route animation origins to agent stars when actions originate from agent sessions, creating visual connection between agents and their operations.

**Architecture:** Add session-to-agent mapping in the visualization state. When creating animations (projectiles), check if the originating session is an agent and route the animation origin from that agent's star position instead of the cluster core. Hook into agent lifecycle (spawn/terminate) to register/unregister sessions.

**Tech Stack:** TypeScript, Canvas 2D rendering, Vite (client build)

---

## File Structure

Key insight: Agent nodes are created with key format `agent:{agentId}` directly in store.ts SubagentStart handler. We map agent IDs → positions for animation routing.

```
client/src/
  types.ts                    — Add AgentPositionMap type, extend Cluster
  store.ts                    — Add agentPositionMap mgmt, registration in SubagentStart/Stop handlers
  canvas/renderer.ts          — Modify projectile origin computation using agent ID lookup
```

---

### Task 1: Add Type Definitions for Agent Position Mapping

**Files:**
- Modify: `client/src/types.ts`

- [ ] **Step 1: Add AgentPositionMap type alias**

Open `client/src/types.ts` and add after the Projectile interface (after line 83):

```typescript
// Maps agent IDs to their current positions for animation routing
// Key: agent ID from SubagentStart event (e.g., "abc123")
// Value: {x, y} position of agent node in space
export type AgentPositionMap = Map<string, {x: number, y: number}>
```

- [ ] **Step 2: Extend Cluster type**

Find the `Cluster` interface (line 95-118) and add this field before the closing brace:

```typescript
  // Maps agent IDs to their current star positions (for animation routing)
  // Populated by SubagentStart, updated each frame, cleared by SubagentStop
  agentPositionMap: AgentPositionMap
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

### Task 2: Initialize Agent Position Map & Add Helper

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate cluster initialization**

Find the code that creates new Cluster instances. Look for where the empty Cluster object is created (around line 195-220 where clusters are first created).

- [ ] **Step 2: Find Projectile creation**

Search for where Projectile objects are created (likely in PixiScene.tsx or store.ts around 340-360):

```bash
grep -n "Projectile" client/src/*.tsx | grep -v import
```

- [ ] **Step 2b: Extend Projectile interface**

In `client/src/types.ts`, add to Projectile interface (after `tool: string;` line 80):

```typescript
  agentId?: string | null      // agent ID if action originated from agent session
```

- [ ] **Step 2c: Populate agentId when creating Projectiles**

In projectile creation code, pass the agent_id from the hook event:

```typescript
// When creating a new Projectile from a tool hook
const projectile: Projectile = {
  // ... existing fields ...
  agentId: event.agent_id || null  // Extract from hook event
}
```

- [ ] **Step 3: Initialize agentPositionMap**

In cluster creation, add:

```typescript
agentPositionMap: new Map<string, {x: number, y: number}>()
```

This creates an empty map that will be populated as agents spawn.

- [ ] **Step 4: Add helper function**

Add this function to `store.ts` after helper functions like `hexToInt`, before the main event processing (around line 180):

```typescript
/**
 * Get the animation origin point for an action.
 * If agentId exists and points to an active agent, returns agent position.
 * Otherwise, returns cluster core position.
 */
export function getAnimationOrigin(
  cluster: Cluster,
  agentId: string | null
): {x: number, y: number} {
  if (agentId && cluster.agentPositionMap.has(agentId)) {
    return cluster.agentPositionMap.get(agentId)!
  }
  // Fallback to core position
  return {x: cluster.centerX, y: cluster.centerY}
}
```

- [ ] **Step 5: Test compilation**

```bash
npm run build 2>&1 | head -20
```

Expected: No TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/types.ts client/src/store.ts
git commit -m "feat: add agentId to Projectile, initialize agentPositionMap and helper"
```

---

### Task 3: Register Agent Positions on Spawn

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate SubagentStart handler**

In `store.ts`, find the SubagentStart event handler (line 416-453). It creates agent nodes with this pattern:

```typescript
if (event.hook_event_name === 'SubagentStart') {
  const agentId = event.agent_id || `${event.session_id}-sub`
  const agentKey = `agent:${agentId}`
  if (!cluster.nodes.has(agentKey)) {
    cluster.nodes.set(agentKey, { ... agent node data ... })
  }
}
```

- [ ] **Step 2: Extract initial position from agent node**

Inside the SubagentStart handler, right after creating the agent node (after line 449, before the closing brace), add:

```typescript
// Register agent position for animation routing
const agentNode = cluster.nodes.get(agentKey)!
cluster.agentPositionMap.set(agentId, {
  x: agentNode.x,
  y: agentNode.y
})
```

- [ ] **Step 3: Test with single agent spawn**

```bash
npm run dev
# Open http://localhost:5173
# In Claude Code: trigger agent spawn
# Check F12 console for any errors
```

Expected: No errors, map is populated.

- [ ] **Step 4: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: register agent positions in agentPositionMap on spawn"
```

---

### Task 4: Update Agent Positions Each Frame

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate the main animation update loop**

In `store.ts`, find the main update/animation loop where nodes are updated per-frame. This should be around line 530-600 where orbital mechanics are computed.

- [ ] **Step 2: Sync agent positions after orbital update**

For each agent node updated in the loop, sync its position to the map. Find where agent nodes are iterated and add:

```typescript
// Sync agent position to animation routing map each frame
if (node.nodeType === 'agent') {
  const agentId = node.key.replace('agent:', '')  // extract ID from key
  cluster.agentPositionMap.set(agentId, {
    x: node.x,
    y: node.y
  })
}
```

This keeps the map current as agents orbit.

- [ ] **Step 3: Performance check**

The assignment is O(1) and happens once per agent per frame. With <10 agents, this is negligible.

- [ ] **Step 4: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: sync agent positions to agentPositionMap each frame"
```

---

### Task 5: Modify Projectile Rendering to Use Agent Origin

**Files:**
- Modify: `client/src/canvas/renderer.ts`

- [ ] **Step 1: Locate projectile rendering code**

Find the projectile loop around line 445 in `renderer.ts`:

```typescript
for (const p of projectiles) {
  const ox = p.cluster.centerX, oy = p.cluster.centerY
  const nx = p.node.x, ny = p.node.y
  const from = p.inbound ? { x: nx, y: ny } : { x: ox, y: oy }
```

- [ ] **Step 2: Import getAnimationOrigin**

At the top of renderer.ts, add the import:

```typescript
import { getAnimationOrigin } from '../store'
```

- [ ] **Step 3: Compute origin from agent or core**

Replace the hardcoded `ox`, `oy` extraction. Change from:

```typescript
const ox = p.cluster.centerX, oy = p.cluster.centerY
```

To:

```typescript
// Get origin: agent star if action from agent, otherwise core
const origin = getAnimationOrigin(p.cluster, p.agentId || null)
const ox = origin.x, oy = origin.y
```

The rest of the projectile loop stays the same. Now `p.agentId` is properly typed since we extended the Projectile interface in Task 2.

- [ ] **Step 4: Test visual rendering**

```bash
npm run dev
# Open http://localhost:5173
# Spawn agent and have it run tools (Bash, Read, etc)
# Observe: animations originate from agent star (orbiting), not core
# Core operations still originate from blue core
```

- [ ] **Step 5: Commit**

```bash
git add client/src/canvas/renderer.ts
git commit -m "feat: route animation origins through getAnimationOrigin"
```

---

### Task 6: Clean Up on Agent Termination

**Files:**
- Modify: `client/src/store.ts`

- [ ] **Step 1: Locate SubagentStop handler**

In `store.ts`, find the SubagentStop handler (line 455-467):

```typescript
if (event.hook_event_name === 'SubagentStop') {
  const agentId = event.agent_id || `${event.session_id}-sub`
  const agentKey = `agent:${agentId}`
  const agentNode = cluster.nodes.get(agentKey)
  if (agentNode) {
    agentNode.life = 0.08  // fade out
  }
}
```

- [ ] **Step 2: Add position map cleanup**

After the agent node's life is set to fade (line 461), add:

```typescript
// Clean up position map immediately so no new animations route to this agent
cluster.agentPositionMap.delete(agentId)
```

This removes the agent from routing as soon as it terminates, even though the visual star is still fading out.

- [ ] **Step 3: Test agent termination**

```bash
npm run dev
# Spawn agent, have it run tools
# Let agent complete and terminate
# Verify: no console errors, agent star fades naturally
```

- [ ] **Step 4: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: clean up agentPositionMap on agent termination"
```

---

### Task 7: Manual Visual Testing

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

### Task 8: Performance Verification (Optional)

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

### Task 9: Final Integration & Cleanup

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
# Should see commits from Tasks 1-6 plus testing
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

- Agent stars already spawn in the orbit ring (pre-existing feature, line 416-450 store.ts)
- Agent IDs are extracted from SubagentStart hook: `event.agent_id || "${event.session_id}-sub"`
- Map entries are ephemeral (in-memory only, no persistence)
- Animations still reach the same core ring destinations
- No changes to animation effects, colors, or timing
- Projectile type needs verification: check if agentId is populated in hook data when agents execute tools
