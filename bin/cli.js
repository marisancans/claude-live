#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fork } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serverPath = join(__dirname, '..', 'server', 'index.js')

const cmd = process.argv[2]

if (cmd === 'start') {
  const child = fork(serverPath, [], { detached: true, stdio: 'ignore' })
  child.unref()
  console.log(`claude-live started (PID ${child.pid})`)
} else {
  // Default: run in foreground
  import(serverPath)
}
