<template>
	<div v-if="imageUrl" class="image-container">
		<img :src="imageUrl" alt="Loaded" class="image" />
		<Button variant="destructive" class="clear-btn" @click="clearImage">Clear</Button>
	</div>
	<div
		v-else
		class="drop-zone"
		:class="dropZoneVariants({ isDragging })"
		@drop.prevent="onDrop"
		@dragover.prevent="onDragOver"
		@dragleave="onDragLeave"
	>
		<p>Drag and drop an image here</p>
		<Button class="load-btn" @click="triggerFileInput">Load image</Button>
		<input
			ref="fileInput"
			type="file"
			accept="image/*"
			class="file-input"
			@change="onFileChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { cva } from "class-variance-authority";
import { ref } from 'vue';
import "../styles/global.css";
import Button from './ui/button/Button.vue';

const dropZoneVariants = cva('border-dashed border-2', {
	variants: {
		isDragging: {
			false: 'bg-taupe-50 border-taupe-600',
			true: 'bg-accent border-accent',
		}
	},
	defaultVariants: {
		isDragging: false,
	}
})

const imageUrl = ref<string | null>(null);
const isDragging = ref(true);
const fileInput = ref<HTMLInputElement | null>(null);

function loadFile(file: File) {
	if (imageUrl.value) {
		URL.revokeObjectURL(imageUrl.value);
	}
	imageUrl.value = URL.createObjectURL(file);
}

function onDrop(event: DragEvent) {
	isDragging.value = false;
	const file =
		event.dataTransfer?.items[0]?.getAsFile() ?? event.dataTransfer?.files[0];
	if (file) loadFile(file);
}

function onDragOver() {
	isDragging.value = true;
}

function onDragLeave() {
	isDragging.value = false;
}

function triggerFileInput() {
	fileInput.value?.click();
}

function onFileChange(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) loadFile(file);
}

function clearImage() {
	if (imageUrl.value) {
		URL.revokeObjectURL(imageUrl.value);
	}
	imageUrl.value = null;
}
</script>

<style lang="css" scoped>
.drop-zone {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	border-radius: 8px;
	cursor: pointer;
}

.file-input {
	display: none;
}

.image-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.image {
	max-width: 100%;
}
</style>
