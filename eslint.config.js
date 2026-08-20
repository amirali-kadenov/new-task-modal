import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import checkFile from 'eslint-plugin-check-file'
import importX from 'eslint-plugin-import-x'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactx from 'eslint-plugin-react-x'
import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // 🧹 Ignore common build and dependency folders (mirrors .gitignore —
  // flat config doesn't read .gitignore automatically)
  globalIgnores([
    'dist',
    'dist-ssr',
    'node_modules',
    'storybook-static',
    'test-results',
    'playwright-report',
    'blob-report',
    'test-artifacts',
    'e2e/visual/trainer-parity/__generated__',
    'public/stats-static',
    '.vercel',
  ]),

  // 🧩 Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],

    // 🔌 Plugins
    plugins: {
      'react-x': reactx,
      'react-refresh': reactRefresh,
      prettier,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
      vitest,
      'check-file': checkFile,
      'import-x': importX,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },

    // 🧠 Language setup
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: {
          // Tooling/config files with no tsconfig project of their own —
          // lint without type info instead of hard-failing (no `**` allowed
          // by typescript-eslint here, so each directory level is explicit).
          allowDefaultProject: [
            'test-gen.ts',
            'vitest.shims.d.ts',
            '.storybook/*.ts',
            '.storybook/*.tsx',
            '.storybook/addon-test-runner/*.ts',
            '.storybook/addon-test-runner/*.tsx',
            '.storybook/stubs/*.js',
            'scripts/*.mjs',
            'scripts/lib/*.mjs',
            'e2e/.auth.local.ts',
            'e2e/.auth.local.example.ts',
          ],
          // ~30 tooling files match the globs above; default cap is 8.
          maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 40,
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },

    // ⚙️ Settings
    settings: {
      // 'import-x/resolver-next': createTypeScriptImportResolver({
      //   alwaysTryTypes: true,
      // }),
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    // 📏 Rules
    rules: {
      // React 19 & TypeScript aware rules
      ...reactx.configs['recommended-type-checked'].rules,
      // Other recommended plugin configs
      ...reactHooks.configs['recommended-latest'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
      ...vitest.configs.recommended.rules,
      ...storybook.configs.recommended.rules,

      // 🔒 Import organization
      'import-x/no-cycle': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '**/*.{css,scss}',
              group: 'unknown',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-named-as-default': 'off',

      // 🧠 Modern React best practices
      'react-x/no-class-component': 'warn',
      'react-x/no-array-index-key': 'warn',

      // ✨ General code style
      'linebreak-style': ['error', 'unix'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'react-hooks/set-state-in-effect': 'off',

      // 💅 Prettier integration
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // 📁 File naming conventions
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      // Accessibility
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },

  // 🚫 Disable type-checking for config files
  // (`disableTypeChecked` only turns off `@typescript-eslint/*` — `react-x`'s
  // own typed rules, e.g. `no-implicit-key`, still ran with no type info and
  // crashed. Merge in react-x's matching disable set too.)
  {
    files: [
      '*.js',
      '*.mjs',
      '*.cjs',
      'eslint.config.js',
      'vite.config.ts',
      '*.config.ts',
      'scripts/*.mjs',
      'scripts/lib/*.mjs',
      '.storybook/*.ts',
      '.storybook/*.tsx',
      '.storybook/addon-test-runner/*.ts',
      '.storybook/addon-test-runner/*.tsx',
      '.storybook/stubs/*.js',
      'test-gen.ts',
    ],
    languageOptions: tseslint.configs.disableTypeChecked.languageOptions,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      ...reactx.configs['disable-type-checked'].rules,
    },
  },

  // 🎭 Real Playwright e2e specs — not Testing Library / Vitest, so `page`
  // isn't a `render()` result and this rule's heuristic misfires.
  {
    files: ['e2e/**/*.ts'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
    },
  },

  // 🗂️ Folder naming conventions for source
  {
    files: ['src/**/!(__tests__)/*'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },

  // 📝 Allow task-XX:YY filename format in grades directory
  {
    files: ['src/modules/tasks/ui/grades/**/*.{ts,tsx}'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': '+([a-z0-9])*(-+([a-z0-9:])*)',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
])
