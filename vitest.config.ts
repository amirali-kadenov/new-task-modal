import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/testing/setup-tests.ts',
        exclude: ['**/node_modules/**', '**/e2e/**'],
        coverage: {
          include: ['src/**'],
        },
        projects: [
          // Default (jsdom) unit tests keep running as-is.
          {
            extends: true,
            test: {
              name: 'unit',
              exclude: ['**/node_modules/**', '**/e2e/**', '**/*.stories.*'],
            },
          },
          // Storybook interaction (`play`) tests, e.g. every `InTrainer`
          // story — run in a real Chromium tab via Playwright so MathQuill
          // (loaded in `.storybook/preview.tsx`) works like it does in dev.
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: path.join(dirname, '.storybook'),
                storybookScript: 'npm run storybook -- --ci',
              }),
            ],
            test: {
              name: 'storybook',
              browser: {
                enabled: true,
                provider: playwright({}),
                headless: true,
                instances: [{ browser: 'chromium' }],
              },
              setupFiles: ['./.storybook/vitest.setup.ts'],
            },
          },
        ],
      },
    }),
  ),
)
