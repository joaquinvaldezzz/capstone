import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export type User = InferSelectModel<typeof usersTable>
export type NewUser = InferInsertModel<typeof usersTable>
