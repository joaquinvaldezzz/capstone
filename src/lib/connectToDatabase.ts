import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any
}

const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (MONGODB_URI.length === 0) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (cached === undefined) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase(): Promise<any> {
  if (cached.conn !== null) {
    return cached.conn
  }

  if (cached.promise === null || cached.promise === undefined) {
    const options = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, options).then((data) => {
      return data
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectToDatabase
