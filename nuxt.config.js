import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  vite: {
    plugins: [
      nodePolyfills({
        include: ['crypto'],
      })
    ]
  }
})