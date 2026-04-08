import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import babel from 'vite-plugin-babel'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import stylelint from 'vite-plugin-stylelint'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import { generateAvailableTasks } from './scripts/generate-available-tasks'
// interface GenerateAvailableTasksPlugin {
//   name: string
//   generateBundle: () => Promise<void>

// }

// const generateAvailableTasksPlugin: GenerateAvailableTasksPlugin = () => {
//   return {
//     name: 'generate-available-tasks',
//     async generateBundle() {
//       const code = await generateAvailableTasks()

//       this.emitFile({
//         type: 'asset',
//         fileName: 'available-tasks.js',
//         source: code,
//       })
//     },
//   }
// }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    cssInjectedByJsPlugin(),
    // babel({
    //   filter: /\.(js|jsx|ts|tsx)$/, // Explicitly filter all relevant extensions
    //   babelConfig: {
    //     plugins: ['babel-plugin-react-compiler'],
    //     parserOpts: {
    //       plugins: ['typescript', 'jsx'],
    //     },
    //   },
    // }),
    // analyzer(),
    tsconfigPaths(),
    stylelint({
      fix: true,
      include: ['**/*.css', '**/*.scss'],
      build: true,
    }),
    svgr({
      include: '**/*.svg',
    }),
    {
      name: 'generate-available-tasks',
      async generateBundle() {
        const code = await generateAvailableTasks()

        this.emitFile({
          type: 'asset',
          fileName: 'available-tasks.js',
          source: code,
        })
      },
    },
  ],

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'spoiled/spoiled.css': 'spoiled/spoiled.css', // Forces resolution
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "/src/styles/lib/functions" as *;
        @use "/src/styles/lib/mixins" as *;
        @use "/src/styles/design-system/typography" as *;`,
      },
    },
  },

  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TaskModal',
      formats: ['es'],
      fileName: () => `index.js`,
    },
    sourcemap: true,
    minify: false,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      // (Optional) If you want to inspect output
      output: {
        // manualChunks: undefined,
        entryFileNames: 'index.js',
        assetFileNames: 'assets/[name][extname]',
        // chunkFileNames: 'assets/[name]-[hash].js',
        // assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  logLevel: 'info',
})
