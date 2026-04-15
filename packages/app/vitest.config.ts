import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [vue()],
	optimizeDeps: {
		include: ['vue'],
	},
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: 'chromium' }],
		},
		coverage: {
			provider: 'v8',
			thresholds: {
				functions: 100,
				branches: 100,
				lines: 100,
				statements: 100,
			},
		},
	},
});
