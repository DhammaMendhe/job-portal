import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../redux/slices/authSlice'
import type { RootState, AppDispatch } from '../redux/store'

function Register() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [role,     setRole]     = useState<'jobseeker' | 'employer'>('jobseeker')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async () => {
    const result = await dispatch(registerUser({ name, email, password, role }))
    if (registerUser.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-cyan-400">
            Job Portal
          </Link>
          <p className="text-sm text-slate-400 mt-2">
            Modern job listings for developers and employers.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-2">
              Get started
            </p>
            <h1 className="text-2xl font-bold text-white">
              Create your account
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Join thousands of professionals finding great jobs
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-3">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole('jobseeker')}
                className={`relative rounded-2xl border py-4 px-4 text-left transition ${
                  role === 'jobseeker'
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <span className="block text-lg mb-1">🔍</span>
                <span className={`block text-sm font-semibold ${
                  role === 'jobseeker' ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  Find a job
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">Job Seeker</span>
                {role === 'jobseeker' && (
                  <span className="absolute top-3 right-3 text-cyan-400 text-xs font-bold">✓</span>
                )}
              </button>

              <button
                onClick={() => setRole('employer')}
                className={`relative rounded-2xl border py-4 px-4 text-left transition ${
                  role === 'employer'
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <span className="block text-lg mb-1">🏢</span>
                <span className={`block text-sm font-semibold ${
                  role === 'employer' ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  Hire talent
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">Employer</span>
                {role === 'employer' && (
                  <span className="absolute top-3 right-3 text-cyan-400 text-xs font-bold">✓</span>
                )}
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-8">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@gmail.com"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm pr-12"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition text-sm"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95 disabled:opacity-50 mb-6"
          >
            {isLoading ? 'Creating account...' : 'Create account →'}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-400 mb-3">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-slate-600">
            By continuing you agree to our Terms & Privacy Policy
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register