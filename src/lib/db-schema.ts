import { type InferSelectModel } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Represents the database table for users.
 *
 * This table stores information about users, including the user ID, first name, last name, email,
 * password, role, and creation timestamp.
 */
export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  creation_date: timestamp('creation_date').defaultNow().notNull(),
  date_modified: timestamp('date_modified').defaultNow().notNull(),
})

/** Represents the inferred type of the `users` table. */
export type User = InferSelectModel<typeof users>

/**
 * Represents the schema for the 'patient_information' table in the database.
 *
 * The table contains the user ID, age, birth date, gender, and address of the patient.
 */
export const patientInformation = pgTable('patient_information', {
  patient_id: serial('patient_id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
  age: integer('age').notNull(),
  birth_date: timestamp('birth_date', { mode: 'date' }).notNull(),
  gender: text('gender').notNull(),
  address: text('address').notNull(),
})

/** Represents the inferred type of the `patient_information` table. */
export type PatientInformation = InferSelectModel<typeof patientInformation>

/**
 * Represents a database table for user sessions.
 *
 * This table stores information about sessions, including the session ID, user ID, user role, and
 * expiration timestamp.
 */
export const sessions = pgTable('sessions', {
  session_id: serial('session_id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
  user_role: text('role').notNull(),
  expires_at: timestamp('expires_at').notNull(),
})

export type Session = InferSelectModel<typeof sessions>

/**
 * Represents a database table for storing diagnosis results of patients.
 *
 * This table contains information about results, including the result ID, doctor ID, patient ID,
 * creation timestamp, ultrasound image, and diagnosis.
 */
export const results = pgTable('results', {
  result_id: serial('result_id').primaryKey(),
  doctor_id: integer('doctor_id')
    .references(() => users.user_id)
    .notNull(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  ultrasound_image: text('ultrasound_image').notNull(),
  percentage: text('percentage').notNull(),
  diagnosis: text('diagnosis').notNull(),
})

/** Represents the inferred type of the `results` table. */
export type Result = InferSelectModel<typeof results>
