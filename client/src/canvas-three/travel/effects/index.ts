import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

export type { SecondaryEffect, EffectEntry } from './types'

export { buildOriginRing }      from './originRing'
export { buildEditCross }       from './editCross'
export { buildWriteLance }      from './writeLance'
export { buildWebFetchBranches } from './webFetchBranches'
export { buildPromptStreak }    from './promptStreak'
export { buildPromptNeon }      from './promptNeon'
export { buildErrorForks }      from './errorForks'
export { buildNotificationRings } from './notificationRings'
export { buildGrepGhost }       from './grepGhost'
export { buildReadScan }        from './readScan'
export { buildReadMagnetar }    from './readMagnetar'
export { buildWriteBus }        from './writeBus'
export { buildBashEffect }       from './bashEffect'
export { buildBashSparseRain }   from './bashSparseRain'
export { buildBashSpikeCorona }  from './bashSpikeCorona'

import { buildOriginRing }       from './originRing'
import { buildEditCross }        from './editCross'
import { buildWriteLance }       from './writeLance'
import { buildWebFetchBranches } from './webFetchBranches'
import { buildPromptStreak }     from './promptStreak'
import { buildPromptNeon }       from './promptNeon'
import { buildErrorForks }       from './errorForks'
import { buildNotificationRings } from './notificationRings'
import { buildGrepGhost }        from './grepGhost'
import { buildReadScan }         from './readScan'
import { buildReadMagnetar }     from './readMagnetar'
import { buildWriteBus }         from './writeBus'
import { buildBashEffect }       from './bashEffect'
import { buildBashSparseRain }   from './bashSparseRain'
import { buildBashSpikeCorona }  from './bashSpikeCorona'

export function buildEffect(tool: string, group: THREE.Group, p: SpawnParams): SecondaryEffect | null {
  switch (tool) {
    case 'Bash:first':         return buildBashSpikeCorona(group, p)
    case 'Bash':               return buildBashSpikeCorona(group, p)
    case 'response:first':     return buildOriginRing(group, 30, '#aad4ff', 0.5)
    case 'compact:post:first': return buildOriginRing(group, 40, '#FFEE88', 0.4)
    case 'Edit':               return buildEditCross(group, p)
    case 'Write':              return buildWriteBus(group, p)
    case 'WebFetch':           return buildWebFetchBranches(group, p)
    case 'prompt':             return buildPromptNeon(group, p)
    case 'error':              return buildErrorForks(group, p)
    case 'Notification':       return buildNotificationRings(group)
    case 'Grep':               return buildGrepGhost(group, p)
    case 'Read':               return buildReadMagnetar(group, p)
    default:                   return null
  }
}
