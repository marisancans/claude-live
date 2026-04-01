/**
 * Effect Demo Scene — #/demo route.
 * Pick a tool and variation to preview the trail animation in isolation.
 */
import { useEffect, useRef, useState } from 'react'
import { EffectDemoApp } from './EffectDemoApp'
import { PROMPT_VARIATIONS, type EffectVariation } from './variations/prompt'

interface ToolGroup {
  label: string
  color: string
  variations: EffectVariation[]
}

const TOOL_GROUPS: ToolGroup[] = [
  { label: 'Prompt', color: '#93c5fd', variations: PROMPT_VARIATIONS },
]

export function EffectDemoScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<EffectDemoApp | null>(null)
  const rafRef = useRef<number>(0)

  const [activeTool, setActiveTool] = useState(0)
  const [activeVar, setActiveVar] = useState(0)

  const currentGroup = TOOL_GROUPS[activeTool]

  useEffect(() => {
    if (!containerRef.current) return
    const app = new EffectDemoApp(containerRef.current)
    appRef.current = app

    // Start with first variation
    const firstVar = TOOL_GROUPS[0].variations[0]
    app.setVariation(firstVar)

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

  function selectVariation(toolIdx: number, varIdx: number) {
    setActiveTool(toolIdx)
    setActiveVar(varIdx)
    const v = TOOL_GROUPS[toolIdx].variations[varIdx]
    appRef.current?.setVariation(v)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030308', display: 'flex', position: 'relative' }}>
      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, height: '100%' }} />

      {/* UI Panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 280, height: '100%',
        background: 'rgba(3,3,14,0.88)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'monospace', color: '#aaa',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#555', marginBottom: 4 }}>EFFECT DEMO</div>
          <div style={{ fontSize: 13, color: '#eee' }}>trail variations</div>
        </div>

        {/* Tool tabs */}
        <div style={{ display: 'flex', padding: '10px 10px 0', gap: 6, flexWrap: 'wrap' }}>
          {TOOL_GROUPS.map((g, i) => (
            <button
              key={g.label}
              onClick={() => selectVariation(i, 0)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 3,
                border: `1px solid ${activeTool === i ? g.color : 'rgba(255,255,255,0.1)'}`,
                background: activeTool === i ? `${g.color}18` : 'transparent',
                color: activeTool === i ? g.color : '#666',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Variation cards */}
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {currentGroup.variations.map((v, i) => {
            const isActive = activeTool === TOOL_GROUPS.indexOf(currentGroup) && activeVar === i
            return (
              <button
                key={v.name}
                onClick={() => selectVariation(TOOL_GROUPS.indexOf(currentGroup), i)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 5,
                  border: `1px solid ${isActive ? currentGroup.color : 'rgba(255,255,255,0.07)'}`,
                  background: isActive ? `${currentGroup.color}12` : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                    background: isActive ? currentGroup.color : '#444',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, color: isActive ? currentGroup.color : '#ccc', fontWeight: 600 }}>
                    {i + 1}. {v.name}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5, paddingLeft: 16 }}>
                  {v.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: '#444' }}>
          drag to orbit · scroll to zoom · node loops automatically
        </div>
      </div>

      {/* Back link */}
      <a
        href="#/three"
        style={{
          position: 'absolute', top: 14, left: 14,
          fontSize: 11, color: '#444', textDecoration: 'none',
          fontFamily: 'monospace', letterSpacing: '0.05em',
        }}
      >
        ← back
      </a>
    </div>
  )
}
