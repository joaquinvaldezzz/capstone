import mongoose from 'mongoose'

export interface Messages extends mongoose.Document {
  _id: string
  sender: string
  receiver: string
  message: string
  status: 'sent' | 'delivered' | 'read'
  date_created: Date
}

const MessagesSchema = new mongoose.Schema<Messages>({
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

export default mongoose.model<Messages>('Messages', MessagesSchema)
