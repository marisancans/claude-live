import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { scatter } from './helpers'

export type ToolInput = Record<string, unknown> | null | undefined
export type ToolResponse = Record<string, unknown> | null | undefined

export { profileRead }        from './read'
export { profileEdit }        from './edit'
export { profileWrite }       from './write'
export { profileBash }        from './bash'
export { profileGlob }        from './glob'
export { profileGrep }        from './grep'
export { profileWebFetch }    from './webfetch'
export { profilePrompt }      from './prompt'
export { profileResponse }    from './response'
export { profileStop }        from './stop'
export { profileCompactPre, profileCompactPost } from './compact'
export { profileError }       from './error'
export { profileNotification } from './notification'
export { profileSubagentStop } from './subagent'
export { profileDefault }     from './fallback'
export { scatter, perpTo }    from './helpers'

import { profileRead }        from './read'
import { profileEdit }        from './edit'
import { profileWrite }       from './write'
import { profileBash }        from './bash'
import { profileGlob }        from './glob'
import { profileGrep }        from './grep'
import { profileWebFetch }    from './webfetch'
import { profilePrompt }      from './prompt'
import { profileResponse }    from './response'
import { profileStop }        from './stop'
import { profileCompactPre, profileCompactPost } from './compact'
import { profileError }       from './error'
import { profileNotification } from './notification'
import { profileSubagentStop } from './subagent'
import { profileDefault }     from './fallback'

export function buildSpawnParams(
  toolName: string,
  colorHex: string,
  index = 0,
  filePos?: THREE.Vector3,
  toolInput?: Record<string, unknown> | null,
  toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  switch (toolName) {
    case 'Read':          return profileRead(filePos, toolInput, toolResponse)
    case 'Edit':          return profileEdit(filePos, toolInput, toolResponse)
    case 'Write':         return profileWrite(filePos, toolInput, toolResponse)
    case 'Bash':          return profileBash(index, toolInput, toolResponse)
    case 'Glob':          return profileGlob()
    case 'Grep':          return profileGrep(filePos, toolInput, toolResponse)
    case 'WebFetch':      return profileWebFetch(toolInput, toolResponse)
    case 'prompt':        return profilePrompt(index)
    case 'response':      return profileResponse(index)
    case 'Stop':          return profileStop()
    case 'compact:pre':   return profileCompactPre()
    case 'compact:post':  return profileCompactPost(index)
    case 'error':         return profileError()
    case 'Notification':  return profileNotification()
    case 'SubagentStop':  return profileSubagentStop()
    default:              return profileDefault(colorHex)
  }
}
