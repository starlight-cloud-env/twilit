import { Routes, Route } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import Home from '../pages/Home/Home.jsx'
import SignIn from '../pages/SignIn/SignIn.jsx'
import AuthCallback from '../pages/AuthCallback/AuthCallback.jsx'
import Calendar from '../pages/features/Calendar/Calendar.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageWrapper />}>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Home />} />

      </Route>
    </Routes>
  )
}