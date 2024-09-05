import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

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
export type NewUser = InferInsertModel<typeof users>
