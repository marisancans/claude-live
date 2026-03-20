import { useEffect, useRef } from 'react'
import type { Cluster, GraphNode, RawEvent } from '../types'
import { PixiApp } from './PixiApp'

interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
  autofitEnabled: boolean
}

export function PixiScene({ clusters, lastEvent, onHover, onSelect, autofitEnabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixiAppRef = useRef<PixiApp | null>(null)
  const clustersRef = useRef(clusters)
  clustersRef.current = clusters
  const autofitRef = useRef(autofitEnabled)
  autofitRef.current = autofitEnabled

  // Refs for callbacks to avoid stale closures in event handlers
  const onHoverRef = useRef(onHover)
  onHoverRef.current = onHover
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Track currently hovered node to avoid redundant calls
  const hoveredRef = useRef<string | null>(null)

  const handleMouseMove = useRef((e: React.MouseEvent) => {
    const app = pixiAppRef.current
    if (!app) return
    const hit = app.worldLayer.hitTest(e.clientX, e.clientY)
    const hitKey = hit ? `${hit.cluster.sessionId}:${hit.node.key}` : null
    if (hitKey !== hoveredRef.current) {
      hoveredRef.current = hitKey
      onHoverRef.current(hit?.node ?? null, hit?.cluster ?? null)
    }
  }).current

  const handleClick = useRef((e: React.MouseEvent) => {
    const app = pixiAppRef.current
    if (!app) return
    const hit = app.worldLayer.hitTest(e.clientX, e.clientY)
    onSelectRef.current(hit?.node ?? null, hit?.cluster ?? null)
  }).current

  useEffect(() => {
    let rafId: number | null = null

    const initializeApp = async () => {
      const canvas = canvasRef.current
      if (!canvas) {
        console.error('Canvas ref not available')
        return
      }

      try {
        const app = new PixiApp(canvas, clustersRef, autofitRef)
        await app.init()
        pixiAppRef.current = app

        // Start render loop
        const animate = () => {
          try {
            app.tick(1 / 60) // 60 FPS
          } catch (err) {
            console.error('Error in tick:', err)
          }
          rafId = requestAnimationFrame(animate)
        }
        rafId = requestAnimationFrame(animate)
      } catch (err) {
        console.error('Failed to initialize PixiApp:', err)
      }
    }

    initializeApp()

    return () => {
      // Cancel RAF loop
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      // Cleanup when unmounting
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy()
        pixiAppRef.current = null
      }
    }
  }, [])

  return (
    <div onMouseMove={handleMouseMove} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: '#080808'
        }}
      />
    </div>
  )
}
