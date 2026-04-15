import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

export type Point = { x: number; y: number };
export type Circle = { center: Point; radius: number };

/**
 * Returns the unique circle passing through three non-collinear points.
 * Returns an Err if the points are collinear (no such circle exists).
 */
export function circumcircle(
	a: Point,
	b: Point,
	c: Point,
): Result<Circle, 'collinear'> {
	// Translate so that `a` is the origin, reducing numerical work.
	const bx = b.x - a.x;
	const by = b.y - a.y;
	const cx = c.x - a.x;
	const cy = c.y - a.y;

	// The denominator is 2 * the signed area of the triangle (cross product).
	const d = 2 * (bx * cy - by * cx);

	if (Math.abs(d) < 1e-10) {
		return err('collinear');
	}

	const bb = bx * bx + by * by;
	const cc = cx * cx + cy * cy;

	const ux = (cy * bb - by * cc) / d;
	const uy = (bx * cc - cx * bb) / d;

	const center: Point = { x: ux + a.x, y: uy + a.y };
	const radius = Math.hypot(ux, uy);

	return ok({ center, radius });
}

/**
 * Returns the length of the arc through a→b→c as a ratio of the circle's circumference,
 * given the precomputed circumcircle center.
 */
export function arcRatio(a: Point, b: Point, c: Point, center: Point): number {
	const τ = 2 * Math.PI;
	const angle = (p: Point) => Math.atan2(p.y - center.y, p.x - center.x);
	const θa = angle(a);
	const δb = (((angle(b) - θa) % τ) + τ) % τ;
	const δc = (((angle(c) - θa) % τ) + τ) % τ;
	return δb < δc ? δc / τ : 1 - δc / τ;
}

export type CircleArc = Circle & { arcRatio: number };

/**
 * Returns the circumcircle and arc ratio for three points combined.
 * Returns an Err if the points are collinear.
 */
export function getCircleData(
	a: Point,
	b: Point,
	c: Point,
): Result<CircleArc, 'collinear'> {
	return circumcircle(a, b, c).map((circle) => ({
		...circle,
		arcRatio: arcRatio(a, b, c, circle.center),
	}));
}
