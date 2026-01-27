import { MongoClient } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI
if (!mongodbUri) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const client = new MongoClient(mongodbUri)

export const clientPromise = client.connect()
