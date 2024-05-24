import mongoose from 'mongoose'

export interface Account {
  _id: mongoose.Schema.Types.ObjectId
  first_name: string
  last_name: string
  username?: string
  password?: string
  role: 'admin' | 'doctor' | 'patient'
  date_created?: Date
  date_updated?: Date
}

const accountSchema = new mongoose.Schema<Account>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false, // This is a unique field, but it's not required.
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: false,
  },
  date_updated: {
    type: Date,
    required: false,
  },
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Accounts || mongoose.model<Account>('Accounts', accountSchema)
