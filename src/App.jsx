import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TripProvider } from './context/TripContext'

import Home          from './pages/Home'
import Login         from './pages/Login'
import Onboarding    from './pages/Onboarding'
import PlanTrip      from './pages/PlanTrip'
import ItineraryView from './pages/ItineraryView'
import Customize     from './pages/Customize'
import SaveExport    from './pages/SaveExport'
import LiveTrip      from './pages/LiveTrip'
import PostTrip      from './pages/PostTrip'
import Profile       from './pages/Profile'
import Navbar        from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function OnboardingRoute({ children }) {
  const { user, onboarded } = useAuth()
  if (!user)      return <Navigate to="/login" replace />
  if (!onboarded) return <Navigate to="/onboarding" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Stage 1 */}
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />

        {/* Stage 2 */}
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />

        {/* Stage 3 */}
        <Route path="/plan" element={
          <OnboardingRoute><PlanTrip /></OnboardingRoute>
        } />

        {/* Stage 4 */}
        <Route path="/itinerary" element={
          <OnboardingRoute><ItineraryView /></OnboardingRoute>
        } />

        {/* Stage 5 */}
        <Route path="/customize" element={
          <OnboardingRoute><Customize /></OnboardingRoute>
        } />

        {/* Stage 6 */}
        <Route path="/save" element={
          <OnboardingRoute><SaveExport /></OnboardingRoute>
        } />

        {/* Stage 7 */}
        <Route path="/live" element={
          <OnboardingRoute><LiveTrip /></OnboardingRoute>
        } />

        {/* Stage 8 */}
        <Route path="/post-trip" element={
          <OnboardingRoute><PostTrip /></OnboardingRoute>
        } />

        {/* Profile */}
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
          }} />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
