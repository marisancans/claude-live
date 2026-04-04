import { useEffect, useRef, useState } from 'react'
import { ColonizationDemoApp } from './ColonizationDemoApp'
import { COLONIZATION_VARIATIONS } from './variations/colonization'

function getMobileLayout() {
  return window.innerWidth < 920
}

export function ColonizationDemoScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<ColonizationDemoApp | null>(null)
  const rafRef = useRef<number>(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => getMobileLayout())

  useEffect(() => {
    const onResize = () => setIsMobile(getMobileLayout())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const app = new ColonizationDemoApp(containerRef.current)
    appRef.current = app
    app.setVariation(COLONIZATION_VARIATIONS[0])

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
    appRef.current?.setVariation(COLONIZATION_VARIATIONS[index])
  }

  const activeVariation = COLONIZATION_VARIATIONS[activeIndex]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#04050b', position: 'relative', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      <div
        style={{
          position: 'absolute',
          top: isMobile ? 'auto' : 0,
          right: 0,
          bottom: 0,
          width: isMobile ? '100%' : 392,
          height: isMobile ? '48vh' : '100%',
          maxHeight: isMobile ? 420 : '100%',
          background: 'linear-gradient(180deg, rgba(6,8,18,0.97) 0%, rgba(5,7,16,0.9) 100%)',
          borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
          borderTop: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          color: '#c8d1df',
          overflowY: 'auto',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: `linear-gradient(180deg, ${activeVariation.accent}18 0%, rgba(255,255,255,0) 100%)`,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#6f7b90', textTransform: 'uppercase', marginBottom: 8 }}>
            Space Colonization Lab
          </div>
          <div style={{ fontSize: 22, fontWeight: 680, letterSpacing: '-0.03em', color: '#eef4ff' }}>
            5 compact event-animation mappings
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.65, color: '#96a4bc', marginTop: 10 }}>
            Treat nodes as attractors. Each event arms a small pocket of them, the scaffold grows from the core, and pulses travel back through the new branch path.
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
                background: `${activeVariation.accent}16`,
              }}
            >
              {activeVariation.layout}
            </span>
            <span style={{ fontSize: 11, color: '#7f8ca4', alignSelf: 'center' }}>{activeVariation.eventModel}</span>
          </div>
        </div>

        <div style={{ padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {COLONIZATION_VARIATIONS.map((variation, index) => {
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: active ? variation.accent : '#7d889d',
                        background: active ? `${variation.accent}18` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? `${variation.accent}33` : 'rgba(255,255,255,0.06)'}`,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 650, color: active ? '#eff4ff' : '#cbd5e5' }}>{variation.name}</div>
                      <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? variation.accent : '#6d7890', marginTop: 4 }}>
                        {variation.useCase}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#7f8aa0', lineHeight: 1.55, marginTop: 10 }}>
                  {variation.description}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ padding: '14px 18px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => appRef.current?.triggerPulse()}
            style={{
              width: '100%',
              padding: '11px 0',
              borderRadius: 10,
              border: `1px solid ${activeVariation.accent}44`,
              background: `linear-gradient(135deg, ${activeVariation.accent}22 0%, rgba(255,255,255,0.03) 100%)`,
              color: '#eef4ff',
              fontSize: 12,
              fontWeight: 650,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Trigger event pulse
          </button>

          <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
            <div style={{ fontSize: 10, color: '#5f6980', lineHeight: 1.5 }}>
              Drag to orbit, scroll to zoom. Route: <code>#/colonization-demo</code>
            </div>
            <div style={{ fontSize: 10, color: '#5f6980', lineHeight: 1.5 }}>
              Suggested product mapping: keep the node field fixed, arm only event-relevant attractors, and let the scaffold persist as a compact memory of recent flow.
            </div>
          </div>
        </div>
      </div>

      <a
        href="#/three"
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
