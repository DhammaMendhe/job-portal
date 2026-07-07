import mongoose, { Schema, Document } from 'mongoose'
import type { IJob } from '../types/index'

// Document gives us _id, createdAt etc from MongoDB
export interface IJobDocument extends IJob, Document {}

const JobSchema = new Schema<IJobDocument>(
  {
    title:       { type: String, required: true },
    company:     { type: String, required: true },
    location:    { type: String, required: true },
    description: { type: String, required: true },
    salary:      { type: String },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'contract'],
      required: true
    },
    postedBy: { type: String, required: true }
  },
  { timestamps: true } // auto adds createdAt and updatedAt
)

export default mongoose.model<IJobDocument>('Job', JobSchema)