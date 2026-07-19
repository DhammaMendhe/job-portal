import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchJobById } from '../redux/slices/jobSlice'
import type { RootState, AppDispatch } from '../redux/store'

function JobDetail() {
  const { id }     = useParams<{ id: string }>()
  const dispatch   = useDispatch<AppDispatch>()
  const navigate   = useNavigate()

  const { selectedJob, isLoading } = useSelector((state: RootState) => state.jobs)
  const { user }                   = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (id) dispatch(fetchJobById(id))
  }, [id, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading job...</p>
      </div>
    )
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Job not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-cyan-400 transition mb-8 inline-block"
        >
          ← Back to jobs
        </button>

        {/* Job Header Card */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50 mb-6">

          {/* Type + Salary */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300 mb-2">
                {selectedJob.type.replace('-', ' ')}
              </p>
              <h1 className="text-3xl font-bold text-white">
                {selectedJob.title}
              </h1>
            </div>
            {selectedJob.salary && (
              <span className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-cyan-300 font-semibold text-sm">
                💰 {selectedJob.salary}
              </span>
            )}
          </div>

          {/* Company & Location */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              🏢 {selectedJob.company}
            </span>
            <span className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              📍 {selectedJob.location}
            </span>
            <span className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              📅 {new Date(selectedJob.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 mb-8" />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Job Description
            </h2>
            <p className="text-slate-400 leading-8 text-base whitespace-pre-line">
              {selectedJob.description}
            </p>
          </div>

        </div>

        {/* Apply Section */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50">

          <h2 className="text-lg font-semibold text-white mb-2">
            Interested in this role?
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Submit your application and we'll get back to you soon.
          </p>

          {/* Not logged in */}
          {!user && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition"
              >
                Login to apply
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
              >
                Create account
              </Link>
            </div>
          )}

          {/* Logged in as jobseeker */}
          {user?.role === 'jobseeker' && (
            <Link
              to={`/apply/${selectedJob._id}`}
              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition"
            >
              Apply for this job →
            </Link>
          )}

          {/* Logged in as employer */}
          {user?.role === 'employer' && (
            <p className="text-slate-500 text-sm">
              You are logged in as an employer. Only job seekers can apply.
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

export default JobDetail