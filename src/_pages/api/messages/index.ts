import type { NextApiRequest, NextApiResponse } from 'next'

import connectToDatabase from '~/lib/connectToDatabase'
import Messages from '~/models/Messages'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    query: { _id },
    method,
  } = request

  await connectToDatabase()

  switch (method) {
    case 'GET':
      try {
        const messages = await Messages.find({})
        response.status(200).json({ success: true, data: messages })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const message = await Messages.create(request.body)
        response.status(200).json({ success: true, data: message })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const message = await Messages.findByIdAndUpdate(_id, request.body, {
          new: true,
          runValidators: true,
        })

        if (message !== null) {
          response.status(200).json({ success: true, data: message })
          return
        }

        response.status(404).json({ success: false, message: 'Message not found.' })
      } catch (error) {
        response.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        await Messages.deleteMany({})
        response.status(200).json({ success: true, message: 'All messages have been deleted.' })
      } catch (error) {
        response
          .status(400)
          .json({ success: false, message: 'There was a problem deleting all messages.' })
      }
      break
    default:
      response.status(400).json({ success: false })
      break
  }
}
