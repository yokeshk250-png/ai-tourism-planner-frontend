import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [profile, setProfile]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [onboarded, setOnboarded]     = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          setProfile(snap.data())
          setOnboarded(!!snap.data().preferences)
        }
      } else {
        setProfile(null)
        setOnboarded(false)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const savePreferences = async (prefs) => {
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName,
      photoURL:    user.photoURL,
      preferences: prefs,
      updatedAt:   new Date().toISOString()
    }, { merge: true })
    setProfile(p => ({ ...p, preferences: prefs }))
    setOnboarded(true)
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, profile, loading, onboarded, savePreferences, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
