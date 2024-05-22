import mongoose from 'mongoose'

export interface Image {
  _id: string
  image: string
  result: 'healthy' | 'infected'
  status: 'pending' | 'completed'
  patient_id: string
  patient_name: string
  doctor_id: string
  doctor_name: string
  date_uploaded: Date
  date_modified: Date
  date_completed: Date
}

const ImageSchema = new mongoose.Schema<Image>({
  _id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  patient_id: {
    type: String,
    required: true,
  },
  patient_name: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: String,
    required: true,
  },
  doctor_name: {
    type: String,
    required: true,
  },
  date_uploaded: {
    type: Date,
    required: true,
  },
  date_modified: {
    type: Date,
    required: true,
  },
  date_completed: {
    type: Date,
    required: false,
  },
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export default mongoose.models.Images || mongoose.model<Image>('Images', ImageSchema)
