import { useEffect, useRef } from 'react'
import { SakuraApp } from './SakuraApp'
import type { ProjectVisualState, SignalEnvelope } from './types'

interface Props {
  projects: ProjectVisualState[]
  latestSignal: SignalEnvelope | null
  resetSignal?: number
}

export function SakuraScene({ projects, latestSignal, resetSignal }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<SakuraApp | null>(null)
  const frameRef = useRef<number | null>(null)
  const projectsRef = useRef(projects)
  projectsRef.current = projects

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let lastTime = performance.now()
    const app = new SakuraApp(container)
    appRef.current = app
    app.syncProjects(projectsRef.current)

    const tick = () => {
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now
      app.tick(Math.min(dt, 0.05))
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      app.destroy()
      appRef.current = null
    }
  }, [])

  useEffect(() => {
    appRef.current?.syncProjects(projects)
  }, [projects])

  useEffect(() => {
    if (!latestSignal) return
    appRef.current?.applyEvent(latestSignal.event)
  }, [latestSignal?.sequence])

  useEffect(() => {
    if (resetSignal) appRef.current?.resetGrowth()
  }, [resetSignal])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh', background: '#0e0a08' }} />
}
