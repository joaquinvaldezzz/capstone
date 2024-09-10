/** @type {import('prettier').Config} */
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
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(react-dom/(.*)$)|^(react-dom$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/registry/(.*)$',
    '^@/styles/(.*)$',
    '^@/app/(.*)$',
    '',
    '^[./]',
    '',
    '^@/public/(.*)$',
  ],
  tailwindFunctions: ['cva', 'cn'],
}

export default config
