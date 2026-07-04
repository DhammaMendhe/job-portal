import type { Request, Response } from 'express'
import Job from '../models/jobs'

// GET /api/jobs - fetch all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 })
    res.json({ success: true, data: jobs })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/jobs/:id - fetch one job
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' })
      return
    }
    res.json({ success: true, data: job })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/jobs - create a job
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.create(req.body)
    res.status(201).json({ success: true, data: job })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// DELETE /api/jobs/:id - delete a job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' })
      return
    }
    res.json({ success: true, message: 'Job deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}