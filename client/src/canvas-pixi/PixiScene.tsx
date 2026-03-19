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

  useEffect(() => {
    const initializeApp = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Initialize PixiJS app with clustersRef (live updates)
      const app = new PixiApp(canvas, clustersRef)
      await app.init()
      pixiAppRef.current = app

      // Start render loop
      let rafId: number
      const animate = () => {
        app.tick(1 / 60) // 60 FPS
        rafId = requestAnimationFrame(animate)
      }
      rafId = requestAnimationFrame(animate)

      return () => {
        cancelAnimationFrame(rafId)
      }
    }

    let cleanup: (() => void) | undefined
    initializeApp().then(c => { cleanup = c })

    return () => {
      cleanup?.()
      // Cleanup when unmounting
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy()
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100vw',
        height: '100vh',
        background: '#080808'
      }}
    />
  )
}
