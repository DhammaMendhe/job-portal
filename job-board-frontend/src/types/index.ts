export interface User {
  id: string
  name: string
  email: string
  role: 'jobseeker' | 'employer'
}

export interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  salary?: string
  type: 'full-time' | 'part-time' | 'remote' | 'contract'
  postedBy: string
  createdAt: string
}

export interface Application {
  _id: string
  jobId: Job
  applicantId: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}