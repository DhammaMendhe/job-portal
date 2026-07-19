import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import type { RootState, AppDispatch } from '../redux/store'

function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 z-50">

      {/* Logo */}
      <div>
        <Link to="/" className="text-2xl font-semibold tracking-tight text-cyan-400">
          Job Portal
        </Link>
        <p className="text-sm text-slate-400 mt-1">
          Modern job listings for developers and employers.
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap gap-3 items-center">

        {user ? (
          <>
            {/* Show user name */}
            <span className="text-sm text-slate-400">
              Hi,{' '}
              <span className="text-slate-200 font-medium">{user.name}</span>
            </span>

            {/* Employer links */}
            {user.role === 'employer' && (
              <>
                <Link
                  to="/post-job"
                  className="rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  + Post Job
                </Link>
                <Link
                  to="/dashboard"
                  className="rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* Jobseeker links */}
            {user.role === 'jobseeker' && (
              <Link
                to="/my-applications"
                className="rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                My Applications
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500/10 border border-red-500/20 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:border-red-500/40"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar