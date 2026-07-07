import mongoose, { Schema, Document } from 'mongoose'

export interface IApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  coverLetter: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',           // links to Job model
      required: true
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',          // links to User model
      required: true
    },
    coverLetter: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'    // every new application starts as pending
    }
  },
  { timestamps: true }      // auto adds createdAt and updatedAt
)

// Prevent same user applying to same job twice
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true })

export default mongoose.model<IApplicationDocument>('Application', ApplicationSchema)