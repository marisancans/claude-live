import type { Cluster, GraphNode, Projectile } from '../types'

const ORBIT_RADII = [70, 120, 175]

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)]
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

    // ── Orbit rings ──
    for (let ri = 0; ri < 3; ri++) {
      ctx.beginPath()
      ctx.arc(cx, cy, ORBIT_RADII[ri], 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.032)'
      ctx.lineWidth = 0.5; ctx.stroke()
    }
    // Outer ephemeral ring
    ctx.beginPath()
    ctx.arc(cx, cy, ORBIT_RADII[2] + 55, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.015)'
    ctx.lineWidth = 0.4; ctx.stroke()

    // ── Orbit trail: fixed-position arc stamps, white only ──
    const DASH_LEN = 0.055
    for (const node of cluster.nodes.values()) {
      const baseAl = node.nodeType === 'file' ? 1 : node.life * Math.min(1, node.entry)
      for (const m of node.marks) {
        const aStart = m.a - DASH_LEN / 2
        const aEnd = m.a + DASH_LEN / 2
        ctx.beginPath()
        ctx.arc(cx, cy, node.orbitRadius, aStart, aEnd)
        ctx.strokeStyle = `rgba(255,255,255,${m.life * baseAl * 0.45})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    // ── Impact effects ──
    for (const node of cluster.nodes.values()) drawImpact(ctx, node, t)

    // ── Ephemeral nodes (non-file) ──
    for (const node of cluster.nodes.values()) {
      if (node.nodeType === 'file') continue
      const [r, g, b] = hexToRgb(node.colorHex)
      const al = node.life * Math.min(1, node.entry)
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

    // Permission ring on core
    if (clusterPerm) {
      _drawPermRing(ctx, cx, cy, coreR + 8, t)
    }

    // Session label
    ctx.font = '9px monospace'; ctx.textAlign = 'center'
    ctx.fillStyle = isChild ? 'rgba(220,190,120,0.65)' : 'rgba(190,205,235,0.7)'
    ctx.fillText(`${isChild ? 'agent' : 'session'}:${cluster.label}`, cx, cy + coreR + 14)
  }

  // ── Projectiles ──
  for (const p of projectiles) {
    const [r, g, b] = hexToRgb(p.colorHex)
    const ox = p.cluster.centerX, oy = p.cluster.centerY
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
    // Dashed beam + collapsing reticle crosshair
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.07)`; ctx.lineWidth = 1; ctx.stroke()
    const trail = Math.max(0, e - 0.28)
    const tx0 = from.x + (to.x-from.x)*trail, ty0 = from.y + (to.y-from.y)*trail
    const grad = ctx.createLinearGradient(tx0, ty0, hx, hy)
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0.9)`)
    ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy)
    ctx.strokeStyle = grad; ctx.lineWidth = 1.3; ctx.stroke()
    const crossSize = 14 * (1 - e * 0.6)
    const alpha = Math.min(1, e * 3) * 0.7
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`; ctx.lineWidth = 0.8
    for (const [ax, ay] of [[-1,0],[1,0],[0,-1],[0,1]] as [number,number][]) {
      ctx.beginPath()
      ctx.moveTo(hx + ax*crossSize*0.4, hy + ay*crossSize*0.4)
      ctx.lineTo(hx + ax*crossSize,     hy + ay*crossSize)
      ctx.stroke()
    }
    ctx.beginPath(); ctx.arc(hx, hy, crossSize*0.55, 0, Math.PI*2)
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha*0.5})`; ctx.lineWidth = 0.6; ctx.stroke()
    if (progress > 0.85) {
      const flash = (progress - 0.85) / 0.15
      ctx.beginPath(); ctx.arc(to.x, to.y, flash * 16, 0, Math.PI*2)
      ctx.strokeStyle = `rgba(${r},${g},${b},${(1-flash)*0.6})`; ctx.lineWidth = 0.8; ctx.stroke()
    }
    ctx.beginPath(); ctx.arc(hx, hy, 1.8, 0, Math.PI*2)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill()

  } else if (tool === 'Grep' || tool === 'Glob') {
    if (tool === 'Grep') {
      // Radar fan — 3 beams sweeping in
      const mainAngle = Math.atan2(to.y-from.y, to.x-from.x)
      const len = Math.hypot(to.x-from.x, to.y-from.y);
      ([0, -0.18, 0.18] as number[]).forEach((angleOff, i) => {
        const delay = i * 0.12
        const lt = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)))
        if (lt <= 0) return
        const le = eio(lt)
        const ang = mainAngle + angleOff * (1 - le)
        const lhx = from.x + Math.cos(ang) * len * le
        const lhy = from.y + Math.sin(ang) * len * le
        const alpha = (1 - i * 0.25) * 0.7
        const lg = ctx.createLinearGradient(from.x, from.y, lhx, lhy)
        lg.addColorStop(0, `rgba(${r},${g},${b},${alpha*0.1})`)
        lg.addColorStop(1, `rgba(${r},${g},${b},${alpha})`)
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(lhx, lhy)
        ctx.strokeStyle = lg; ctx.lineWidth = i === 0 ? 1.4 : 0.7; ctx.stroke()
        if (i === 0) {
          ctx.beginPath(); ctx.arc(lhx, lhy, 2, 0, Math.PI*2)
          ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fill()
        }
      })
      const sweepArc = 0.35 * (1 - progress * 0.5)
      ctx.beginPath(); ctx.arc(from.x, from.y, 12, mainAngle-sweepArc, mainAngle+sweepArc)
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.35*(1-progress)})`; ctx.lineWidth = 1; ctx.stroke()
    } else {
      // Glob dots formation
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.05)`; ctx.lineWidth = 1; ctx.stroke()
      for (let i = 0; i < 6; i++) {
        const frac = e - i * 0.1
        if (frac < 0 || frac > 1) continue
        const px = from.x + (to.x-from.x)*frac, py = from.y + (to.y-from.y)*frac
        ctx.beginPath(); ctx.arc(px, py, (1-i/6)*3.5+0.8, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${r},${g},${b},${(1-i/6)*0.9})`; ctx.fill()
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
    // Compressed packet → shockwave burst on impact
    const trail = Math.max(0, e - 0.15)
    const tx0 = from.x+(to.x-from.x)*trail, ty0 = from.y+(to.y-from.y)*trail
    const tg = ctx.createLinearGradient(tx0, ty0, hx, hy)
    tg.addColorStop(0, `rgba(${r},${g},${b},0)`)
    tg.addColorStop(1, `rgba(${r},${g},${b},0.85)`)
    ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy)
    ctx.strokeStyle = tg; ctx.lineWidth = 2.5; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`; ctx.lineWidth = 10; ctx.stroke()
    ctx.beginPath(); ctx.arc(hx, hy, 3.5, 0, Math.PI*2)
    ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fill()
    ctx.beginPath(); ctx.arc(hx, hy, 1.5, 0, Math.PI*2)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill()
    if (progress > 0.7) {
      const imp = (progress - 0.7) / 0.3
      for (let i = 0; i < 3; i++) {
        const rt = Math.max(0, imp - i*0.15)
        const rr = rt*(22+i*8), ra = (1-rt)*(0.6-i*0.15)
        if (ra <= 0) continue
        ctx.beginPath(); ctx.arc(to.x, to.y, rr, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${ra})`; ctx.lineWidth = 1.2-i*0.3; ctx.stroke()
      }
      for (let i = 0; i < 8; i++) {
        const angle = (i/8)*Math.PI*2+imp
        const dist = imp*(12+i%3*5)
        const px = to.x+Math.cos(angle)*dist, py = to.y+Math.sin(angle)*dist
        ctx.beginPath(); ctx.arc(px, py, 1.2*(1-imp*0.7), 0, Math.PI*2)
        ctx.fillStyle = `rgba(${r},${g},${b},${(1-imp)*0.7})`; ctx.fill()
      }
    }

  } else if (tool === 'Bash') {
    // Branching lightning
    const seed = Math.floor(progress / 0.12)
    function sr(s: number) { const x = Math.sin(s*127.1+311.7)*43758.5453; return x-Math.floor(x) }
    function bolt(x0: number, y0: number, x1: number, y1: number, depth: number, alpha: number, s: number) {
      if (depth === 0 || alpha < 0.05) {
        ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1)
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth = depth===0?0.5:1; ctx.stroke(); return
      }
      const mx = (x0+x1)/2+(sr(s*7.3+depth)-0.5)*28*(1/depth)
      const my = (y0+y1)/2+(sr(s*13.1+depth)-0.5)*28*(1/depth)
      bolt(x0,y0,mx,my,depth-1,alpha,s*2.1)
      bolt(mx,my,x1,y1,depth-1,alpha,s*3.7)
      if (depth===2 && sr(s*5.9)>0.4) {
        const bx = mx+(sr(s*8.3)-0.5)*30, by = my+(sr(s*9.1)-0.5)*30
        bolt(mx,my,bx,by,depth-2,alpha*0.45,s*4.3)
      }
    }
    ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(hx,hy)
    ctx.strokeStyle=`rgba(${r},${g},${b},0.07)`; ctx.lineWidth=8; ctx.stroke()
    bolt(from.x,from.y,hx,hy,3,0.75,seed)
    ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(hx,hy)
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=0.6; ctx.stroke()
    ctx.beginPath(); ctx.arc(from.x,from.y,3+Math.sin(t*30)*1.5,0,Math.PI*2)
    ctx.fillStyle=`rgba(${r},${g},${b},0.8)`; ctx.fill()
    if (progress > 0.82) {
      const fl = (progress-0.82)/0.18
      ctx.beginPath(); ctx.arc(to.x,to.y,fl*18,0,Math.PI*2)
      ctx.strokeStyle=`rgba(${r},${g},${b},${(1-fl)*0.8})`; ctx.lineWidth=1.2; ctx.stroke()
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
