import mongoose from 'mongoose'

// Ensure MongoDB connection is established
const connectDB = async () => {
  try {
    const { clientPromise } = await import('@/lib/mongodb-adapter')
    await clientPromise
    console.log('✅ MongoDB connected for User model')
  } catch (error) {
    console.error('❌ MongoDB connection failed for User model:', error)
    throw error
  }
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar_url: {
    type: String,
    default: function(this: any) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: true // Since we're disabling email verification
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      if (ret.password) {
        delete ret.password
      }
      return ret
    }
  }
})

// Index for faster queries (email already has unique index in field definition)
UserSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model('User', UserSchema)

// Export connection function for explicit connection
export { connectDB }
