import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		env: {
			dir: './'
		},

		alias: {
			$db: './src/lib/server/db',
			$schema: './src/lib/server/schema',
			$types: './src/lib/types',
			$components: './src/lib/components',
		}
	}
}

export default config
