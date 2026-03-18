import { generateSpline, evaluateSpline, evaluateTangent, generateRandomSpline } from './spline'

describe('spline utilities', () => {
  it('generates spline with start, control, end points', () => {
    const spline = generateSpline(
      { x: 0, y: 0 },      // start
      { x: 50, y: -50 },   // control
      { x: 100, y: 0 }     // end
    )
    expect(spline.controlPoints).toHaveLength(3)
    expect(spline.controlPoints[0]).toEqual({ x: 0, y: 0 })
  })

  it('evaluates position at t=0 returns start point', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: -50 }, { x: 100, y: 0 })
    const pos = evaluateSpline(spline, 0)
    expect(pos.x).toBeCloseTo(0, 2)
    expect(pos.y).toBeCloseTo(0, 2)
  })

  it('evaluates position at t=1 returns end point', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: -50 }, { x: 100, y: 0 })
    const pos = evaluateSpline(spline, 1)
    expect(pos.x).toBeCloseTo(100, 2)
    expect(pos.y).toBeCloseTo(0, 2)
  })

  it('evaluates position at t=0.5 returns midpoint', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 0 })
    const pos = evaluateSpline(spline, 0.5)
    expect(pos.x).toBeCloseTo(100, 2)
  })

  it('evaluates tangent (derivative) at points along curve', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 })
    const tangent = evaluateTangent(spline, 0.5)
    expect(Math.abs(tangent.x) + Math.abs(tangent.y)).toBeGreaterThan(0)
  })

  it('tangent is normalized (magnitude ~1)', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 })
    const tangent = evaluateTangent(spline, 0.5)
    const mag = Math.sqrt(tangent.x ** 2 + tangent.y ** 2)
    expect(mag).toBeCloseTo(1, 2)  // ±0.01 tolerance
  })

  it('generates random spline from spawn to cluster center', () => {
    const clusterCx = 100
    const clusterCy = 100
    const spawnAngle = 0  // spawn to the right
    const maxDist = 200

    const spline = generateRandomSpline(clusterCx, clusterCy, spawnAngle, maxDist)

    // Verify start point is at expected distance
    expect(spline.controlPoints[0].x).toBeCloseTo(clusterCx + maxDist, 1)
    expect(spline.controlPoints[0].y).toBeCloseTo(clusterCy, 1)

    // Verify end point is at cluster center
    expect(spline.controlPoints[2].x).toBeCloseTo(clusterCx, 1)
    expect(spline.controlPoints[2].y).toBeCloseTo(clusterCy, 1)

    // Verify control point exists and is offset
    expect(spline.controlPoints[1]).toBeDefined()
    const midX = (spline.controlPoints[0].x + spline.controlPoints[2].x) / 2
    const midY = (spline.controlPoints[0].y + spline.controlPoints[2].y) / 2
    const distFromMid = Math.sqrt(
      (spline.controlPoints[1].x - midX) ** 2 +
      (spline.controlPoints[1].y - midY) ** 2
    )
    expect(distFromMid).toBeGreaterThanOrEqual(80)  // min offset
    expect(distFromMid).toBeLessThanOrEqual(150)     // max offset
  })
})
