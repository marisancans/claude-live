/**
 * React wrapper for the Three.js nebula renderer.
 * Same props interface as PixiScene — drop-in replacement via hash routing.
 * Fetches /api/history on mount to load existing session data.
 */
import { useEffect, useRef } from 'react'
import type { Cluster, GraphNode } from '../types'
import { ThreeApp } from './ThreeApp'

interface Props {
  clusters: Map<string, Cluster>
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
  autofitEnabled: boolean
}

export function ThreeScene({ clusters, onHover, onSelect, autofitEnabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<ThreeApp | null>(null)
  const clustersRef = useRef(clusters)
  clustersRef.current = clusters

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null
    let lastTime = performance.now()

    const app = new ThreeApp(container, clustersRef)
    appRef.current = app

    const animate = () => {
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now
      app.tick(dt)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      app.destroy()
      appRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000000',
      }}
    />
  )
}
