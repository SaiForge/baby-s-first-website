import { useState, useEffect, useRef } from 'react'
import { sounds } from '../../audio/soundEffects'
import { Play, Pause, RotateCw, Music, Volume2, Sparkles } from 'lucide-react'

// Pentatonic frequencies in Hz (sweet harmonious chimes)
const NOTES = [
  { name: 'C5', freq: 523.25, color: '#f43f5e' },
  { name: 'D5', freq: 587.33, color: '#f59e0b' },
  { name: 'E5', freq: 659.25, color: '#10b981' },
  { name: 'G5', freq: 783.99, color: '#00f0b5' },
  { name: 'A5', freq: 880.00, color: '#38bdf8' },
  { name: 'C6', freq: 1046.50, color: '#a855f7' },
]

const PRESET_SONGS: { [key: string]: number[] } = {
  'Twinkle Circuit': [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0, -1],
  'Binary Dream': [0, 2, 3, 4, 5, 4, 3, 2, 0, 3, 2, 0, 1, 2, 0, -1],
  'Sunbeam Waltz': [2, 3, 4, 2, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 2, -1],
}

export function ClockworkLullabyBox() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [windEnergy, setWindEnergy] = useState(60) // 0 to 100
  const [gearRotation, setGearRotation] = useState(0)
  const [activeSong, setActiveSong] = useState<string>('Twinkle Circuit')
  const [sequencerGrid, setSequencerGrid] = useState<boolean[][]>(
    Array.from({ length: 6 }, () => Array(8).fill(false))
  )
  const [mode, setMode] = useState<'preset' | 'custom'>('preset')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize a default pattern for custom mode
  useEffect(() => {
    const grid = Array.from({ length: 6 }, () => Array(8).fill(false))
    grid[0][0] = true
    grid[2][2] = true
    grid[3][4] = true
    grid[5][6] = true
    setSequencerGrid(grid)
  }, [])

  // Clockwork playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      // Rotate gears
      setGearRotation((r) => (r + 15) % 360)

      // Consume wind energy
      setWindEnergy((w) => {
        const next = Math.max(0, w - 1.2)
        if (next <= 0) {
          setIsPlaying(false)
        }
        return next
      })

      setCurrentStep((prev) => {
        const next = (prev + 1) % (mode === 'preset' ? 16 : 8)

        if (mode === 'preset') {
          const songNotes = PRESET_SONGS[activeSong]
          const noteIdx = songNotes[next]
          if (noteIdx >= 0 && noteIdx < NOTES.length) {
            sounds.playChime(NOTES[noteIdx].freq, 0.45)
          }
        } else {
          // Custom sequencer step
          sequencerGrid.forEach((row, rowIdx) => {
            if (row[next]) {
              sounds.playChime(NOTES[rowIdx].freq, 0.4)
            }
          })
        }

        return next
      })
    }, 280)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, activeSong, mode, sequencerGrid])

  const handleWindKey = () => {
    sounds.playClick(650)
    setGearRotation((r) => r + 45)
    setWindEnergy((w) => Math.min(100, w + 20))
  }

  const toggleCell = (row: number, col: number) => {
    sounds.playChime(NOTES[row].freq, 0.3)
    setSequencerGrid((prev) => {
      const copy = prev.map((r) => [...r])
      copy[row][col] = !copy[row][col]
      return copy
    })
  }

  return (
    <div className="relative bg-[#fffaf3] border-2 border-[#5c4033] p-6 shadow-[5px_5px_0px_#5c4033] rounded-xl flex flex-col items-center">
      {/* Top Tape Header */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#bae6fd] border border-[#0369a1]/40 shadow-xs rotate-[1deg] text-[11px] font-mono font-bold uppercase text-[#0369a1] flex items-center gap-1.5">
        <Music className="w-3 h-3 text-[#0284c7]" /> Project #02: Clockwork Lullaby Box
      </div>

      <div className="w-full flex justify-between items-center mt-2 mb-3">
        <div>
          <h4 className="font-bold text-lg text-[#5c4033] tracking-tight">
            Clockwork Lullaby Box
          </h4>
          <p className="text-xs text-[#5c4033]/70 font-mono">
            Web Audio 8-bit soothing chime synthesizer
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fef3c7] border border-[#d97706] px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-[#b45309]">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Spring: {Math.round(windEnergy)}%</span>
        </div>
      </div>

      {/* CLOCKWORK GEARS & WINDING KEY ANIMATION */}
      <div className="w-full relative bg-[#2b1d14] border-2 border-[#5c4033] rounded-xl p-4 flex items-center justify-between mb-4 overflow-hidden">
        {/* Decorative Circuit traces */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00f0b5_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Spinning Mechanical Gears */}
        <div className="flex items-center gap-4 z-10">
          {/* Main Brass Gear */}
          <div
            className="w-16 h-16 rounded-full border-4 border-dashed border-[#d97706] bg-[#78350f] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${gearRotation}deg)` }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-[#f59e0b] bg-[#451a03] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fcd34d]" />
            </div>
          </div>

          {/* Interlocking Secondary Gear */}
          <div
            className="w-10 h-10 rounded-full border-3 border-dashed border-[#00f0b5] bg-[#064e3b] flex items-center justify-center -ml-2 -mt-4 transition-transform duration-200"
            style={{ transform: `rotate(${-gearRotation * 1.5}deg)` }}
          >
            <div className="w-4 h-4 rounded-full bg-[#00f0b5]/50" />
          </div>

          <div className="text-white text-xs font-mono">
            <div className="text-[#00f0b5] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isPlaying ? 'CHIMING...' : 'WOUND & READY'}
            </div>
            <div className="text-white/60 text-[10px]">
              {mode === 'preset' ? activeSong : 'Custom Composition'}
            </div>
          </div>
        </div>

        {/* Tactile Winding Key Button */}
        <button
          onClick={handleWindKey}
          title="Click to wind up spring"
          className="z-10 group relative px-3 py-2 bg-[#d97706] hover:bg-[#b45309] border-2 border-[#fef3c7] text-[#fffaf3] rounded-lg shadow-sm font-mono text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
          <span>Wind Key</span>
        </button>
      </div>

      {/* MODE TABS */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex gap-1.5 bg-[#f5f5f4] border border-[#5c4033] p-1 rounded-lg">
          <button
            onClick={() => {
              sounds.playClick()
              setMode('preset')
            }}
            className={`text-xs font-mono font-bold px-3 py-1 rounded transition-all ${
              mode === 'preset'
                ? 'bg-[#5c4033] text-white'
                : 'text-[#5c4033] hover:bg-black/5'
            }`}
          >
            Lullaby Presets
          </button>
          <button
            onClick={() => {
              sounds.playClick()
              setMode('custom')
            }}
            className={`text-xs font-mono font-bold px-3 py-1 rounded transition-all ${
              mode === 'custom'
                ? 'bg-[#5c4033] text-white'
                : 'text-[#5c4033] hover:bg-black/5'
            }`}
          >
            Chime Matrix (8-Step)
          </button>
        </div>

        {/* Master Play/Pause */}
        <button
          onClick={() => {
            sounds.playClick()
            if (windEnergy <= 5) setWindEnergy(60)
            setIsPlaying(!isPlaying)
          }}
          className={`px-4 py-1.5 border-2 border-[#5c4033] font-mono text-xs font-bold uppercase rounded-lg shadow-[2px_2px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-[#ef4444] text-white'
              : 'bg-[#00f0b5] text-[#2b1d14]'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Play Lullaby'}</span>
        </button>
      </div>

      {/* PRESET SONGS SELECTOR */}
      {mode === 'preset' ? (
        <div className="w-full grid grid-cols-3 gap-2 mb-3">
          {Object.keys(PRESET_SONGS).map((song) => (
            <button
              key={song}
              onClick={() => {
                sounds.playClick(800)
                setActiveSong(song)
                setCurrentStep(0)
              }}
              className={`text-xs font-mono font-semibold p-2 border-2 rounded-lg text-left transition-all ${
                activeSong === song
                  ? 'border-[#5c4033] bg-[#fed7aa] text-[#7c2d12] shadow-xs'
                  : 'border-[#5c4033]/30 bg-white hover:bg-orange-50 text-[#5c4033]'
              }`}
            >
              🎵 {song}
            </button>
          ))}
        </div>
      ) : (
        /* CUSTOM 8-STEP CHIME MATRIX */
        <div className="w-full bg-[#fdfaf3] border-2 border-[#5c4033] rounded-lg p-3 mb-3">
          <div className="grid grid-rows-6 gap-1.5">
            {NOTES.map((note, rowIdx) => (
              <div key={note.name} className="flex items-center gap-2">
                <span className="w-7 text-[11px] font-mono font-bold text-[#5c4033]">
                  {note.name}
                </span>
                <div className="flex-1 grid grid-cols-8 gap-1">
                  {Array.from({ length: 8 }).map((_, colIdx) => {
                    const active = sequencerGrid[rowIdx][colIdx]
                    const isStep = currentStep === colIdx && isPlaying
                    return (
                      <button
                        key={colIdx}
                        onClick={() => toggleCell(rowIdx, colIdx)}
                        className={`h-6 rounded border transition-all ${
                          active
                            ? 'bg-[#00f0b5] border-[#5c4033] shadow-xs'
                            : isStep
                            ? 'bg-[#fef08a] border-[#5c4033]'
                            : 'bg-white border-[#5c4033]/20 hover:border-[#5c4033]'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE PENTATONIC CHIME KEYS (Play manually!) */}
      <div className="w-full pt-3 border-t border-[#5c4033]/20">
        <p className="text-[11px] font-mono text-[#5c4033]/70 mb-2 text-center">
          Tap metal chime tines to play notes manually:
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {NOTES.map((note) => (
            <button
              key={note.name}
              onClick={() => sounds.playChime(note.freq, 0.55)}
              className="py-3 px-1 rounded-md border-2 border-[#5c4033] bg-gradient-to-b from-white to-[#f5f5f4] hover:to-[#e7e5e4] active:translate-y-1 shadow-[2px_2px_0px_#5c4033] text-center font-mono text-xs font-bold text-[#5c4033] transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: note.color }} />
              {note.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
