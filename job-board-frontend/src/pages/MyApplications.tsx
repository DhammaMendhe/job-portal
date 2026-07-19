import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getMyApplicationsAPI } from '../api/applications'
import type { RootState } from '../redux/store'
import type { Application } from '../types'

function MyApplications() {
  const {  }                          = useSelector((state: RootState) => state.auth)
  const [applications, setApplications]   = useState<Application[]>([])
  const [isLoading,    setIsLoading]      = useState(true)
  const [error,        setError]          = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true)
        const res = await getMyApplicationsAPI()
        setApplications(res.data.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load applications')
      } finally {
        setIsLoading(false)
      }
    }
    fetchApplications()
  }, [])

  // Status badge styling
  const statusStyles: Record<string, string> = {
    pending:  'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    reviewed: 'bg-blue-500/10   border-blue-500/20   text-blue-400',
    accepted: 'bg-green-500/10  border-green-500/20  text-green-400',
    rejected: 'bg-red-500/10    border-red-500/20    text-red-400',
  }

  const statusIcons: Record<string, string> = {
    pending:  '⏳',
    reviewed: '👀',
    accepted: '✅',
    rejected: '❌',
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-1">
            Job Seeker
          </p>
          <h1 className="text-3xl font-bold text-white">
            My Applications
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Track the status of all your job applications
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total',    value: applications.length,                                          color: 'text-white'        },
            { label: 'Pending',  value: applications.filter(a => a.status === 'pending').length,  color: 'text-yellow-400'   },
            { label: 'Reviewed', value: applications.filter(a => a.status === 'reviewed').length, color: 'text-blue-400'     },
            { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'text-green-400'    },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 text-center"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
            Loading your applications...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 transition hover:border-slate-700"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                {/* Job Info */}
                <div className="flex flex-col gap-2">

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold w-fit ${statusStyles[application.status]}`}>
                    {statusIcons[application.status]} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-white">
                    {application.jobId?.title || 'Job Removed'}
                  </h3>

                  {/* Company & Location */}
                  <div className="flex flex-wrap gap-3">
                    {application.jobId?.company && (
                      <span className="text-sm text-slate-400">
                        🏢 {application.jobId.company}
                      </span>
                    )}
                    {application.jobId?.location && (
                      <span className="text-sm text-slate-400">
                        📍 {application.jobId.location}
                      </span>
                    )}
                    {application.jobId?.salary && (
                      <span className="text-sm font-semibold text-cyan-300">
                        💰 {application.jobId.salary}
                      </span>
                    )}
                  </div>

                  {/* Applied date */}
                  <p className="text-xs text-slate-600">
                    Applied on {new Date(application.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {application.jobId?._id && (
                    <Link
                      to={`/jobs/${application.jobId._id}`}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                    >
                      View Job
                    </Link>
                  )}
                </div>

              </div>

              {/* Cover Letter Preview */}
              <div className="mt-5 border-t border-slate-800 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  Your cover letter
                </p>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                  {application.coverLetter}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && applications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg font-semibold text-slate-200 mb-2">
              No applications yet
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Start applying for jobs to track them here
            </p>
            <Link
              to="/"
              className="inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
            >
              Browse Jobs →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default MyApplications