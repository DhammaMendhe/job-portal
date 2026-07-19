import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import type { Request, Response } from 'express'
import authRoutes from './routes/auth.routes'
import jobRoutes from './routes/job.routes'
import applicationRoutes from './routes/application.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

// CORS — must be before routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://job-portal-olive-omega.vercel.app',
    'https://job-portal-7xz22t12h-dhammadip-santosh-mendhes-projects.vercel.app',
  ],
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Board API is running!' })
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error('MongoDB connection error:', err))