import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PostJob from "./pages/Postjob";
import Apply from "./pages/Apply";
import JobDetail from "./pages/JobDetail";
       import MyApplications from './pages/MyApplications'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — no Navbar on login/register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Pages with Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <>
              <Navbar />
              <JobDetail />
            </>
          }
        />
        // Replace the post-job route placeholder with:
        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="employer">
              <Navbar />
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="employer">
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected — jobseeker only */}
       
       
        // Replace the apply route with:
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute role="jobseeker">
              <Navbar />
              <Apply />
            </ProtectedRoute>
          }
        />

<Route path="/my-applications" element={
  <ProtectedRoute role="jobseeker">
    <Navbar />
    <MyApplications />
  </ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
