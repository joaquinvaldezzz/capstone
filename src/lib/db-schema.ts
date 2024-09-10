import { type InferSelectModel } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Represents the database table for users.
 *
 * This table stores information about users, including their first name, last name, email,
 * password, role, and creation timestamp.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

/** Represents the inferred type of the `users` table. */
export type User = InferSelectModel<typeof users>

/**
 * Represents a database table for user sessions.
 *
 * This table stores information about sessions, including the session ID, user ID, user role, and
 * expiration timestamp.
 */
export const sessions = pgTable('sessions', {
  session_id: serial('session_id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  user_role: text('role').notNull(),
  expires_at: timestamp('expires_at').notNull(),
})

export type Session = InferSelectModel<typeof sessions>

/**
 * Represents a database table for storing diagnosis results of patients.
 *
 * This table contains information about results, including the user ID, creation timestamp, patient
 * name, ultrasound image, and diagnosis.
 */
export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  patient_name: text('patient_name').notNull(),
  ultrasound_image: text('ultrasound_image').notNull(),
  diagnosis: text('diagnosis').notNull(),
})

/** Represents the inferred type of the `results` table. */
export type Result = InferSelectModel<typeof results>
