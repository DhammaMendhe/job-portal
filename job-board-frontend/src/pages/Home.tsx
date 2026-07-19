import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllJobs } from '../redux/slices/jobSlice'
import type { RootState, AppDispatch } from '../redux/store'
import { Link } from 'react-router-dom'

function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, isLoading } = useSelector((state: RootState) => state.jobs)

  useEffect(() => {
    dispatch(fetchAllJobs({}))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
     

      <header className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-slate-900 to-slate-950 px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-slate-900/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 shadow-sm shadow-cyan-500/10">
              Find work faster
            </p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Discover your next tech role with confidence.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              Browse curated remote, full-time, and contract jobs from top employers. Stay ahead with a clean job board experience built for modern professionals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search jobs, companies, locations..."
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-5 py-3 text-slate-100 shadow-lg shadow-slate-950/20 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 sm:max-w-md"
              />
              <button className="inline-flex items-center justify-center rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-50 sm:w-auto">
                Search jobs
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Why choose us</p>
            <ul className="mt-6 space-y-4 text-slate-200">
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <p className="font-semibold text-white">Fast matching</p>
                <p className="mt-1 text-sm text-slate-400">See the newest job opportunities as they appear.</p>
              </li>
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <p className="font-semibold text-white">Remote friendly</p>
                <p className="mt-1 text-sm text-slate-400">Filter remote and hybrid roles instantly.</p>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="max-w-6xl px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-white">Latest jobs</h3>
            <p className="mt-2 text-sm text-slate-400">Curated listings updated for your next career move.</p>
          </div>
          <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300 shadow-sm">
            {jobs.length} open roles
          </span>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400 shadow-lg shadow-slate-950/20">
            Loading jobs...
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article key={job._id} className="group rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">{job.type.replace('-', ' ')}</p>
                  <h4 className="mt-3 text-xl font-semibold text-white">{job.title}</h4>
                </div>
                <span className="rounded-2xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                  {job.location}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-400 line-clamp-3">{job.description}</p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                <span className="rounded-2xl bg-slate-800/80 px-3 py-1">{job.company}</span>
                {job.salary ? <span className="font-semibold text-cyan-300">{job.salary}</span> : null}
              </div>

              <Link
                to={`/jobs/${job._id}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                View job
              </Link>
            </article>
          ))}
        </div>

        {!isLoading && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
            <p className="text-lg font-semibold text-slate-200">No jobs available</p>
            <p className="mt-2 text-sm">Check back soon � new roles are added regularly.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
