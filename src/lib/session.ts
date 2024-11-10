import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify, SignJWT, type JWTPayload } from 'jose'

import { db } from './db'
import { sessions } from './db-schema'

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload extends JWTPayload {
  userId: string | number
  userRole: string
  expiresAt: Date
}

/**
 * Encrypts the given payload using the HS256 algorithm.
 *
 * @param payload - The payload to be encrypted.
 * @returns A promise that resolves to the encrypted token.
 */
export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setExpirationTime('1hour')
    .setIssuedAt()
    .setProtectedHeader({ alg: 'HS256' })
    .sign(key)
}

/**
 * Decrypts a session token and returns the payload.
 *
 * @param session - The session token to decrypt.
 * @returns The payload of the decrypted session token, or null if decryption fails.
 */
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })

    return payload
  } catch (error) {
    return null
  }
}

/**
 * Creates a session for the specified user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to void.
 */
export async function createSession(userId: string, userRole: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await db
    .insert(sessions)
    .values({
      user_id: Number(userId),
      user_role: userRole,
      expires_at: expiresAt,
    })
    .execute()

  const session = await encrypt({ userId, userRole, expiresAt })

  ;(await cookies()).set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  if (userRole === 'admin') {
    redirect('/admin')
  } else if (userRole === 'doctor') {
    redirect('/doctor')
  } else if (userRole === 'patient') {
    redirect('/patient')
  }
}

/**
 * Verifies the session by checking the session cookie and decrypting it. If the session cookie is
 * valid and contains a userId, the function returns an object with isAuth set to true and the
 * userId. Otherwise, it redirects to the home page.
 *
 * @returns An object with the session verification result, including isAuth and userId.
 */
export async function verifySession() {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (session?.userId == null) {
    redirect('/')
  }

  return { userId: Number(session?.userId) }
}

/**
 * Updates the session cookie with a new value.
 *
 * @returns A promise that resolves once the session cookie is updated.
 */
export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (session == null || payload == null) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  ;(await cookies()).set('session', session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

/** Deletes the session by removing the 'session' cookie and redirecting to the home page. */
export async function deleteSession() {
  ;(await cookies()).delete('session')
  redirect('/')
}
