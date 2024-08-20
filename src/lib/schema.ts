import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
