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
export { buildPromptPlasma }    from './promptPlasma'
export { buildErrorForks }      from './errorForks'
export { buildNotificationRings } from './notificationRings'
export { buildGrepGhost }       from './grepGhost'
export { buildReadScan }        from './readScan'
export { buildReadMagnetar }    from './readMagnetar'
export { buildWriteBus }        from './writeBus'
export { buildBashEffect }       from './bashEffect'
export { buildBashSparseRain }   from './bashSparseRain'
export { buildBashSpikeCorona }  from './bashSpikeCorona'
export { buildGlobSeekers }     from './globSeekers'
export { buildResponseBurst }   from './responseBurst'
export { buildCompactImplosion } from './compactImplosion'
export { buildCompactSupernova } from './compactSupernova'

import { buildOriginRing }       from './originRing'
import { buildEditCross }        from './editCross'
import { buildWriteLance }       from './writeLance'
import { buildWebFetchBranches } from './webFetchBranches'
import { buildPromptStreak }     from './promptStreak'
import { buildPromptNeon }       from './promptNeon'
import { buildPromptPlasma }     from './promptPlasma'
import { buildErrorForks }       from './errorForks'
import { buildNotificationRings } from './notificationRings'
import { buildGrepGhost }        from './grepGhost'
import { buildReadScan }         from './readScan'
import { buildReadMagnetar }     from './readMagnetar'
import { buildWriteBus }         from './writeBus'
import { buildBashEffect }       from './bashEffect'
import { buildBashSparseRain }   from './bashSparseRain'
import { buildBashSpikeCorona }  from './bashSpikeCorona'
import { buildGlobSeekers }     from './globSeekers'
import { buildResponseBurst }   from './responseBurst'
import { buildCompactImplosion } from './compactImplosion'
import { buildCompactSupernova } from './compactSupernova'

export function buildEffect(tool: string, group: THREE.Group, p: SpawnParams): SecondaryEffect | null {
  switch (tool) {
    case 'Bash:first':         return buildBashSpikeCorona(group, p)
    case 'Bash':               return buildBashSpikeCorona(group, p)
    case 'response':           return buildResponseBurst(group, p)
    case 'response:first':     return buildResponseBurst(group, p)
    case 'compact:pre':        return buildCompactImplosion(group, p)
    case 'compact:post':       return buildCompactSupernova(group, p)
    case 'compact:post:first': return buildCompactSupernova(group, p)
    case 'Edit':               return buildEditCross(group, p)
    case 'Write':              return buildWriteBus(group, p)
    case 'WebFetch':           return buildWebFetchBranches(group, p)
    case 'prompt':             return buildPromptPlasma(group, p)
    case 'error':              return buildErrorForks(group, p)
    case 'Notification':       return buildNotificationRings(group)
    case 'Grep':               return buildGrepGhost(group, p)
    case 'Glob':               return buildGlobSeekers(group, p)
    case 'Read':               return buildReadMagnetar(group, p)
    default:                   return null
  }
}
