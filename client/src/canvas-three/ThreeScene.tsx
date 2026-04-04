/**
 * React wrapper for the Three.js nebula renderer.
 */
import { useEffect, useRef } from 'react'
import type { Cluster, GraphNode } from '../types'
import { ThreeApp } from './ThreeApp'

interface Props {
  clusters: Map<string, Cluster>
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
  autofitEnabled: boolean
  autoRotateEnabled: boolean
}

export function ThreeScene({ clusters, onHover, onSelect, autofitEnabled, autoRotateEnabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<ThreeApp | null>(null)
  const clustersRef = useRef(clusters)
  clustersRef.current = clusters

  useEffect(() => {
    if (appRef.current) appRef.current.setAutofit(autofitEnabled)
  }, [autofitEnabled])

  useEffect(() => {
    if (appRef.current) appRef.current.setAutoRotate(autoRotateEnabled)
  }, [autoRotateEnabled])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null
    let lastTime = performance.now()

    const app = new ThreeApp(container, clustersRef)
    app.setAutofit(autofitEnabled)
    app.setAutoRotate(autoRotateEnabled)
    appRef.current = app

    const onVisibilityChange = () => {
      if (!document.hidden) lastTime = performance.now()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const animate = () => {
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now
      app.tick(dt)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
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
