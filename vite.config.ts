import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import babel from 'vite-plugin-babel'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import stylelint from 'vite-plugin-stylelint'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import { generateAvailableTasks } from './scripts/generate-available-tasks'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
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
        build: !isDev,
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
    },

    css: {
      devSourcemap: isDev,
      // transformer: 'lightningcss',
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
      sourcemap: isDev,
      minify: isDev ? false : 'esbuild',
      cssCodeSplit: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          entryFileNames: 'index.js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },

    esbuild: isDev
      ? {}
      : {
          drop: ['console', 'debugger'],
        },

    logLevel: 'info',
  }
})
