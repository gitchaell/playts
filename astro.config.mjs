// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		AstroPWA({
			registerType: "autoUpdate",
			manifest: {
				name: "PlayTS",
				short_name: "PlayTS",
				description: "A modern, client-side TypeScript playground and editor.",
				theme_color: "#3178c6",
				background_color: "#0d1117",
				display: "standalone",
				icons: [
					{
						src: "/icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icon-512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
				navigateFallback: "/index.html",
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
