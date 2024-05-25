import type { NextApiRequest, NextApiResponse } from 'next'
import { SignJWT } from 'jose'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts from '~/models/Account'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const { method } = request
  const EXPIRES = process.env.EXPIRES ?? '10 sec from now'
  const SECRET = new TextEncoder().encode(`${process.env.JWT_SECRET ?? 'secret'}`)

  await connectToDatabase()

  switch (method) {
    case 'POST':
      try {
        const account = await Accounts.find({ username: request.body.username })

        if (account.length > 0) {
          if (account[0].password === request.body.password) {
            const token = await new SignJWT({
              _id: request.body._id,
              username: request.body.username,
              role: request.body.role,
            })
              .setExpirationTime(EXPIRES)
              .setProtectedHeader({ alg: 'HS256' })
              .sign(SECRET)

            console.log(token)

            response.status(200).json({ success: true, data: { token, account } })
            return
          }

          response.status(401).json({ success: false, message: 'Invalid password.' })
        }

        response.status(404).json({ success: false, message: 'Username not found.' })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    default:
      response.status(400).json({ success: false })
      break
  }
}
