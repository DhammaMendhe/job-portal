import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllJobsAPI, getJobByIdAPI, getMyJobsAPI, deleteJobAPI } from '../../api/jobs'
import type { Job } from '../../types'

interface JobState {
  jobs: Job[]
  myJobs: Job[]
  selectedJob: Job | null
  isLoading: boolean
  error: string | null
}

const initialState: JobState = {
  jobs: [],
  myJobs: [],
  selectedJob: null,
  isLoading: false,
  error: null
}

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (params: { search?: string; type?: string; location?: string } | void, { rejectWithValue }) => {
    try {
      const queryParams = params || {}
      const res = await getAllJobsAPI(queryParams)
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

// Fetch employer's own jobs
export const fetchMyJobs = createAsyncThunk(
  'jobs/fetchMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyJobsAPI()
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response.data.message)
    }
  }
)

// Delete a job
export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteJobAPI(id)
      return id  // return id so we can remove it from state
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

    // Fetch all jobs
    builder.addCase(fetchAllJobs.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchAllJobs.fulfilled, (state, action) => {
      state.isLoading = false
      state.jobs = action.payload.data
    })
    builder.addCase(fetchAllJobs.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch job by id
    builder.addCase(fetchJobById.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchJobById.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedJob = action.payload.data
    })
    builder.addCase(fetchJobById.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch my jobs
    builder.addCase(fetchMyJobs.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchMyJobs.fulfilled, (state, action) => {
      state.isLoading = false
      state.myJobs = action.payload.data  // save in myJobs not jobs
    })
    builder.addCase(fetchMyJobs.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Delete job
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      // Remove deleted job from myJobs array
      state.myJobs = state.myJobs.filter(job => job._id !== action.payload)
    })

  }
})

export default jobSlice.reducer