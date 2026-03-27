#!/usr/bin/env node
// Reads a JSON event from stdin and POSTs it to the claude-live server.
// Fails silently — must never block Claude Code.
import { request } from 'http'

let data = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', c => data += c)
process.stdin.on('end', () => {
  if (!data.trim()) process.exit(0)
  const body = Buffer.from(data)
  const req = request({
    hostname: '127.0.0.1',
    port: parseInt(process.env.CLAUDE_LIVE_PORT || '43451', 10),
    path: '/hook',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': body.length },
    timeout: 2000,
  })
  req.on('error', () => {})
  req.on('timeout', () => req.destroy())
  req.end(body)
})
process.stdin.on('error', () => {})
