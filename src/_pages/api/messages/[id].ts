import type { NextApiRequest, NextApiResponse } from 'next'

import connectToDatabase from '~/lib/connectToDatabase'
import Messages from '~/models/Messages'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    query: { id },
    method,
  } = request

  await connectToDatabase()

  switch (method) {
    case 'GET':
      try {
        const accounts = await Messages.findById(id)
        response.status(200).json({ success: true, data: accounts })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const account = await Messages.findByIdAndUpdate(id, request.body)
        response.status(201).json({ success: true, data: account })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        await Messages.deleteOne({ _id: id })
        response.status(200).json({ success: true, message: 'Account has been deleted.' })
      } catch (error) {
        response
          .status(400)
          .json({ success: false, message: 'There was a problem deleting the account.' })
      }
      break
    default:
      response.status(400).json({ success: false })
      break
  }
}
