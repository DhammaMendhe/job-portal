import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserDocument extends Document {
  name: string
  email: string
  password: string
  role: 'jobseeker' | 'employer'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true            // removes extra spaces automatically
    },
    email: {
      type: String,
      required: true,
      unique: true,         // no two users with same email
      lowercase: true,      // saves email in lowercase always
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6          // minimum 6 characters
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer'],
      default: 'jobseeker'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }      // auto adds createdAt and updatedAt
)

// Runs automatically before saving — hashes the password
UserSchema.pre('save', async function () {
  // Only hash if password was changed or is new
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Method to compare password at login
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Never send password in any response
UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

export default mongoose.model<IUserDocument>('User', UserSchema)