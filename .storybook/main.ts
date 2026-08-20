import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'
import type { Plugin } from 'vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const statsDir = path.resolve(dirname, '../../stats')
const matheducatorClient = path.resolve(
  dirname,
  '../../matheducator/reactjs_client',
)
const stubsDir = path.resolve(dirname, 'stubs')
const statsPanelPath = path.resolve(
  matheducatorClient,
  'src/common/StatsPanel.jsx',
)

function stubMatheducatorDeps(): Plugin {
  const stubs: Record<string, string> = {
    './Global': path.resolve(stubsDir, 'matheducator-global.js'),
    '../api/Api': path.resolve(stubsDir, 'matheducator-api.js'),
    './featureFlags': path.resolve(stubsDir, 'matheducator-feature-flags.js'),
  }

  return {
    name: 'stub-matheducator-deps',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!importer) return null
      const normalizedImporter = path.normalize(importer)
      if (normalizedImporter !== statsPanelPath) return null
      const target = stubs[id]
      return target ?? null
    },
  }
}

const config: StorybookConfig = {
  stories: [
    '../src/docs/Introduction.mdx',
    '../src/docs/Architecture.mdx',
    '../src/docs/internals/Overview.mdx',
    '../src/docs/internals/LazyLoading.mdx',
    '../src/docs/internals/Styles.mdx',
    '../src/docs/internals/TaskContainer.mdx',
    '../src/docs/internals/Math.mdx',
    '../src/docs/internals/Mount.mdx',
    '../src/docs/internals/Deps.mdx',
    '../src/docs/internals/State.mdx',
    '../src/docs/internals/CheckAnswer.mdx',
    '../src/docs/internals/Templates.mdx',
    '../src/docs/internals/AddTemplate.mdx',
    '../src/docs/internals/AvailableTasks.mdx',
    '../src/docs/internals/Legacy.mdx',
    '../src/docs/internals/FeatureFlags.mdx',
    '../src/docs/internals/I18n.mdx',
    '../src/docs/internals/Panels.mdx',
    '../src/docs/internals/ScssPipeline.mdx',
    '../src/docs/internals/Glossary.mdx',
    '../src/docs/Templates.mdx',
    '../src/docs/DesignSystem.mdx',
    '../src/docs/Development.mdx',
    '../src/docs/Deployment.mdx',
    '../src/docs/statistics/Overview.mdx',
    '../src/docs/statistics/Interface.mdx',
    '../src/docs/statistics/Tables.mdx',
    '../src/docs/statistics/Generation.mdx',
    '../src/docs/statistics/Panel.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: [
    '../public',
    { from: '../test-artifacts', to: '/test-artifacts' },
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    './addon-test-runner/preset.ts',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths(), stubMatheducatorDeps()],
      define: {
        'import.meta.env.VITE_LAUNCH_BASE': JSON.stringify(
          process.env.VITE_LAUNCH_BASE || 'http://localhost:8888',
        ),
        'import.meta.env.VITE_STATS_STATIC': JSON.stringify(
          process.env.VITE_STATS_STATIC || '',
        ),
      },
      resolve: {
        alias: {
          '@': path.resolve(dirname, '../src'),
          '@stats': statsDir,
          '@matheducator/StatsPanel': statsPanelPath,
        },
      },
      server: {
        fs: {
          allow: [path.resolve(dirname, '..'), statsDir, matheducatorClient],
        },
      },
      optimizeDeps: {
        include: ['react-toastify'],
      },
    })
  },
}

export default config
