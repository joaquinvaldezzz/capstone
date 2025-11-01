/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  plugins: [
    '@prettier/plugin-xml',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-jsdoc',
    'prettier-plugin-packagejson',
    'prettier-plugin-sh',
    'prettier-plugin-tailwindcss',
  ],
  overrides: [
    {
      files: '**/*-instructions.md',
      options: {
        parser: 'markdown',
      },
    },
  ],
  importOrder: [
    '<BUILTIN_MODULES>',
    '^react(/.*)?$',
    '^react-dom(/.*)?$',
    '^next(/.*)?$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/config/',
    '^@/lib/',
    '^@/hooks/',
    '^@/components/ui/',
    '^@/components/',
    '^@/registry/',
    '^@/styles/',
    '^@/app/',
    '',
    '<TYPES>^node:',
    '<TYPES>',
    '<TYPES>^@/types',
    '<TYPES>^\\.',
    '',
    '^\\.',
    '',
    '^@/public/',
  ],
  tailwindStylesheet: './src/styles/main.css',
  tailwindAttributes: ['classNames'],
  tailwindFunctions: ['cva', 'cn'],
}

export default config
