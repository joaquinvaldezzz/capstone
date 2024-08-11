import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  try {
    response.status(200).json({ success: true, data: 'Hello World' })
  } catch (err) {
    response.status(500).json({ error: 'Failed to load data' })
  }
}
