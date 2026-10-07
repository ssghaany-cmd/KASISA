import { get, set } from 'idb-keyval'
import { supabase } from './supabase'

export type Photo = { dataUrl: string; lat: number | null; lng: number | null; takenAt: string }
export type Pending = {
  id: string
  assetId: string
  inspectedAt: string
  notes: string
  answers: Record<string, string>
  photos: Photo[]
  submitted: boolean
}

const KEY = 'pending-inspections'
export const getQueue = async () => (await get<Pending[]>(KEY)) ?? []
const save = async (item: Pending) =>
  set(KEY, (await getQueue()).map(i => (i.id === item.id ? item : i)))
const remove = async (id: string) => set(KEY, (await getQueue()).filter(i => i.id !== id))

export async function enqueue(p: Pending) {
  await set(KEY, [...(await getQueue()), p])
  void syncQueue()
}

let syncing = false
export async function syncQueue() {
  if (syncing || !navigator.onLine) return
  syncing = true
  try {
    for (const item of await getQueue()) {
      try {
        if (!item.submitted) {
          // Safe to retry: the server ignores a repeated id
          const { error } = await supabase.rpc('submit_inspection', {
            p_id: item.id,
            p_asset: item.assetId,
            p_inspected_at: item.inspectedAt,
            p_notes: item.notes,
            p_answers: item.answers
          })
          if (error) throw error
          item.submitted = true
          await save(item)
        }
        while (item.photos.length) {
          const ph = item.photos[0]
          const path = `${item.id}/${Date.parse(ph.takenAt)}.jpg`
          const blob = await (await fetch(ph.dataUrl)).blob()
          const up = await supabase.storage
            .from('inspection-photos')
            .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
          if (up.error) throw up.error
          const ins = await supabase.from('inspection_photos').insert({
            inspection_id: item.id,
            storage_path: path,
            taken_at: ph.takenAt,
            location: ph.lat != null ? `SRID=4326;POINT(${ph.lng} ${ph.lat})` : null
          })
          if (ins.error) throw ins.error
          item.photos.shift()
          await save(item)
        }
        await remove(item.id)
      } catch (e) {
        console.warn('Sync paused, will retry', e)
        break
      }
    }
  } finally {
    syncing = false
  }
        }
