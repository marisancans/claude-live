export interface Point {
  x: number
  y: number
}

export interface SplinePath {
  controlPoints: [Point, Point, Point]  // [start, control, end] for quadratic Bézier
}

/**
 * Generate a quadratic Bézier spline from start to end with a control point.
 * Control point is typically offset perpendicular to the straight line.
 */
export function generateSpline(start: Point, control: Point, end: Point): SplinePath {
  return {
    controlPoints: [start, control, end]
  }
}

/**
 * Evaluate position on quadratic Bézier curve at parameter t ∈ [0, 1]
 * Formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
 */
export function evaluateSpline(spline: SplinePath, t: number): Point {
  const [p0, p1, p2] = spline.controlPoints
  const mt = 1 - t
  const mt2 = mt * mt
  const t2 = t * t
  const a = mt2
  const b = 2 * mt * t
  const c = t2

  return {
    x: a * p0.x + b * p1.x + c * p2.x,
    y: a * p0.y + b * p1.y + c * p2.y
  }
}

/**
 * Evaluate tangent (normalized) on quadratic Bézier curve at parameter t ∈ [0, 1]
 * Derivative: B'(t) = 2(1-t)(P₁-P₀) + 2t(P₂-P₁)
 */
export function evaluateTangent(spline: SplinePath, t: number): Point {
  const [p0, p1, p2] = spline.controlPoints
  const mt = 1 - t

  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)

  // Normalize
  const mag = Math.sqrt(dx * dx + dy * dy)
  if (mag < 0.0001) return { x: 0, y: 0 }

  return {
    x: dx / mag,
    y: dy / mag
  }
}

/**
 * Generate random spline from spawn point toward cluster center.
 * @param clusterCx - cluster center X
 * @param clusterCy - cluster center Y
 * @param spawnAngle - direction in radians (0-2π) from cluster center
 * @param maxDist - distance from cluster center to spawn point
 */
export function generateRandomSpline(
  clusterCx: number,
  clusterCy: number,
  spawnAngle: number,
  maxDist: number
): SplinePath {
  // Start point: on the edge, far from cluster
  const startX = clusterCx + Math.cos(spawnAngle) * maxDist
  const startY = clusterCy + Math.sin(spawnAngle) * maxDist

  // End point: cluster center
  const endX = clusterCx
  const endY = clusterCy

  // Control point: offset perpendicular to radial line by random amount (for dramatic curves)
  const perpAngle = spawnAngle + Math.PI / 2
  const controlOffset = 80 + Math.random() * 70  // 80-150px offset for more curvature
  const sign = Math.random() > 0.5 ? 1 : -1
  const controlX = (startX + endX) / 2 + Math.cos(perpAngle) * controlOffset * sign
  const controlY = (startY + endY) / 2 + Math.sin(perpAngle) * controlOffset * sign

  return generateSpline(
    { x: startX, y: startY },
    { x: controlX, y: controlY },
    { x: endX, y: endY }
  )
}
