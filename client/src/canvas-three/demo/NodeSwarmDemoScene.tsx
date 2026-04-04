import { useEffect, useRef, useState } from 'react'
import { NodeSwarmDemoApp } from './NodeSwarmDemoApp'
import { NODE_SWARM_VARIATIONS } from './variations/nodeSwarm'

export function NodeSwarmDemoScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<NodeSwarmDemoApp | null>(null)
  const rafRef = useRef<number>(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const app = new NodeSwarmDemoApp(containerRef.current)
    appRef.current = app
    app.setVariation(NODE_SWARM_VARIATIONS[0])

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

  function selectVariation(index: number) {
    setActiveIndex(index)
    appRef.current?.setVariation(NODE_SWARM_VARIATIONS[index])
  }

  const activeVariation = NODE_SWARM_VARIATIONS[activeIndex]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#04050b', position: 'relative', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 380,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(6,8,18,0.96) 0%, rgba(6,8,18,0.88) 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          color: '#c6cfde',
          overflowY: 'auto',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            padding: '22px 22px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(180deg, rgba(90,140,255,0.08) 0%, rgba(90,140,255,0) 100%)',
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#677188', textTransform: 'uppercase', marginBottom: 8 }}>
            Node Swarm Lab
          </div>
          <div style={{ fontSize: 20, fontWeight: 650, letterSpacing: '-0.02em', color: '#eef3ff' }}>
            10 directions beyond bloom squares
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#93a0b8', marginTop: 8 }}>
            Same swarm behavior, different node identities: flat, physical, networked, and slightly higher-dimensional.
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: 999,
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeVariation.accent,
                border: `1px solid ${activeVariation.accent}44`,
                background: `${activeVariation.accent}14`,
              }}
            >
              {activeVariation.space}
            </span>
            <span style={{ fontSize: 11, color: '#6d7890', alignSelf: 'center' }}>{activeVariation.technique}</span>
          </div>
        </div>

        <div style={{ padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {NODE_SWARM_VARIATIONS.map((variation, index) => {
            const active = index === activeIndex
            return (
              <button
                key={variation.name}
                onClick={() => selectVariation(index)}
                style={{
                  textAlign: 'left',
                  borderRadius: 12,
                  border: `1px solid ${active ? variation.accent : 'rgba(255,255,255,0.07)'}`,
                  background: active
                    ? `linear-gradient(135deg, ${variation.accent}18 0%, rgba(255,255,255,0.03) 100%)`
                    : 'rgba(255,255,255,0.025)',
                  padding: '14px 15px',
                  color: 'inherit',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: active ? variation.accent : '#7a869d',
                        background: active ? `${variation.accent}18` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? `${variation.accent}33` : 'rgba(255,255,255,0.06)'}`,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 650, color: active ? '#eff4ff' : '#cbd5e5' }}>
                        {variation.name}
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? variation.accent : '#6a7488', marginTop: 3 }}>
                        {variation.space}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#7f8aa0', lineHeight: 1.5, marginTop: 10 }}>
                  {variation.description}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ padding: '14px 18px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => appRef.current?.triggerPulse()}
            style={{
              width: '100%',
              padding: '11px 0',
              borderRadius: 10,
              border: `1px solid ${activeVariation.accent}44`,
              background: `linear-gradient(135deg, ${activeVariation.accent}20 0%, rgba(255,255,255,0.03) 100%)`,
              color: '#eef3ff',
              fontSize: 12,
              fontWeight: 650,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Trigger activity pulse
          </button>
          <div style={{ fontSize: 10, color: '#5f6980', marginTop: 10, lineHeight: 1.5 }}>
            Drag to orbit, scroll to zoom. Route: <code>#/node-swarm-demo</code>
          </div>
        </div>
      </div>

      <a
        href="#"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '7px 12px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(8,10,18,0.55)',
          color: '#a8b3c8',
          textDecoration: 'none',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11,
          letterSpacing: '0.04em',
          backdropFilter: 'blur(12px)',
        }}
      >
        ← back to live view
      </a>
    </div>
  )
}
