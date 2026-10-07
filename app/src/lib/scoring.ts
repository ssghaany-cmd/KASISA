// Mirrors submit_inspection() in the database so the officer sees the grade before saving.
export type Answer = 'good' | 'fair' | 'poor' | 'failed' | 'na'
export type Question = {
  id: number
  code: string
  category: string
  text_en: string
  text_ha: string | null
  section_weight: number
  is_critical: boolean
}

const pts: Record<Answer, number> = { good: 100, fair: 60, poor: 25, failed: 0, na: 0 }
const DANGEROUS_CAP = 39

export const gradeFor = (s: number) =>
  s >= 85 ? 'A' : s >= 70 ? 'B' : s >= 55 ? 'C' : s >= 40 ? 'D' : s >= 30 ? 'E' : 'F'

export function preview(qs: Question[], a: Record<string, Answer>) {
  const sec: Record<string, { sum: number; n: number; w: number }> = {}
  let crit = false
  for (const q of qs) {
    const v = a[q.code]
    if (!v || v === 'na') continue
    const s = (sec[q.category] ??= { sum: 0, n: 0, w: q.section_weight })
    s.sum += pts[v]
    s.n += 1
    if (q.is_critical && v === 'failed') crit = true
  }
  let num = 0, den = 0, rated = 0
  for (const s of Object.values(sec)) {
    num += (s.sum / s.n) * s.w
    den += s.w
    rated += s.n
  }
  if (!den) return null
  const raw = Math.round((num / den) * 10) / 10
  const score = crit && raw > DANGEROUS_CAP ? DANGEROUS_CAP : raw
  return { score, grade: gradeFor(score), crit, rated }
}
