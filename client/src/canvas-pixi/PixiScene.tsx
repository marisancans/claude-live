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
    let rafId: number | null = null

    const initializeApp = async () => {
      const canvas = canvasRef.current
      if (!canvas) {
        console.error('Canvas ref not available')
        return
      }

      try {
        // Initialize PixiJS app with clustersRef (live updates)
        console.log('Initializing PixiApp...')
        const app = new PixiApp(canvas, clustersRef)
        await app.init()
        console.log('PixiApp initialized successfully')
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
    <div>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: '#080808'
        }}
      />
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        color: '#fff',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.7)',
        padding: '5px 10px',
        borderRadius: '3px'
      }}>
        PixiJS Renderer
      </div>
    </div>
  )
}
