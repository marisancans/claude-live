# Agent Animation Routing Design
**Date:** 2026-03-18
**Feature:** Route animation origins to agent stars when actions originate from agents

## Overview

When an agent/subagent executes tool operations (Read, Bash, Write, etc.), animation effects should originate from the agent's star (orbiting in the ring) rather than the cluster's core. Both agent and core share the same ring node destinations since they operate on the same files, but the animation source point indicates which session is performing the action.

This creates a visual connection: users can see which agent is executing operations by watching the animation origin point.

## Current Behavior

- All animations originate from the cluster core
- Files orbit the core
- Agent stars orbit in a ring around the core (already implemented)
- Tool animations travel from files → core rings

## New Behavior

- If action originates from an agent session: animations originate from that agent's star
- If action originates from core session: animations originate from the core (unchanged)
- All animations still reach the same core ring destinations
- Agent stars remain temporary (disappear when agent session ends)

## Data Structures

### Session-to-Agent Mapping

Maintain on the cluster or visualization state:
```typescript
agentSessionMap: Map<string, AgentStarInfo>

type AgentStarInfo = {
  sessionId: string           // unique agent session identifier
  position: {x: number, y: number}  // current orbital position
  angle: number              // current angle in orbit (0-360)
  radius: number             // orbit radius (fixed)
  spawnTime: number          // when agent spawned (for lifecycle tracking)
}
```

**Lifecycle:**
- Created when agent session spawns (already handled by existing code)
- Registered in map immediately
- Removed from map when agent session terminates
- Removed from map when session reaches lifespan limit

### Animation Origin Points

Animations currently track origin implicitly (assumed core). Update to:
```typescript
// In animation state/data
animationOrigin: {
  type: 'core' | 'agent'
  sessionId?: string        // if type='agent', which agent
  position: {x: number, y: number}  // computed position
}
```

Alternatively, compute origin point on-the-fly during rendering based on originating session ID.

## Animation Routing Logic

### Hook Data Processing

When a tool-use hook arrives (PreToolUse, PostToolUse):

1. Extract `sessionId` from hook context
2. Check if `sessionId` exists in `agentSessionMap`
3. Determine origin:
   ```typescript
   const origin = agentSessionMap.has(sessionId)
     ? agentSessionMap.get(sessionId).position  // agent star position
     : {x: cluster.cx, y: cluster.cy}           // core position
   ```
4. Create animation with computed origin
5. Destination remains: cluster's ring nodes (unchanged)

### Tool Types (No Changes)

All tool effects operate the same way structurally:
- **Read/Grep/Glob** (inbound): file → origin
- **Edit/Write/Bash** (outbound): origin → file
- **WebFetch** (wave), **Notification** (rings): centered on origin

Origin point is the only variable; visuals and destinations unchanged.

## Rendering Changes

### Animation Rendering

Update animation draw calls to:
1. Use computed origin point (from mapping, not hardcoded core)
2. Draw line/effect from origin to destination
3. Apply existing color/glow/opacity based on tool type

**No change to:** destination points, effect types, timing, colors, or visual styling.

### Performance Considerations

- `agentSessionMap` lookup is O(1) per animation
- No new render passes needed
- Reuse existing animation rendering pipeline
- Session map cleanup happens at session end (not per-frame)

## Session Lifecycle Integration

### When Agent Spawns

Existing code already:
1. Creates agent star in orbit ring
2. Assigns unique `sessionId`
3. Tracks in active sessions

**Add:** Register in `agentSessionMap` with initial position/angle.

### During Agent Operation

- Hook arrives with `sessionId`
- Check map to find origin point
- Create animation from that origin
- No map updates needed during operation

### When Agent Terminates

Existing code already removes agent star from visualization.

**Add:** Remove `sessionId` from `agentSessionMap` at same time.

### Edge Case: Agent Position Updates

If agent star position updates (orbital movement), `agentSessionMap` must track current position.

**Solution:** Update map value each frame when agent star position changes (link to existing orbital animation loop).

## Success Criteria

- [ ] Animations from agent sessions originate at agent star position
- [ ] Animations from core sessions originate at core position (unchanged)
- [ ] Animation destinations (ring nodes) remain consistent
- [ ] Agent star removal clears animations from that session
- [ ] No performance regression with 5+ concurrent agents
- [ ] Visual clarity: users can see which agent is acting

## Testing Strategy

1. **Single agent test:** Spawn agent, run tools, verify animations originate from agent star
2. **Multi-agent test:** Spawn 3+ agents, run concurrent tools, verify correct routing
3. **Agent termination:** Agent ends → animations stop originating from that agent star
4. **Core operations:** Parent session tools still animate from core (baseline)
5. **Visual inspection:** Watch agent animations for smooth origin transitions as agent star orbits

## Implementation Notes

- Reuse existing animation rendering code; only change origin point computation
- Session map is ephemeral (in-memory only); no persistence needed
- Consider debouncing position updates to map if agent star moves per-frame
- Coordinate with existing agent lifecycle code (hook into same termination path)

## Open Questions

None at this stage. Design validated with user.
