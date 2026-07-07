import type { Request, Response } from 'express'
import Job from '../models/Job'
import type { AuthRequest } from '../middleware/auth.middleware'

// GET /api/jobs — get all jobs (public)
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Search and filter from query params
    const { search, type, location } = req.query

    // Build filter object dynamically
    const filter: any = {}

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { company:     { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (type)     filter.type     = type
    if (location) filter.location = { $regex: location, $options: 'i' }

    const jobs = await Job.find(filter).sort({ createdAt: -1 })

    res.json({ success: true, count: jobs.length, data: jobs })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/jobs/:id — get single job (public)
export const getJobById = async (req: Request, res: Response): Promise<void> => {
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

// POST /api/jobs — create job (employers only)
export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, company, location, description, salary, type } = req.body

    // Validate fields
    if (!title || !company || !location || !description || !type) {
      res.status(400).json({ success: false, message: 'Please fill all required fields' })
      return
    }

    // Attach the logged in user as postedBy
    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      type,
      postedBy: req.userId
    })

    res.status(201).json({ success: true, data: job })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// PUT /api/jobs/:id — update job (employer who posted it only)
export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' })
      return
    }

    // Make sure logged in user is the one who posted this job
    if (job.postedBy.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Not authorized to update this job' })
      return
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({ success: true, data: updatedJob })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// DELETE /api/jobs/:id — delete job (employer who posted it only)
export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' })
      return
    }

    // Make sure logged in user is the one who posted this job
    if (job.postedBy.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this job' })
      return
    }

    await Job.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/jobs/my-jobs — get jobs posted by logged in employer
export const getMyJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ postedBy: req.userId }).sort({ createdAt: -1 })
    res.json({ success: true, count: jobs.length, data: jobs })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}