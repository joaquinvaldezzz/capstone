import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'drizzle-kit'

loadEnvConfig(process.cwd())

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db-schema.ts',
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
})
