#!/usr/bin/env node
import { request } from 'http'
import { request as httpsRequest } from 'https'
import { readFileSync, mkdirSync, appendFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const CONFIG_PATH = join(homedir(), '.config', 'claude-live', 'config.json')
const LOG_DIR = join(homedir(), '.config', 'claude-live', 'logs')

function getTargets() {
  try {
    const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
    if (Array.isArray(cfg.targets) && cfg.targets.length > 0) return cfg.targets
    if (cfg.url) return [cfg.url]
  } catch {}
  return ['http://localhost:43451']
}

function writeLog(entry) {
  try {
    mkdirSync(LOG_DIR, { recursive: true })
    const date = new Date().toISOString().slice(0, 10)
    appendFileSync(join(LOG_DIR, `${date}.jsonl`), JSON.stringify(entry) + '\n')
  } catch {}
}

function postToTarget(url, body) {
  return new Promise(resolve => {
    const start = Date.now()
    try {
      const parsed = new URL(url)
      const isHttps = parsed.protocol === 'https:'
      const req = (isHttps ? httpsRequest : request)({
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: '/hook',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': body.length },
        timeout: 2000,
      }, res => {
        res.resume()
        resolve({ url, ok: res.statusCode === 200, ms: Date.now() - start })
      })
      req.on('error', () => resolve({ url, ok: false, ms: Date.now() - start, error: 'connection_error' }))
      req.on('timeout', () => { req.destroy(); resolve({ url, ok: false, ms: Date.now() - start, error: 'timeout' }) })
      req.end(body)
    } catch (e) {
      resolve({ url, ok: false, ms: Date.now() - start, error: e.message })
    }
  })
}

let data = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', c => data += c)
process.stdin.on('end', async () => {
  if (!data.trim()) process.exit(0)

  const body = Buffer.from(data)
  const targets = getTargets()

  let event = {}
  try { event = JSON.parse(data) } catch {}

  const results = await Promise.all(targets.map(url => postToTarget(url, body)))

  writeLog({
    ts: new Date().toISOString(),
    session_id: event.session_id ?? null,
    hook_event_name: event.hook_event_name ?? null,
    tool_name: event.tool_name ?? null,
    targets: results,
  })

  process.exit(0)
})
process.stdin.on('error', () => process.exit(0))
