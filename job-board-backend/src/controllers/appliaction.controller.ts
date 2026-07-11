import type { Request, Response } from 'express'
import Application from '../models/Application'
import Job from '../models/Job'
import type { AuthRequest } from '../middleware/auth.middleware'
import sendEmail from '../utils/sendEmail'

// POST /api/applications/:jobId — apply for a job
export const applyForJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params
    const { coverLetter } = req.body
// console.log(AuthRequest)
    // Check job exists
    const job = await Job.findById(jobId)
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' })
      return
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      jobId,
      applicantId: req.userId
    })

    if (alreadyApplied) {
      res.status(400).json({ success: false, message: 'You already applied for this job' })
      return
    }

    const application = await Application.create({
      jobId,
      applicantId: req.userId,
      coverLetter
    })

    res.status(201).json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/applications/my-applications — jobseeker sees their applications
export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application
      .find({ applicantId: req.userId })
      .populate('jobId', 'title company location type')  // get job details
      .sort({ createdAt: -1 })

    res.json({ success: true, count: applications.length, data: applications })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/applications/job/:jobId — employer sees all applicants for a job
export const getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application
      .find({ jobId: req.params.jobId })
      .populate('applicantId', 'name email')  // get applicant details
      .sort({ createdAt: -1 })

    res.json({ success: true, count: applications.length, data: applications })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// PUT /api/applications/:id/status — employer updates application status
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('applicantId', 'name email')

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' })
      return
    }

    res.json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}