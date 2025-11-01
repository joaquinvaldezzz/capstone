import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(['src/_app']),
  {
    extends: [
      ...nextCoreWebVitals,
      ...compat.extends('plugin:react/recommended'),
      ...compat.extends('airbnb-typescript'),
      ...compat.extends('standard-with-typescript'),
      ...compat.extends('plugin:tailwindcss/recommended'),
      ...compat.extends('plugin:prettier/recommended'),
    ],

    plugins: {
      react,
      perfectionist,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: true,
      },
    },

    settings: {
      tailwindcss: {
        callees: ['clsx', 'cva', 'cn'],
        config: 'tailwind.config.ts',
        cssFiles: ['!**/.*', '!**/build', '!**/dist', '!**/node_modules', '**/*.css'],
        cssFilesRefreshRate: 5000,
        removeDuplicates: true,
        skipClassAttribute: false,
        whitelist: [],
        tags: [],
        classRegex: '^class(Name)?$',
      },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',

      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['*.config.js', '*.config.mjs', '*.config.ts'],
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',

      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: ['calendly-inline-widget'],
        },
      ],

      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          ignoreCase: true,
          ignorePattern: [],

          groups: [
            'className',
            'id',
            'name',
            'data',
            'src',
            'for',
            'type',
            'placeholder',
            'href',
            'value',
            'title',
            'alt',
            'role',
            'aria',
            'tabIndex',
            'style',
            'unknown',
            'shorthand',
            'multiline',
            'callback',
          ],

          customGroups: {
            className: 'className',
            id: 'id',
            name: 'name',
            data: 'data-*',
            src: 'src',
            for: 'for',
            type: 'type',
            placeholder: 'placeholder',
            href: 'href',
            value: 'value',
            title: 'title',
            alt: 'alt',
            role: 'role',
            aria: 'aria-*',
            tabIndex: 'tabIndex',
            style: 'style',
            callback: 'on*',
          },
        },
      ],
    },
  },
])
