import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllJobsAPI, getJobByIdAPI } from '../../api/jobs'
import type { Job } from '../../types'

interface JobState {
  jobs: Job[]
  selectedJob: Job | null
  isLoading: boolean
  error: string | null
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null
}

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (params: { search?: string; type?: string; location?: string } = {}, { rejectWithValue }) => {
    try {
      const res = await getAllJobsAPI(params)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response.data.message)
    }
  }
)

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getJobByIdAPI(id)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response.data.message)
    }
  }
)

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllJobs.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchAllJobs.fulfilled, (state, action) => {
      state.isLoading = false
      state.jobs      = action.payload.data
    })
    builder.addCase(fetchAllJobs.rejected, (state, action) => {
      state.isLoading = false
      state.error     = action.payload as string
    })

    builder.addCase(fetchJobById.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchJobById.fulfilled, (state, action) => {
      state.isLoading  = false
      state.selectedJob = action.payload.data
    })
    builder.addCase(fetchJobById.rejected, (state, action) => {
      state.isLoading = false
      state.error     = action.payload as string
    })
  }
})

export default jobSlice.reducer