// tests/server.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../server/index.js'

describe('SSE server', () => {
  let server, port

  beforeAll(async () => {
    ({ server, port } = await createServer({ port: 0 })) // port 0 = OS assigns
  })

  afterAll(() => server.close())

  it('returns 200 on POST /hook with valid JSON', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hook_event_name: 'PreToolUse',
        tool_name: 'Read',
        tool_input: { file_path: '/src/foo.ts' },
        session_id: 'test-session'
      })
    })
    expect(res.status).toBe(200)
  })

  it('normalizes missing session_id to fallback', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hook_event_name: 'Stop' })
    })
    expect(res.status).toBe(200)
    // buffer should have an event with a non-empty session_id
    const events = await fetch(`http://localhost:${port}/buffer`).then(r => r.json())
    expect(events[events.length - 1].session_id).toBeTruthy()
  })

  it('returns 400 on invalid JSON', async () => {
    const res = await fetch(`http://localhost:${port}/hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json'
    })
    expect(res.status).toBe(400)
  })
})
