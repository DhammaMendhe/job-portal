import { Router } from 'express'
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/appliaction.controller'
import { protect, employerOnly } from '../middleware/auth.middleware'

const router = Router()

// Jobseeker applies for a job
router.post('/:jobId', protect, applyForJob)

// Jobseeker sees their own applications
router.get('/my-applications', protect, getMyApplications)

// Employer sees all applicants for a specific job
router.get('/job/:jobId', protect, employerOnly, getJobApplications)

// Employer updates application status
router.put('/:id/status', protect, employerOnly, updateApplicationStatus)

export default router