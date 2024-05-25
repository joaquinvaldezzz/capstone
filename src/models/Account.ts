import mongoose from 'mongoose'

export interface Account {
  _id: mongoose.Schema.Types.ObjectId

  // Personal information
  first_name: string
  last_name: string
  gender?: 'female' | 'male'
  age?: number
  birthdate?: Date
  contact_number?: string
  address?: {
    street: string
    city: string
    province: string
    zip_code: string | number
    country: string
  }

  // Account information
  username?: string
  password?: string
  role?: 'admin' | 'doctor' | 'patient'

  // Account creation and update information
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

  // Personal information
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  contact_number: {
    type: String,
    required: false,
  },
  address: {
    type: {
      street: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      zip_code: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
      },
      province: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    required: false,
  },

  // Account information
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

  // Account creation and update information
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
