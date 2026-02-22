import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 60000,
})

// ─── Itinerary ───
export const generateItinerary = (payload) =>
  API.post('/api/itinerary/generate', payload)

export const saveItinerary = (userId, itinerary) =>
  API.post(`/api/itinerary/save?user_id=${userId}`, itinerary)

export const getItinerary = (id) =>
  API.get(`/api/itinerary/${id}`)

export const getUserItineraries = (userId) =>
  API.get(`/api/itinerary/user/${userId}`)

export const ratePlace = (payload) =>
  API.post('/api/itinerary/rate', payload)

export const enrichPlace = (placeName, city) =>
  API.post('/api/itinerary/enrich', { place_name: placeName, city })

// ─── Places ───
export const searchPlaces = (destination, category, limit = 10) =>
  API.get('/api/places/search', { params: { destination, category, limit } })

// ─── Weather ───
export const getWeather = (city, days) =>
  API.get('/api/weather/forecast', { params: { city, days } })

export default API
