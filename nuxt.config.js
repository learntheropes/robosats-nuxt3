import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      robosatsCoordinatorUrl: process.env.ROBOSATS_COORDINATOR_URL
    }
  },
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