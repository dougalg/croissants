import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import ImageMeasure from './ImageMeasure.vue';

describe('ImageMeasure', () => {
	it('renders', () => {
		render(ImageMeasure);
		expect(screen.getByText('Hello')).toBeTruthy();
	});
});
