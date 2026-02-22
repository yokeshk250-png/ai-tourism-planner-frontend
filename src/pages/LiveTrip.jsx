import { useTrip } from '../context/TripContext'
import { useNavigate } from 'react-router-dom'
import { MapPin, CheckCircle2, Circle, Navigation, Utensils } from 'lucide-react'

export default function LiveTrip() {
  const { itinerary, liveChecked, toggleVisited } = useTrip()
  const nav = useNavigate()

  if (!itinerary.length) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No active trip. Generate an itinerary first.</p>
        <button onClick={() => nav('/plan')} className="mt-4 text-blue-400 hover:underline">Plan a trip</button>
      </div>
    )
  }

  const byDay = itinerary.reduce((acc, s) => { (acc[s.day] = acc[s.day] || []).push(s); return acc }, {})
  const total   = itinerary.length
  const visited = Object.values(liveChecked).filter(Boolean).length
  const pct = Math.round((visited / total) * 100)

  const openMaps = (place) => {
    const q = place.lat && place.lon
      ? `${place.lat},${place.lon}`
      : encodeURIComponent(place.place_name)
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
  }

  const isMealStop = (s) => ['breakfast', 'lunch', 'dinner', 'food', 'restaurant'].some(k => (s.category || s.place_name).toLowerCase().includes(k))

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📍 Live Trip Mode</h1>
          <p className="text-slate-400 text-sm mt-1">{visited} of {total} places visited</p>
        </div>
        <button onClick={() => nav('/post-trip')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          End Trip →
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>

      {Object.entries(byDay).map(([day, stops]) => (
        <div key={day} className="mb-8">
          <h3 className="text-blue-400 font-semibold mb-3">🗓️ Day {day}</h3>
          <div className="space-y-3">
            {stops.map((s, i) => {
              const key = `${s.day}-${s.time}-${s.place_name}`
              const done = !!liveChecked[key]
              const meal = isMealStop(s)
              return (
                <div key={i}
                  className={`bg-slate-800 border rounded-xl p-4 flex items-start gap-3 transition ${
                    done ? 'border-green-700 opacity-60' : 'border-slate-700'
                  }`}
                >
                  <button onClick={() => toggleVisited(key)} className="mt-0.5 flex-shrink-0">
                    {done
                      ? <CheckCircle2 size={22} className="text-green-500" />
                      : <Circle size={22} className="text-slate-500" />
                    }
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {meal && <Utensils size={14} className="text-orange-400" />}
                      <p className={`font-semibold ${done ? 'line-through text-slate-500' : 'text-white'}`}>
                        {s.place_name}
                      </p>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{s.time} • {s.duration_hrs}hr{s.entry_fee !== undefined ? ` • ₹${s.entry_fee}` : ''}</p>
                    {s.tip && <p className="text-purple-400 text-xs mt-1">💡 {s.tip}</p>}
                    {meal && s.nearby_food && <p className="text-orange-400 text-xs mt-1">🍴 {s.nearby_food}</p>}
                  </div>
                  {!done && (
                    <button onClick={() => openMaps(s)}
                      className="flex-shrink-0 flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg text-xs"
                    >
                      <Navigation size={13} /> Go
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
