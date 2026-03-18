import { useEffect, useRef } from 'react'
import type { Cluster, GraphNode, Projectile, RawEvent } from '../types'
import { tickSimulation } from './graph'
import { drawScene } from './renderer'
import { drawBackground } from './background'
import { nodeKeyFor } from '../store'

const TOOL_COLOR_HEX: Record<string, string> = {
  Read: '#4ade80', Edit: '#60a5fa', Write: '#60a5fa',
  Bash: '#f59e0b', Grep: '#a78bfa', Glob: '#a78bfa',
  WebFetch: '#f472b6', Stop: '#888888', Notification: '#34d399',
  PermissionRequest: '#fbbf24', UserPromptSubmit: '#38bdf8',
}

function desaturate(hex: string): string {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  const mr = Math.round(r*0.3 + 190*0.7), mg = Math.round(g*0.3 + 190*0.7), mb = Math.round(b*0.3 + 190*0.7)
  return `#${mr.toString(16).padStart(2,'0')}${mg.toString(16).padStart(2,'0')}${mb.toString(16).padStart(2,'0')}`
}

interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
  autofitEnabled: boolean
}

export function PixiScene({ clusters, lastEvent, onHover, onSelect, autofitEnabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const clustersRef = useRef(clusters)
  clustersRef.current = clusters
  const lastEventRef = useRef<RawEvent | null>(null)
  const projectilesRef = useRef<Projectile[]>([])
  const hoveredNodeRef = useRef<GraphNode | null>(null)
  const selectedNodeRef = useRef<GraphNode | null>(null)
  const tRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const W = window.innerWidth, H = window.innerHeight
      canvas.width = W * DPR; canvas.height = H * DPR
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Pan/zoom
    let dragging = false, dragMoved = false
    let dragStart = { x: 0, y: 0 }, viewOffset = { x: 0, y: 0 }, viewStart = { x: 0, y: 0 }
    let scale = 1

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      scale = Math.max(0.2, Math.min(4, scale * factor))
    }
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      dragging = true; dragMoved = false
      dragStart = { x: e.clientX, y: e.clientY }
      viewStart = { x: viewOffset.x, y: viewOffset.y }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved = true
        viewOffset = { x: viewStart.x + dx, y: viewStart.y + dy }
        return
      }
      // Hover detection (world coords)
      const W = window.innerWidth, H = window.innerHeight
      const wx = (e.clientX - W/2 - viewOffset.x) / scale + W/2
      const wy = (e.clientY - H/2 - viewOffset.y) / scale + H/2
      let closest: GraphNode | null = null
      let closestCluster: Cluster | null = null
      let closestDist = 28
      for (const cluster of clustersRef.current.values()) {
        for (const node of cluster.nodes.values()) {
          const d = Math.hypot(node.x - wx, node.y - wy)
          if (d < closestDist) { closestDist = d; closest = node; closestCluster = cluster }
        }
      }
      if (closest !== hoveredNodeRef.current) {
        hoveredNodeRef.current = closest
        canvas.style.cursor = closest ? 'pointer' : 'default'
        onHover(closest, closestCluster)
      }
    }
    const onMouseUp = (e: MouseEvent) => {
      if (!dragMoved && e.button === 0) {
        if (hoveredNodeRef.current) {
          const prev = selectedNodeRef.current
          if (prev === hoveredNodeRef.current) {
            selectedNodeRef.current = null; onSelect(null, null)
          } else {
            selectedNodeRef.current = hoveredNodeRef.current
            let fc: Cluster | null = null
            for (const c of clustersRef.current.values()) {
              if (c.nodes.has(hoveredNodeRef.current.key)) { fc = c; break }
            }
            onSelect(hoveredNodeRef.current, fc)
          }
        } else {
          selectedNodeRef.current = null; onSelect(null, null)
        }
      }
      dragging = false
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    function loop() {
      tRef.current += 0.016
      const t = tRef.current
      const W = window.innerWidth, H = window.innerHeight

      // Decay per-cluster transients
      for (const cluster of clustersRef.current.values()) {
        const c = cluster as any
        c.coreAct = Math.max(0, (c.coreAct || 0) - 0.014)
        if ((c.coreLabelFade || 0) > 0) c.coreLabelFade = Math.max(0, c.coreLabelFade - 0.003)
        if ((c.compacting || 0) > 0) c.compacting = Math.max(0, c.compacting - 0.0003)  // ~55s
        if ((c.compacted || 0) > 0) c.compacted = Math.max(0, c.compacted - 0.0005)  // ~32s
      }

      tickSimulation(clustersRef.current)

      // Advance projectiles — all positions computed live from refs
      const projs = projectilesRef.current
      for (let i = projs.length - 1; i >= 0; i--) {
        const p = projs[i]
        p.progress = Math.min(1, p.progress + 0.016 / p.duration)
        if (p.progress >= 1) {
          // Trigger action label at destination when animation finishes
          if (p.inbound) {
            const c = p.cluster as any
            // UserPromptSubmit: store already set the prompt text, just refresh the fade
            if (p.tool === 'UserPromptSubmit') {
              c.coreLabelFade = 1.0
              c.coreLabelColor = p.colorHex
            } else {
              c.coreLabelText = p.tool
              c.coreLabelFade = 1.0
              c.coreLabelColor = p.colorHex
            }
          } else if (p.node.key != null && p.cluster.nodes.has(p.node.key)) {
            p.node.actionFade = 1.0
          }
          projs.splice(i, 1)
        }
      }

      // Clear
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.fillStyle = '#020209'
      ctx.fillRect(0, 0, W, H)

      // Apply viewport transform (background + scene both pan/zoom together)
      ctx.save()
      ctx.translate(W/2 + viewOffset.x, H/2 + viewOffset.y)
      ctx.scale(scale, scale)
      ctx.translate(-W/2, -H/2)

      drawBackground(ctx, W, H, t)
      drawScene(ctx, W, H, clustersRef.current, projs, t)

      ctx.restore()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Fire projectile on new event — only on PreToolUse (not PostToolUse duplicate)
  useEffect(() => {
    if (!lastEvent || lastEvent === lastEventRef.current) return
    lastEventRef.current = lastEvent
    if (lastEvent.hook_event_name === 'PostToolUse') return
    const cluster = clusters.get(lastEvent.session_id)
    if (!cluster) return

    ;(cluster as any).coreAct = 1.0

    const tool = lastEvent.tool_name || lastEvent.hook_event_name || ''
    const rawHex = TOOL_COLOR_HEX[tool] ?? '#888888'
    const colorHex = desaturate(rawHex)

    // UserPromptSubmit: comet flies in from random direction in outer space
    if (tool === 'UserPromptSubmit') {
      const angle = Math.random() * Math.PI * 2
      const dist = 600 + Math.random() * 400 // far outside orbit rings
      const farNode = {
        x: cluster.centerX + Math.cos(angle) * dist,
        y: cluster.centerY + Math.sin(angle) * dist,
      } as GraphNode
      projectilesRef.current.push({
        sessionId: lastEvent.session_id,
        cluster,
        node: farNode,
        inbound: true,
        colorHex,
        tool: 'UserPromptSubmit',
        progress: 0,
        duration: 2.5 + Math.random() * 0.5,
      })
      return
    }

    // Notification / PermissionRequest: rings emanate from core
    if (tool === 'Notification' || tool === 'PermissionRequest') {
      const coreNode = { x: cluster.centerX, y: cluster.centerY } as GraphNode
      projectilesRef.current.push({
        sessionId: lastEvent.session_id,
        cluster,
        node: coreNode,
        inbound: false,
        colorHex,
        tool: 'Notification',
        progress: 0,
        duration: 4.5,
      })
      return
    }

    // Find the node this event targets by key
    const key = nodeKeyFor(lastEvent)
    if (!key) return
    const target = cluster.nodes.get(key) ?? null
    if (!target) return

    // Read/Grep/Glob/WebFetch: planet → core (inbound). Failures always outbound (show error on node)
    const inbound = lastEvent.hook_event_name !== 'PostToolUseFailure' && ['Read', 'Grep', 'Glob', 'WebFetch'].includes(tool)

    projectilesRef.current.push({
      sessionId: lastEvent.session_id,
      cluster,
      node: target,
      inbound,
      colorHex,
      tool,
      progress: 0,
      duration: 3.5 + Math.random() * 0.8,
    })
  }, [lastEvent])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, display: 'block' }}
    />
  )
}
