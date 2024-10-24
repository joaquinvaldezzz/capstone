import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

import { db } from './db'
import { users as usersTable } from './db-schema'

const roles = ['admin', 'doctor', 'patient']

/**
 * Generates an array of 100 user objects with random data. Each user object contains the following
 * properties:
 *
 * - `firstName`: A randomly generated first name.
 * - `lastName`: A randomly generated last name.
 * - `email`: A randomly generated email address in lowercase.
 * - `role`: A randomly selected role from the `roles` array.
 */
export const users = Array.from({ length: 100 }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  role: faker.helpers.arrayElement(roles),
}))

/**
 * Seeds the database with default user data.
 *
 * This function hashes a default password and inserts a list of users into the database. Each user
 * will have the same default hashed password.
 */
export async function seed() {
  const defaultHashedPassword = await bcrypt.hash('5678ghjk@@!!##', 10)

  await db
    .insert(usersTable)
    .values(
      users.map((user) => ({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: defaultHashedPassword,
        role: user.role,
      })),
    )
    .execute()

  console.log('Database seeded successfully')
}
