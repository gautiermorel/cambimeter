import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
    ],
    build: {
      sourcemap: mode !== 'production',
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      rollupOptions: {
        output: {
          manualChunks: () => 'everything.js',
        },
      },
      cssCodeSplit: false,
    },
    server: {
      port: 8080,
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
      },
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: /^~.+/,
          replacement: (val) => val.replace(/^~/, ''),
        },
      ],
    },
  }
})
