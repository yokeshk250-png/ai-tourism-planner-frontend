import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import { generateItinerary } from '../api'
import toast from 'react-hot-toast'
import { MapPin, Calendar, Loader } from 'lucide-react'

const MOODS = ['cultural', 'relaxed', 'adventure', 'spiritual', 'romantic', 'foodie']
const INTERESTS = ['temples', 'beach', 'history', 'nature', 'food', 'shopping', 'adventure', 'heritage', 'museum']

export default function PlanTrip() {
  const loc  = useLocation()
  const nav  = useNavigate()
  const { profile } = useAuth()
  const { setItinerary, setMeta, setWeather, setTripRequest } = useTrip()

  const prefs = profile?.preferences || {}

  const [destination, setDest]      = useState(loc.state?.destination || '')
  const [days,        setDays]      = useState(2)
  const [travelDate,  setDate]      = useState('')
  const [budget,      setBudget]    = useState(prefs.budget || 'medium')
  const [travelType,  setType]      = useState(prefs.travelType || 'solo')
  const [mood,        setMood]      = useState('cultural')
  const [interests,   setInterests] = useState(prefs.interests?.map(i => i.toLowerCase()) || ['temples', 'beach'])
  const [loading,     setLoading]   = useState(false)

  const toggleInterest = (item) =>
    setInterests(p => p.includes(item) ? p.filter(i => i !== item) : [...p, item])

  const handleGenerate = async () => {
    if (!destination.trim()) return toast.error('Enter a destination')
    if (interests.length === 0) return toast.error('Pick at least one interest')
    setLoading(true)
    try {
      const payload = { destination, days, budget, travel_type: travelType, mood, interests, travel_dates: travelDate || null }
      setTripRequest(payload)
      const res = await generateItinerary(payload)
      setItinerary(res.data.itinerary)
      setMeta(res.data.meta)
      setWeather(res.data.weather_warnings || [])
      toast.success(`Generated ${res.data.itinerary.length} stops!`)
      nav('/itinerary')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Generation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">🗺️ Plan Your Trip</h1>
      <p className="text-slate-400 mb-8">Fill in your trip details — AI will craft your itinerary</p>

      <div className="space-y-5">
        {/* Destination */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <label className="text-slate-300 text-sm font-medium mb-2 block">📍 Destination</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-lg px-4">
            <MapPin size={16} className="text-blue-400" />
            <input value={destination} onChange={e => setDest(e.target.value)}
              placeholder="e.g. Chennai, Jaipur, Goa"
              className="flex-1 bg-transparent py-3 text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Days + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <label className="text-slate-300 text-sm font-medium mb-2 block">📅 Days</label>
            <input type="number" value={days} min={1} max={14} onChange={e => setDays(+e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <label className="text-slate-300 text-sm font-medium mb-2 block">📆 Travel Date</label>
            <input type="date" value={travelDate} onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <label className="text-slate-300 text-sm font-medium mb-3 block">💰 Budget</label>
          <div className="grid grid-cols-3 gap-3">
            {[['low','💸 Budget'],['medium','💳 Mid'],['high','💵 Luxury']].map(([v,l]) => (
              <button key={v} onClick={() => setBudget(v)}
                className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                  budget === v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300'
                }`}>{l}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Type */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <label className="text-slate-300 text-sm font-medium mb-3 block">👥 Travel Type</label>
          <div className="grid grid-cols-4 gap-3">
            {[['solo','🧑 Solo'],['couple','👫 Couple'],['family','👨‍👩‍👧 Family'],['group','👥 Group']].map(([v,l]) => (
              <button key={v} onClick={() => setType(v)}
                className={`py-2.5 rounded-lg border text-xs font-medium transition ${
                  travelType === v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300'
                }`}>{l}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <label className="text-slate-300 text-sm font-medium mb-3 block">✨ Trip Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)}
                className={`px-4 py-2 rounded-full border text-sm capitalize transition ${
                  mood === m ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300'
                }`}>{m}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <label className="text-slate-300 text-sm font-medium mb-3 block">❤️ Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(item => (
              <button key={item} onClick={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-full border text-sm capitalize transition ${
                  interests.includes(item) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300'
                }`}>{item}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader size={20} className="animate-spin" /> Generating Itinerary...</> : '⚡ Generate AI Itinerary'}
        </button>
      </div>
    </div>
  )
}
