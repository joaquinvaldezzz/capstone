import mongoose from 'mongoose'

import { type Account } from './Account'

export interface Patient extends Account {
  ultrasound_image?: string
  result?: 'healthy' | 'infected'
  suggestion?: string
  status?: 'to examine' | 'confirmed' | 'treated' | 'recovered' | 'deceased'
  date_uploaded?: Date
  date_confirmed?: Date
}

const patientSchema = new mongoose.Schema<Patient>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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

  // Ultrasound image
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
export default mongoose.models.Patients || mongoose.model<Patient>('Patients', patientSchema)
