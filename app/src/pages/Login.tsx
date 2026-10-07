import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async () => {
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
  }

  return (
    <div className="mx-auto mt-24 max-w-sm space-y-3 p-4">
      <h1 className="text-2xl font-bold text-green-800">KASISA</h1>
      <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {!supabaseConfigured && (
        <p className="text-sm text-amber-700">Supabase is not connected yet. Add your keys to .env to sign in.</p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="w-full rounded bg-green-700 p-2 text-white" onClick={submit}>Sign in</button>
      <div className="text-center">
        <Link to="/forgot" className="text-sm text-green-800 underline">Forgot password?</Link>
      </div>
    </div>
  )
}
