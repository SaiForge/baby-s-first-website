import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface DbStickyNote {
  id: string
  author: string
  text: string
  color: 'cream' | 'yellow' | 'pink' | 'mint' | 'cyan'
  rotation: number
  created_at?: string
  timestamp?: string
}

// Start with 0 default notes — only genuine user-created notes appear!
const DEFAULT_NOTES: DbStickyNote[] = []

/**
 * Fetch and increment the global view count starting from 0.
 * If Supabase is connected, calls the atomic increment_views RPC or direct table increment.
 * Otherwise falls back to localStorage.
 */
export async function getAndIncrementViewCount(): Promise<number> {
  const fallbackCount = () => {
    if (typeof window === 'undefined') return 1
    const saved = localStorage.getItem('cutobot_visitors_v2')
    const count = saved ? parseInt(saved, 10) + 1 : 1
    localStorage.setItem('cutobot_visitors_v2', String(count))
    return count
  }

  if (!supabase) {
    return fallbackCount()
  }

  try {
    // 1. Try atomic RPC increment_views
    const { data, error } = await supabase.rpc('increment_views')
    if (!error && data !== null) {
      return Number(data)
    }

    // 2. Fallback: try direct select & increment from site_stats table
    const { data: stats } = await supabase
      .from('site_stats')
      .select('view_count')
      .eq('id', 'global')
      .single()

    if (stats) {
      const current = typeof stats.view_count === 'number' ? stats.view_count : 0
      const newCount = current + 1
      await supabase
        .from('site_stats')
        .update({ view_count: newCount, updated_at: new Date().toISOString() })
        .eq('id', 'global')
      return newCount
    } else {
      // Create initial row with 1
      await supabase
        .from('site_stats')
        .insert({ id: 'global', view_count: 1, high_fives: 0 })
      return 1
    }
  } catch (err) {
    console.warn('Supabase view count error, falling back to local:', err)
    return fallbackCount()
  }
}

/**
 * Fetch all persistent sticky notes from Supabase or localStorage.
 * Starts with 0 notes.
 */
export async function fetchStickyNotes(): Promise<DbStickyNote[]> {
  const fallbackNotes = () => {
    if (typeof window === 'undefined') return DEFAULT_NOTES
    const saved = localStorage.getItem('cutobot_guestbook_v2')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // use empty
      }
    }
    return DEFAULT_NOTES
  }

  if (!supabase) {
    return fallbackNotes()
  }

  try {
    const { data, error } = await supabase
      .from('sticky_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) {
      return fallbackNotes()
    }

    return data.map((n) => ({
      id: String(n.id),
      author: n.author || 'Anonymous Tinker',
      text: n.text,
      color: n.color || 'yellow',
      rotation: typeof n.rotation === 'number' ? n.rotation : 0,
      timestamp: n.created_at
        ? new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Recently',
    }))
  } catch (err) {
    console.warn('Supabase fetch notes error, falling back to local:', err)
    return fallbackNotes()
  }
}

/**
 * Create a new sticky note in Supabase or localStorage.
 */
export async function insertStickyNote(note: Omit<DbStickyNote, 'id'>): Promise<DbStickyNote> {
  const localNote: DbStickyNote = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: 'Just now',
  }

  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('cutobot_guestbook_v2')
    let list: DbStickyNote[] = []
    try {
      list = existing ? JSON.parse(existing) : []
    } catch {
      list = []
    }
    localStorage.setItem('cutobot_guestbook_v2', JSON.stringify([localNote, ...list]))
  }

  if (!supabase) {
    return localNote
  }

  try {
    const { data, error } = await supabase
      .from('sticky_notes')
      .insert({
        author: note.author,
        text: note.text,
        color: note.color,
        rotation: note.rotation,
      })
      .select()
      .single()

    if (error || !data) {
      console.warn('Could not persist to Supabase, used local:', error)
      return localNote
    }

    return {
      id: String(data.id),
      author: data.author,
      text: data.text,
      color: data.color,
      rotation: data.rotation,
      timestamp: 'Just now',
      created_at: data.created_at,
    }
  } catch (err) {
    console.warn('Supabase insert note error:', err)
    return localNote
  }
}

/**
 * Subscribe to realtime sticky note additions so when another user posts a note,
 * it immediately appears on all viewing screens without refresh!
 */
export function subscribeToRealtimeNotes(onNewNote: (note: DbStickyNote) => void): () => void {
  if (!supabase) return () => {}

  try {
    const channel = supabase
      .channel('sticky_notes_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sticky_notes' },
        (payload) => {
          const n = payload.new as Record<string, unknown>
          if (n && n.id) {
            onNewNote({
              id: String(n.id),
              author: String(n.author || 'Anonymous Tinker'),
              text: String(n.text || ''),
              color: (n.color as DbStickyNote['color']) || 'yellow',
              rotation: typeof n.rotation === 'number' ? n.rotation : 0,
              timestamp: 'Just now',
              created_at: String(n.created_at || ''),
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch (err) {
    console.warn('Realtime subscription error:', err)
    return () => {}
  }
}
