import { Routes, Route } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import Home from '../pages/Home/Home.jsx'
import SignIn from '../pages/SignIn/SignIn.jsx'
import AuthCallback from '../pages/AuthCallback/AuthCallback.jsx'
import Calendar from '../pages/features/Calendar/Calendar.jsx'
import Lists from '../pages/features/Lists/Lists.jsx'
import ListDetail from '../pages/features/Lists/ListDetail.jsx'
import Nebula from '../pages/features/Nebula/Nebula.jsx'
import Bills from '../pages/features/Bills/Bills.jsx'
import BillDetail from '../pages/features/Bills/BillDetail.jsx'
import About from '../pages/About/About.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageWrapper />}>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/nebula" element={<Nebula />} />
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <Lists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists/:id"
          element={
            <ProtectedRoute>
              <ListDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills/:id"
          element={
            <ProtectedRoute>
              <BillDetail />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Home />} />

      </Route>
    </Routes>
  )
}