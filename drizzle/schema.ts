import { sql } from '@vercel/postgres'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/vercel-postgres'

export const db = drizzle(sql)

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
