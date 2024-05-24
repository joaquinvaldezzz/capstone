import type { NextApiRequest, NextApiResponse } from 'next'

import connectToDatabase from '~/lib/connectToDatabase'
import Accounts from '~/models/Account'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const { method } = request

  await connectToDatabase()

  switch (method) {
    case 'GET':
      try {
        const accounts = await Accounts.find({})
        response.status(200).json({ success: true, data: accounts })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const account = await Accounts.create(request.body)
        response.status(200).json({ success: true, data: account })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        await Accounts.deleteMany({})
        response.status(200).json({ success: true, message: 'All accounts have been deleted.' })
      } catch (error) {
        response
          .status(400)
          .json({ success: false, message: 'There was a problem deleting all accounts.' })
      }
      break
    default:
      response.status(400).json({ success: false })
      break
  }
}
