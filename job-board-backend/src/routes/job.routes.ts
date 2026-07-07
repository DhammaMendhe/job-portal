import { Router } from 'express'
import {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob
} from '../controllers/job.controller'
import { protect, employerOnly } from '../middleware/auth.middleware'

const router = Router()

router.get('/',       getAllJobs)                      // public
router.get('/:id',    getJobById)                     // public
router.post('/',      protect, employerOnly, createJob)   // employers only
router.delete('/:id', protect, employerOnly, deleteJob)   // employers only

export default router