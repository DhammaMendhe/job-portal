import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createJobAPI } from '../api/jobs'
import type { RootState } from '../redux/store'

function PostJob() {
  const navigate  = useNavigate()
  const { user }  = useSelector((state: RootState) => state.auth)

  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  const [form, setForm] = useState({
    title:       '',
    company:     user?.name || '',
    location:    '',
    description: '',
    salary:      '',
    type:        'full-time' as 'full-time' | 'part-time' | 'remote' | 'contract'
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!form.title || !form.company || !form.location || !form.description) {
      setError('Please fill all required fields')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      await createJobAPI(form)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const jobTypes = [
    { value: 'full-time', label: '💼 Full Time' },
    { value: 'part-time', label: '⏰ Part Time' },
    { value: 'remote',    label: '🌍 Remote'    },
    { value: 'contract',  label: '📝 Contract'  },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/dashboard"
            className="text-sm text-slate-500 hover:text-cyan-400 transition mb-6 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-1">
            New Listing
          </p>
          <h1 className="text-3xl font-bold text-white">
            Post a Job
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Fill in the details below to post a new job listing
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400 text-center">
            ✅ Job posted successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50">

          {/* Job Type Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Job Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {jobTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, type: t.value as any })}
                  className={`rounded-2xl border py-3 px-3 text-sm font-medium transition text-center ${
                    form.type === t.value
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-6">

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
              />
            </div>

            {/* Location and Salary — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, India"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Salary{' '}
                  <span className="text-slate-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 8-12 LPA"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-3.5 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm"
                />
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the role, responsibilities, requirements and what you're looking for in a candidate..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-4 text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm resize-none leading-relaxed"
              />
              <p className="text-xs text-slate-600 mt-2">
                {form.description.length} characters — aim for at least 200 for best results
              </p>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-8" />

          {/* Preview */}
          {form.title && (
            <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Preview
              </p>
              <p className="text-xs text-cyan-300 font-semibold uppercase tracking-widest mb-1">
                {form.type.replace('-', ' ')}
              </p>
              <h4 className="text-lg font-bold text-white">{form.title}</h4>
              <p className="text-sm text-slate-400 mt-1">
                🏢 {form.company || '—'} &nbsp;|&nbsp; 📍 {form.location || '—'}
                {form.salary && <>&nbsp;|&nbsp; 💰 {form.salary}</>}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || success}
              className="flex-1 rounded-full bg-cyan-500 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Posting job...' : '🚀 Post Job'}
            </button>
            <Link
              to="/dashboard"
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

export default PostJob