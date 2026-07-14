import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAPI, registerAPI } from '../../api/auth'
import type { AuthState } from '../../types'

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null
}

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const res = await registerAPI(data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response.data.message)
    }
  }
)

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginAPI(data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response.data.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true
      state.error     = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.user      = action.payload.user
      state.token     = action.payload.token
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false
      state.error     = action.payload as string
    })

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error     = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.user      = action.payload.user
      state.token     = action.payload.token
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error     = action.payload as string
    })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer