import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { TranscriptParser } from '../server/transcript-parser.js'

/**
 * Integration test: replay a real session file from ~/.claude/projects/
 * and verify the parser produces valid events the frontend can consume.
 *
 * Skips if no session files are found (e.g. CI without Claude Code).
 */
function findLatestSession() {
  const projectsDir = join(homedir(), '.claude', 'projects')
  try {
    const dirs = readdirSync(projectsDir)
    for (const dir of dirs) {
      const dirPath = join(projectsDir, dir)
      if (!statSync(dirPath).isDirectory()) continue
      const files = readdirSync(dirPath).filter(f => f.endsWith('.jsonl'))
      if (!files.length) continue
      const latest = files
        .map(f => ({ path: join(dirPath, f), mtime: statSync(join(dirPath, f)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime)[0]
      return latest.path
    }
  } catch {}
  return null
}

const sessionFile = findLatestSession()

describe.skipIf(!sessionFile)('Real session replay', () => {
  it('parses a real session without throwing', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))

    // Should not throw on any real data
    for (const line of lines) {
      parser.processLine(line)
    }

    expect(events.length).toBeGreaterThan(0)
  })

  it('all events have required RawEvent fields', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))
    for (const line of lines) parser.processLine(line)

    const requiredFields = [
      'id', 'session_id', 'timestamp', 'hook_event_name',
      'tool_name', 'tool_input', 'tool_response',
      'agent_id', 'agent_type', 'cwd', 'error',
      'tool_use_id', 'prompt', 'model', 'source',
    ]

    for (const event of events) {
      for (const field of requiredFields) {
        expect(event).toHaveProperty(field)
      }
      expect(event.id).toMatch(/^jsonl-/)
      expect(event.source).toBe('jsonl')
      expect(typeof event.timestamp).toBe('number')
    }
  })

  it('every PreToolUse has a matching PostToolUse (except pending)', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))
    for (const line of lines) parser.processLine(line)

    const preIds = new Set(
      events.filter(e => e.hook_event_name === 'PreToolUse' && e.tool_use_id)
        .map(e => e.tool_use_id)
    )
    const postIds = new Set(
      events.filter(e => e.hook_event_name === 'PostToolUse' && e.tool_use_id)
        .map(e => e.tool_use_id)
    )

    // Every PostToolUse should have a PreToolUse
    for (const id of postIds) {
      expect(preIds.has(id)).toBe(true)
    }

    // Unmatched PreToolUse should be in parser.pendingToolCalls (still running or last call in session)
    const unmatched = [...preIds].filter(id => !postIds.has(id))
    for (const id of unmatched) {
      expect(parser.pendingToolCalls.has(id)).toBe(true)
    }
  })

  it('emits exactly one SessionStart', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))
    for (const line of lines) parser.processLine(line)

    const starts = events.filter(e => e.hook_event_name === 'SessionStart')
    expect(starts).toHaveLength(1)
    expect(starts[0].model).toBeTruthy()
  })

  it('hook_event_name values are all valid', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))
    for (const line of lines) parser.processLine(line)

    const validTypes = new Set([
      'PreToolUse', 'PostToolUse', 'UserPromptSubmit',
      'SessionStart', 'SubagentStart',
    ])
    for (const e of events) {
      expect(validTypes.has(e.hook_event_name)).toBe(true)
    }
  })

  it('tool_response is always an object on PostToolUse', () => {
    const data = readFileSync(sessionFile, 'utf8')
    const lines = data.split('\n').filter(l => l.trim())
    const events = []
    const parser = new TranscriptParser(e => events.push(e))
    for (const line of lines) parser.processLine(line)

    const posts = events.filter(e => e.hook_event_name === 'PostToolUse')
    for (const e of posts) {
      expect(e.tool_response).toBeDefined()
      expect(typeof e.tool_response).toBe('object')
      expect(e.tool_response).not.toBeNull()
    }
  })
})
