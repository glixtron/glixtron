import { MongoClient } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI
if (!mongodbUri) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const client = new MongoClient(mongodbUri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  retryWrites: true
})

export const clientPromise = client.connect()
