#!/usr/bin/env node
import { createServer } from '../server/index.js'
import open from 'open'

const portArgIdx = process.argv.findIndex(a => a === '--port' || a.startsWith('--port='))
const portArg = portArgIdx >= 0
  ? (process.argv[portArgIdx].includes('=') ? process.argv[portArgIdx].split('=')[1] : process.argv[portArgIdx + 1])
  : '3141'
const desiredPort = parseInt(portArg, 10)

let p = desiredPort
const tryStart = async () => {
  try {
    const { port } = await createServer({ port: p })
    const url = `http://localhost:${port}`
    console.log(`claude-live running at ${url}`)
    if (p !== desiredPort) {
      console.log(`(port ${desiredPort} was in use)`)
      console.log(`Update your hook command to use port ${port}`)
    }
    console.log('\nAdd this to ~/.claude/settings.json hooks:')
    console.log(`  curl -s -X POST ${url}/hook -H 'Content-Type: application/json' -d @- || true`)
    open(url)
  } catch (e) {
    if (e.code === 'EADDRINUSE') { p++; tryStart() }
    else { console.error(e); process.exit(1) }
  }
}
tryStart()
