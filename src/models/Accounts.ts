import mongoose from 'mongoose'

export interface Account {
  _id?: string
  username: string
  password: string
  role: 'admin' | 'doctor' | 'patient'
  date_created: Date
  date_updated: Date
}

const AccountSchema = new mongoose.Schema<Account>({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
  date_updated: {
    type: Date,
    required: true,
  },
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Accounts || mongoose.model<Account>('Accounts', AccountSchema)
