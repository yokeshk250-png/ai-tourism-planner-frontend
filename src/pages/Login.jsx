import { useState } from 'react'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { MapPin } from 'lucide-react'

export default function Login() {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [isNew, setIsNew]   = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { onboarded } = useAuth()

  const redirect = () => nav(onboarded ? '/plan' : '/onboarding')

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, provider)
      toast.success('Signed in with Google!')
      redirect()
    } catch (e) {
      toast.error(e.message)
    } finally { setLoading(false) }
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isNew) {
        await createUserWithEmailAndPassword(auth, email, pass)
        toast.success('Account created!')
      } else {
        await signInWithEmailAndPassword(auth, email, pass)
        toast.success('Welcome back!')
      }
      redirect()
    } catch (e) {
      toast.error(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-6">
          <MapPin className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">AI Tourism Planner</h1>
        </div>
        <h2 className="text-center text-slate-400 mb-8">{isNew ? 'Create your account' : 'Welcome back'}</h2>

        {/* Google OAuth */}
        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-xl mb-4 transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="text-slate-500 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>

        {/* Email/Password */}
        <form onSubmit={handleEmail} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="Password" required
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? 'Please wait...' : (isNew ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          {isNew ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsNew(!isNew)} className="text-blue-400 hover:underline">
            {isNew ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
