import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import RouteLoading from '../components/layout/RouteLoading.jsx'
import Home from '../pages/Home/Home.jsx'
import SignIn from '../pages/SignIn/SignIn.jsx'
import AuthCallback from '../pages/AuthCallback/AuthCallback.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

// Feature pages are lazy-loaded — Home, SignIn, and AuthCallback stay eager
// since they're the critical first-load / auth-flow path and shouldn't
// show a loading flicker.
const Calendar = lazy(() => import('../pages/features/Calendar/Calendar.jsx'))
const Lists = lazy(() => import('../pages/features/Lists/Lists.jsx'))
const ListDetail = lazy(() => import('../pages/features/Lists/ListDetail.jsx'))
const Nebula = lazy(() => import('../pages/features/Nebula/Nebula.jsx'))
const Skirmish = lazy(() => import('../pages/features/Skirmish/Skirmish.jsx'))
const Bills = lazy(() => import('../pages/features/Bills/Bills.jsx'))
const BillDetail = lazy(() => import('../pages/features/Bills/BillDetail.jsx'))
const Archery = lazy(() => import('../pages/features/Archery/Archery.jsx'))
const ScorecardDetail = lazy(() => import('../pages/features/Archery/ScorecardDetail.jsx'))
const Notes = lazy(() => import('../pages/features/Notes/Notes.jsx'))
const FolderDetail = lazy(() => import('../pages/features/Notes/FolderDetail.jsx'))
const NoteEditor = lazy(() => import('../pages/features/Notes/NoteEditor.jsx'))
const About = lazy(() => import('../pages/About/About.jsx'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageWrapper />}>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/nebula" element={<Suspense fallback={<RouteLoading />}><Nebula /></Suspense>} />
        <Route path="/skirmish" element={<Suspense fallback={<RouteLoading />}><Skirmish /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<RouteLoading />}><About /></Suspense>} />

        {/* Protected routes */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><Calendar /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><Lists /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><ListDetail /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><Bills /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><BillDetail /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/archery"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><Archery /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/archery/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><ScorecardDetail /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><Notes /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><FolderDetail /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:folderId/:noteId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoading />}><NoteEditor /></Suspense>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Home />} />

      </Route>
    </Routes>
  )
}