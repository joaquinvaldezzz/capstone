import mongoose from 'mongoose'

export interface Accounts extends mongoose.Document {
  _id: string
  username: string
  password: string
  role: 'admin' | 'doctor' | 'patient'
  date_created: Date
  date_updated: Date
}

const AccountsSchema = new mongoose.Schema<Accounts>({
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

export default mongoose.model<Accounts>('Accounts', AccountsSchema)
