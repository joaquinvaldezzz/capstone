import mongoose from 'mongoose'

export interface Message {
  _id: string | mongoose.Schema.Types.ObjectId
  sender: string
  receiver: string
  subject: string
  message: string
  status: 'sent' | 'delivered' | 'read'
  date_sent: Date
}

const MessageSchema = new mongoose.Schema<Message>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    subject: {
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
    date_sent: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  },
)

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Messages || mongoose.model<Message>('Messages', MessageSchema)
