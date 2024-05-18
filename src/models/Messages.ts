import mongoose from 'mongoose'

export interface Message {
  _id: string
  sender: string
  receiver: string
  message: string
  status: 'sent' | 'delivered' | 'read'
  date_created: Date
}

const MessageSchema = new mongoose.Schema<Message>({
  _id: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Messages || mongoose.model<Message>('Message', MessageSchema)
