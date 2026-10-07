import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const nav = useNavigate()
  const [state, setState] = useState<'checking' | 'ok' | 'invalid'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    // The link in the email signs the person in; give the app a moment to read it.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession()
      setState(data.session ? 'ok' : 'invalid')
    }, 800)
    return () => clearTimeout(t)
  }, [])

  const submit = async () => {
    setErr('')
    if (password.length < 8) return setErr('Use at least 8 characters.')
    if (password !== confirm) return setErr('The two passwords do not match.')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setErr(error.message)
    else nav('/')
  }

  if (state === 'checking') return <p className="p-4">Checking link…</p>
  if (state === 'invalid')
    return (
      <div className="mx-auto mt-24 max-w-sm space-y-3 p-4">
        <p>This reset link is invalid or has expired.</p>
        <Link to="/forgot" className="text-green-800 underline">Request a new link</Link>
      </div>
    )

  return (
    <div className="mx-auto mt-24 max-w-sm space-y-3 p-4">
      <h1 className="text-2xl font-bold text-green-800">Choose a new password</h1>
      <input className="w-full rounded border p-2" type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="w-full rounded bg-green-700 p-2 text-white" onClick={submit}>Save password</button>
    </div>
  )
}
