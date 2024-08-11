import mongoose from 'mongoose'

export interface Account {
  _id: string | mongoose.Schema.Types.ObjectId

  // Personal information
  first_name: string
  last_name: string
  full_name?: string
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

  // Patient information
  ultrasound_image?: string
  result?: 'pending' | 'healthy' | 'infected'
  suggestion?: string
  status?: 'pending' | 'to examine' | 'confirmed' | 'treated' | 'recovered' | 'deceased'
  date_uploaded?: Date
  date_confirmed?: Date
}

const accountSchema = new mongoose.Schema<Account>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
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
  full_name: {
    type: String,
    required: false,
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

  // Patient information
  ultrasound_image: {
    type: String,
    required: false,
  },
  result: {
    type: String,
    required: false,
  },
  suggestion: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  date_uploaded: {
    type: Date,
    required: false,
  },
  date_confirmed: {
    type: Date,
    required: false,
  },
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Accounts || mongoose.model<Account>('Accounts', accountSchema)
