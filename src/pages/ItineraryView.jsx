import { useNavigate } from 'react-router-dom'
import { useTrip } from '../context/TripContext'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { AlertTriangle, Edit3, Save, Navigation } from 'lucide-react'

function DayCard({ day, stops }) {
  return (
    <div className="mb-8">
      <h3 className="text-blue-400 font-bold text-lg mb-4">🗓️ Day {day}</h3>
      <div className="space-y-3">
        {stops.map((s, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-4">
            <div className="text-center min-w-[52px]">
              <div className="text-blue-400 text-xs font-bold">{s.time}</div>
              <div className="text-slate-500 text-xs mt-1">{s.duration_hrs}hr</div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold">{s.place_name}</p>
                  <p className="text-slate-500 text-xs capitalize mt-0.5">{s.category}</p>
                </div>
                {s.entry_fee !== undefined && (
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                    {s.entry_fee === 0 ? 'Free' : `₹${s.entry_fee}`}
                  </span>
                )}
              </div>
              {s.tip && <p className="text-purple-400 text-xs mt-2">💡 {s.tip}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ItineraryView() {
  const { itinerary, meta, weatherWarnings } = useTrip()
  const nav = useNavigate()

  if (!itinerary.length) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No itinerary yet.</p>
        <button onClick={() => nav('/plan')} className="mt-4 text-blue-400 hover:underline">Plan a trip</button>
      </div>
    )
  }

  const byDay = itinerary.reduce((acc, s) => { (acc[s.day] = acc[s.day] || []).push(s); return acc }, {})
  const coords = itinerary.filter(s => s.lat && s.lon).map(s => [s.lat, s.lon])
  const center = coords[0] || [13.0827, 80.2707]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🗺️ {meta?.destination} Itinerary</h1>
          <p className="text-slate-400 mt-1">{meta?.days} days • {meta?.travel_type} • {meta?.budget} budget • {meta?.mood} mood</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => nav('/customize')} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm">
            <Edit3 size={15} /> Customize
          </button>
          <button onClick={() => nav('/save')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            <Save size={15} /> Save & Export
          </button>
        </div>
      </div>

      {/* Weather Warnings */}
      {weatherWarnings?.map((w, i) => (
        <div key={i} className="flex items-center gap-2 bg-amber-900/30 border border-amber-700 text-amber-400 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertTriangle size={16} /> {w}
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Day Cards */}
        <div>
          {Object.entries(byDay).map(([day, stops]) => (
            <DayCard key={day} day={day} stops={stops} />
          ))}
          <button onClick={() => nav('/live')}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl mt-4"
          >
            <Navigation size={18} /> Start Live Trip Mode
          </button>
        </div>

        {/* Map */}
        <div className="lg:sticky lg:top-20 h-[500px] rounded-xl overflow-hidden">
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {coords.length > 1 && <Polyline positions={coords} color="#3b82f6" weight={3} opacity={0.7} dashArray="8,4" />}
            {itinerary.filter(s => s.lat && s.lon).map((s, i) => (
              <Marker key={i} position={[s.lat, s.lon]}>
                <Popup>
                  <b>{s.place_name}</b><br />
                  Day {s.day} • {s.time}{s.entry_fee !== undefined ? ` • ₹${s.entry_fee}` : ''}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
