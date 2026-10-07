import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import { supabase } from '../lib/supabase'
import { cached } from '../lib/cache'
import { enqueue, type Photo } from '../lib/queue'
import { preview, type Answer, type Question } from '../lib/scoring'

const OPTIONS: Answer[] = ['good', 'fair', 'poor', 'failed', 'na']
const MIN_PHOTOS = 4

export default function Inspect() {
  const { assetId } = useParams()
  const nav = useNavigate()
  const [asset, setAsset] = useState<{ name: string; asset_code: string } | null>(null)
  const [qs, setQs] = useState<Question[]>([])
  const [ans, setAns] = useState<Record<string, Answer>>({})
  const [photos, setPhotos] = useState<Photo[]>([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    cached(`asset-${assetId}`, async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('name,asset_code,asset_types(question_group)')
        .eq('id', assetId!)
        .single()
      if (error) throw error
      return data as any
    }).then(async a => {
      setAsset(a)
      const group = a.asset_types.question_group
      setQs(
        await cached(`questions-${group}`, async () => {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('asset_group', group)
            .order('position')
          if (error) throw error
          return data as Question[]
        })
      )
    })
  }, [assetId])

  const addPhoto = async () => {
    const shot = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })
    let lat: number | null = null
    let lng: number | null = null
    try {
      const p = await Geolocation.getCurrentPosition({ timeout: 10000 })
      lat = p.coords.latitude
      lng = p.coords.longitude
    } catch {}
    setPhotos(p => [...p, { dataUrl: shot.dataUrl!, lat, lng, takenAt: new Date().toISOString() }])
  }

  const result = preview(qs, ans)
  const ready = qs.length > 0 && qs.every(q => ans[q.code]) && photos.length >= MIN_PHOTOS

  const save = async () => {
    await enqueue({
      id: crypto.randomUUID(),
      assetId: assetId!,
      inspectedAt: new Date().toISOString(),
      notes,
      answers: ans,
      photos,
      submitted: false
    })
    nav('/assignments')
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">{asset?.name}</h2>
      <p className="text-xs text-gray-500">{asset?.asset_code}</p>
      {qs.map(q => (
        <div key={q.code} className="rounded border p-3">
          <div className="text-xs uppercase text-gray-500">
            {q.category}
            {q.is_critical && ' · critical'}
          </div>
          <div className="mb-2">{q.text_en}</div>
          <div className="flex flex-wrap gap-1">
            {OPTIONS.map(o => (
              <button
                key={o}
                onClick={() => setAns(a => ({ ...a, [q.code]: o }))}
                className={`rounded border px-2 py-1 text-sm ${ans[q.code] === o ? 'bg-green-700 text-white' : ''}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <button className="rounded border px-3 py-2" onClick={addPhoto}>
          Take photo ({photos.length}/{MIN_PHOTOS} minimum)
        </button>
        <div className="mt-2 flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <img key={i} src={p.dataUrl} className="h-16 w-16 rounded object-cover" />
          ))}
        </div>
      </div>
      <textarea className="w-full rounded border p-2" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
      {result && (
        <p className="font-semibold">
          Grade {result.grade} · {result.score}%{result.crit && ' · DANGEROUS FAILURE'}
        </p>
      )}
      <button disabled={!ready} onClick={save} className="w-full rounded bg-green-700 p-3 text-white disabled:opacity-40">
        Save inspection
      </button>
    </div>
  )
        }
