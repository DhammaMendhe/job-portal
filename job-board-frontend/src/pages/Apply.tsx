import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobById } from '../redux/slices/jobSlice'
import { applyForJobAPI } from '../api/applications'
import type { RootState, AppDispatch } from '../redux/store'

function Apply() {
  const { jobId }  = useParams<{ jobId: string }>()
  const navigate   = useNavigate()
  const dispatch   = useDispatch<AppDispatch>()

  const { selectedJob, isLoading } = useSelector((state: RootState) => state.jobs)
  const { user }                   = useSelector((state: RootState) => state.auth)

  const [coverLetter, setCoverLetter] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  useEffect(() => {
    if (jobId) dispatch(fetchJobById(jobId))
  }, [jobId, dispatch])

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      setError('Please write a cover letter')
      return
    }
    if (coverLetter.trim().length < 50) {
      setError('Cover letter must be at least 50 characters')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      await applyForJobAPI(jobId!, { coverLetter })
      setSuccess(true)
      setTimeout(() => navigate('/my-applications'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading job
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading job details...</p>
      </div>
    )
  }

  // Job not found
  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Job not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          to={`/jobs/${jobId}`}
          className="text-sm text-slate-500 hover:text-cyan-400 transition mb-8 inline-block"
        >
          ← Back to Job
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-1">
            Job Application
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">
            Apply for this role
          </h1>
          <p className="text-slate-400 text-sm">
            Applying as{' '}
            <span className="text-slate-200 font-medium">{user?.name}</span>
            {' '}·{' '}
            <span className="text-slate-500">{user?.email}</span>
          </p>
        </div>

        {/* Job Summary Card */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-3">
            You are applying for
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedJob.title}
              </h2>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-sm text-slate-400">🏢 {selectedJob.company}</span>
                <span className="text-sm text-slate-400">📍 {selectedJob.location}</span>
                {selectedJob.salary && (
                  <span className="text-sm font-semibold text-cyan-300">
                    💰 {selectedJob.salary}
                  </span>
                )}
              </div>
            </div>
            <span className="rounded-2xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 w-fit">
              {selectedJob.type.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400 text-center">
            ✅ Application submitted! Redirecting to your applications...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Application Form */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50">

          <h3 className="text-lg font-semibold text-white mb-2">
            Cover Letter
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Tell the employer why you're a great fit for this role. Be specific about your skills and experience.
          </p>

          {/* Tips */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              💡 Tips for a great cover letter
            </p>
            <ul className="space-y-1.5">
              {[
                'Mention your relevant experience and skills',
                'Explain why you want to work at this company',
                'Keep it concise — 2 to 3 paragraphs is ideal',
                'Show enthusiasm for the role',
              ].map((tip) => (
                <li key={tip} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the ${selectedJob.title} position at ${selectedJob.company}. With my experience in...\n\nI believe I would be a great fit because...\n\nThank you for considering my application.`}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-4 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm resize-none leading-relaxed"
            />

            {/* Character count */}
            <div className="flex justify-between mt-2">
              <p className={`text-xs ${
                coverLetter.length < 50
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}>
                {coverLetter.length < 50
                  ? `${50 - coverLetter.length} more characters needed`
                  : `✓ Good length`
                }
              </p>
              <p className="text-xs text-slate-600">
                {coverLetter.length} characters
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 mb-8" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || success}
              className="flex-1 rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : '🚀 Submit Application'}
            </button>
            <Link
              to={`/jobs/${jobId}`}
              className="flex-1 rounded-full border border-slate-700 py-3.5 text-sm font-medium text-slate-300 hover:border-slate-600 transition text-center"
            >
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Apply