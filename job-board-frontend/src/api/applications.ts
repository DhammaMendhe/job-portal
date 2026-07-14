import API from './axios'

export const applyForJobAPI = (jobId: string, data: {
  coverLetter: string
}) => API.post(`/applications/${jobId}`, data)

export const getMyApplicationsAPI = () =>
  API.get('/applications/my-applications')

export const getJobApplicationsAPI = (jobId: string) =>
  API.get(`/applications/job/${jobId}`)

export const updateApplicationStatusAPI = (id: string, status: string) =>
  API.put(`/applications/${id}/status`, { status })