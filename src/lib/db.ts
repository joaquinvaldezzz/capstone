import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'

/** The database instance. */
export const db = drizzle(sql)
