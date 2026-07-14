import API from './axios'

export const registerAPI = (data: {
  name: string
  email: string
  password: string
  role: string
}) => API.post('/auth/register', data)

export const loginAPI = (data: {
  email: string
  password: string
}) => API.post('/auth/login', data)

export const getMeAPI = () => API.get('/auth/me')
