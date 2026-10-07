import { useEffect, useState } from 'react'

export default function InstallButton() {
  const [evt, setEvt] = useState<any>(null)
  const [hint, setHint] = useState(false)
  const standalone = window.matchMedia('(display-mode: standalone)').matches
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault()
      setEvt(e)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  if (standalone || (!evt && !ios)) return null
  return (
    <div>
      <button
        className="rounded bg-green-700 px-3 py-1 text-sm text-white"
        onClick={() => (evt ? evt.prompt() : setHint(true))}
      >
        Install app
      </button>
      {hint && <p className="mt-1 text-xs text-gray-600">On iPhone: tap Share, then “Add to Home Screen”.</p>}
    </div>
  )
}
