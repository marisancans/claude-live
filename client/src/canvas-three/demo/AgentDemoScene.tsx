/**
 * Agent Demo Scene — #/agent-demo route.
 * Preview 5 different agent visualization concepts.
 */
import { useEffect, useRef, useState } from 'react'
import { AgentDemoApp } from './AgentDemoApp'
import { AGENT_VARIATIONS, type AgentVariation } from './variations/agent'

export function AgentDemoScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<AgentDemoApp | null>(null)
  const rafRef = useRef<number>(0)

  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const app = new AgentDemoApp(containerRef.current)
    appRef.current = app

    // Start with first variation
    app.setVariation(AGENT_VARIATIONS[0])

    function loop() {
      app.tick()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      app.destroy()
      appRef.current = null
    }
  }, [])

  function selectVariation(idx: number) {
    setActiveIdx(idx)
    appRef.current?.setVariation(AGENT_VARIATIONS[idx])
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030308', position: 'relative', overflow: 'hidden' }}>
      {/* Canvas */}
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      {/* UI Panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 320, height: '100%',
        background: 'rgba(3,3,14,0.92)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        color: '#aaa',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, rgba(100,120,255,0.06) 0%, transparent 100%)',
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#555', marginBottom: 6, textTransform: 'uppercase' }}>
            SUBAGENT VISUALIZATIONS
          </div>
          <div style={{ fontSize: 16, color: '#e8ecf4', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Agent Node Concepts
          </div>
          <div style={{ fontSize: 11, color: '#556', marginTop: 4, lineHeight: 1.5 }}>
            Each concept is a completely different visual direction for representing
            a subagent in the Three.js scene.
          </div>
        </div>

        {/* Variation cards */}
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {AGENT_VARIATIONS.map((v, i) => {
            const isActive = activeIdx === i
            const accentColors = ['#66aaff', '#aa66ff', '#8833cc', '#4488ff', '#44ddff']
            const accent = accentColors[i]
            return (
              <button
                key={v.name}
                onClick={() => selectVariation(i)}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 8,
                  border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.06)'}`,
                  background: isActive
                    ? `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`
                    : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = `${accent}66`
                    ;(e.currentTarget as HTMLElement).style.background = `${accent}08`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    background: `linear-gradient(180deg, ${accent}, ${accent}44)`,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: isActive
                      ? `linear-gradient(135deg, ${accent}44, ${accent}22)`
                      : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: isActive ? accent : '#555',
                    border: `1px solid ${isActive ? `${accent}33` : 'rgba(255,255,255,0.06)'}`,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
                    color: isActive ? '#eef2ff' : '#bbb',
                  }}>
                    {v.name}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: isActive ? '#8899bb' : '#556', lineHeight: 1.6, paddingLeft: 38 }}>
                  {v.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Pulse button */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => appRef.current?.triggerPulse()}
            style={{
              width: '100%', padding: '10px 0',
              background: 'linear-gradient(135deg, rgba(100,120,255,0.15), rgba(100,120,255,0.08))',
              border: '1px solid rgba(100,120,255,0.2)',
              borderRadius: 6, cursor: 'pointer',
              color: '#8899cc', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(100,120,255,0.25), rgba(100,120,255,0.15))'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,120,255,0.4)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(100,120,255,0.15), rgba(100,120,255,0.08))'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,120,255,0.2)'
            }}
          >
            ⚡ TRIGGER PULSE
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: 10, color: '#334',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>drag to orbit · scroll to zoom</span>
          <span>auto-pulse active</span>
        </div>
      </div>

      {/* Back link */}
      <a
        href="#/three"
        style={{
          position: 'absolute', top: 16, left: 16,
          fontSize: 11, color: '#556', textDecoration: 'none',
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: '0.05em',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 5,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
          ;(e.currentTarget as HTMLElement).style.color = '#aab'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
          ;(e.currentTarget as HTMLElement).style.color = '#556'
        }}
      >
        ← back
      </a>
    </div>
  )
}
