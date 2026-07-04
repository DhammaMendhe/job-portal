import { Router } from 'express'
import {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob
} from '../controllers/job.controller'

const router = Router()

router.get('/',     getAllJobs)   // GET    /api/jobs
router.get('/:id',  getJobById)  // GET    /api/jobs/:id
router.post('/',    createJob)   // POST   /api/jobs
router.delete('/:id', deleteJob) // DELETE /api/jobs/:id

export default router