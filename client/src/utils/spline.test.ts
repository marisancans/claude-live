import { generateSpline, evaluateSpline, evaluateTangent } from './spline'

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
})
