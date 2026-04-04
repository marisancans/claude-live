#!/usr/bin/env node
/**
 * Replay a real Claude Code session JSONL file through our TranscriptParser.
 * Shows what events the frontend would receive from JSONL tailing.
 *
 * Usage:
 *   node test/replay-session.js [path-to-jsonl]
 *   node test/replay-session.js                   # uses most recent session in this project
 *   node test/replay-session.js --stats            # summary only
 *   node test/replay-session.js --compare          # show what hooks would send vs what JSONL sends
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { TranscriptParser } from '../server/transcript-parser.js'

const args = process.argv.slice(2)
const statsOnly = args.includes('--stats')
const compare = args.includes('--compare')
const filePath = args.find(a => !a.startsWith('--'))

function findLatestSession() {
  // Look for sessions in the current project's directory
  const cwd = process.cwd().replace(/[^a-zA-Z0-9]/g, '-')
  const projectsDir = join(homedir(), '.claude', 'projects')

  // Try exact match first, then prefix match
  let projectDir
  try {
    const dirs = readdirSync(projectsDir)
    projectDir = dirs.find(d => d === cwd) || dirs.find(d => cwd.startsWith(d) || d.startsWith(cwd.slice(0, 20)))
    if (!projectDir) {
      // Fall back to most recently modified project
      projectDir = dirs
        .map(d => ({ name: d, mtime: statSync(join(projectsDir, d)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime)[0]?.name
    }
  } catch { }

  if (!projectDir) {
    console.error('No project directory found in ~/.claude/projects/')
    process.exit(1)
  }

  const dir = join(projectsDir, projectDir)
  const files = readdirSync(dir).filter(f => f.endsWith('.jsonl'))
  if (!files.length) {
    console.error(`No JSONL files in ${dir}`)
    process.exit(1)
  }

  const latest = files
    .map(f => ({ name: f, mtime: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]

  return join(dir, latest.name)
}

const sessionFile = filePath || findLatestSession()
console.log(`\nReplaying: ${sessionFile}\n`)

const data = readFileSync(sessionFile, 'utf8')
const lines = data.split('\n').filter(l => l.trim())

console.log(`Total JSONL lines: ${lines.length}\n`)

// Analyze raw line types first
const lineTypes = {}
const skippedTypes = {}
for (const line of lines) {
  try {
    const d = JSON.parse(line)
    const t = d.type || 'unknown'
    lineTypes[t] = (lineTypes[t] || 0) + 1
    if (!d.message) skippedTypes[t] = (skippedTypes[t] || 0) + 1
  } catch {
    lineTypes['parse-error'] = (lineTypes['parse-error'] || 0) + 1
  }
}

console.log('--- Raw JSONL line types ---')
for (const [t, c] of Object.entries(lineTypes).sort((a, b) => b[1] - a[1])) {
  const skipped = skippedTypes[t]
  console.log(`  ${t}: ${c}${skipped ? ` (${skipped} skipped - no message)` : ''}`)
}

// Run through parser
const events = []
const parser = new TranscriptParser(e => events.push(e))

for (const line of lines) {
  parser.processLine(line)
}

console.log(`\n--- Parsed events: ${events.length} ---`)

const eventCounts = {}
for (const e of events) {
  eventCounts[e.hook_event_name] = (eventCounts[e.hook_event_name] || 0) + 1
}
for (const [t, c] of Object.entries(eventCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}`)
}

// Tool breakdown
const toolCounts = {}
for (const e of events) {
  if (e.tool_name) toolCounts[e.tool_name] = (toolCounts[e.tool_name] || 0) + 1
}
if (Object.keys(toolCounts).length) {
  console.log('\n--- Tools used ---')
  for (const [t, c] of Object.entries(toolCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t}: ${c}`)
  }
}

// Check for unmatched pending tool calls
if (parser.pendingToolCalls.size > 0) {
  console.log(`\n⚠ ${parser.pendingToolCalls.size} unmatched tool_use (no tool_result received):`)
  for (const [id, p] of parser.pendingToolCalls) {
    console.log(`  ${p.name} (${id})`)
  }
}

// Show tool_response shapes
if (compare) {
  console.log('\n--- tool_response samples (what frontend receives) ---')
  const seen = new Set()
  for (const e of events) {
    if (e.hook_event_name !== 'PostToolUse' || !e.tool_response) continue
    const key = e.tool_name
    if (seen.has(key)) continue
    seen.add(key)
    const resp = e.tool_response
    const keys = Object.keys(resp)
    const preview = JSON.stringify(resp).slice(0, 150)
    console.log(`  ${key}: keys=${JSON.stringify(keys)} → ${preview}`)
  }
}

if (!statsOnly) {
  console.log('\n--- Event timeline (first 30) ---')
  for (const e of events.slice(0, 30)) {
    const tool = e.tool_name ? ` [${e.tool_name}]` : ''
    const extra = e.prompt ? ` "${e.prompt.slice(0, 50)}..."` : ''
    const model = e.model ? ` model=${e.model}` : ''
    const resp = e.tool_response ? ` → ${JSON.stringify(e.tool_response).slice(0, 60)}` : ''
    console.log(`  ${e.hook_event_name}${tool}${model}${extra}${resp}`)
  }
  if (events.length > 30) console.log(`  ... and ${events.length - 30} more`)
}

console.log()
