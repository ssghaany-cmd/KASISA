import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Assignments from './pages/Assignments'
import Inspect from './pages/Inspect'
import Dashboard from './pages/Dashboard'
import InstallButton from './components/InstallButton'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setRole(null)
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          localStorage.setItem('role', data.role)
          setRole(data.role)
        } else setRole(localStorage.getItem('role')) // offline fallback
      })
  }, [session])

  if (!ready) return null
  if (!session) return <Login />
  if (!role) return <p className="p-4">Loading…</p>
  const home = role === 'field_officer' ? '/assignments' : '/dashboard'

  return (
    <>
      <header className="flex items-center justify-between border-b p-3">
        <b className="text-green-800">KASISA</b>
        <div className="flex items-center gap-3">
          <InstallButton />
          <button className="text-sm underline" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </header>
      <Routes>
        <Route path="/assignments" element={role === 'field_officer' ? <Assignments /> : <Navigate to={home} />} />
        <Route path="/inspect/:assetId" element={role === 'field_officer' ? <Inspect /> : <Navigate to={home} />} />
        <Route path="/dashboard" element={role !== 'field_officer' ? <Dashboard /> : <Navigate to={home} />} />
        <Route path="*" element={<Navigate to={home} />} />
      </Routes>
    </>
  )
}
