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
			$components: './src/lib/components',
			$types: './src/lib/types'
		}
	}
}

export default config
