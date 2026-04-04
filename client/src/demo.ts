/**
 * Demo mode: when no real server is available (e.g. GitHub Pages),
 * simulate realistic Claude Code events to showcase the visualization.
 */

const TOOLS = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'WebFetch'] as const
const FILES = [
  'server/index.js', 'bin/hook.js', 'bin/cli.js', 'bin/hook-wrapper.sh',
  'client/src/App.tsx', 'client/src/store.ts', 'client/src/types.ts',
  'client/src/canvas-three/ThreeApp.ts', 'client/src/canvas-three/ThreeScene.tsx',
  'client/src/canvas-three/layers/BackgroundLayer.ts', 'client/src/events/EventBus.ts',
  'package.json', 'README.md', 'CLAUDE.md', 'client/vite.config.ts',
]
const BASH_COMMANDS = [
  'npm test', 'npm run build', 'npm run dev', 'git status',
  'npx tsc --noEmit', 'grep -r TODO client/src/', 'ls -la node_modules/', 'cat .gitignore',
]
const URLS = [
  'https://nodejs.org/api/http.html', 'https://api.github.com/repos', 'https://www.npmjs.com/package/claude-live',
]
const PROMPTS = [
  'refactor the auth module to use JWT tokens',
  'add error handling to the SSE endpoint',
  'fix the failing typecheck in App.tsx',
  'implement the event filtering feature',
  'write tests for the hook handler',
]

let eventId = 0
let sessionCount = 0

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeSessionId() {
  return uuid()
}

function makeToolEvent(sessionId: string, hook: string, tool: string | null, input: any, response?: any) {
  return {
    id: `demo-${eventId++}`,
    session_id: sessionId,
    hook_event_name: hook,
    tool_name: tool,
    tool_input: input,
    tool_response: response ?? null,
    timestamp: Date.now(),
    cwd: '/home/user/claude-live',
    tool_use_id: `tu-${eventId}`,
  }
}

interface DemoSession {
  id: string
  label: string
  active: boolean
  eventsSent: number
}

export function createDemoSimulator(onEvent: (data: any) => void) {
  const sessions: DemoSession[] = []
  let tickCount = 0

  function startSession() {
    const id = makeSessionId()
    sessionCount++
    const label = `demo-session-${sessionCount}`
    sessions.push({ id, label, active: true, eventsSent: 0 })

    // SessionStart
    onEvent({
      type: 'event',
      data: makeToolEvent(id, 'SessionStart', null, null),
    })

    return id
  }

  function sendToolUse(session: DemoSession) {
    const tool = pick(TOOLS)
    let input: any = {}
    let response: any = {}

    switch (tool) {
      case 'Read':
        input = { file_path: pick(FILES) }
        response = { content: 'file contents...\n'.repeat(20) }
        break
      case 'Edit':
        input = { file_path: pick(FILES), old_string: 'old code', new_string: 'new code\nwith changes' }
        break
      case 'Write':
        input = { file_path: pick(FILES), content: '// new file\n'.repeat(10) }
        break
      case 'Bash':
        input = { command: pick(BASH_COMMANDS) }
        response = { exitCode: Math.random() > 0.9 ? 1 : 0, output: 'command output' }
        break
      case 'Grep':
        input = { pattern: pick(['TODO', 'FIXME', 'async fn', 'impl ']), path: 'src/' }
        response = { numMatches: Math.floor(Math.random() * 20) }
        break
      case 'Glob':
        input = { pattern: pick(['**/*.js', '**/*.ts', '**/*.tsx']), path: '.' }
        response = { files: FILES.slice(0, Math.floor(Math.random() * 10)) }
        break
      case 'WebFetch':
        input = { url: pick(URLS) }
        response = { status: 200 }
        break
    }

    // PreToolUse
    onEvent({
      type: 'event',
      data: makeToolEvent(session.id, 'PreToolUse', tool, input),
    })

    // PostToolUse after a delay
    setTimeout(() => {
      const isFailure = Math.random() > 0.92
      onEvent({
        type: 'event',
        data: makeToolEvent(session.id, isFailure ? 'PostToolUseFailure' : 'PostToolUse', tool, input, response),
      })
      session.eventsSent++
    }, 200 + Math.random() * 800)
  }

  function sendPrompt(session: DemoSession) {
    const prompt = pick(PROMPTS)
    onEvent({
      type: 'event',
      data: {
        ...makeToolEvent(session.id, 'UserPromptSubmit', null, null),
        prompt,
      },
    })
  }

  function sendResponse(session: DemoSession) {
    onEvent({
      type: 'event',
      data: {
        ...makeToolEvent(session.id, 'Stop', null, null),
        stop_reason: 'end_turn',
      },
    })
  }

  function sendCompaction(session: DemoSession) {
    onEvent({
      type: 'event',
      data: makeToolEvent(session.id, 'PreCompact', null, { trigger: 'auto' }),
    })
    setTimeout(() => {
      onEvent({
        type: 'event',
        data: makeToolEvent(session.id, 'PostCompact', null, { summary: 'Context compacted' }),
      })
    }, 3500)
  }

  // Start first session immediately
  const firstSession = startSession()

  // Initial prompt
  setTimeout(() => {
    const s = sessions.find(s => s.id === firstSession)
    if (s) sendPrompt(s)
  }, 500)

  // Main simulation loop
  const interval = setInterval(() => {
    tickCount++

    // Maybe start a second session after a while
    if (tickCount === 30 && sessions.length < 2) {
      const id = startSession()
      setTimeout(() => {
        const s = sessions.find(s => s.id === id)
        if (s) sendPrompt(s)
      }, 500)
    }

    // For each active session, maybe fire a tool use
    for (const session of sessions) {
      if (!session.active) continue

      const r = Math.random()

      if (r < 0.6) {
        // Tool use (most common)
        sendToolUse(session)
      } else if (r < 0.7) {
        // Prompt
        sendPrompt(session)
      } else if (r < 0.75) {
        // Response
        sendResponse(session)
      } else if (r < 0.76 && session.eventsSent > 40) {
        // Compaction (rare, only after many events)
        sendCompaction(session)
      }
      // else: idle tick
    }
  }, 1200)

  return () => clearInterval(interval)
}

/**
 * Check if we're running in demo mode (no server available).
 */
export function isDemoMode(): boolean {
  // GitHub Pages or any static hosting won't have our WebSocket server
  const host = window.location.hostname
  if (host.includes('github.io')) return true
  if (host.includes('pages.dev')) return true
  // Also enable via URL param
  if (new URLSearchParams(window.location.search).has('demo')) return true
  return false
}
