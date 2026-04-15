<template>
	<div v-if="imageUrl" class="image-container">
		<img :src="imageUrl" alt="Loaded" class="image" />
		<button class="clear-btn" @click="clearImage">Clear</button>
	</div>
	<div
		v-else
		class="drop-zone"
		:class="{ 'drop-zone--active': isDragging }"
		@drop.prevent="onDrop"
		@dragover.prevent="onDragOver"
		@dragleave="onDragLeave"
	>
		<p>Drag and drop an image here</p>
		<button class="load-btn" @click="triggerFileInput">Load image</button>
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
import { ref } from 'vue';

const imageUrl = ref<string | null>(null);
const isDragging = ref(false);
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
	border: 2px dashed #aaa;
	border-radius: 8px;
	cursor: pointer;
}

.drop-zone--active {
	border-color: #3b82f6;
	background-color: #eff6ff;
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
