# 🗺️ AI Tourism Planner — Frontend

React + Vite frontend for the AI-powered tourism itinerary planner.
**8-stage user flow** from landing page to post-trip ML feedback.

## 🚀 Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Auth | Firebase Auth (Google OAuth + Email) |
| Database | Firebase Firestore |
| Map | Leaflet + OpenStreetMap (free) |
| Drag & Drop | @hello-pangea/dnd |
| PDF Export | jsPDF + jspdf-autotable |
| Toast | react-hot-toast |
| Icons | lucide-react |
| HTTP | Axios |

## 🎬 8-Stage User Flow

| Stage | Route | Description |
|---|---|---|
| 1 🔑 Entry & Auth | `/` `/login` | Home + Firebase Google/Email auth |
| 2 🎯 Onboarding | `/onboarding` | Budget, travel type, interests saved to Firestore |
| 3 🗺️ Plan Trip | `/plan` | Destination, days, mood, interests form |
| 4 👁️ Review | `/itinerary` | Day-by-day cards + Leaflet map route |
| 5 ✏️ Customize | `/customize` | Drag & drop reorder, remove, re-generate |
| 6 💾 Save | `/save` | Save to Firebase, PDF export, WhatsApp share |
| 7 📍 Live Mode | `/live` | Checklist + 1-tap Google Maps navigation |
| 8 ⭐ Post Trip | `/post-trip` | Star ratings feed back to ML model |

## 🛠️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in Firebase keys + backend URL

# 3. Run dev server
npm run dev
# → http://localhost:5173
```

## 🔗 Backend
This frontend connects to the FastAPI backend:
[ai-tourism-planner-backend](https://github.com/yokeshk250-png/ai-tourism-planner-backend)
