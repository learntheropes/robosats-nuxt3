import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  vite: {
    plugins: [
      nodePolyfills({
        include: ['crypto', 'stream', 'buffer', 'util'],
        globals: {
          Buffer: true,
          process: true,
        },
      }),
    ]
  },
})