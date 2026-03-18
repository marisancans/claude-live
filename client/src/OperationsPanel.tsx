import type { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface NodeType {
  badge: string
  name: string
  description: string
  color: string
}

interface AnimationStyle {
  name: string
  description: string
}

const NODE_TYPES: NodeType[] = [
  { badge: '#', name: 'Read', description: 'file operations', color: '#22c55e' },
  { badge: 'E', name: 'Edit / Write', description: 'editing tools', color: '#3b82f6' },
  { badge: 'B', name: 'Bash', description: 'shell commands', color: '#f97316' },
  { badge: 'G', name: 'Grep / Glob', description: 'search tools', color: '#a855f7' },
  { badge: '↗', name: 'WebFetch', description: 'HTTP requests', color: '#ec4899' },
  { badge: '!', name: 'Notification', description: 'notifications', color: '#06b6d4' },
  { badge: '✓', name: 'Stop', description: 'tool completion', color: '#666666' },
  { badge: '⬡', name: 'Subagent', description: 'subagent execution', color: '#a855f7' },
]

const ANIMATIONS: AnimationStyle[] = [
  { name: 'Slide-in bounce', description: 'New event arrives at top of log' },
  { name: 'Dot pop', description: 'Emphasis animation on new entry (scale/rotate)' },
  { name: 'Scan shimmer', description: 'Left-to-right scan effect (processing effect)' },
  { name: 'Fade with time', description: 'Entry visibility decreases after 5 seconds' },
]

export function OperationsPanel({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="panel-overlay operations-panel">
      <button className="panel-close-btn" onClick={onClose}>×</button>

      <div className="panel-section">
        <h3>Node Types</h3>
        <div className="node-types-grid">
          {NODE_TYPES.map(type => (
            <div key={type.name} className="node-type-item">
              <div className="node-type-badge" style={{ background: type.color }}>
                {type.badge}
              </div>
              <div className="node-type-info">
                <div className="node-type-name">{type.name}</div>
                <div className="node-type-description">{type.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Animation Styles</h3>
        <div className="animations-list">
          {ANIMATIONS.map(anim => (
            <div key={anim.name} className="animation-item">
              <div className="animation-name">{anim.name}</div>
              <div className="animation-description">{anim.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
