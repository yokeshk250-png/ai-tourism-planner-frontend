import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserItineraries } from '../api'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../context/TripContext'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'

export default function Profile() {
  const { user, profile, logout } = useAuth()
  const { setItinerary, setMeta } = useTrip()
  const nav = useNavigate()
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserItineraries(user.uid)
      .then(res => setTrips(res.data.itineraries || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const loadTrip = (trip) => {
    setItinerary(trip.itinerary || [])
    setMeta({ destination: trip.destination, days: trip.days })
    nav('/itinerary')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* User Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 flex items-center gap-5">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=2563eb&color=fff`}
          className="w-16 h-16 rounded-full border-2 border-blue-500"
          alt="avatar"
        />
        <div className="flex-1">
          <p className="text-white font-bold text-lg">{user?.displayName || user?.email}</p>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex gap-3 mt-2 text-xs text-slate-400">
            <span>💰 {profile?.preferences?.budget}</span>
            <span>👥 {profile?.preferences?.travelType}</span>
          </div>
        </div>
        <button onClick={async () => { await logout(); nav('/') }}
          className="text-slate-500 hover:text-red-400 text-sm"
        >Logout</button>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">📂 Trip History</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-xl">
          <p className="text-slate-400">No saved trips yet.</p>
          <button onClick={() => nav('/plan')} className="mt-3 text-blue-400 hover:underline text-sm">Plan your first trip</button>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((t, i) => (
            <button key={i} onClick={() => loadTrip(t)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-blue-600 rounded-xl p-4 flex items-center gap-4 text-left transition"
            >
              <MapPin size={20} className="text-blue-400" />
              <div className="flex-1">
                <p className="text-white font-semibold">{t.destination}</p>
                <p className="text-slate-500 text-xs">{t.days} days • saved {t.created_at?.slice(0, 10)}</p>
              </div>
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
