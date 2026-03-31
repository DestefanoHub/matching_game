import js from '@eslint/js';
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime']
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'array-callback-return': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-use-before-define': ['warn', {
        'functions': false,
        'classes': true,
        'variables': true,
        'allowNamedExports': true,
        'enums': true,
        'typedefs': true,
        'ignoreTypeReferences': true
      }],
      'arrow-body-style': ['error', 'as-needed'],
      'block-scoped-var': 'error',
      'default-case': 'error',
      'eqeqeq': 'error',
      'no-bitwise': 'error',
      'no-empty-function': 'error',
      'no-eval': 'error',
      'no-param-reassign': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'require-await': 'error'
    }
  }
]);
