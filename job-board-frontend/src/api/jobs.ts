import API from './axios'

export const getAllJobsAPI = (params?: {
  search?: string
  type?: string
  location?: string
}) => API.get('/jobs', { params })

export const getJobByIdAPI = (id: string) =>
  API.get(`/jobs/${id}`)

export const createJobAPI = (data: {
  title: string
  company: string
  location: string
  description: string
  salary?: string
  type: string
}) => API.post('/jobs', data)

export const updateJobAPI = (id: string, data: object) =>
  API.put(`/jobs/${id}`, data)

export const deleteJobAPI = (id: string) =>
  API.delete(`/jobs/${id}`)

export const getMyJobsAPI = () =>
  API.get('/jobs/my-jobs')