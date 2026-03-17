#!/usr/bin/env node
import { createServer } from '../server/index.js'
import open from 'open'

const portArgIdx = process.argv.findIndex(a => a === '--port' || a.startsWith('--port='))
const portArg = portArgIdx >= 0
  ? (process.argv[portArgIdx].includes('=') ? process.argv[portArgIdx].split('=')[1] : process.argv[portArgIdx + 1])
  : '43451'
const port = parseInt(portArg, 10)

try {
  await createServer({ port })
  const url = `http://localhost:${port}`
  console.log(`claude-live running at ${url}`)
  open(url)
} catch (e) {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`)
    console.error(`Either claude-live is already running, or another process is using port ${port}.`)
    console.error(`Check: curl http://localhost:${port}/buffer`)
    process.exit(1)
  } else {
    console.error(e)
    process.exit(1)
  }
}
