import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../context/TripContext'
import { useAuth } from '../context/AuthContext'
import { ratePlace } from '../api'
import toast from 'react-hot-toast'
import { Star, CheckCircle } from 'lucide-react'

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)}>
          <Star size={22} className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
        </button>
      ))}
    </div>
  )
}

export default function PostTrip() {
  const { itinerary, liveChecked } = useTrip()
  const { user } = useAuth()
  const nav = useNavigate()
  const [ratings, setRatings] = useState({})
  const [submitted, setSubmitted] = useState({})

  const visited = itinerary.filter(s => !!liveChecked[`${s.day}-${s.time}-${s.place_name}`])

  const handleRate = async (stop, rating) => {
    const key = `${stop.day}-${stop.time}-${stop.place_name}`
    setRatings(p => ({ ...p, [key]: rating }))
    try {
      await ratePlace({
        user_id:    user?.uid || 'anonymous',
        place_id:   stop.place_id || key,
        place_name: stop.place_name,
        rating
      })
      setSubmitted(p => ({ ...p, [key]: true }))
      toast.success(`Rated ${stop.place_name}!`)
    } catch (e) {
      toast.error('Rating failed')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">⭐ Rate Your Trip</h1>
      <p className="text-slate-400 text-sm mb-8">Your ratings improve future AI recommendations</p>

      {visited.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No visited places recorded.</p>
          <button onClick={() => nav('/live')} className="mt-3 text-blue-400 hover:underline text-sm">Go to Live Mode</button>
        </div>
      )}

      <div className="space-y-4">
        {visited.map((s, i) => {
          const key = `${s.day}-${s.time}-${s.place_name}`
          const done = submitted[key]
          return (
            <div key={i} className={`bg-slate-800 border rounded-xl p-4 ${ done ? 'border-green-700' : 'border-slate-700'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold">{s.place_name}</p>
                  <p className="text-slate-500 text-xs capitalize mt-0.5">{s.category} • Day {s.day}</p>
                </div>
                {done && <CheckCircle size={20} className="text-green-500" />}
              </div>
              <div className="mt-3">
                <StarRating
                  value={ratings[key] || 0}
                  onChange={(r) => !done && handleRate(s, r)}
                />
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={() => nav('/profile')}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition"
      >
        View My Trip History →
      </button>
    </div>
  )
}
