import { normalize, resolve } from 'path'

import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
// import babel from 'vite-plugin-babel'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import stylelint from 'vite-plugin-stylelint'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import { generateAvailableTasks } from './scripts/generate-available-tasks'

const statsDir = resolve(__dirname, '../stats')
const matheducatorClient = resolve(__dirname, '../matheducator/reactjs_client')
const stubsDir = resolve(__dirname, '.storybook/stubs')
const statsPanelPath = resolve(matheducatorClient, 'src/common/StatsPanel.jsx')

function stubMatheducatorDeps(): Plugin {
  const stubs: Record<string, string> = {
    './Global': resolve(stubsDir, 'matheducator-global.js'),
    '../api/Api': resolve(stubsDir, 'matheducator-api.js'),
    './featureFlags': resolve(stubsDir, 'matheducator-feature-flags.js'),
  }

  return {
    name: 'stub-matheducator-deps',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!importer) return null
      const normalizedImporter = normalize(importer)
      if (normalizedImporter !== statsPanelPath) return null
      const target = stubs[id]
      return target ?? null
    },
  }
}

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
      stubMatheducatorDeps(),
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
      alias: {
        '@': resolve(__dirname, 'src'),
        '@stats': statsDir,
        '@matheducator/StatsPanel': statsPanelPath,
      },
    },

    server: {
      fs: {
        allow: [resolve(__dirname, '.'), statsDir, matheducatorClient],
      },
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
