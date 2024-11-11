import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

import { db } from './db'
import { userInformation, users } from './db-schema'

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
export const fakeUsers = Array.from({ length: 100 }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  role: faker.helpers.arrayElement(roles),
}))

/**
 * Generates an array of 100 fake user information objects. Each object contains the following
 * properties:
 *
 * - `age`: A random integer between 18 and 100.
 * - `birthDate`: A random past date.
 * - `gender`: A random gender.
 * - `address`: A random street address.
 */
export const fakeUserInformation = Array.from({ length: 100 }, () => ({
  age: faker.number.int({ min: 18, max: 100 }),
  birthDate: faker.date.past(),
  gender: faker.person.sex(),
  address: faker.location.streetAddress(),
}))

/**
 * Seeds the database with default user data.
 *
 * This function hashes a default password and inserts a list of users into the database. Each user
 * will have the same default hashed password.
 */
export async function seed() {
  const defaultHashedPassword = await bcrypt.hash('5678ghjk@@!!##', 10)

  /** Inserts a list of fake users into the database and returns their IDs. */
  const newUser = await db
    .insert(users)
    .values(
      fakeUsers.map((user) => ({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: defaultHashedPassword,
        role: user.role,
      })),
    )
    .returning({ id: users.user_id })
    .execute()

  /**
   * Inserts user information into the database.
   *
   * This function takes an array of user information objects, maps them to a format suitable for
   * the database, and inserts them into the `usersInformation` table. Each user information object
   * includes the user's ID, age, birth date, gender, and address.
   */
  await db
    .insert(userInformation)
    .values(
      fakeUserInformation.map((information, index) => ({
        user_id: newUser[index].id,
        age: information.age,
        birth_date: information.birthDate,
        gender: information.gender,
        address: information.address,
      })),
    )
    .execute()

  console.log('Database seeded successfully')
}
