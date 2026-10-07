import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { cached } from '../lib/cache'
import { getQueue } from '../lib/queue'

type Row = { asset_id: string; status: string; assets: { name: string; asset_code: string } }

export default function Assignments() {
  const [rows, setRows] = useState<Row[]>([])
  const [pending, setPending] = useState(0)

  useEffect(() => {
    cached('assignments', async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('asset_id,status,assets(name,asset_code)')
        .eq('status', 'pending')
      if (error) throw error
      return data as unknown as Row[]
    }).then(setRows).catch(console.error)
    getQueue().then(q => setPending(q.length))
  }, [])

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-lg font-semibold">Assets to inspect</h2>
      {pending > 0 && <p className="text-sm text-amber-700">{pending} inspection(s) waiting to sync</p>}
      {rows.map(r => (
        <Link key={r.asset_id} to={`/inspect/${r.asset_id}`} className="block rounded border p-3">
          <div className="font-medium">{r.assets.name}</div>
          <div className="text-xs text-gray-500">{r.assets.asset_code}</div>
        </Link>
      ))}
      {!rows.length && <p className="text-gray-500">No assignments.</p>}
    </div>
  )
}
