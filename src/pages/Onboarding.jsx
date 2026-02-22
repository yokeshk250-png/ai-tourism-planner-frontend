import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const INTERESTS = ['Temples', 'Beach', 'History', 'Nature', 'Food', 'Shopping', 'Adventure', 'Heritage', 'Museum', 'Nightlife']

export default function Onboarding() {
  const [budget,      setBudget]      = useState('medium')
  const [travelType,  setTravelType]  = useState('solo')
  const [interests,   setInterests]   = useState(['Temples', 'Beach'])
  const [saving,      setSaving]      = useState(false)
  const { savePreferences } = useAuth()
  const nav = useNavigate()

  const toggleInterest = (item) =>
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )

  const handleSave = async () => {
    if (interests.length === 0) return toast.error('Pick at least one interest')
    setSaving(true)
    try {
      await savePreferences({ budget, travelType, interests })
      toast.success('Profile saved!')
      nav('/plan')
    } catch (e) {
      toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-white">Set Up Your Travel Profile</h2>
          <p className="text-slate-400 mt-1">We'll personalise your AI itineraries</p>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="text-slate-300 text-sm font-medium mb-3 block">💰 Budget</label>
          <div className="grid grid-cols-3 gap-3">
            {[['low', '💸 Budget'], ['medium', '💳 Mid-Range'], ['high', '💵 Luxury']].map(([v, l]) => (
              <button key={v} onClick={() => setBudget(v)}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  budget === v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}>{l}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Type */}
        <div className="mb-6">
          <label className="text-slate-300 text-sm font-medium mb-3 block">👥 Travel Type</label>
          <div className="grid grid-cols-4 gap-3">
            {[['solo', '🧑 Solo'], ['couple', '👫 Couple'], ['family', '👨‍👩‍👧 Family'], ['group', '👥 Group']].map(([v, l]) => (
              <button key={v} onClick={() => setTravelType(v)}
                className={`py-3 rounded-xl border text-xs font-medium transition ${
                  travelType === v ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}>{l}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <label className="text-slate-300 text-sm font-medium mb-3 block">❤️ Interests <span className="text-slate-500">(pick all that apply)</span></label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(item => (
              <button key={item} onClick={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  interests.includes(item) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}>{item}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save & Start Planning →'}
        </button>
      </div>
    </div>
  )
}
