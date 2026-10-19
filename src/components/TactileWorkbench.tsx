import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { StickyNote } from './StickyNote'
import { Heart, Users, Pin, Stamp, Database, Radio, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import {
  isSupabaseConfigured,
  supabase,
  getAndIncrementViewCount,
  fetchStickyNotes,
  insertStickyNote,
  subscribeToRealtimeNotes,
  type DbStickyNote,
} from '../lib/supabase'

export function TactileWorkbench() {
  const [visitorCount, setVisitorCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [pinnedNotes, setPinnedNotes] = useState<DbStickyNote[]>([])
  const [authorInput, setAuthorInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [selectedColor, setSelectedColor] = useState<'cream' | 'yellow' | 'pink' | 'mint'>('yellow')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize view count and load persistent notes starting from 0
  useEffect(() => {
    let mounted = true

    async function initWorkbench() {
      // 1. Fetch & increment real view count
      const count = await getAndIncrementViewCount()
      if (mounted) {
        setVisitorCount(count)
      }

      // 2. Fetch persistent notes
      const notes = await fetchStickyNotes()
      if (mounted) {
        setPinnedNotes(notes)
      }
    }

    initWorkbench()

    // 3. Subscribe to Realtime notes if Supabase is active
    const unsubscribe = subscribeToRealtimeNotes((newNote) => {
      if (mounted) {
        setPinnedNotes((prev) => {
          // Avoid duplicate note if already added locally
          if (prev.some((n) => n.id === newNote.id || (n.text === newNote.text && n.author === newNote.author))) {
            return prev
          }
          sounds.playChime(880, 0.3)
          return [newNote, ...prev]
        })
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const handleGiveHighFive = (e: React.MouseEvent) => {
    sounds.playFanfare()
    setVisitorCount((c) => {
      const updated = c + 1
      if (typeof window !== 'undefined') {
        localStorage.setItem('cutobot_visitors_v2', String(updated))
      }
      return updated
    })
    setHasLiked(true)

    if (isSupabaseConfigured && supabase) {
      const sb = supabase
      sb.from('site_stats')
        .select('high_fives')
        .eq('id', 'global')
        .single()
        .then(({ data }) => {
          if (data) {
            sb.from('site_stats')
              .update({ high_fives: (Number(data.high_fives) || 0) + 1 })
              .eq('id', 'global')
          }
        })
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#f43f5e', '#00f0b5', '#f59e0b', '#38bdf8'],
    })
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim() || isSubmitting) return

    setIsSubmitting(true)
    sounds.playClick(900)

    const notePayload = {
      author: authorInput.trim() || 'Anonymous Tinker',
      text: textInput.trim(),
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 4,
    }

    // Insert to Supabase (or fallback to local storage)
    const savedNote = await insertStickyNote(notePayload)

    setPinnedNotes((prev) => [savedNote, ...prev.filter((n) => n.id !== savedNote.id)])
    setTextInput('')
    setAuthorInput('')
    setIsSubmitting(false)

    confetti({
      particleCount: 30,
      spread: 60,
      colors: ['#00f0b5', '#f59e0b', '#ec4899'],
    })
  }

  return (
    <section id="workbench" className="py-16 px-4 max-w-6xl mx-auto">
      {/* Section Header with Oversized Typography */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-[#fef08a] border-2 border-[#854d0e] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#854d0e] shadow-[2px_2px_0px_#854d0e] mb-3"
        >
          <Pin className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Tactile Workbench • Sweet-Tape & Database</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-extrabold text-[#2b1d14] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          COMMUNITY PEGBOARD.
        </motion.h2>

        <p className="text-sm sm:text-base text-[#5c4033] font-mono mt-1 max-w-xl mx-auto">
          Leave a sweet-tape note for Bolt and watch live workshop visitors tick up in real time!
        </p>

        {/* Database Live Connection Status Badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold">
          {isSupabaseConfigured ? (
            <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Postgres Live • Realtime Synchronized</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 border-amber-300">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Offline/Demo Mode (Ready for Supabase credentials)</span>
            </div>
          )}
        </div>
      </div>

      {/* TOP ROW: LIVE VISITOR COUNTER & STICKER DECK */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 items-stretch">
        {/* RETRO 7-SEGMENT / MECHANICAL ODOMETER VISITOR COUNTER */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="md:col-span-6 bg-[#2b1d14] border-4 border-[#5c4033] rounded-2xl p-6 shadow-[6px_6px_0px_#5c4033] flex flex-col justify-between text-white relative overflow-hidden"
        >
          {/* Washi tape on counter */}
          <div className="absolute -top-3 left-6 px-4 py-0.5 bg-[#fef08a] border border-[#a16207]/40 shadow-xs rotate-[-1deg] text-[10px] font-mono font-bold uppercase text-[#854d0e]">
            Unit-B04 Telemetry
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#00f0b5] uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Live Workshop Visitors
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400">
                  {isSupabaseConfigured ? 'Global Postgres' : 'Live Counter'}
                </span>
              </div>
            </div>

            {/* Retro Number Tumbler */}
            <div className="flex items-center justify-center gap-2 my-4">
              {String(visitorCount)
                .padStart(6, '0')
                .split('')
                .map((digit, i) => (
                  <div
                    key={i}
                    className="w-10 sm:w-12 h-14 bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#18181b] border-2 border-[#5c4033] rounded-lg shadow-inner flex items-center justify-center font-mono font-extrabold text-2xl sm:text-3xl text-[#00f0b5] relative overflow-hidden"
                  >
                    {/* Horizontal split divider like flip clock */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[#27272a]" />
                    <span className="z-10 drop-shadow-[0_0_8px_#00f0b5]">
                      {digit}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* High-Five Action */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-700/60">
            <span className="text-[11px] font-mono text-zinc-400">
              {hasLiked ? '🎉 You high-fived Bolt!' : 'Give Bolt a high-five!'}
            </span>
            <button
              onClick={handleGiveHighFive}
              className="px-4 py-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white border-2 border-[#881337] rounded-lg font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#881337] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>High-Five (+1)</span>
            </button>
          </div>
        </motion.div>

        {/* TACTILE PEELABLE STICKER MAT */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-6 bg-[#fffaf3] border-4 border-[#5c4033] rounded-2xl p-6 shadow-[6px_6px_0px_#5c4033] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#5c4033] uppercase tracking-wider flex items-center gap-1.5">
                <Stamp className="w-4 h-4 text-[#a34063]" /> Workshop Sticker Collection
              </span>
              <span className="text-[10px] font-mono text-[#a34063] bg-pink-100 border border-pink-300 px-2 py-0.5 rounded-full">
                Sweet-Tape Edition
              </span>
            </div>

            <div className="rounded-xl border-2 border-dashed border-[#5c4033]/40 p-2 bg-[#fdf5e6] overflow-hidden">
              <img
                src="/assets/cutobot_stickers.jpg"
                alt="Die-cut sticker sheet with CutoBot, Music Box, and Sparkle Rattle"
                className="w-full h-auto object-cover rounded-lg shadow-inner"
              />
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-[#5c4033]/80 flex items-center justify-between">
            <span>✨ Tactile die-cut enamel finishes</span>
            <span className="font-bold text-[#a34063]">haX.baby 2026</span>
          </div>
        </motion.div>
      </div>

      {/* COMMUNITY GUESTBOOK PEGBOARD */}
      <div className="relative bg-[#f5e8d3] border-4 border-[#5c4033] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#5c4033]">
        {/* Pegboard Hole Matrix Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#5c4033_2px,transparent_2px)] [background-size:24px_24px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Note Submission Form */}
          <div className="lg:col-span-5 bg-[#fffaf3] border-2 border-[#5c4033] rounded-xl p-5 shadow-[4px_4px_0px_#5c4033]">
            {/* Washi tape header */}
            <div className="w-24 h-4 bg-[#fde047]/80 border border-[#a16207]/30 mx-auto -mt-7 mb-3 rotate-1" />

            <h3 className="font-bold text-base text-[#5c4033] mb-1">
              Tape a Note to Bolt's Board
            </h3>
            <p className="text-xs text-[#5c4033]/70 font-mono mb-4">
              Write a message or cheer for the baby robot! {isSupabaseConfigured && 'Synced globally in real time.'}
            </p>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5c4033] mb-1">
                  Your Nickname / Handle:
                </label>
                <input
                  type="text"
                  maxLength={30}
                  placeholder="e.g. TinkerBelle, SolderKing"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-[#5c4033] bg-white font-mono text-xs text-[#2b1d14] focus:outline-none focus:ring-2 focus:ring-[#00f0b5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5c4033] mb-1">
                  Message:
                </label>
                <textarea
                  required
                  maxLength={140}
                  rows={3}
                  placeholder="Leave a sweet note or circuit advice..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-[#5c4033] bg-white font-sans text-xs text-[#2b1d14] focus:outline-none focus:ring-2 focus:ring-[#00f0b5]"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5c4033] mb-1">
                  Sticky Note Color:
                </label>
                <div className="flex gap-2">
                  {(['yellow', 'mint', 'pink', 'cream'] as const).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        sounds.playClick(900)
                        setSelectedColor(c)
                      }}
                      className={`w-7 h-7 rounded border-2 border-[#5c4033] transition-transform cursor-pointer ${
                        c === 'yellow'
                          ? 'bg-[#fef08a]'
                          : c === 'mint'
                          ? 'bg-[#a7f3d0]'
                          : c === 'pink'
                          ? 'bg-[#fbcfe8]'
                          : 'bg-[#fffaf3]'
                      } ${selectedColor === c ? 'scale-115 ring-2 ring-[#5c4033]' : 'hover:scale-105'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-[#00f0b5] hover:bg-[#00d8a3] text-[#2b1d14] font-mono text-xs font-bold uppercase rounded-lg border-2 border-[#5c4033] shadow-[3px_3px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition-all mt-2 cursor-pointer disabled:opacity-50"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Taping...' : 'Tape Note to Board'}</span>
              </button>
            </form>
          </div>

          {/* Pegboard Pinned Sticky Notes Grid */}
          <div className="lg:col-span-7">
            {pinnedNotes.length === 0 ? (
              <div className="h-full min-h-[220px] bg-[#fffaf3]/70 border-2 border-dashed border-[#5c4033]/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#fef08a] border-2 border-[#5c4033] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#5c4033]">
                  <Sparkles className="w-6 h-6 text-[#854d0e]" />
                </div>
                <h4 className="font-extrabold text-[#2b1d14] text-base mb-1">
                  Pegboard is Fresh & Clean!
                </h4>
                <p className="text-xs text-[#5c4033] font-mono max-w-xs mb-3">
                  0 notes taped so far. Be the very first human to tape a note on Bolt's workbench!
                </p>
                <span className="text-[10px] font-mono font-bold bg-[#dcfce7] text-[#15803d] border border-[#86efac] px-3 py-1 rounded-full shadow-xs">
                  ✨ 0 Notes • Waiting for your spark
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1">
                {pinnedNotes.map((note) => (
                  <StickyNote
                    key={note.id}
                    title={note.author}
                    color={note.color}
                    rotation={note.rotation}
                    tapeColor="kraft"
                    className="transition-transform hover:scale-103"
                  >
                    <p className="font-hand text-lg leading-tight text-[#2b1d14]">
                      "{note.text}"
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-[#5c4033]/60 text-right">
                      {note.timestamp}
                    </div>
                  </StickyNote>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
