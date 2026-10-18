import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { Volume2, VolumeX, Sparkles, Sun } from 'lucide-react'

interface NavbarProps {
  isCosmicMode: boolean
  onToggleCosmic: () => void
}

export function Navbar({ isCosmicMode, onToggleCosmic }: NavbarProps) {
  const [muted, setMuted] = useState(sounds.muted)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  // 3D Coin Rotation for Logo
  const logoRotateY = useTransform(smoothProgress, [0, 1], [0, 1080])
  const tapeWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const spoolRotate = useTransform(smoothProgress, [0, 1], [0, 1440])

  useEffect(() => {
    return sounds.subscribe((m) => setMuted(m))
  }, [])

  // Keyboard shortcut 'M' to mute/unmute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea') return
        sounds.toggleMute()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (id: string) => {
    sounds.playClick(900)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fff8f1]/90 border-b-2 border-[#5c4033] shadow-xs transition-colors duration-300">
      {/* Top Hackathon Announcement Ribbon */}
      <div className="w-full bg-[#5c4033] text-[#fff8f1] text-[11px] font-mono py-1 px-4 flex items-center justify-between border-b border-[#382419]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0b5] animate-ping" />
          <span className="font-bold tracking-wider uppercase">haX.baby 48-Hour Hackathon</span>
          <span className="hidden sm:inline opacity-70">| Track 2: Original Character (Baby Robo)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[10px] text-amber-300">Oct 17–19, 2026</span>
          <span className="bg-[#00f0b5] text-[#2b1d14] px-1.5 py-0.2 rounded font-bold text-[9px] uppercase">
            Unit-B04 Online
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Brand / Logo with Pseudo-3D Rotating Disc */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          style={{ perspective: 600 }}
        >
          {/* Pseudo-3D Rotating Logo Coin */}
          <motion.div
            style={{
              rotateY: logoRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="w-9 h-9 rounded-lg bg-[#5c4033] border-2 border-[#5c4033] shadow-[2px_2px_0px_#00f0b5] flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105"
          >
            <div
              style={{ transform: 'translateZ(6px)' }}
              className="w-6 h-4 bg-[#0d1117] rounded-sm flex items-center justify-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0b5] animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0b5] animate-pulse" />
            </div>
            {/* Antenna dot */}
            <div
              style={{ transform: 'translateZ(8px)' }}
              className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f43f5e]"
            />
          </motion.div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#5c4033] group-hover:text-[#a34063] transition-colors">
                CutoBot
              </span>
              <span className="text-[10px] font-mono bg-[#fef08a] text-[#854d0e] border border-[#d97706]/40 px-1 rounded font-bold">
                B-04
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#5c4033]/70 leading-none">
              Junior Circuit Tinker
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-mono font-bold text-[#5c4033]">
          <button
            onClick={() => handleNavClick('character-sheet')}
            className="hover:text-[#a34063] hover:underline transition-colors"
          >
            Character Sheet
          </button>
          <button
            onClick={() => handleNavClick('journey')}
            className="hover:text-[#a34063] hover:underline transition-colors"
          >
            Assembly Journey
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className="hover:text-[#a34063] hover:underline transition-colors"
          >
            Inventions (3+)
          </button>
          <button
            onClick={() => handleNavClick('workbench')}
            className="hover:text-[#a34063] hover:underline transition-colors"
          >
            Tactile Workbench
          </button>
          <button
            onClick={() => handleNavClick('specs')}
            className="hover:text-[#a34063] hover:underline transition-colors"
          >
            Hardware Specs
          </button>
        </nav>

        {/* Right Action Tools: Audio + Astrodither Mode */}
        <div className="flex items-center gap-2">
          {/* Astrodither Cosmic Mode Toggle */}
          <button
            onClick={() => {
              sounds.playClick(1000)
              onToggleCosmic()
            }}
            title={isCosmicMode ? 'Switch to Workbench Cream' : 'Switch to Cosmic Dither Mode'}
            className={`px-2.5 py-1.5 rounded-lg border-2 border-[#5c4033] font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              isCosmicMode
                ? 'bg-[#0f172a] text-[#00f0b5] border-[#00f0b5]'
                : 'bg-[#fffaf3] text-[#5c4033] hover:bg-orange-50'
            }`}
          >
            {isCosmicMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Workbench</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#00f0b5]" />
                <span className="hidden sm:inline">Cosmic Dither</span>
              </>
            )}
          </button>

          {/* Retro Audio Toggle with Equalizer Waveform */}
          <button
            onClick={() => sounds.toggleMute()}
            title={muted ? 'Unmute Sound Effects (or press M)' : 'Mute Sound Effects (or press M)'}
            className={`px-2.5 py-1.5 rounded-lg border-2 border-[#5c4033] font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              muted
                ? 'bg-[#fee2e2] text-[#991b1b]'
                : 'bg-[#dcfce7] text-[#166534]'
            }`}
          >
            {muted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-600 animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-600 animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-emerald-600 animate-pulse delay-150" />
                </div>
                <span className="hidden sm:inline">Audio [M]</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* UNROLLING WASHI TAPE SCROLL PROGRESS BAR (Under Navbar) */}
      <div className="relative w-full h-1.5 bg-[#5c4033]/20 overflow-visible">
        {/* Washi Tape Ribbon Strip */}
        <motion.div
          style={{ width: tapeWidth }}
          className="h-full bg-gradient-to-r from-[#00f0b5] via-[#f59e0b] to-[#f43f5e] relative shadow-xs"
        >
          {/* Rolling mini spool gear indicator at the tape tip */}
          <motion.div
            style={{ rotate: spoolRotate }}
            className="absolute -right-2 -top-1.5 w-4 h-4 rounded-full bg-[#5c4033] border border-[#fef08a] flex items-center justify-center shadow-xs"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0b5]" />
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}
