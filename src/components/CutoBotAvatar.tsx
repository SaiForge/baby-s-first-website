import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { sounds } from '../audio/soundEffects'
import { Sparkles } from 'lucide-react'

export type MoodType = 'happy' | 'sleepy' | 'excited' | 'overcharged'

interface CutoBotAvatarProps {
  mood?: MoodType
  onMoodChange?: (mood: MoodType) => void
  batteryLevel?: number // 0 to 120
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const QUOTES = [
  "Beep boop! Found a 10k resistor!",
  "Small circuits, bright sparks! ✨",
  "Sunbeams taste like warm lemon drops!",
  "Unit-B04 reporting for tinkering duty!",
  "Don't worry, my treads have baby grip!",
  "Calculating meaning of tickles... (100%)",
  "Assembled with love in a midnight garage! 🌙",
  "Is that solder wire or licorice?",
]

export function CutoBotAvatar({
  mood = 'happy',
  onMoodChange,
  batteryLevel = 84,
  size = 'lg',
  interactive = true,
}: CutoBotAvatarProps) {
  const [currentMood, setCurrentMood] = useState<MoodType>(mood)
  const [speech, setSpeech] = useState<string>("Small circuits, bright sparks! ✨")
  const [antennaWobble, setAntennaWobble] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const botRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  // Mouse tracking for LED eye visor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return
      const rect = botRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height * 0.35 // visor height

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const angle = Math.atan2(dy, dx)
      const dist = Math.min(Math.hypot(dx, dy) / 40, 1)

      // Clamp eye shift within visor
      const maxShift = 9
      setEyeOffset({
        x: Math.cos(angle) * dist * maxShift,
        y: Math.sin(angle) * dist * maxShift,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Antenna boing & celebration
  const handleAntennaClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    sounds.playBoing()
    setAntennaWobble(true)
    setTimeout(() => setAntennaWobble(false), 700)

    // Trigger colorful confetti celebration!
    confetti({
      particleCount: 45,
      spread: 60,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#00f0b5', '#f59e0b', '#38bdf8', '#f43f5e', '#a34063'],
    })

    const newMood: MoodType = 'excited'
    setCurrentMood(newMood)
    onMoodChange?.(newMood)
    setSpeech("BOING! My antenna caught a cosmic radio wave! 📡")
  }

  // Poke CutoBot body
  const handleBodyClick = () => {
    sounds.playSqueak()
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setSpeech(randomQuote)

    // Cycle mood playfully
    const moods: MoodType[] = ['happy', 'excited', 'sleepy']
    const nextMood = moods[(moods.indexOf(currentMood) + 1) % moods.length]
    setCurrentMood(nextMood)
    onMoodChange?.(nextMood)
  }

  // Size scaling
  const scale = size === 'sm' ? 0.6 : size === 'md' ? 0.8 : 1.0

  // Mood-dependent LED colors
  const moodColors = {
    happy: { led: '#00f0b5', glow: 'rgba(0,240,181,0.5)', label: 'Happy' },
    sleepy: { led: '#f59e0b', glow: 'rgba(245,158,11,0.5)', label: 'Sleepy' },
    excited: { led: '#f43f5e', glow: 'rgba(244,63,94,0.6)', label: 'Excited' },
    overcharged: { led: '#38bdf8', glow: 'rgba(56,189,248,0.7)', label: 'Overcharged' },
  }[currentMood]

  return (
    <div
      ref={botRef}
      className="relative inline-flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Speech Bubble (Sweet-tape styled) */}
      <div className="relative mb-3 max-w-xs animate-bounce-subtle">
        <div className="relative bg-[#fff8f1] border-2 border-[#5c4033] px-4 py-2 shadow-[3px_3px_0px_#5c4033] rounded-xl text-center">
          <p className="font-mono text-xs font-semibold text-[#5c4033] tracking-tight">
            {speech}
          </p>
          {/* Speech bubble beak */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fff8f1] border-r-2 border-b-2 border-[#5c4033] rotate-45"></div>
        </div>
      </div>

      {/* Robot SVG Graphics */}
      <div
        onClick={handleBodyClick}
        className="relative cursor-pointer transition-transform duration-200 active:scale-95"
        title="Click CutoBot to tickle!"
      >
        <svg
          width="260"
          height="320"
          viewBox="0 0 260 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="copperBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e5d0" />
              <stop offset="50%" stopColor="#d9be9b" />
              <stop offset="100%" stopColor="#b69168" />
            </linearGradient>
            <linearGradient id="treadDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d2c20" />
              <stop offset="50%" stopColor="#5c4033" />
              <stop offset="100%" stopColor="#2b1d14" />
            </linearGradient>
            <linearGradient id="solarCell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* FLOPPY ANTENNA (Spring coiled with clickable top bulb) */}
          <g
            id="antenna-group"
            onClick={handleAntennaClick}
            className={`cursor-pointer group transition-transform ${
              antennaWobble ? 'animate-boing' : 'hover:rotate-6'
            }`}
            style={{ transformOrigin: '130px 65px' }}
          >
            {/* Spring Coil stem */}
            <path
              d="M130 65 Q125 50 135 40 Q125 30 135 22 Q126 14 130 8"
              stroke="#5c4033"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Magnetic Tip Base */}
            <rect x="124" y="6" width="12" height="4" rx="2" fill="#d97706" />
            {/* Antenna Top Glowing Orb */}
            <circle
              cx="130"
              cy="6"
              r="8"
              fill={currentMood === 'overcharged' ? '#f59e0b' : '#f43f5e'}
              stroke="#5c4033"
              strokeWidth="2.5"
              className="group-hover:scale-125 transition-transform"
            />
            <circle cx="128" cy="4" r="2.5" fill="#ffffff" opacity="0.8" />
          </g>

          {/* SOLAR BACKPACK (peeking on side) */}
          <g id="solar-backpack">
            <rect
              x="180"
              y="110"
              width="36"
              height="70"
              rx="6"
              fill="url(#solarCell)"
              stroke="#5c4033"
              strokeWidth="3"
            />
            {/* Solar panel grid lines */}
            <line x1="180" y1="130" x2="216" y2="130" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
            <line x1="180" y1="155" x2="216" y2="155" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
            <line x1="198" y1="110" x2="198" y2="180" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
            {/* Mini blinking status LED */}
            <circle cx="210" cy="116" r="2.5" fill="#10b981" />
          </g>

          {/* TANK TREADS (FEET) */}
          <g id="treads">
            {/* Left Tread */}
            <rect
              x="30"
              y="250"
              width="60"
              height="40"
              rx="12"
              fill="url(#treadDark)"
              stroke="#2b1d14"
              strokeWidth="3"
            />
            {/* Right Tread */}
            <rect
              x="170"
              y="250"
              width="60"
              height="40"
              rx="12"
              fill="url(#treadDark)"
              stroke="#2b1d14"
              strokeWidth="3"
            />
            {/* Tread Wheel Axles */}
            <circle cx="48" cy="270" r="10" fill="#d9be9b" stroke="#5c4033" strokeWidth="2.5" />
            <circle cx="72" cy="270" r="10" fill="#d9be9b" stroke="#5c4033" strokeWidth="2.5" />
            <circle cx="188" cy="270" r="10" fill="#d9be9b" stroke="#5c4033" strokeWidth="2.5" />
            <circle cx="212" cy="270" r="10" fill="#d9be9b" stroke="#5c4033" strokeWidth="2.5" />
            {/* Center axle bolts */}
            <circle cx="48" cy="270" r="3" fill="#5c4033" />
            <circle cx="72" cy="270" r="3" fill="#5c4033" />
            <circle cx="188" cy="270" r="3" fill="#5c4033" />
            <circle cx="212" cy="270" r="3" fill="#5c4033" />
          </g>

          {/* MAIN CHASSIS / TORSO */}
          <g id="torso">
            <rect
              x="55"
              y="160"
              width="150"
              height="105"
              rx="18"
              fill="url(#copperBody)"
              stroke="#5c4033"
              strokeWidth="3.5"
            />
            {/* Rivets on Torso */}
            <circle cx="65" cy="172" r="2.5" fill="#5c4033" />
            <circle cx="195" cy="172" r="2.5" fill="#5c4033" />
            <circle cx="65" cy="252" r="2.5" fill="#5c4033" />
            <circle cx="195" cy="252" r="2.5" fill="#5c4033" />

            {/* Circuit Tinker Inspection Hatch */}
            <rect
              x="80"
              y="180"
              width="100"
              height="70"
              rx="8"
              fill="#2b1d14"
              stroke="#5c4033"
              strokeWidth="2"
            />

            {/* Glowing Gear & Heart indicator inside hatch */}
            <circle cx="130" cy="205" r="16" fill="#382419" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" />
            <path
              d="M130 198 C130 195 125 192 122 195 C118 198 118 204 130 213 C142 204 142 198 138 195 C135 192 130 195 130 198 Z"
              fill="#f43f5e"
              className="animate-pulse"
            />

            {/* Battery Level Mini-Bar */}
            <rect x="90" y="235" width="80" height="7" rx="3.5" fill="#18181b" stroke="#5c4033" strokeWidth="1" />
            <rect
              x="91"
              y="236"
              width={Math.min(78, (78 * batteryLevel) / 100)}
              height="5"
              rx="2.5"
              fill={batteryLevel > 90 ? '#10b981' : batteryLevel > 40 ? '#f59e0b' : '#ef4444'}
            />
          </g>

          {/* ARMS WITH COPPER JOINTS */}
          <g id="arms">
            {/* Left Arm (Waving) */}
            <path
              d="M55 175 C30 165 20 135 25 115"
              stroke="#5c4033"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Clamp / Hand */}
            <circle cx="25" cy="115" r="7" fill="#d97706" stroke="#5c4033" strokeWidth="2" />
            <path d="M20 110 Q28 105 32 112" stroke="#5c4033" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M20 120 Q28 125 32 118" stroke="#5c4033" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Right Arm (Resting on hip) */}
            <path
              d="M205 175 C225 185 235 210 220 225"
              stroke="#5c4033"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="220" cy="225" r="7" fill="#d97706" stroke="#5c4033" strokeWidth="2" />
          </g>

          {/* ROUNDED DOME HEAD */}
          <g id="head">
            {/* Dome Shell */}
            <path
              d="M50 145 C50 85 85 65 130 65 C175 65 210 85 210 145 Z"
              fill="url(#copperBody)"
              stroke="#5c4033"
              strokeWidth="3.5"
            />
            {/* Rivets on Head Rim */}
            <circle cx="60" cy="140" r="2.5" fill="#5c4033" />
            <circle cx="95" cy="142" r="2.5" fill="#5c4033" />
            <circle cx="130" cy="143" r="2.5" fill="#5c4033" />
            <circle cx="165" cy="142" r="2.5" fill="#5c4033" />
            <circle cx="200" cy="140" r="2.5" fill="#5c4033" />

            {/* HEADPHONE / EAR PIECES */}
            <rect x="42" y="105" width="10" height="28" rx="5" fill="#d97706" stroke="#5c4033" strokeWidth="2" />
            <rect x="208" y="105" width="10" height="28" rx="5" fill="#d97706" stroke="#5c4033" strokeWidth="2" />

            {/* BLACK GLASS VISOR */}
            <rect
              x="65"
              y="85"
              width="130"
              height="48"
              rx="12"
              fill="#0d1117"
              stroke="#5c4033"
              strokeWidth="2.5"
            />

            {/* Specular glare reflection across visor */}
            <path
              d="M72 89 L125 89 L105 110 L72 110 Z"
              fill="#ffffff"
              opacity="0.12"
            />

            {/* DYNAMIC LED EYE VISOR (Tracks Cursor & Mood) */}
            <g
              id="led-eyes"
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                transition: 'transform 0.08s ease-out',
              }}
            >
              {currentMood === 'happy' && (
                <>
                  {/* Left smiling arch eye */}
                  <path
                    d="M90 112 Q100 96 110 112"
                    stroke={moodColors.led}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#ledGlow)"
                  />
                  {/* Right smiling arch eye */}
                  <path
                    d="M150 112 Q160 96 170 112"
                    stroke={moodColors.led}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#ledGlow)"
                  />
                  {/* Cute blush cheeks */}
                  <circle cx="85" cy="118" r="4" fill="#f43f5e" opacity="0.6" />
                  <circle cx="175" cy="118" r="4" fill="#f43f5e" opacity="0.6" />
                </>
              )}

              {currentMood === 'sleepy' && (
                <>
                  {/* Sleepy straight/droopy lines */}
                  <line
                    x1="90"
                    y1="110"
                    x2="110"
                    y2="110"
                    stroke={moodColors.led}
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#ledGlow)"
                  />
                  <line
                    x1="150"
                    y1="110"
                    x2="170"
                    y2="110"
                    stroke={moodColors.led}
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#ledGlow)"
                  />
                  <text x="180" y="98" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    z
                  </text>
                  <text x="190" y="90" fill="#f59e0b" fontSize="14" fontFamily="monospace" fontWeight="bold">
                    Z
                  </text>
                </>
              )}

              {currentMood === 'excited' && (
                <>
                  {/* Starburst eyes */}
                  <path
                    d="M100 98 L103 107 L112 107 L105 112 L108 120 L100 115 L92 120 L95 112 L88 107 L97 107 Z"
                    fill={moodColors.led}
                    filter="url(#ledGlow)"
                  />
                  <path
                    d="M160 98 L163 107 L172 107 L165 112 L168 120 L160 115 L152 120 L155 112 L148 107 L157 107 Z"
                    fill={moodColors.led}
                    filter="url(#ledGlow)"
                  />
                </>
              )}

              {currentMood === 'overcharged' && (
                <>
                  {/* Lightning eyes */}
                  <path
                    d="M95 98 L106 108 L100 110 L108 122"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#ledGlow)"
                  />
                  <path
                    d="M155 98 L166 108 L160 110 L168 122"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#ledGlow)"
                  />
                </>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Mood Selector Pill Switcher (Tactile sweet-tape micro-interaction) */}
      {interactive && (
        <div className="mt-4 flex items-center gap-1.5 bg-[#fff8f1] border-2 border-[#5c4033] p-1.5 rounded-full shadow-[3px_3px_0px_#5c4033]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5c4033] px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#f59e0b]" /> Mood:
          </span>
          {(['happy', 'sleepy', 'excited', 'overcharged'] as MoodType[]).map((m) => {
            const active = currentMood === m
            return (
              <button
                key={m}
                onClick={() => {
                  sounds.playClick(880)
                  setCurrentMood(m)
                  onMoodChange?.(m)
                  if (m === 'overcharged') sounds.playZap(2)
                }}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full transition-all duration-150 uppercase ${
                  active
                    ? 'bg-[#5c4033] text-[#fff8f1] shadow-xs'
                    : 'text-[#5c4033] hover:bg-[#5c4033]/10'
                }`}
              >
                {m}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
