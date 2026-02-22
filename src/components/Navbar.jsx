import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, User, LogOut, Map } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    await logout()
    nav('/')
  }

  return (
    <nav className="bg-dark-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
        <MapPin className="text-blue-400" size={22} />
        AI Tourism Planner
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/plan"    className="text-slate-300 hover:text-white text-sm">Plan Trip</Link>
            <Link to="/profile" className="text-slate-300 hover:text-white text-sm">My Trips</Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
              alt="avatar" className="w-8 h-8 rounded-full border border-slate-600"
            />
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
