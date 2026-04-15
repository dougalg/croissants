import vue from '@vitejs/plugin-vue';
import { defineProject, mergeConfig } from 'vitest/config';
import sharedConfig from "../../vitest.shared.ts";

export default mergeConfig(sharedConfig, defineProject({
	plugins: [vue()],
	define: {
		'process.env': {},
	},
	optimizeDeps: {
		include: ['vue'],
	},
}));
