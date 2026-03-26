// Audio manager using Howler.js for reliable cross-browser playback
import { Howl } from 'howler'

const CHORD_FILES = [
  '/chords/chord_01.ogg', '/chords/chord_02.ogg', '/chords/chord_03.ogg', '/chords/chord_04.ogg',
  '/chords/chord_05.ogg', '/chords/chord_06.ogg', '/chords/chord_07.ogg', '/chords/chord_08.ogg',
  '/chords/chord_09.ogg', '/chords/chord_10.ogg', '/chords/chord_11.ogg', '/chords/chord_12.ogg',
  '/chords/chord_13.ogg', '/chords/chord_14.ogg', '/chords/chord_15.ogg', '/chords/chord_16.ogg',
]

let enabled = false
let howls: Howl[] = []
let initialized = false

// Debounce per event type
const lastPlayTime = new Map<string, number>()

// Tab visibility: suppress plays while hidden + brief cooldown on refocus
let tabHidden = document.hidden
let visibleSince = document.hidden ? 0 : Date.now()
const REFOCUS_COOLDOWN_MS = 500

// Loading progress callbacks
const loadingCallbacks: Array<(loaded: number, total: number) => void> = []
export function onAudioLoadingProgress(callback: (loaded: number, total: number) => void) {
  loadingCallbacks.push(callback)
}

export function initAudio() {
  if (initialized) return
  initialized = true

  const saved = localStorage.getItem('claude-live-audio-enabled')
  if (saved !== null) enabled = saved === 'true'

  let loadedCount = 0
  howls = CHORD_FILES.map(src => new Howl({
    src: [src],
    volume: 0.2,
    preload: true,
    onload: () => {
      loadedCount++
      loadingCallbacks.forEach(cb => cb(loadedCount, CHORD_FILES.length))
    },
  }))

  // Track tab visibility. When hidden, playChordForEvent() becomes a no-op.
  // On refocus, a 500ms cooldown swallows any queued plays that Howler or
  // Chrome's throttled JS fires all at once.
  document.addEventListener('visibilitychange', () => {
    tabHidden = document.hidden
    if (!document.hidden) {
      visibleSince = Date.now()
    }
  })
}

// Map event type to chord index for consistent sounds
function chordIndexFor(toolName?: string, hookName?: string): number {
  if (toolName === 'Read') return 0
  if (toolName === 'Edit' || toolName === 'Write') return 1
  if (toolName === 'Bash') return 2
  if (toolName === 'Grep' || toolName === 'Glob') return 3
  if (toolName === 'WebFetch') return 4
  if (hookName === 'Notification' || hookName === 'PermissionRequest') return 5
  if (hookName === 'SubagentStart') return 6
  if (hookName === 'SubagentStop') return 7
  if (hookName === 'UserPromptSubmit') return 8
  if (hookName === 'SessionStart') return 9
  if (hookName === 'SessionEnd') return 10
  return Math.floor(Math.random() * CHORD_FILES.length)
}

export function playChordForEvent(toolName?: string, hookName?: string) {
  if (!enabled || howls.length === 0) return

  // Don't play while tab is hidden — prevents Howler from queuing plays
  // that all fire at once on focus
  if (tabHidden) return

  // Swallow the burst of queued events that fire in the first 500ms after
  // the tab becomes visible again
  if (Date.now() - visibleSince < REFOCUS_COOLDOWN_MS) return

  // Debounce same event type within 150ms
  const key = toolName || hookName || 'unknown'
  const now = Date.now()
  if (now - (lastPlayTime.get(key) || 0) < 150) return
  lastPlayTime.set(key, now)

  const idx = chordIndexFor(toolName, hookName)
  const howl = howls[idx % howls.length]
  if (howl.state() === 'loaded') howl.play()
}

export function playChord() {
  playChordForEvent()
}

export function setAudioEnabled(val: boolean) {
  enabled = val
  localStorage.setItem('claude-live-audio-enabled', val ? 'true' : 'false')
}

export function isAudioEnabled(): boolean {
  return enabled
}

export function getAudioLoadingProgress(): { loaded: number; total: number } {
  const loaded = howls.filter(h => h.state() === 'loaded').length
  return { loaded, total: CHORD_FILES.length }
}

export function getAudioDebugInfo() {
  return {
    enabled,
    howlCount: howls.length,
    loaded: howls.filter(h => h.state() === 'loaded').length,
    playing: howls.filter(h => h.playing()).length,
  }
}
