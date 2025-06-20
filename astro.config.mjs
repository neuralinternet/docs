// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.tplr.ai',
	markdown: {
		rehypePlugins: [
			[rehypeMermaid, {
				strategy: 'pre-mermaid' // Switch to client-side rendering strategy
				// dark: true is no longer needed here
				// mermaidConfig is also not needed here as theming will be client-side
			}]
		],
		syntaxHighlight: 'shiki',
	},
	integrations: [
		starlight({
			title: '',
			favicon: '/favicon.ico',
			head: [
				// We will keep mermaid-themer.js but will modify its contents significantly
				{ tag: 'script', attrs: { src: '/scripts/mermaid-themer.js', defer: true } },
				// Add mermaid-expander.js for click-to-expand functionality
				{ tag: 'script', attrs: { src: '/scripts/mermaid-expander.js', defer: true } },
				// We might need to add Mermaid.js library itself if not already available
				// For example, from a CDN:
				// { tag: 'script', attrs: { src: 'https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.esm.min.mjs', type: 'module' } }
				// Or, if installed as a dependency and Astro bundles it, this might not be needed here.
			],
			logo: {
				light: './src/assets/ni-logo-text.png',
				dark: './src/assets/ni-logo-text.avif',
			},
			customCss: [
				'./src/styles/custom.css'
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/neuralinternet/compute-subnet',
				},
				{
					icon: 'discord',
					label: 'Discord',
					href: 'https://discord.com/invite/neuralinternet',
				},
				{
					icon: 'x.com',
					label: 'X',
					href: 'https://x.com/neural_internet',
				},
			],
		}),
	],
});