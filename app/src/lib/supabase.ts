import { createClient } from '@supabase/supabase-js'

// Placeholders let the app open before Supabase is set up.
const url = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'not-configured'
export const supabase = createClient(url, key)
export const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL)
