import { useEffect, useRef, useState } from 'react'
import type { RawEvent } from './types'
import { createStore } from './store'
import { PixiScene } from './canvas/PixiScene'

const store = createStore()

export function App() {
  const [clusters, setClusters] = useState(store.getSessions())
  const [lastEvent, setLastEvent] = useState<RawEvent | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource('/events')
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const event: RawEvent = JSON.parse(e.data)
        store.addEvent(event)
        setClusters(new Map(store.getSessions()))
        setLastEvent(event)
      } catch { /* ignore malformed */ }
    }
    es.onerror = () => {
      // EventSource auto-reconnects — no action needed
    }
    return () => es.close()
  }, [])

  return (
    <PixiScene clusters={clusters} lastEvent={lastEvent} />
  )
}
