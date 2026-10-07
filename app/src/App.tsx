import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Assignments from './pages/Assignments'
import Inspect from './pages/Inspect'
import Dashboard from './pages/Dashboard'
import InstallButton from './components/InstallButton'

type Status = 'loading' | 'ok' | 'none' | 'offline'

function Main() {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('loading')
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
    if (!session) {
      setRole(null)
      setStatus('loading')
      return
    }
    const cacheKey = `role-${session.user.id}`
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data) {
          localStorage.setItem(cacheKey, data.role)
          setRole(data.role)
          setStatus('ok')
        } else if (error) {
          const cached = localStorage.getItem(cacheKey) // offline fallback
          if (cached) {
            setRole(cached)
            setStatus('ok')
          } else setStatus('offline')
        } else setStatus('none') // signed in, but no profile row
      })
  }, [session])

  if (!ready) return null
  if (!session) return <Login />

  if (status === 'loading') return <p className="p-4">Loading…</p>
  if (status === 'none' || status === 'offline')
    return (
      <div className="mx-auto mt-24 max-w-sm space-y-3 p-4 text-center">
        <h1 className="text-xl font-bold text-green-800">
          {status === 'none' ? 'No access' : 'Cannot reach the server'}
        </h1>
        <p className="text-sm">
          {status === 'none'
            ? 'Your account has not been set up for KASISA yet. Please contact KASISA.'
            : 'Connect to the internet and try again.'}
        </p>
        <button className="rounded border px-3 py-2" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    )

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

export default function App() {
  return (
    <Routes>
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="*" element={<Main />} />
    </Routes>
  )
      }
