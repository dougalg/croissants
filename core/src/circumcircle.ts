export type Point = { x: number; y: number };
export type Circle = { center: Point; radius: number };

/**
 * Returns the unique circle passing through three non-collinear points.
 * Throws if the points are collinear (no such circle exists).
 */
export function circumcircle(a: Point, b: Point, c: Point): Circle {
  // Translate so that `a` is the origin, reducing numerical work.
  const bx = b.x - a.x;
  const by = b.y - a.y;
  const cx = c.x - a.x;
  const cy = c.y - a.y;

  // The denominator is 2 * the signed area of the triangle (cross product).
  const d = 2 * (bx * cy - by * cx);

  if (Math.abs(d) < 1e-10) {
    throw new Error("Points are collinear — no circumcircle exists");
  }

  const bb = bx * bx + by * by;
  const cc = cx * cx + cy * cy;

  const ux = (cy * bb - by * cc) / d;
  const uy = (bx * cc - cx * bb) / d;

  const center: Point = { x: ux + a.x, y: uy + a.y };
  const radius = Math.hypot(ux, uy);

  return { center, radius };
}
