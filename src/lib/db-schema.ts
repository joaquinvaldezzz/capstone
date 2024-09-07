import { type InferSelectModel } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export type User = InferSelectModel<typeof users>

export const sessions = pgTable('sessions', {
  session_id: serial('session_id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  user_role: text('role').notNull(),
  expires_at: timestamp('expires_at').notNull(),
})
