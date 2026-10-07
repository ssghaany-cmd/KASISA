import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    setErr('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`
    })
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <div className="mx-auto mt-24 max-w-sm space-y-3 p-4">
      <h1 className="text-2xl font-bold text-green-800">Reset password</h1>
      {sent ? (
        <p className="text-sm">If this email belongs to a KASISA account, a reset link is on its way. Check your inbox.</p>
      ) : (
        <>
          <input className="w-full rounded border p-2" type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="w-full rounded bg-green-700 p-2 text-white disabled:opacity-40" disabled={!email} onClick={submit}>
            Send reset link
          </button>
        </>
      )}
      <div className="text-center">
        <Link to="/" className="text-sm text-green-800 underline">Back to sign in</Link>
      </div>
    </div>
  )
}
