// Audio manager for event-triggered guitar chord sounds
// Uses epic guitar chords from Andrew Chellman's sample pack

const GUITAR_CHORDS = [
  '01', '02', '03', '04', '05', '06', '07', '08',
  '09', '10', '11', '12', '13', '14', '15', '16'
]

interface AudioContext {
  audio: HTMLAudioElement
  isPlaying: boolean
}

interface AudioManagerState {
  enabled: boolean
  audioContexts: AudioContext[]
  loadedCount: number
  totalCount: number
}

const state: AudioManagerState = {
  enabled: false, // muted by default
  audioContexts: [],
  loadedCount: 0,
  totalCount: 16,
}

// Track last play time per event type to debounce rapid duplicates
const lastPlayTime = new Map<string, number>()

// Callbacks for loading progress
const loadingCallbacks: Array<(loaded: number, total: number) => void> = []
export function onAudioLoadingProgress(callback: (loaded: number, total: number) => void) {
  loadingCallbacks.push(callback)
}

function getRandomChord(): string {
  const chord = GUITAR_CHORDS[Math.floor(Math.random() * GUITAR_CHORDS.length)]
  return `/chords/chord_${chord}.wav`
}

function fadeOutAndStop(audio: HTMLAudioElement, ctx: AudioContext, durationMs: number = 300) {
  const startVolume = audio.volume
  const startTime = Date.now()

  const fadeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    audio.volume = startVolume * (1 - progress)

    if (progress >= 1) {
      clearInterval(fadeInterval)
      // Don't pause - let audio fade naturally to silence for smooth ending
      audio.volume = 0
      // Mark as idle so channel can be reused, but let audio finish naturally
      setTimeout(() => {
        audio.pause()
        audio.volume = startVolume
        ctx.isPlaying = false
      }, 500) // Give audio time to fade out completely
    }
  }, 16) // ~60fps
}

export function initAudio() {
  // Load saved preference from localStorage
  const saved = localStorage.getItem('claude-live-audio-enabled')
  if (saved !== null) {
    state.enabled = saved === 'true'
  }

  // If audio is already enabled, unlock elements on first user interaction
  // (browser autoplay policy blocks play() until a user gesture occurs)
  if (state.enabled) {
    document.addEventListener('click', primeAutoplay, { capture: true, once: true })
    document.addEventListener('keydown', primeAutoplay, { capture: true, once: true })
  }

  // Pre-load multiple audio elements for true polyphony (16 concurrent sounds)
  for (let i = 0; i < 16; i++) {
    const audio = new Audio()
    audio.preload = 'auto'  // Actually preload the audio file data
    audio.crossOrigin = 'anonymous'
    audio.volume = 0.2

    // Attach listeners BEFORE setting src (to catch loading events)
    let canplayFired = false
    audio.addEventListener('canplay', () => {
      if (!canplayFired) {
        // Audio is ready to play — track loading progress
        canplayFired = true
        state.loadedCount++
        console.debug('[audio] loaded:', state.loadedCount, '/', state.totalCount)
        loadingCallbacks.forEach(cb => cb(state.loadedCount, state.totalCount))
      }
    })
    audio.addEventListener('error', (e) => {
      console.debug('[audio] load error:', e)
      const ctx = state.audioContexts.find(c => c.audio === audio)
      if (ctx) ctx.isPlaying = false
    })

    // Track when audio finishes playing and fade out
    audio.addEventListener('ended', () => {
      const ctx = state.audioContexts.find(c => c.audio === audio)
      if (ctx) {
        ctx.isPlaying = false
        clearTimeout((ctx as any).fadeTimeout)
      }
    })

    state.audioContexts.push({ audio, isPlaying: false })

    // Set src to trigger loading (after listener is attached)
    const chord = GUITAR_CHORDS[i % GUITAR_CHORDS.length]
    audio.src = `/chords/chord_${chord}.wav`
  }
}

export function playChordForEvent(toolName?: string, hookName?: string) {
  if (!state.enabled) {
    console.debug('[audio] audio disabled')
    return
  }

  // Debounce: prevent same event type from playing too frequently
  const eventKey = toolName || hookName || 'unknown'
  const now = Date.now()
  const lastTime = lastPlayTime.get(eventKey) || 0
  const debounceMs = 150  // Small blockage: 150ms minimum between same event sounds

  if (now - lastTime < debounceMs) {
    console.debug('[audio] debounced:', eventKey)
    return
  }
  lastPlayTime.set(eventKey, now)

  // Map event types to specific chords for consistent audio feedback.
  // Each chord index maps directly to a pool element (pre-loaded in initAudio),
  // so we can play without reassigning src or calling load().
  let chordIndex = 0
  if (toolName === 'Read') chordIndex = 0
  else if (toolName === 'Edit' || toolName === 'Write') chordIndex = 1
  else if (toolName === 'Bash') chordIndex = 2
  else if (toolName === 'Grep' || toolName === 'Glob') chordIndex = 3
  else if (toolName === 'WebFetch') chordIndex = 4
  else if (hookName === 'Notification' || hookName === 'PermissionRequest') chordIndex = 5
  else if (hookName === 'SubagentStart') chordIndex = 6
  else if (hookName === 'SubagentStop') chordIndex = 7
  else if (hookName === 'UserPromptSubmit') chordIndex = 8
  else if (hookName === 'SessionStart') chordIndex = 9
  else if (hookName === 'SessionEnd') chordIndex = 10
  else chordIndex = Math.floor(Math.random() * GUITAR_CHORDS.length)

  // Prefer the element pre-loaded for this chord; fall back to any idle element.
  let selected = state.audioContexts[chordIndex % state.audioContexts.length]
  if (selected.isPlaying) {
    const idle = state.audioContexts.find(c => !c.isPlaying)
    if (!idle) {
      console.debug('[audio] no idle channels available')
      return
    }
    selected = idle
  }

  // Play the pre-loaded element directly — no src reassignment, no async load.
  // Elements are already loaded from initAudio so play() resolves synchronously.
  selected.audio.currentTime = 0
  selected.isPlaying = true

  selected.audio.play()
    .then(() => {
      const duration = selected!.audio.duration || 2.0
      const fadeDelay = Math.max(duration * 1000, 1500)
      const fadeTimeout = setTimeout(() => {
        fadeOutAndStop(selected!.audio, selected!, 1000)
      }, fadeDelay)
      ;(selected as any).fadeTimeout = fadeTimeout
    })
    .catch((err) => {
      console.debug('[audio] playback failed:', err.message)
      selected!.isPlaying = false
    })
}

// Legacy function for compatibility
export function playChord() {
  playChordForEvent()
}

// Prime all pool elements by playing them at volume 0 then pausing.
// This satisfies browsers (especially Safari) that require each element to be
// individually user-activated before it can play outside a gesture context.
function primeAutoplay() {
  for (const ctx of state.audioContexts) {
    const { audio } = ctx
    ctx.isPlaying = true
    const prevVol = audio.volume
    audio.volume = 0
    audio.play().then(() => {
      audio.pause()
      audio.currentTime = 0
      audio.volume = prevVol
      ctx.isPlaying = false
    }).catch(() => {
      ctx.isPlaying = false
    })
  }
}

export function setAudioEnabled(enabled: boolean) {
  state.enabled = enabled
  localStorage.setItem('claude-live-audio-enabled', enabled ? 'true' : 'false')
  if (enabled) primeAutoplay()
}

export function isAudioEnabled(): boolean {
  return state.enabled
}

export function getAudioLoadingProgress(): { loaded: number; total: number } {
  return { loaded: state.loadedCount, total: state.totalCount }
}

export function getAudioDebugInfo() {
  const playingCount = state.audioContexts.filter(ctx => ctx.isPlaying).length
  const recentDebounces = Array.from(lastPlayTime.entries())
    .map(([key, time]) => ({ key, msAgo: Date.now() - time }))
    .filter(d => d.msAgo < 500)
    .sort((a, b) => b.msAgo - a.msAgo)

  return {
    enabled: state.enabled,
    loadedCount: state.loadedCount,
    totalCount: state.totalCount,
    playingCount,
    recentDebounces,
  }
}
