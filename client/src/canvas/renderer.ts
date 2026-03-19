import type { Cluster, GraphNode, Projectile, PromptSnake } from '../types'
import type { Point } from '../utils/spline'
import { getAnimationOrigin } from '../store'
import { evaluateSpline, evaluateTangent } from '../utils/spline'

// Atomic orbital structure: dynamically grows from 1 to 4 rings
const RING_CAPACITIES = [4, 8, 18, 20]  // sum = 50 total slots per session
const ORBIT_RADII = [70, 120, 175, 225] // distances for each ring

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)]
}

function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: PromptSnake,
  clusterCx: number,
  clusterCy: number,
  cluster?: Cluster
) {
  const [r, g, b] = hexToRgb(snake.color)
  const progress = snake.progress

  // For ResponseSnakes, use the pre-calculated initial path
  // No per-frame recalculation to maintain performance with multiple snakes
  const splinePath = snake.splinePath

  // Fixed total snake length on curve — same for all prompts regardless of word count
  const SNAKE_LENGTH = 0.65  // curve parameter length
  const wordSpacing = snake.words.length > 1 ? SNAKE_LENGTH / (snake.words.length - 1) : 0

  // Map progress [0,1] to head position [0, 1 + SNAKE_LENGTH]
  // All snakes take the same time: head overshoots past center,
  // tail arrives at center when progress=1
  const headT = progress * (1 + SNAKE_LENGTH)

  const fontSize = 7 * (0.6 + Math.min(1, progress * 2) * 0.4)

  for (let i = 0; i < snake.words.length; i++) {
    const word = snake.words[i]

    // Head is last word in array, tail is first
    const distFromHead = snake.words.length - 1 - i
    const wordT = headT - wordSpacing * distFromHead

    // Skip words that haven't entered the curve yet (t < 0)
    if (wordT < 0) continue
    // Skip words that have already passed center (t > 1) — they've been absorbed
    if (wordT > 1) continue

    // All snakes now use curved splines
    const wordPos = evaluateSpline(splinePath, wordT)

    // Get tangent to rotate word along the curve direction
    const tangent = evaluateTangent(splinePath, wordT)
    const angle = Math.atan2(tangent.y, tangent.x)

    // All words same opacity — fade in at start, fade out as each word approaches center
    const fadeIn = Math.min(1, wordT * 5)           // fade in over first 20% of curve
    const fadeOut = Math.min(1, (1 - wordT) * 5)    // fade out over last 20% of curve
    const opacity = fadeIn * fadeOut

    if (opacity <= 0.01) continue

    // Draw glow around word — smaller for ResponseSnakes (letters), normal for PromptSnakes (words)
    const glowR = snake.sourceNodeKey ? 8 : 18  // smaller glow for ResponseSnakes
    const glowOpacity = snake.sourceNodeKey ? opacity * 0.1 : opacity * 0.2  // reduced opacity for ResponseSnakes
    const gg = ctx.createRadialGradient(wordPos.x, wordPos.y, 0, wordPos.x, wordPos.y, glowR)
    gg.addColorStop(0, `rgba(${r},${g},${b},${glowOpacity})`)
    gg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(wordPos.x, wordPos.y, glowR, 0, Math.PI * 2)
    ctx.fillStyle = gg
    ctx.fill()

    // Draw word rotated along the curve
    ctx.save()
    ctx.translate(wordPos.x, wordPos.y)
    ctx.rotate(angle)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${fontSize}px monospace`

    // Shadow
    ctx.fillStyle = `rgba(0,0,0,${opacity * 0.3})`
    ctx.fillText(word, 1, 1)

    // Main text
    ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`
    ctx.fillText(word, 0, 0)

    ctx.restore()
  }
}

function drawImpact(
  ctx: CanvasRenderingContext2D,
  node: GraphNode,
  t: number
) {
  if (!node.impactType || node.impactTime <= 0) return
  const [r, g, b] = hexToRgb(node.colorHex)
  const it = node.impactTime
  const nr = node.baseRadius

  if (node.impactType === 'scan') {
    // Read/Grep/Glob — expanding ring
    const scanR = nr + (1 - it) * 30
    ctx.beginPath()
    ctx.arc(node.x, node.y, scanR, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${it * 0.55})`
    ctx.lineWidth = 0.8
    ctx.stroke()
  } else if (node.impactType === 'morph') {
    // Edit/Write — double ring
    const r1 = nr + (1 - it) * 18
    const r2 = nr + (1 - it) * 28
    ctx.beginPath(); ctx.arc(node.x, node.y, r1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${it * 0.6})`; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.beginPath(); ctx.arc(node.x, node.y, r2, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${it * 0.25})`; ctx.lineWidth = 0.6; ctx.stroke()
  } else if (node.impactType === 'spark') {
    // Bash — radial sparks
    for (let s = 0; s < 6; s++) {
      const sa = (s / 6) * Math.PI * 2 + t * 0.5
      const inner = nr + 3, outer = nr + 3 + (1 - it) * 16
      ctx.beginPath()
      ctx.moveTo(node.x + Math.cos(sa) * inner, node.y + Math.sin(sa) * inner)
      ctx.lineTo(node.x + Math.cos(sa) * outer, node.y + Math.sin(sa) * outer)
      ctx.strokeStyle = `rgba(${r},${g},${b},${it * 0.65})`; ctx.lineWidth = 0.8; ctx.stroke()
    }
  } else if (node.impactType === 'ping') {
    // Notification — two fast rings
    const p1 = nr + (1 - it) * 22
    ctx.beginPath(); ctx.arc(node.x, node.y, p1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${it * 0.45})`; ctx.lineWidth = 0.7; ctx.stroke()
  } else if (node.impactType === 'fade') {
    // Stop — contracting ring
    const fr = nr + it * 22
    ctx.beginPath(); ctx.arc(node.x, node.y, fr, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - it) * 0.5})`; ctx.lineWidth = 0.6; ctx.stroke()
  } else if (node.impactType === 'fail') {
    // Error — red X burst + expanding ring
    const fr = nr + (1 - it) * 25
    ctx.beginPath(); ctx.arc(node.x, node.y, fr, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(248,113,113,${it * 0.55})`; ctx.lineWidth = 0.8; ctx.stroke()
    for (let s = 0; s < 4; s++) {
      const ang = (s / 4) * Math.PI + Math.PI / 4
      const inner = nr + 2, outer = nr + 2 + (1 - it) * 18
      ctx.beginPath()
      ctx.moveTo(node.x + Math.cos(ang) * inner, node.y + Math.sin(ang) * inner)
      ctx.lineTo(node.x + Math.cos(ang) * outer, node.y + Math.sin(ang) * outer)
      ctx.strokeStyle = `rgba(248,113,113,${it * 0.85})`; ctx.lineWidth = 1.4; ctx.stroke()
    }
  }
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  clusters: Map<string, Cluster>,
  projectiles: Projectile[],
  t: number
) {
  // Subtle vignette
  const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.75)
  vg.addColorStop(0, 'rgba(6,3,18,0.45)')
  vg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

  for (const cluster of clusters.values()) {
    const cx = cluster.centerX, cy = cluster.centerY
    const clusterPerm = (cluster as any).awaitingPermission as boolean

    // ── Solid orbit rings (thin, subtle) — only draw rings with active nodes ──
    for (let ri = 0; ri < cluster.ringCounts.length && ri < ORBIT_RADII.length; ri++) {
      if (cluster.ringCounts[ri] > 0) {  // Only draw if ring has nodes
        ctx.beginPath()
        ctx.arc(cx, cy, ORBIT_RADII[ri], 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.045)'
        ctx.lineWidth = 0.6; ctx.stroke()
      }
    }

    // ── Trail stamps: fixed dashes left behind each node, smooth gradient ──
    const DASH_PX = 3        // pixel length of each dash (uniform across all rings)
    for (const node of cluster.nodes.values()) {
      if (node.orbitRing < 0 || node.marks.length === 0) continue
      const baseAl = node.nodeType === 'file'
        ? 0.5
        : node.life * 0.4 * Math.min(1, node.entry)
      if (baseAl <= 0.01) continue
      const dashArc = DASH_PX / node.orbitRadius  // constant px → radians
      const n = node.marks.length
      for (let i = 0; i < n; i++) {
        // i=0 oldest, i=n-1 newest  →  linear fade: ~4% per step
        const fade = (i + 1) / n
        const al = baseAl * fade
        if (al <= 0.01) continue
        const a = node.marks[i]
        ctx.beginPath()
        ctx.arc(cx, cy, node.orbitRadius, a - dashArc / 2, a + dashArc / 2)
        ctx.strokeStyle = `rgba(255,255,255,${al})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    // ── Impact effects ──
    for (const node of cluster.nodes.values()) drawImpact(ctx, node, t)

    // ── Agent satellite nodes ──
    for (const node of cluster.nodes.values()) {
      if (node.nodeType !== 'agent') continue
      const [r, g, b] = hexToRgb(node.colorHex)
      const al = Math.min(1, node.entry)
      if (al <= 0.01) continue
      const sz = 1.8
      const spinAngle = t * 2.5
      const ringR = 7

      // Soft glow
      const gg = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, ringR * 2.5)
      gg.addColorStop(0, `rgba(${r},${g},${b},0.25)`)
      gg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(node.x, node.y, ringR * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = gg; ctx.fill()

      // Spinning dashed ring
      const SEGS = 6
      for (let s = 0; s < SEGS; s++) {
        const a1 = (s / SEGS) * Math.PI * 2 + spinAngle
        const a2 = ((s + 0.38) / SEGS) * Math.PI * 2 + spinAngle
        ctx.beginPath(); ctx.arc(node.x, node.y, ringR, a1, a2)
        ctx.strokeStyle = `rgba(${r},${g},${b},1)`
        ctx.lineWidth = 1; ctx.stroke()
      }
      // Rotating diamond core
      ctx.save(); ctx.translate(node.x, node.y); ctx.rotate(Math.PI / 4 + t * 1.5)
      ctx.fillStyle = `rgba(${r},${g},${b},1)`
      ctx.fillRect(-sz, -sz, sz * 2, sz * 2)
      ctx.restore()
      // Type label beneath
      ctx.textAlign = 'center'; ctx.font = '7px monospace'
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`
      ctx.fillText(node.label, node.x, node.y + ringR + 6)
    }

    // ── Ephemeral nodes (non-file, non-agent) ──
    for (const node of cluster.nodes.values()) {
      if (node.nodeType === 'file' || node.nodeType === 'agent') continue
      const [r, g, b] = hexToRgb(node.colorHex)
      const al = Math.min(1, node.entry)
      if (al <= 0.01) continue

      const sz = node.baseRadius * Math.min(1, node.entry)

      // glow
      if (node.impactTime > 0.1) {
        const gg = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, sz * 5)
        gg.addColorStop(0, `rgba(${r},${g},${b},${al * node.impactTime * 0.15})`)
        gg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(node.x, node.y, sz * 5, 0, Math.PI * 2)
        ctx.fillStyle = gg; ctx.fill()
      }

      // diamond shape
      ctx.save(); ctx.translate(node.x, node.y); ctx.rotate(Math.PI / 4)
      ctx.fillStyle = `rgba(${r},${g},${b},${al * 0.9})`
      ctx.fillRect(-sz, -sz, sz * 2, sz * 2)
      ctx.restore()

      // label — always shown
      ctx.textAlign = 'center'
      ctx.font = '9px monospace'
      ctx.fillStyle = `rgba(${r},${g},${b},${al * 0.85})`
      ctx.fillText(node.label, node.x, node.y - sz - 5)

      // action label
      if (node.actionFade > 0 && node.actionLabel) {
        ctx.font = '700 8px monospace'
        ctx.fillStyle = `rgba(${r},${g},${b},${node.actionFade * al})`
        ctx.fillText(node.actionLabel, node.x, node.y + sz + 13)
      }
    }

    // ── File nodes ──
    for (const node of cluster.nodes.values()) {
      if (node.nodeType !== 'file') continue
      const [r, g, b] = hexToRgb(node.colorHex)

      // glow on impact
      if (node.impactTime > 0.05) {
        const gg = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.baseRadius * 4)
        gg.addColorStop(0, `rgba(${r},${g},${b},${node.impactTime * 0.14})`)
        gg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(node.x, node.y, node.baseRadius * 4, 0, Math.PI * 2)
        ctx.fillStyle = gg; ctx.fill()
      }

      // morph effect: size bump
      const bump = node.impactType === 'morph' ? node.impactTime * 1.8 : 0
      const dr = node.baseRadius + bump

      // node circle
      ctx.beginPath(); ctx.arc(node.x, node.y, dr, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.92)`; ctx.fill()

      // permission ring on file node (legacy — now on core, but keep for safety)
      if (node.awaitingPermission) {
        _drawPermRing(ctx, node.x, node.y, dr + 7, t)
      }

      // label — always visible
      ctx.font = '9px monospace'; ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`
      ctx.fillText(node.label, node.x, node.y - dr - 5)

      // action label — floats up, fades over ~3 seconds
      if (node.actionFade > 0 && node.actionLabel) {
        const yOff = (1 - node.actionFade) * 10
        ctx.font = '700 9px monospace'
        ctx.fillStyle = `rgba(${r},${g},${b},${node.actionFade * 0.95})`
        ctx.fillText(node.actionLabel, node.x, node.y + dr + 14 - yOff)
      }
    }

    // ── Session core ──
    const isChild = (cluster as any).isChild as boolean
    const pulse = 1 + Math.sin(t * 1.2) * 0.04 + ((cluster as any).coreAct || 0) * 0.1
    const coreR = (isChild ? 4.5 : 7) * pulse

    // Child: draw tether line to parent
    if (isChild) {
      const parentId = (cluster as any).parentSessionId as string | null
      const parent = parentId ? clusters.get(parentId) : null
      if (parent) {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(parent.centerX, parent.centerY)
        ctx.strokeStyle = 'rgba(160,180,220,0.12)'
        ctx.lineWidth = 0.8
        ctx.setLineDash([4, 8])
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // Halo — amber tint for children
    const [hr, hg, hb] = isChild ? [220, 180, 100] : [200, 210, 240]
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 5)
    halo.addColorStop(0, `rgba(${hr},${hg},${hb},${0.06 + ((cluster as any).coreAct || 0) * 0.07})`)
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(cx, cy, coreR * 5, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill()

    // Thin ring
    ctx.beginPath(); ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.05 + ((cluster as any).coreAct || 0) * 0.05})`
    ctx.lineWidth = 0.4; ctx.stroke()

    // Core body — amber tint for children
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    if (isChild) {
      cg.addColorStop(0, 'rgba(255,230,160,0.95)')
      cg.addColorStop(0.5, 'rgba(220,190,110,0.75)')
      cg.addColorStop(1, 'rgba(180,140,60,0.12)')
    } else {
      cg.addColorStop(0, 'rgba(240,245,255,0.98)')
      cg.addColorStop(0.5, 'rgba(200,215,245,0.78)')
      cg.addColorStop(1, 'rgba(160,180,230,0.15)')
    }
    ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()

    // ── Compact: gravity well implosion (PreCompact) ──
    const compacting = (cluster as any).compacting as number || 0
    if (compacting > 0) {
      // 5 concentric rings collapse inward sequentially (staggered timing)
      const maxOuterRadius = cluster.ringCounts.length > 0
        ? ORBIT_RADII[Math.min(cluster.ringCounts.length - 1, ORBIT_RADII.length - 1)]
        : ORBIT_RADII[0]
      for (let ri = 0; ri < 5; ri++) {
        const delay = ri * 0.15
        const localT = Math.max(0, Math.min(1, (1 - compacting - delay) / (1 - delay)))
        if (localT >= 1) continue
        const maxR = maxOuterRadius * (0.4 + ri * 0.15)
        const ringDist = maxR * (1 - localT)  // collapses from maxR → 0
        const ringAl = (1 - localT) * 0.45
        if (ringAl <= 0.01) continue
        ctx.beginPath(); ctx.arc(cx, cy, ringDist, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180,190,210,${ringAl})`
        ctx.lineWidth = 1.5 + localT * 2; ctx.stroke()
        // Inward streak particles on each ring
        const nPart = 8
        for (let p = 0; p < nPart; p++) {
          const ang = (p / nPart) * Math.PI * 2
          const streakLen = 6 + localT * 18
          const px = cx + Math.cos(ang) * ringDist
          const py = cy + Math.sin(ang) * ringDist
          const px2 = cx + Math.cos(ang) * (ringDist + streakLen)
          const py2 = cy + Math.sin(ang) * (ringDist + streakLen)
          const sg = ctx.createLinearGradient(px2, py2, px, py)
          sg.addColorStop(0, 'rgba(180,190,210,0)')
          sg.addColorStop(1, `rgba(220,225,240,${ringAl * 0.7})`)
          ctx.beginPath(); ctx.moveTo(px2, py2); ctx.lineTo(px, py)
          ctx.strokeStyle = sg; ctx.lineWidth = 0.7; ctx.stroke()
        }
      }
      // Core densifies — growing dark gravity well
      const wellR = (1 - compacting) * coreR * 6 + coreR
      const well = ctx.createRadialGradient(cx, cy, 0, cx, cy, wellR)
      well.addColorStop(0, `rgba(10,10,20,${(1 - compacting) * 0.5})`)
      well.addColorStop(0.4, `rgba(100,110,140,${(1 - compacting) * 0.15})`)
      well.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, wellR, 0, Math.PI * 2); ctx.fillStyle = well; ctx.fill()
      // Bright rim on the core (accretion glow)
      ctx.beginPath(); ctx.arc(cx, cy, coreR + 2, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200,210,240,${(1 - compacting) * 0.6})`
      ctx.lineWidth = 1.5; ctx.stroke()
    }

    // ── Compact: starburst rebirth (PostCompact) ──
    const compacted = (cluster as any).compacted as number || 0
    if (compacted > 0) {
      const expand = 1 - compacted  // 0→1 as animation progresses
      const maxOuterRadius = cluster.ringCounts.length > 0
        ? ORBIT_RADII[Math.min(cluster.ringCounts.length - 1, ORBIT_RADII.length - 1)]
        : ORBIT_RADII[0]
      // Radial light beams (8 beams, not rings)
      const BEAMS = 8
      for (let b = 0; b < BEAMS; b++) {
        const ang = (b / BEAMS) * Math.PI * 2
        const beamLen = expand * maxOuterRadius * 1.2
        const bx = cx + Math.cos(ang) * beamLen
        const by = cy + Math.sin(ang) * beamLen
        const bg = ctx.createLinearGradient(cx, cy, bx, by)
        bg.addColorStop(0, `rgba(255,240,200,${compacted * 0.6})`)
        bg.addColorStop(0.5, `rgba(255,220,140,${compacted * 0.25})`)
        bg.addColorStop(1, 'rgba(255,200,100,0)')
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by)
        ctx.strokeStyle = bg; ctx.lineWidth = 2.5 * compacted; ctx.stroke()
      }
      // Single thick shockwave ring
      const waveR = expand * maxOuterRadius * 0.9
      ctx.beginPath(); ctx.arc(cx, cy, waveR, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255,230,180,${compacted * 0.5})`
      ctx.lineWidth = 3 * compacted; ctx.stroke()
      // White-gold core flash
      const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 5 * compacted)
      fg.addColorStop(0, `rgba(255,245,220,${compacted * 0.45})`)
      fg.addColorStop(0.5, `rgba(255,220,160,${compacted * 0.15})`)
      fg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 5 * compacted, 0, Math.PI * 2)
      ctx.fillStyle = fg; ctx.fill()
    }

    // Permission ring on core
    if (clusterPerm) {
      _drawPermRing(ctx, cx, cy, coreR + 8, t)
    }

    // Render snakes
    for (const snake of cluster.promptSnakes) {
      drawSnake(ctx, snake, cx, cy, cluster)
    }

    // Core label — appears when inbound animation (Read/Grep/Glob) arrives
    const coreLabelFade = (cluster as any).coreLabelFade as number || 0
    if (coreLabelFade > 0) {
      const coreLabelText = (cluster as any).coreLabelText as string
      const coreLabelColor = (cluster as any).coreLabelColor as string || '#b0c8f0'
      const [clr, clg, clb] = hexToRgb(coreLabelColor)
      const yOff = (1 - coreLabelFade) * 7
      ctx.font = '700 9px monospace'; ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(${clr},${clg},${clb},${coreLabelFade * 0.9})`
      ctx.fillText(coreLabelText, cx, cy - coreR - 8 - yOff)
    }

    // Session label
    ctx.font = '9px monospace'; ctx.textAlign = 'center'
    ctx.fillStyle = isChild ? 'rgba(220,190,120,0.65)' : 'rgba(190,205,235,0.7)'
    ctx.fillText(`${isChild ? 'agent' : 'session'}:${cluster.label}`, cx, cy + coreR + 14)
    // Model label
    const model = (cluster as any).model as string | undefined
    if (model) {
      ctx.font = '7px monospace'
      ctx.fillStyle = 'rgba(140,150,170,0.5)'
      ctx.fillText(model.replace('claude-', ''), cx, cy + coreR + 24)
    }
  }

  // ── Projectiles ──
  for (const p of projectiles) {
    const [r, g, b] = hexToRgb(p.colorHex)
    // Get origin: agent star if action from agent, otherwise core
    const origin = getAnimationOrigin(p.cluster, p.agentId || null)
    if (p.agentId) {
      const hasAgent = p.cluster.agentPositionMap.has(p.agentId)
      const mapSize = p.cluster.agentPositionMap.size
      console.log(`[Renderer] agentId=${p.agentId}, inMap=${hasAgent}, mapSize=${mapSize}, origin=(${origin.x},${origin.y})`)
    }
    const ox = origin.x, oy = origin.y
    const nx = p.node.x, ny = p.node.y
    const from = p.inbound ? { x: nx, y: ny } : { x: ox, y: oy }
    const to   = p.inbound ? { x: ox, y: oy } : { x: nx, y: ny }
    _drawProjectile(ctx, p.tool, p.progress, from, to, r, g, b, t)
  }
}

function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

function _drawProjectile(
  ctx: CanvasRenderingContext2D,
  tool: string,
  progress: number,
  from: {x:number,y:number},
  to: {x:number,y:number},
  r: number, g: number, b: number,
  t: number
) {
  const e = eio(Math.min(progress, 1))
  const hx = from.x + (to.x - from.x) * e
  const hy = from.y + (to.y - from.y) * e

  if (tool === 'Read') {
    // Two-phase: laser scan at node → data sends to center
    // Since inbound: from=node, to=core
    const core = to, node = from
    const scanH = 18  // half-height of scan area

    if (progress < 0.45) {
      // ── Phase 1: Laser scanner at node — line sweeps bottom to top ──
      const p1 = progress / 0.45
      const fadeIn = Math.min(1, p1 * 4)

      // Line sweeps from bottom to top (single smooth pass)
      const scanY = node.y + scanH - p1 * scanH * 2

      // Corner tick marks
      const bw = 14, bh = scanH
      ctx.strokeStyle = `rgba(${r},${g},${b},${fadeIn * 0.18})`; ctx.lineWidth = 0.5
      const cornerLen = 5
      for (const [sx, sy] of [[-1,-1],[1,-1],[-1,1],[1,1]] as [number,number][]) {
        ctx.beginPath()
        ctx.moveTo(node.x + sx * bw, node.y + sy * bh)
        ctx.lineTo(node.x + sx * bw, node.y + sy * bh - sy * cornerLen)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(node.x + sx * bw, node.y + sy * bh)
        ctx.lineTo(node.x + sx * bw - sx * cornerLen, node.y + sy * bh)
        ctx.stroke()
      }

      // Laser scan line
      ctx.beginPath()
      ctx.moveTo(node.x - bw, scanY); ctx.lineTo(node.x + bw, scanY)
      ctx.strokeStyle = `rgba(${r},${g},${b},${fadeIn * 0.85})`
      ctx.lineWidth = 1.2; ctx.stroke()

      // Soft glow around scan line
      ctx.beginPath()
      ctx.moveTo(node.x - bw, scanY); ctx.lineTo(node.x + bw, scanY)
      ctx.strokeStyle = `rgba(${r},${g},${b},${fadeIn * 0.12})`
      ctx.lineWidth = 8; ctx.stroke()

      // Scanned region fill (below scan line = already read)
      ctx.fillStyle = `rgba(${r},${g},${b},${fadeIn * 0.035})`
      ctx.fillRect(node.x - bw, scanY, bw * 2, (node.y + scanH) - scanY)

      // Text-like detail lines revealed behind scan line
      const lineSpacing = 3.5
      const numLines = Math.floor(scanH * 2 / lineSpacing)
      for (let i = 0; i < numLines; i++) {
        const ly = node.y - scanH + i * lineSpacing + 2
        if (ly < scanY) continue  // only show lines already scanned (below line going up)
        const dist = ly - scanY
        if (dist > 14) continue
        const lineAlpha = fadeIn * 0.22 * (1 - dist / 14)
        const lineW = 4 + ((i * 7) % 5) * 2.5  // pseudo-random varying widths
        const lineX = node.x - 8 + ((i * 3) % 5) * 1.5  // slight offset per line
        ctx.beginPath()
        ctx.moveTo(lineX - lineW * 0.5, ly); ctx.lineTo(lineX + lineW * 0.5, ly)
        ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }

      // Flash at end of scanning
      if (p1 > 0.88) {
        const flash = (p1 - 0.88) / 0.12
        ctx.beginPath(); ctx.arc(node.x, node.y, flash * 16, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - flash) * 0.4})`; ctx.lineWidth = 0.7; ctx.stroke()
      }

    } else {
      // ── Phase 2: Data sends to center (node → core) ──
      const p2 = (progress - 0.45) / 0.55
      const e2 = eio(p2)

      // Faint return path
      const trailS = Math.max(0, e2 - 0.35)
      const tsx = node.x + (core.x - node.x) * trailS
      const tsy = node.y + (core.y - node.y) * trailS
      const tex = node.x + (core.x - node.x) * e2
      const tey = node.y + (core.y - node.y) * e2
      const grad = ctx.createLinearGradient(tsx, tsy, tex, tey)
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0.5)`)
      ctx.beginPath(); ctx.moveTo(tsx, tsy); ctx.lineTo(tex, tey)
      ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.stroke()

      // Data packets streaming to core
      const PACKETS = 5
      for (let i = 0; i < PACKETS; i++) {
        const offset = i / PACKETS * 0.3
        const pp = Math.min(1, Math.max(0, e2 - offset))
        if (pp <= 0) continue
        const px = node.x + (core.x - node.x) * pp
        const py = node.y + (core.y - node.y) * pp
        const a = pp < 0.1 ? pp / 0.1 : (pp > 0.85 ? (1 - pp) / 0.15 : 1)
        ctx.beginPath(); ctx.arc(px, py, 2.5 - i * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.8})`; ctx.fill()
      }

      // Lead dot
      ctx.beginPath(); ctx.arc(tex, tey, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill()

      // Arrival flash at core
      if (p2 > 0.85) {
        const flash = (p2 - 0.85) / 0.15
        ctx.beginPath(); ctx.arc(core.x, core.y, flash * 16, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - flash) * 0.6})`; ctx.lineWidth = 0.8; ctx.stroke()
      }
    }

  } else if (tool === 'Grep' || tool === 'Glob') {
    function rng(s: number) { const x = Math.sin(s*127.1+311.7)*43758.5453; return x-Math.floor(x) }
    if (tool === 'Grep') {
      // Shotgun blast: wide cone of pellets with muzzle flash
      const mainAngle = Math.atan2(to.y-from.y, to.x-from.x)
      const fullDist = Math.hypot(to.x-from.x, to.y-from.y)
      const PELLETS = 16, SPREAD = 0.65

      // Muzzle flash
      if (e < 0.18) {
        const flash = 1 - e / 0.18
        const gg = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, 36)
        gg.addColorStop(0, `rgba(${r},${g},${b},${flash * 0.9})`)
        gg.addColorStop(0.5, `rgba(${r},${g},${b},${flash * 0.3})`)
        gg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(from.x, from.y, 36, 0, Math.PI*2)
        ctx.fillStyle = gg; ctx.fill()
      }

      for (let i = 0; i < PELLETS; i++) {
        const spreadFrac = (i / (PELLETS - 1)) * 2 - 1
        const ang = mainAngle + spreadFrac * SPREAD + (rng(i * 2.3 + 1) - 0.5) * 0.2
        const speedMult = 0.65 + rng(i * 3.7 + 2) * 0.45
        const delay = rng(i * 1.3 + 0.5) * 0.06
        const pe = Math.min(1, Math.max(0, (e - delay) / (1 - delay)) * speedMult)
        if (pe <= 0) continue
        const dist = pe * fullDist
        const px = from.x + Math.cos(ang) * dist
        const py = from.y + Math.sin(ang) * dist
        const alpha = (1 - pe * 0.8) * (0.9 - Math.abs(spreadFrac) * 0.25)
        const sz = (1 - pe * 0.55) * (1.6 + rng(i * 5.1 + 3) * 1.4)
        // short motion trail
        const px0 = from.x + Math.cos(ang) * Math.max(0, dist - fullDist * 0.09)
        const py0 = from.y + Math.sin(ang) * Math.max(0, dist - fullDist * 0.09)
        const tg2 = ctx.createLinearGradient(px0, py0, px, py)
        tg2.addColorStop(0, `rgba(${r},${g},${b},0)`)
        tg2.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.5})`)
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(px, py)
        ctx.strokeStyle = tg2; ctx.lineWidth = sz * 0.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx.fill()
      }
    } else {
      // Glob: particles arc outward then reconverge at target (net cast)
      const dx = to.x-from.x, dy = to.y-from.y
      const len2 = Math.hypot(dx, dy)
      const nx2 = -dy/len2, ny2 = dx/len2
      const N = 12
      for (let i = 0; i < N; i++) {
        const scatter = (rng(i * 2.1 + 0.3) - 0.5) * 2 * 70
        const delay = rng(i * 1.7 + 0.9) * 0.07
        const pe = Math.min(1, Math.max(0, (e - delay) / (1 - delay)))
        if (pe <= 0) continue
        const arc = scatter * Math.sin(pe * Math.PI)
        const px = from.x + dx * pe + nx2 * arc
        const py = from.y + dy * pe + ny2 * arc
        const al = Math.min(1, pe * 4) * (1 - pe * 0.75)
        const sz = 1.2 + rng(i * 3.3 + 1) * 1.8
        // faint line back to spine
        const spineX = from.x + dx * pe, spineY = from.y + dy * pe
        ctx.beginPath(); ctx.moveTo(spineX, spineY); ctx.lineTo(px, py)
        ctx.strokeStyle = `rgba(${r},${g},${b},${al * 0.2})`; ctx.lineWidth = 0.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${r},${g},${b},${al * 0.9})`; ctx.fill()
      }
      // lead bead
      ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI*2)
      ctx.fillStyle = `rgba(${r},${g},${b},0.95)`; ctx.fill()
      if (progress > 0.82) {
        const fl = (progress - 0.82) / 0.18
        ctx.beginPath(); ctx.arc(to.x, to.y, fl * 22, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${(1-fl)*0.5})`; ctx.lineWidth = 0.8; ctx.stroke()
      }
    }

  } else if (tool === 'Edit') {
    // Ink bleed — beam that leaves drawn path behind
    const lg = ctx.createLinearGradient(from.x, from.y, hx, hy)
    lg.addColorStop(0, `rgba(${r},${g},${b},0.5)`)
    lg.addColorStop(0.7, `rgba(${r},${g},${b},0.35)`)
    lg.addColorStop(1, `rgba(${r},${g},${b},0.75)`)
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(hx, hy)
    ctx.strokeStyle = lg; ctx.lineWidth = 2; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(hx, hy)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.07)`; ctx.lineWidth = 8; ctx.stroke()
    for (let i = 3; i >= 0; i--) {
      const blobR = (4-i)*2.5+1
      const blobA = (0.08 - i*0.015) * (1 + Math.sin(t*12+i)*0.3)
      const ox2 = Math.cos(t*5+i*1.4)*i*1.5, oy2 = Math.sin(t*4+i*2.1)*i*1.5
      ctx.beginPath(); ctx.arc(hx+ox2, hy+oy2, blobR, 0, Math.PI*2)
      ctx.fillStyle = `rgba(${r},${g},${b},${blobA})`; ctx.fill()
    }
    ctx.beginPath(); ctx.arc(hx, hy, 2, 0, Math.PI*2)
    ctx.fillStyle = `rgba(${r},${g},${b},0.95)`; ctx.fill()
    ctx.beginPath(); ctx.arc(hx, hy, 0.7, 0, Math.PI*2)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill()

  } else if (tool === 'Write') {
    // Data injection: glowing tube with 5 racing packets and explosive detonation on arrival
    function rnw(s: number) { const x = Math.sin(s*127.1+311.7)*43758.5453; return x-Math.floor(x) }
    // Outer glow tube
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.07)`; ctx.lineWidth = 14; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.18)`; ctx.lineWidth = 3; ctx.stroke()
    // 5 packets racing along the tube with offsets
    for (let i = 0; i < 5; i++) {
      const phase = ((e * 1.6 - i * 0.2) % 1 + 1) % 1
      if (phase > 0.98) continue
      const pe = eio(phase)
      const px = from.x + (to.x-from.x) * pe
      const py = from.y + (to.y-from.y) * pe
      const fadeOut = phase > 0.85 ? (1 - phase) / 0.15 : 1
      const pulse = 0.7 + 0.3 * Math.sin(t * 22 + i * 1.4)
      ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI*2)
      ctx.fillStyle = `rgba(${r},${g},${b},${fadeOut * 0.75})`; ctx.fill()
      ctx.beginPath(); ctx.arc(px, py, 1.3, 0, Math.PI*2)
      ctx.fillStyle = `rgba(255,255,255,${fadeOut * pulse * 0.95})`; ctx.fill()
    }
    // Soft arrival pulse
    if (progress > 0.8) {
      const fl = (progress - 0.8) / 0.2
      ctx.beginPath(); ctx.arc(to.x, to.y, fl * 14, 0, Math.PI*2)
      ctx.strokeStyle = `rgba(${r},${g},${b},${(1-fl) * 0.5})`; ctx.lineWidth = 1; ctx.stroke()
    }

  } else if (tool === 'Bash') {
    // Mini terminal with scrolling fake logs
    const termW = 62, termH = 52
    const termX = to.x - termW / 2, termY = to.y - termH / 2
    const fadeIn = Math.min(1, progress * 3)

    // Dark background
    ctx.fillStyle = `rgba(15,15,20,${fadeIn * 0.92})`
    ctx.beginPath()
    ctx.roundRect(termX, termY, termW, termH, 3)
    ctx.fill()

    // Frame border
    ctx.strokeStyle = `rgba(${r},${g},${b},${fadeIn * 0.5})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(termX, termY, termW, termH, 3)
    ctx.stroke()

    // Title bar background
    ctx.fillStyle = `rgba(${r},${g},${b},${fadeIn * 0.15})`
    ctx.beginPath()
    ctx.roundRect(termX, termY, termW, 9, [3, 3, 0, 0])
    ctx.fill()

    // Title bar dots
    const dotColors = ['#ff5f57', '#febc2e', '#28c840']
    for (let d = 0; d < 3; d++) {
      ctx.fillStyle = `rgba(${d===0?'255,95,87':d===1?'254,188,46':'40,200,64'},${fadeIn * 0.8})`
      ctx.beginPath()
      ctx.arc(termX + 5 + d * 6, termY + 4.5, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Title text
    ctx.fillStyle = `rgba(${r},${g},${b},${fadeIn * 0.5})`
    ctx.font = '5px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('bash', termX + termW / 2, termY + 7)

    // Clip log area
    ctx.save()
    ctx.beginPath()
    ctx.rect(termX + 1, termY + 10, termW - 2, termH - 11)
    ctx.clip()

    // Fake log lines — deterministic from progress, scrolling upward
    const logLines = [
      '$ npm run build',
      'compiling 42 modules...',
      'transform: es2022',
      'chunk vendor [hash]',
      'minify: terser pass 1',
      'tree-shake: 12 removed',
      'emit: dist/index.js',
      'asset: 142kb gzip:38kb',
      '$ git status',
      'M  src/store.ts',
      'M  renderer.ts',
      '$ eslint --fix .',
      'fixed 3 warnings',
      '$ tsc --noEmit',
      'no errors found',
      '$ vitest run',
      'PASS tests/unit.ts',
      'PASS tests/e2e.ts',
      '3 passed, 0 failed',
      '$ docker build .',
      'layer 1/5 cached',
      'layer 2/5 RUN npm ci',
      'layer 3/5 COPY .',
      'built in 4.2s',
      '$ deploy --prod',
      'uploading bundle...',
      'deployed v2.1.0 ✓',
    ]
    const lineH = 6.5
    const visibleLines = Math.floor((termH - 11) / lineH)
    // Scroll speed: one new line per 0.08 progress
    const scrollOffset = progress / 0.08
    const startLine = Math.floor(scrollOffset)
    // Fractional pixel offset for smooth scrolling
    const fracOffset = (scrollOffset - startLine) * lineH

    ctx.font = '5px monospace'
    ctx.textAlign = 'left'
    for (let i = -1; i <= visibleLines; i++) {
      const lineIdx = (startLine + i) % logLines.length
      const text = logLines[lineIdx < 0 ? logLines.length + lineIdx : lineIdx]
      const ly = termY + 10 + lineH + i * lineH - fracOffset

      // Prompt lines get color, rest get dimmer
      const isPrompt = text.startsWith('$')
      const alpha = fadeIn * (isPrompt ? 0.9 : 0.6)
      ctx.fillStyle = isPrompt
        ? `rgba(${r},${g},${b},${alpha})`
        : `rgba(180,200,180,${alpha})`
      ctx.fillText(text.slice(0, 14), termX + 3, ly)
    }

    ctx.restore()

    // Subtle scanline overlay
    ctx.fillStyle = `rgba(0,0,0,${fadeIn * 0.06})`
    for (let sy = termY + 10; sy < termY + termH; sy += 2) {
      ctx.fillRect(termX, sy, termW, 1)
    }

  } else if (tool === 'WebFetch') {
    // Sine wave beam
    const dx = to.x-from.x, dy = to.y-from.y
    const len = Math.hypot(dx,dy)
    const nx2 = -dy/len, ny2 = dx/len
    for (const [lw, la] of [[8,0.04],[3,0.1],[1.5,0.7]] as [number,number][]) {
      ctx.beginPath()
      for (let i = 0; i <= 50; i++) {
        const frac = (i/50)*e
        const bx = from.x+dx*frac, by = from.y+dy*frac
        const wv = Math.sin(frac*Math.PI*5-t*10)*6*Math.min(1,frac*5)*Math.min(1,(e-frac)*8)
        const px = bx+nx2*wv, py = by+ny2*wv
        i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py)
      }
      ctx.strokeStyle=`rgba(${r},${g},${b},${la})`; ctx.lineWidth=lw; ctx.stroke()
    }
    const whx = from.x+dx*e+nx2*Math.sin(e*Math.PI*5-t*10)*6
    const why = from.y+dy*e+ny2*Math.sin(e*Math.PI*5-t*10)*6
    ctx.beginPath(); ctx.arc(whx,why,2.5,0,Math.PI*2)
    ctx.fillStyle=`rgba(${r},${g},${b},0.9)`; ctx.fill()
    ctx.beginPath(); ctx.arc(whx,why,1,0,Math.PI*2)
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill()

  } else if (tool === 'Notification' || tool === 'Stop') {
    // Expanding rings from core — slow, wide, visible
    const cx2 = from.x, cy2 = from.y
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.2
      const rt = Math.max(0, (progress - delay) / (1 - delay))
      const rr = rt * 110, ra = (1 - rt) * (0.7 - i * 0.12)
      if (ra <= 0 || rr <= 0) continue
      ctx.beginPath(); ctx.arc(cx2, cy2, rr, 0, Math.PI*2)
      ctx.strokeStyle = `rgba(${r},${g},${b},${ra})`
      ctx.lineWidth = 1.8 - i * 0.3; ctx.stroke()
    }
    // Bright core flash at start
    const flash = Math.max(0, 1 - progress * 4)
    if (flash > 0) {
      const fg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 20)
      fg.addColorStop(0, `rgba(${r},${g},${b},${flash * 0.5})`)
      fg.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath(); ctx.arc(cx2, cy2, 20, 0, Math.PI*2)
      ctx.fillStyle = fg; ctx.fill()
    }
    ctx.beginPath(); ctx.arc(cx2, cy2, 3 + progress * 2, 0, Math.PI*2)
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, 0.9 - progress * 2)})`; ctx.fill()

  } else {
    // Fallback: simple dot trail
    const trail2 = Math.max(0, e - 0.25)
    const tx2 = from.x+(to.x-from.x)*trail2, ty2 = from.y+(to.y-from.y)*trail2
    const fg = ctx.createLinearGradient(tx2,ty2,hx,hy)
    fg.addColorStop(0, `rgba(${r},${g},${b},0)`)
    fg.addColorStop(1, `rgba(${r},${g},${b},0.8)`)
    ctx.beginPath(); ctx.moveTo(tx2,ty2); ctx.lineTo(hx,hy)
    ctx.strokeStyle=fg; ctx.lineWidth=1.2; ctx.stroke()
    ctx.beginPath(); ctx.arc(hx,hy,2,0,Math.PI*2)
    ctx.fillStyle=`rgba(${r},${g},${b},0.9)`; ctx.fill()
  }
}

function _drawPermRing(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number) {
  const segs = 10
  for (let s = 0; s < segs; s++) {
    const a1 = (s / segs) * Math.PI * 2 + t * 1.2
    const a2 = ((s + 0.45) / segs) * Math.PI * 2 + t * 1.2
    ctx.beginPath(); ctx.arc(x, y, r, a1, a2)
    ctx.strokeStyle = `rgba(251,191,36,${0.7 + Math.sin(t * 3) * 0.2})`
    ctx.lineWidth = 1.5; ctx.stroke()
  }
}
