// https://en.wikipedia.org/wiki/Circumcircle#Circumcircle_equations
import { assert, describe, expect, it } from 'vitest';
import { circumcircle } from './circumcircle.ts';

describe('circumcircle', () => {
	it('finds the unit circle from three points on it', () => {
		expect(
			circumcircle(
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
				{ x: -1, y: 0 },
			)._unsafeUnwrap(),
		).toEqual({
			center: { x: 0, y: 0 },
			radius: 1,
		});
	});

	it('handles a right triangle (circumcenter is midpoint of hypotenuse)', () => {
		// triangle (0,0), (4,0), (0,3) — hypotenuse midpoint is (2, 1.5), radius = 2.5
		expect(
			circumcircle(
				{ x: 0, y: 0 },
				{ x: 4, y: 0 },
				{ x: 0, y: 3 },
			)._unsafeUnwrap(),
		).toEqual({
			center: { x: 2, y: 1.5 },
			radius: 2.5,
		});
	});

	it('handles an equilateral triangle', () => {
		// equilateral with vertices (0,0), (2,0), (1, √3) — circumcenter at (1, √3/3)
		const sqrt3 = Math.sqrt(3);
		const result = circumcircle(
			{ x: 0, y: 0 },
			{ x: 2, y: 0 },
			{ x: 1, y: sqrt3 },
		);
		assert(result.isOk());
		expect(result.value.center.x).toBeCloseTo(1);
		expect(result.value.center.y).toBeCloseTo(sqrt3 / 3);
		expect(result.value.radius).toBeCloseTo((2 * sqrt3) / 3);
	});

	it('handles a circle not centred at the origin', () => {
		// circle centred at (3, 4) with radius 5: use points (8,4), (3,9), (-2,4)
		expect(
			circumcircle(
				{ x: 8, y: 4 },
				{ x: 3, y: 9 },
				{ x: -2, y: 4 },
			)._unsafeUnwrap(),
		).toEqual({
			center: { x: 3, y: 4 },
			radius: 5,
		});
	});

	it('returns Err when the three points are collinear', () => {
		expect(
			circumcircle(
				{ x: 0, y: 0 },
				{ x: 1, y: 1 },
				{ x: 2, y: 2 },
			)._unsafeUnwrapErr(),
		).toBe('collinear');
	});
});
