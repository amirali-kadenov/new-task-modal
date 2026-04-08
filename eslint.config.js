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
  // 🧹 Ignore common build and dependency folders
  globalIgnores(['dist', 'node_modules']),

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
        projectService: true,
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
  {
    files: [
      '*.js',
      '*.mjs',
      '*.cjs',
      'eslint.config.js',
      'vite.config.ts',
      '*.config.ts',
    ],
    ...tseslint.configs.disableTypeChecked,
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
