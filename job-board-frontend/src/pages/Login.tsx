import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../redux/slices/authSlice'
import type { RootState, AppDispatch } from '../redux/store'

function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async () => {
    const result = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

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
              Welcome back
            </p>
            <h1 className="text-2xl font-bold text-white">
              Sign in to your account
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4 mb-6">

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
                  placeholder="••••••••"
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

          {/* Forgot password */}
          <div className="flex justify-end mb-8">
            <button className="text-sm text-slate-500 hover:text-cyan-400 transition">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95 disabled:opacity-50 mb-6"
          >
            {isLoading ? 'Signing in...' : 'Sign in →'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-slate-800" />
            <span className="text-xs text-slate-600">or continue with</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'G', color: 'text-red-400' },
              { label: 'f', color: 'text-blue-400' },
              { label: '🍎', color: 'text-slate-200' },
            ].map((s) => (
              <button
                key={s.label}
                className="flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/50 py-3 text-base hover:border-slate-600 hover:bg-slate-800 transition"
              >
                <span className={`${s.color} font-bold`}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login