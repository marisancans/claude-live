import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import type { Cluster, Ripple, RawEvent } from '../types'
import { tickSimulation } from './graph'
import { drawScene } from './renderer'

const TOOL_COLORS: Record<string, number> = {
  Read: 0x4ade80, Edit: 0x60a5fa, Write: 0x60a5fa,
  Bash: 0xf59e0b, Grep: 0xa78bfa, Glob: 0xa78bfa,
  WebFetch: 0xf472b6, Stop: 0x888888, Notification: 0x34d399,
}

interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
}

export function PixiScene({ clusters, lastEvent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const gfxRef = useRef<PIXI.Graphics | null>(null)
  const textRef = useRef<PIXI.Container | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const lastEventRef = useRef<RawEvent | null>(null)
  // Store latest clusters in a ref so the ticker always sees current data
  const clustersRef = useRef(clusters)
  clustersRef.current = clusters // update every render

  useEffect(() => {
    if (!containerRef.current) return
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x080808,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })
    containerRef.current.appendChild(app.view as HTMLCanvasElement)
    appRef.current = app

    const gfx = new PIXI.Graphics()
    const textContainer = new PIXI.Container()
    app.stage.addChild(gfx)
    app.stage.addChild(textContainer)
    gfxRef.current = gfx
    textRef.current = textContainer

    // Use clustersRef.current so ticker always reads latest clusters
    app.ticker.add(() => {
      tickSimulation(clustersRef.current)
      drawScene(app, gfx, textContainer, clustersRef.current, ripplesRef.current, performance.now())
    })

    return () => { app.destroy(true); appRef.current = null }
  }, [])

  // Spawn ripple on new event
  useEffect(() => {
    if (!lastEvent || lastEvent === lastEventRef.current) return
    lastEventRef.current = lastEvent
    const cluster = clusters.get(lastEvent.session_id)
    if (!cluster) return
    // find the youngest node (age === 0)
    const nodeKey = [...cluster.nodes.keys()].find(k => cluster.nodes.get(k)!.age === 0)
    if (!nodeKey) return
    const node = cluster.nodes.get(nodeKey)!
    const color = TOOL_COLORS[lastEvent.tool_name || lastEvent.hook_event_name] ?? 0x555555
    ripplesRef.current.push({
      x: node.x, y: node.y,
      color,
      radius: 0,
      maxRadius: 300,
      alpha: 0.8,
      startTime: performance.now(),
      duration: 600,
    })
  }, [lastEvent])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
