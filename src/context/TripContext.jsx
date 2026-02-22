import { createContext, useContext, useState } from 'react'

const TripContext = createContext(null)

export function TripProvider({ children }) {
  const [tripRequest, setTripRequest]   = useState(null)
  const [itinerary, setItinerary]       = useState([])
  const [meta, setMeta]                 = useState(null)
  const [weatherWarnings, setWeather]   = useState([])
  const [savedId, setSavedId]           = useState(null)
  const [liveChecked, setLiveChecked]   = useState({})

  // Remove a stop from itinerary
  const removeStop = (day, time) =>
    setItinerary(prev => prev.filter(s => !(s.day === day && s.time === time)))

  // Reorder stops (drag & drop result)
  const reorderStops = (newList) => setItinerary(newList)

  // Add a new stop
  const addStop = (stop) => setItinerary(prev => [...prev, stop].sort((a,b) => a.day - b.day || a.time.localeCompare(b.time)))

  // Mark a place as visited in live mode
  const toggleVisited = (key) =>
    setLiveChecked(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <TripContext.Provider value={{
      tripRequest, setTripRequest,
      itinerary,   setItinerary,
      meta,        setMeta,
      weatherWarnings, setWeather,
      savedId,     setSavedId,
      liveChecked, toggleVisited,
      removeStop, reorderStops, addStop
    }}>
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => useContext(TripContext)
