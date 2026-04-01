/**
 * PROMPT — Single needle from deep space into core.
 * One sharp inbound streak — user input, no splits, no fragments.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profilePrompt(_index: number): SpawnParams {
  return {
    origin: scatter(250, 400),
    target: scatter(1, 4),
    color: new THREE.Color('#c8e0ff'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: rand(2.0, 3.5),
    trailLength: 0.06,
    trailBrightness: 1.8,
    trailFadeTime: 18.0,
    headSize: 0,
    pathConfig: { type: 'linear', easing: 'easeInCubic' },
    _tool: 'prompt',
  }
}
