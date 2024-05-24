import mongoose from 'mongoose'

export interface Account {
  _id: mongoose.Schema.Types.ObjectId
  first_name: string
  last_name: string
  username: string
  password: string
  role: 'admin' | 'doctor' | 'patient'
  date_created: Date
  date_updated: Date
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
    required: [true, 'Please enter your first name.'],
  },
  last_name: {
    type: String,
    required: [true, 'Please enter your last name.'],
  },
  username: {
    type: String,
    required: false, // This is a unique field, but it's not required.
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
  },
  role: {
    type: String,
    required: [true, 'Please indicate your role.'],
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
export default mongoose.models.Accounts || mongoose.model<Account>('Accounts', accountSchema)
