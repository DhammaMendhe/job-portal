import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyJobs, deleteJob } from '../redux/slices/jobSlice'
import type { RootState, AppDispatch } from '../redux/store'

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { myJobs, isLoading } = useSelector((state: RootState) => state.jobs)
  const { user } = useSelector((state: RootState) => state.auth)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchMyJobs())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this job?')
    if (!confirm) return
    setDeletingId(id)
    await dispatch(deleteJob(id))
    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-1">
              Employer Dashboard
            </p>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Manage your job listings and view applicants
            </p>
          </div>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 mt-4 md:mt-0"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Jobs Posted', value: myJobs.length, icon: '📋' },
            { label: 'Active Listings',   value: myJobs.length, icon: '✅' },
            { label: 'Total Applications', value: '—',          icon: '👥' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Your Job Listings</h2>
          <span className="rounded-full bg-slate-800 px-4 py-1.5 text-sm text-slate-300">
            {myJobs.length} jobs
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
            Loading your jobs...
          </div>
        )}

        {/* Jobs */}
        <div className="space-y-4">
          {myJobs.map((job) => (
            <div
              key={job._id}
              className="group rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 transition hover:border-slate-700"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* Job Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      {job.type.replace('-', ' ')}
                    </p>
                    <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="text-sm font-semibold text-cyan-300">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    🏢 {job.company}
                  </p>
                  <p className="text-xs text-slate-600">
                    Posted on {new Date(job.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    className="rounded-full bg-red-500/10 border border-red-500/20 px-5 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition disabled:opacity-50"
                  >
                    {deletingId === job._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!isLoading && myJobs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg font-semibold text-slate-200 mb-2">
              No jobs posted yet
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Start by posting your first job listing
            </p>
            <Link
              to="/post-job"
              className="inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
            >
              + Post your first job
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard