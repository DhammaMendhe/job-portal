import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../redux/store'

interface Props {
  children: React.ReactNode
  role?: 'employer' | 'jobseeker'  // optional — restrict to specific role
}

function ProtectedRoute({ children, role }: Props) {
  const { user, token } = useSelector((state: RootState) => state.auth)

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role → redirect to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  // All good → show the page
  return <>{children}</>
}

export default ProtectedRoute