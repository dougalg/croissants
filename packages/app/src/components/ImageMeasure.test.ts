import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ImageMeasure from './ImageMeasure.vue';

function makeFile(name = 'photo.png') {
	return new File(['(binary)'], name, { type: 'image/png' });
}

function makeObjectUrl(name: string) {
	return `blob:fake/${name}`;
}

beforeEach(() => {
	vi.spyOn(URL, 'createObjectURL').mockImplementation((file) =>
		makeObjectUrl((file as File).name),
	);
	vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('ImageMeasure — empty state', () => {
	it('shows the drop zone', () => {
		render(ImageMeasure);
		expect(screen.getByText('Drag and drop an image here')).toBeTruthy();
	});

	it('shows a load image button', () => {
		render(ImageMeasure);
		expect(screen.getByRole('button', { name: 'Load image' })).toBeTruthy();
	});

	it('has a hidden file input accepting images', () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.accept).toBe('image/*');
	});
});

describe('ImageMeasure — loading an image', () => {
	it('displays the image after a file is dropped', async () => {
		const wrapper = mount(ImageMeasure);
		const file = makeFile('dropped.png');

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		await wrapper.find('.drop-zone').trigger('drop', { dataTransfer });

		expect(wrapper.find('img').exists()).toBe(true);
		expect(wrapper.find('img').attributes('src')).toContain('dropped.png');
	});

	it('displays the image after file input selection', async () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file = makeFile('selected.png');

		await fireEvent.change(input, { target: { files: [file] } });

		expect(screen.getByRole('img')).toBeTruthy();
		expect((screen.getByRole('img') as HTMLImageElement).src).toContain('selected.png');
	});

	it('shows the clear button once an image is loaded', async () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;

		await fireEvent.change(input, { target: { files: [makeFile()] } });

		expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();
	});

	it('replaces the previous image when a new one is loaded', async () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;

		await fireEvent.change(input, { target: { files: [makeFile('first.png')] } });
		await fireEvent.change(input, { target: { files: [makeFile('second.png')] } });

		const imgs = screen.getAllByRole('img');
		expect(imgs).toHaveLength(1);
		expect((imgs[0] as HTMLImageElement).src).toContain('second.png');
		expect(URL.revokeObjectURL).toHaveBeenCalledWith(makeObjectUrl('first.png'));
	});
});

describe('ImageMeasure — clearing', () => {
	it('returns to the drop zone after clear is clicked', async () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;

		await fireEvent.change(input, { target: { files: [makeFile()] } });
		await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

		expect(screen.getByText('Drag and drop an image here')).toBeTruthy();
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('revokes the object URL on clear', async () => {
		render(ImageMeasure);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file = makeFile('to-clear.png');

		await fireEvent.change(input, { target: { files: [file] } });
		await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

		expect(URL.revokeObjectURL).toHaveBeenCalledWith(makeObjectUrl('to-clear.png'));
	});
});

describe('ImageMeasure — drag state', () => {
	it('adds active class on dragover', async () => {
		render(ImageMeasure);
		const dropZone = screen.getByText('Drag and drop an image here').parentElement!;

		await fireEvent.dragOver(dropZone);

		expect(dropZone.classList.contains('drop-zone--active')).toBe(true);
	});

	it('removes active class on dragleave', async () => {
		render(ImageMeasure);
		const dropZone = screen.getByText('Drag and drop an image here').parentElement!;

		await fireEvent.dragOver(dropZone);
		await fireEvent.dragLeave(dropZone);

		expect(dropZone.classList.contains('drop-zone--active')).toBe(false);
	});
});
