// tests/store.test.ts
import { describe, it, expect } from 'vitest'
import { createStore } from '../client/src/store'

const makeEvent = (overrides = {}) => ({
  id: Math.random().toString(),
  session_id: 'sess-1',
  timestamp: Date.now(),
  hook_event_name: 'PreToolUse' as const,
  tool_name: 'Read',
  tool_input: { file_path: '/src/foo.ts' },
  tool_response: null,
  ...overrides
})

describe('store', () => {
  it('keeps last 100 events', () => {
    const store = createStore()
    for (let i = 0; i < 110; i++) store.addEvent(makeEvent({ id: String(i) }))
    expect(store.getBuffer()).toHaveLength(100)
    expect(store.getBuffer()[0].id).toBe('10') // oldest remaining
  })

  it('derives node age as distance from end of buffer', () => {
    const store = createStore()
    store.addEvent(makeEvent({ id: '1', tool_input: { file_path: '/a.ts' } }))
    store.addEvent(makeEvent({ id: '2', tool_input: { file_path: '/b.ts' } }))
    store.addEvent(makeEvent({ id: '3', tool_input: { file_path: '/a.ts' } })) // a.ts touched again
    const sessions = store.getSessions()
    const cluster = sessions.get('sess-1')!
    expect(cluster.nodes.get('file:/a.ts')!.age).toBe(0) // most recent
    expect(cluster.nodes.get('file:/b.ts')!.age).toBe(1) // second from end
  })

  it('removes nodes pushed out of buffer', () => {
    const store = createStore()
    store.addEvent(makeEvent({ id: '1', tool_input: { file_path: '/old.ts' } }))
    for (let i = 2; i <= 102; i++) {
      store.addEvent(makeEvent({ id: String(i), tool_input: { file_path: '/new.ts' } }))
    }
    const cluster = store.getSessions().get('sess-1')!
    expect(cluster.nodes.has('file:/old.ts')).toBe(false)
  })

  it('creates separate clusters per session_id', () => {
    const store = createStore()
    store.addEvent(makeEvent({ session_id: 'sess-a' }))
    store.addEvent(makeEvent({ session_id: 'sess-b' }))
    expect(store.getSessions().size).toBe(2)
  })

  it('sets stopping=true on Stop event', () => {
    const store = createStore()
    store.addEvent(makeEvent())
    store.addEvent(makeEvent({ hook_event_name: 'Stop', tool_name: null, tool_input: null }))
    const cluster = store.getSessions().get('sess-1')!
    expect(cluster.stopping).toBe(true)
  })
})
