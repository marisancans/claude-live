import './index.css'
import { StrictMode, useState, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const EffectDemoScene = lazy(() =>
  import('./canvas-three/demo/EffectDemoScene').then(m => ({ default: m.EffectDemoScene }))
)

const AgentDemoScene = lazy(() =>
  import('./canvas-three/demo/AgentDemoScene').then(m => ({ default: m.AgentDemoScene }))
)

function getRoute(): string {
  return window.location.hash.replace(/^#\/?/, '') || 'pixi'
}

function Root() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'three') {
    return <App engine="three" />
  }
  if (route === 'effect-demo') {
    return (
      <Suspense fallback={<div style={{ background: '#030308', width: '100vw', height: '100vh' }} />}>
        <EffectDemoScene />
      </Suspense>
    )
  }
  if (route === 'demo') {
    return (
      <Suspense fallback={<div style={{ background: '#030308', width: '100vw', height: '100vh' }} />}>
        <AgentDemoScene />
      </Suspense>
    )
  }
  return <App engine="pixi" />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
