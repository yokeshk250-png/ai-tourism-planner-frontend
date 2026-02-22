import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Compass, Star, Zap } from 'lucide-react'

const FEATURED = [
  { name: 'Chennai',    img: 'https://source.unsplash.com/400x250/?chennai,temple',    tag: 'Temples & Beach' },
  { name: 'Munnar',     img: 'https://source.unsplash.com/400x250/?munnar,tea',         tag: 'Nature & Hills' },
  { name: 'Jaipur',     img: 'https://source.unsplash.com/400x250/?jaipur,palace',      tag: 'Heritage & Culture' },
  { name: 'Goa',        img: 'https://source.unsplash.com/400x250/?goa,beach',          tag: 'Beach & Nightlife' },
  { name: 'Varanasi',   img: 'https://source.unsplash.com/400x250/?varanasi,ganges',    tag: 'Spiritual & History' },
  { name: 'Coorg',      img: 'https://source.unsplash.com/400x250/?coorg,forest',       tag: 'Adventure & Nature' },
]

export default function Home() {
  const { user, onboarded } = useAuth()
  const nav = useNavigate()
  
  const handleSearch = (dest) => {
    if (!user)      return nav('/login')
    if (!onboarded) return nav('/onboarding')
    nav('/plan', { state: { destination: dest } })
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} /> Powered by Groq LLama 3.3 70B
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Plan Your Perfect<br />
            <span className="text-blue-400">Indian Adventure</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            AI-generated day-wise itineraries tailored to your budget, mood & interests.
          </p>

          {/* Search Bar */}
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-xl px-4">
              <MapPin size={18} className="text-blue-400" />
              <input
                id="hero-search"
                type="text"
                placeholder="Where do you want to go? e.g. Chennai"
                className="flex-1 bg-transparent py-3 text-white placeholder-slate-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleSearch(document.getElementById('hero-search').value)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Plan Trip
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Zap className="text-yellow-400" />, title: 'AI-Powered Plans', desc: 'Groq LLama 3.3 generates smart day-wise itineraries in seconds' },
            { icon: <Compass className="text-green-400" />, title: 'Live Trip Mode', desc: 'Navigate places one-by-one with live checklist & Maps directions' },
            { icon: <Star className="text-purple-400" />, title: 'Personalized', desc: 'ML recommendations improve with every trip you rate' },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured Destinations */}
        <h2 className="text-2xl font-bold text-white mb-6">🌟 Featured Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURED.map((d) => (
            <button key={d.name} onClick={() => handleSearch(d.name)}
              className="relative rounded-xl overflow-hidden group text-left hover:scale-105 transition-transform"
            >
              <img src={d.img} alt={d.name} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold">{d.name}</p>
                <p className="text-slate-300 text-xs">{d.tag}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
