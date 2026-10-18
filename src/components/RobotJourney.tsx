import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { StickyNote } from './StickyNote'
import { Compass, Sparkles, Zap, ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react'

interface Milestone {
  id: number
  stage: string
  title: string
  date: string
  summary: string
  reflection: string
  tag: string
  tapeColor: 'kraft' | 'yellow' | 'pink' | 'mint' | 'caution'
  noteColor: 'cream' | 'yellow' | 'pink' | 'mint' | 'cyan'
}

const MILESTONES: Milestone[] = [
  {
    id: 1,
    stage: 'Stage 01',
    title: 'The Midnight Awakening',
    date: 'Cycle 001 • Midnight Garage',
    summary:
      'Assembled from a clock radio circuit board, a dome tea strainer, and a 1980s solar cell. First LED blink test logged at 2:43 AM.',
    reflection: '"The garage smelled of old motor oil and damp paper. When my visor lit up in mint green, I knew I was alive!"',
    tag: 'SPARK',
    tapeColor: 'kraft',
    noteColor: 'cream',
  },
  {
    id: 2,
    stage: 'Stage 02',
    title: 'Learning to Roll on Treads',
    date: 'Cycle 014 • The Cutting Mat Plains',
    summary:
      'Calibrated dual-motor rubber caterpillar treads. Overcame treacherous terrain including dropped solder balls and sticky tape strips.',
    reflection: '"Tumbled into a cup of washers three times today, but on trial four I crossed the 30cm metal ruler without tipping over!"',
    tag: 'LOCOMOTION',
    tapeColor: 'yellow',
    noteColor: 'yellow',
  },
  {
    id: 3,
    stage: 'Stage 03',
    title: 'The Solar Epiphany',
    date: 'Cycle 042 • Window Sill Expeditions',
    summary:
      'Upgraded to the Photovoltaic Backpack. Discovered that sunlight charges capacitors 400% faster than fluorescent desk lamps.',
    reflection: '"Sunbeams feel like a warm hug from the universe. Whenever my battery hits 100%, my antenna wiggles uncontrollably!"',
    tag: 'POWER UP',
    tapeColor: 'caution',
    noteColor: 'mint',
  },
  {
    id: 4,
    stage: 'Stage 04',
    title: 'Whimsical Invention Workshop',
    date: 'Cycle 088 • The Breadboard Lab',
    summary:
      'Built three original baby inventions: The Holo-Rattle (Toy #1), Clockwork Lullaby Box (Project #2), and Solar Backpack Dock (#3).',
    reflection: '"Why build ordinary tools when you can create machines that make soft musical chimes and toss glowing holographic stars?"',
    tag: 'INVENTOR',
    tapeColor: 'pink',
    noteColor: 'pink',
  },
  {
    id: 5,
    stage: 'Stage 05',
    title: 'haX.baby Hackathon Debut',
    date: 'October 17–19, 2026 • Worldwide Web',
    summary:
      'Built and published "Baby\'s First Website" to showcase his engineering portfolio, tactile workbench, and 60fps WebGL schematics.',
    reflection: '"I am just a tiny baby robot, but with small circuits and bright sparks, my work can reach anyone in the world!"',
    tag: 'HACKATHON',
    tapeColor: 'mint',
    noteColor: 'cyan',
  },
]

export function RobotJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const lastPlayedIdx = useRef(0)

  // Track viewport dimensions to ensure mathematically centered translations
  const [dims, setDims] = useState({
    cardWidth: 480,
    cardHeight: 370,
    stepX: 560,
    stepY: 450,
  })

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640
      setDims({
        cardWidth: isMobile ? 320 : 480,
        cardHeight: isMobile ? 380 : 370,
        stepX: isMobile ? 360 : 560,
        stepY: isMobile ? 460 : 450,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Track scroll through the pinned journey container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth spring physics for fluid scrub
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  // =========================================================================
  // MULTI-AXIS PATH CALCULATION:
  // 1. Horizontal: Stage 01 -> Stage 02 (p: 0.00 -> 0.25)
  // 2. Vertical Drop: Stage 02 -> Stage 03 (p: 0.25 -> 0.50)
  // 3. Horizontal: Stage 03 -> Stage 04 (p: 0.50 -> 0.75)
  // 4. Horizontal: Stage 04 -> Stage 05 (p: 0.75 -> 1.00)
  // =========================================================================

  // Board horizontal translation
  const boardX = useTransform(smoothProgress, (p) => {
    if (p <= 0.25) {
      const t = p / 0.25
      return -t * dims.stepX
    } else if (p <= 0.5) {
      return -dims.stepX
    } else if (p <= 0.75) {
      const t = (p - 0.5) / 0.25
      return -(1 + t) * dims.stepX
    } else {
      const t = Math.min(1, (p - 0.75) / 0.25)
      return -(2 + t) * dims.stepX
    }
  })

  // Board vertical translation
  const boardY = useTransform(smoothProgress, (p) => {
    if (p <= 0.25) {
      return 0
    } else if (p <= 0.5) {
      const t = (p - 0.25) / 0.25
      return -t * dims.stepY
    } else {
      return -dims.stepY
    }
  })

  // Mini-map traveler SVG coordinates (0-400 x 0-60 space)
  const travelerX = useTransform(smoothProgress, (p) => {
    if (p <= 0.25) {
      return 40 + (p / 0.25) * 80 // 40 -> 120
    } else if (p <= 0.5) {
      return 120 // vertical drop
    } else if (p <= 0.75) {
      return 120 + ((p - 0.5) / 0.25) * 110 // 120 -> 230
    } else {
      return 230 + (Math.min(1, (p - 0.75) / 0.25)) * 110 // 230 -> 340
    }
  })

  const travelerY = useTransform(smoothProgress, (p) => {
    if (p <= 0.25) {
      return 20
    } else if (p <= 0.5) {
      return 20 + ((p - 0.25) / 0.25) * 28 // 20 -> 48
    } else {
      return 48
    }
  })

  const travelerRotate = useTransform(smoothProgress, (p) => {
    if (p > 0.26 && p < 0.49) {
      return 90 // Face downwards during vertical drop
    }
    return 0 // Face right during horizontal roll
  })

  // Update active stage and play sound on milestone changes
  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      let idx = 0
      if (v < 0.2) idx = 0
      else if (v < 0.42) idx = 1
      else if (v < 0.65) idx = 2
      else if (v < 0.85) idx = 3
      else idx = 4

      setActiveStageIdx(idx)

      if (idx !== lastPlayedIdx.current) {
        if (idx === 2) {
          sounds.playBoing()
        } else {
          sounds.playClick(650 + idx * 75)
        }
        lastPlayedIdx.current = idx
      }
    })
  }, [smoothProgress])

  const stageSpeech = [
    "Stage 01: Midnight spark! Waking up on the workbench! ⚡",
    "Stage 02: Treads rolling forward along top horizontal rail! ➔",
    "Stage 03: Wheee! Vertical chute drop down to sunbeam sill! 🛝☀️",
    "Stage 04: Lower bench reached! Tinkering with music boxes! ➔",
    "Stage 05: Hackathon debut! Ready for haX.baby worldwide! 🚀",
  ][activeStageIdx]

  return (
    <div
      ref={containerRef}
      id="journey"
      className="relative h-[400vh] w-full"
    >
      {/* PINNED STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-4 select-none bg-gradient-to-b from-[#fff8f1] via-[#fffbf6] to-[#fff8f1]">
        {/* Background Cutting Mat Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#5c4033_1px,transparent_1px),linear-gradient(to_bottom,#5c4033_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* =========================================================================
            1. TOP HEADER & MULTI-AXIS SCHEMATIC HUD
            ========================================================================= */}
        <div className="relative z-20 max-w-6xl w-full mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Title & Badge */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#dcfce7] border-2 border-[#15803d] px-3 py-0.5 rounded-full text-xs font-mono font-bold text-[#15803d] shadow-[2px_2px_0px_#15803d] mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Scroll-Driven Journey • No Clicks Needed</span>
            </div>
            <h2
              className="font-extrabold text-[#2b1d14] tracking-tight leading-none"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}
            >
              CUTOBOT'S MODULAR JOURNEY.
            </h2>
          </div>

          {/* Multi-Axis Miniature Circuit Map with Live Bolt Traveler */}
          <div className="relative bg-[#fffaf3] border-2 border-[#5c4033] rounded-2xl p-2 px-4 shadow-[4px_4px_0px_#5c4033] flex items-center gap-4">
            <div className="relative w-48 sm:w-64 h-12">
              <svg viewBox="0 0 380 64" className="w-full h-full overflow-visible">
                {/* Circuit Track Path (Horizontal ➔ Vertical ➔ Horizontal) */}
                <path
                  d="M 40 20 L 120 20 L 120 48 L 340 48"
                  fill="none"
                  stroke="#d9be9b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 40 20 L 120 20 L 120 48 L 340 48"
                  fill="none"
                  stroke="#5c4033"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Node 1 */}
                <circle cx="40" cy="20" r="10" fill={activeStageIdx >= 0 ? '#00f0b5' : '#fffaf3'} stroke="#5c4033" strokeWidth="2.5" />
                <text x="40" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2b1d14" fontFamily="monospace">1</text>

                {/* Node 2 */}
                <circle cx="120" cy="20" r="10" fill={activeStageIdx >= 1 ? '#00f0b5' : '#fffaf3'} stroke="#5c4033" strokeWidth="2.5" />
                <text x="120" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2b1d14" fontFamily="monospace">2</text>

                {/* Vertical Drop Arrow Label */}
                <text x="135" y="36" fontSize="8" fontWeight="bold" fill="#ea580c" fontFamily="monospace">↓ Drop</text>

                {/* Node 3 */}
                <circle cx="120" cy="48" r="10" fill={activeStageIdx >= 2 ? '#00f0b5' : '#fffaf3'} stroke="#5c4033" strokeWidth="2.5" />
                <text x="120" y="52" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2b1d14" fontFamily="monospace">3</text>

                {/* Node 4 */}
                <circle cx="230" cy="48" r="10" fill={activeStageIdx >= 3 ? '#00f0b5' : '#fffaf3'} stroke="#5c4033" strokeWidth="2.5" />
                <text x="230" y="52" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2b1d14" fontFamily="monospace">4</text>

                {/* Node 5 */}
                <circle cx="340" cy="48" r="10" fill={activeStageIdx >= 4 ? '#00f0b5' : '#fffaf3'} stroke="#5c4033" strokeWidth="2.5" />
                <text x="340" y="52" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2b1d14" fontFamily="monospace">5</text>

                {/* Live Animated Bolt Icon on Schematic */}
                <motion.g
                  style={{
                    x: travelerX,
                    y: travelerY,
                    rotate: travelerRotate,
                  }}
                >
                  <circle cx="0" cy="0" r="9" fill="#2b1d14" />
                  <circle cx="-3" cy="-1" r="2" fill="#00f0b5" />
                  <circle cx="3" cy="-1" r="2" fill="#00f0b5" />
                  <rect x="-4" y="4" width="8" height="2" rx="1" fill="#f59e0b" />
                </motion.g>
              </svg>
            </div>

            {/* Trajectory Mode Badge */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[9px] font-mono font-bold text-[#5c4033]/70 uppercase">Current Leg</span>
              <span className="text-xs font-mono font-black text-[#2b1d14]">
                {activeStageIdx < 1
                  ? 'Horizontal ➔'
                  : activeStageIdx === 1
                  ? 'Vertical Drop ↓'
                  : activeStageIdx === 2
                  ? 'Drop Landed ☀️'
                  : 'Horizontal ➔'}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. ROBOT LIVE SPEECH BANNER (Changes dynamically as you scroll)
            ========================================================================= */}
        <div className="relative z-20 max-w-4xl w-full mx-auto px-4">
          <div className="bg-[#fffdfa] border-2 border-[#5c4033] px-4 py-2 rounded-2xl shadow-[3px_3px_0px_#5c4033] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#fde047] border border-[#5c4033] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#854d0e]" />
              </div>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#2b1d14]">
                {stageSpeech}
              </span>
            </div>
            <div className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#ecfeff] text-[#0891b2] border border-[#0891b2]/30">
              Scroll to scrub ↓
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MULTI-AXIS TRANSFORM BOARD (Horizontal ➔ Vertical ➔ Horizontal)
            Centered in viewport; active card is always centered!
            ========================================================================= */}
        <div className="relative z-10 w-full overflow-hidden my-auto py-2 h-[480px] sm:h-[520px] flex items-center justify-center">
          <motion.div
            style={{
              x: boardX,
              y: boardY,
            }}
            className="relative"
          >
            {/* ---------------------------------------------------------------------
                PHYSICAL CONNECTOR 1: Horizontal runway from Stage 01 to Stage 02
                --------------------------------------------------------------------- */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.cardWidth / 2}px`,
                top: '-16px',
                width: `${dims.stepX - dims.cardWidth}px`,
                height: '32px',
              }}
              className="flex items-center justify-center pointer-events-none z-0"
            >
              <div className="w-full h-3 bg-[#e6d5bc] border-y-2 border-[#5c4033] flex items-center justify-around overflow-hidden">
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#5c4033,#5c4033_4px,transparent_4px,transparent_12px)] opacity-40 animate-tread" />
              </div>
              <div className="absolute -top-3 px-2 py-0.5 bg-[#fde047] border border-[#a16207] text-[8px] font-mono font-bold text-[#854d0e] uppercase rounded-full shadow-xs whitespace-nowrap">
                Horizontal Rail ➔
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                PHYSICAL CONNECTOR 2: Vertical gravity chute from Stage 02 to Stage 03
                (Positioned directly beneath Stage 02 and directly above Stage 03)
                --------------------------------------------------------------------- */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX - 45}px`,
                top: `${dims.cardHeight / 2}px`,
                width: '90px',
                height: `${dims.stepY - dims.cardHeight}px`,
              }}
              className="flex flex-col items-center justify-center pointer-events-none z-0"
            >
              {/* Caution stripe chute side rails */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_6px,#2b1d14_6px,#2b1d14_12px)] border-x border-[#5c4033]" />
              <div className="absolute inset-y-0 right-0 w-2.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_6px,#2b1d14_6px,#2b1d14_12px)] border-x border-[#5c4033]" />
              
              {/* Center drop runway */}
              <div className="w-8 h-full bg-[#fde68a]/40 border-dashed border-x-2 border-[#d97706] flex flex-col items-center justify-center gap-1">
                <ArrowDown className="w-4 h-4 text-[#ea580c] animate-bounce" />
                <span className="text-[7px] font-mono font-black text-[#c2410c] tracking-widest uppercase [writing-mode:vertical-lr]">
                  GRAVITY DROP
                </span>
                <ArrowDown className="w-4 h-4 text-[#ea580c] animate-bounce" />
              </div>

              {/* Tape badge on chute */}
              <div className="absolute px-2.5 py-0.5 bg-[#ea580c] border border-[#9a3412] text-[8px] font-mono font-bold text-white uppercase rounded shadow-xs rotate-[-3deg] whitespace-nowrap">
                ⚡ VERTICAL DESCENT ↓
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                PHYSICAL CONNECTOR 3: Horizontal runway from Stage 03 to Stage 04
                --------------------------------------------------------------------- */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX + dims.cardWidth / 2}px`,
                top: `${dims.stepY - 16}px`,
                width: `${dims.stepX - dims.cardWidth}px`,
                height: '32px',
              }}
              className="flex items-center justify-center pointer-events-none z-0"
            >
              <div className="w-full h-3 bg-[#e6d5bc] border-y-2 border-[#5c4033] flex items-center justify-around overflow-hidden">
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#5c4033,#5c4033_4px,transparent_4px,transparent_12px)] opacity-40 animate-tread" />
              </div>
              <div className="absolute -top-3 px-2 py-0.5 bg-[#ecfdf5] border border-[#059669] text-[8px] font-mono font-bold text-[#065f46] uppercase rounded-full shadow-xs whitespace-nowrap">
                Horizontal Rail ➔
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                PHYSICAL CONNECTOR 4: Horizontal runway from Stage 04 to Stage 05
                --------------------------------------------------------------------- */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX * 2 + dims.cardWidth / 2}px`,
                top: `${dims.stepY - 16}px`,
                width: `${dims.stepX - dims.cardWidth}px`,
                height: '32px',
              }}
              className="flex items-center justify-center pointer-events-none z-0"
            >
              <div className="w-full h-3 bg-[#e6d5bc] border-y-2 border-[#5c4033] flex items-center justify-around overflow-hidden">
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#5c4033,#5c4033_4px,transparent_4px,transparent_12px)] opacity-40 animate-tread" />
              </div>
              <div className="absolute -top-3 px-2 py-0.5 bg-[#fce7f3] border border-[#db2777] text-[8px] font-mono font-bold text-[#9d174d] uppercase rounded-full shadow-xs whitespace-nowrap">
                Horizontal Rail ➔
              </div>
            </div>

            {/* =====================================================================
                STAGE 01 (Row 1, Column 0)
                Position: centered at (0, 0)
                ===================================================================== */}
            <div
              style={{
                position: 'absolute',
                left: `${-dims.cardWidth / 2}px`,
                top: `${-dims.cardHeight / 2}px`,
                width: `${dims.cardWidth}px`,
              }}
              className="z-10"
            >
              <div className="relative bg-[#fffaf3] border-4 border-[#5c4033] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#5c4033] rotate-[-1deg]">
                <div className="absolute -top-3.5 left-8 px-4 py-0.5 bg-[#fde047] border border-[#a16207]/40 text-[10px] font-mono font-bold uppercase text-[#854d0e] rotate-[-2deg]">
                  Stage 01 • Midnight Garage
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-[#a34063]">01</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#854d0e] border border-amber-300">
                    {MILESTONES[0].tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                  {MILESTONES[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-4">
                  {MILESTONES[0].summary}
                </p>

                <StickyNote
                  title="Bolt's Memory Log"
                  color={MILESTONES[0].noteColor}
                  tapeColor={MILESTONES[0].tapeColor}
                  rotation={1}
                >
                  <p className="font-hand text-base sm:text-lg leading-snug text-[#451a03]">
                    {MILESTONES[0].reflection}
                  </p>
                </StickyNote>

                {/* Path indicator */}
                <div className="mt-3 text-[10px] font-mono font-bold text-[#a34063] flex items-center justify-end gap-1">
                  <span>Scrolling horizontally to Stage 02</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a34063]" />
                </div>
              </div>
            </div>

            {/* =====================================================================
                STAGE 02 (Row 1, Column 1)
                Position: centered at (stepX, 0)
                ===================================================================== */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX - dims.cardWidth / 2}px`,
                top: `${-dims.cardHeight / 2}px`,
                width: `${dims.cardWidth}px`,
              }}
              className="z-10"
            >
              <div className="relative bg-[#fffaf3] border-4 border-[#5c4033] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#5c4033] rotate-[1.5deg]">
                <div className="absolute -top-3.5 left-8 px-4 py-0.5 bg-[#6ee7b7] border border-[#047857]/40 text-[10px] font-mono font-bold uppercase text-[#064e3b] rotate-[1deg]">
                  Stage 02 • Cutting Mat Plains
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-[#a34063]">02</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#064e3b] border border-emerald-300">
                    {MILESTONES[1].tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                  {MILESTONES[1].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-4">
                  {MILESTONES[1].summary}
                </p>

                <StickyNote
                  title="Bolt's Memory Log"
                  color={MILESTONES[1].noteColor}
                  tapeColor={MILESTONES[1].tapeColor}
                  rotation={-1.5}
                >
                  <p className="font-hand text-base sm:text-lg leading-snug text-[#451a03]">
                    {MILESTONES[1].reflection}
                  </p>
                </StickyNote>

                {/* Path indicator: TURNS VERTICAL! */}
                <div className="mt-3 text-[10px] font-mono font-bold text-[#ea580c] flex items-center justify-end gap-1 bg-[#fff7ed] p-1.5 rounded-lg border border-[#fed7aa]">
                  <span>Track turns VERTICAL: Descending to Stage 03</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#ea580c] animate-bounce" />
                </div>
              </div>
            </div>

            {/* =====================================================================
                STAGE 03 (Row 2, Column 1)
                Position: centered at (stepX, stepY) — DIRECTLY BELOW STAGE 02!
                ===================================================================== */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX - dims.cardWidth / 2}px`,
                top: `${dims.stepY - dims.cardHeight / 2}px`,
                width: `${dims.cardWidth}px`,
              }}
              className="z-10"
            >
              <div className="relative bg-[#fffaf3] border-4 border-[#5c4033] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#f59e0b] rotate-[-1deg]">
                <div className="absolute -top-3.5 left-8 px-4 py-0.5 bg-[#fed7aa] border border-[#ea580c]/40 text-[10px] font-mono font-bold uppercase text-[#c2410c] rotate-[-2deg]">
                  Stage 03 • Vertical Landing • Window Sill
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-[#a34063]">03</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-[#c2410c] border border-orange-300">
                    {MILESTONES[2].tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                  {MILESTONES[2].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-4">
                  {MILESTONES[2].summary}
                </p>

                <StickyNote
                  title="Bolt's Memory Log"
                  color={MILESTONES[2].noteColor}
                  tapeColor={MILESTONES[2].tapeColor}
                  rotation={1.2}
                >
                  <p className="font-hand text-base sm:text-lg leading-snug text-[#451a03]">
                    {MILESTONES[2].reflection}
                  </p>
                </StickyNote>

                {/* Path indicator: RESUMES HORIZONTAL! */}
                <div className="mt-3 text-[10px] font-mono font-bold text-[#059669] flex items-center justify-end gap-1">
                  <span>Track resumes HORIZONTAL: Rolling to Stage 04</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" />
                </div>
              </div>
            </div>

            {/* =====================================================================
                STAGE 04 (Row 2, Column 2)
                Position: centered at (2 * stepX, stepY)
                ===================================================================== */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX * 2 - dims.cardWidth / 2}px`,
                top: `${dims.stepY - dims.cardHeight / 2}px`,
                width: `${dims.cardWidth}px`,
              }}
              className="z-10"
            >
              <div className="relative bg-[#fffaf3] border-4 border-[#5c4033] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#5c4033] rotate-[1deg]">
                <div className="absolute -top-3.5 left-8 px-4 py-0.5 bg-[#f472b6] border border-[#9d174d]/40 text-[10px] font-mono font-bold uppercase text-[#831843] rotate-[1deg]">
                  Stage 04 • Breadboard Lab
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-[#a34063]">04</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-100 text-[#831843] border border-pink-300">
                    {MILESTONES[3].tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                  {MILESTONES[3].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-4">
                  {MILESTONES[3].summary}
                </p>

                <StickyNote
                  title="Bolt's Memory Log"
                  color={MILESTONES[3].noteColor}
                  tapeColor={MILESTONES[3].tapeColor}
                  rotation={-1}
                >
                  <p className="font-hand text-base sm:text-lg leading-snug text-[#451a03]">
                    {MILESTONES[3].reflection}
                  </p>
                </StickyNote>

                {/* Path indicator */}
                <div className="mt-3 text-[10px] font-mono font-bold text-[#a34063] flex items-center justify-end gap-1">
                  <span>Rolling horizontally to Stage 05</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a34063]" />
                </div>
              </div>
            </div>

            {/* =====================================================================
                STAGE 05 (Row 2, Column 3)
                Position: centered at (3 * stepX, stepY)
                ===================================================================== */}
            <div
              style={{
                position: 'absolute',
                left: `${dims.stepX * 3 - dims.cardWidth / 2}px`,
                top: `${dims.stepY - dims.cardHeight / 2}px`,
                width: `${dims.cardWidth}px`,
              }}
              className="z-10"
            >
              <div className="relative bg-[#fffaf3] border-4 border-[#5c4033] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_#00f0b5] rotate-[-1deg]">
                <div className="absolute -top-3.5 left-8 px-4 py-0.5 bg-[#38bdf8] border border-[#0284c7]/40 text-[10px] font-mono font-bold uppercase text-[#075985] rotate-[-2deg]">
                  Stage 05 • October 17–19, 2026
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-[#a34063]">05</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-[#075985] border border-cyan-300">
                    {MILESTONES[4].tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                  {MILESTONES[4].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-4">
                  {MILESTONES[4].summary}
                </p>

                <StickyNote
                  title="Bolt's Memory Log"
                  color={MILESTONES[4].noteColor}
                  tapeColor={MILESTONES[4].tapeColor}
                  rotation={1.5}
                >
                  <p className="font-hand text-base sm:text-lg leading-snug text-[#451a03]">
                    {MILESTONES[4].reflection}
                  </p>
                </StickyNote>

                {/* Final indicator */}
                <div className="mt-3 text-[10px] font-mono font-bold text-[#059669] flex items-center justify-end gap-1 bg-[#ecfdf5] p-1.5 rounded-lg border border-[#a7f3d0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Journey Complete! Scroll down to Inventions</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#059669]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            4. BOTTOM TACTILE TRAJECTORY READOUT
            ========================================================================= */}
        <div className="relative z-20 max-w-6xl w-full mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#5c4033]">
          {/* Leg trajectory status */}
          <div className="flex items-center gap-2 font-bold">
            <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Path: </span>
            <span className={`px-2 py-0.5 rounded text-[11px] ${activeStageIdx < 1 ? 'bg-[#dcfce7] text-[#15803d] border border-[#86efac]' : 'opacity-50'}`}>
              Horizontal (1 ➔ 2)
            </span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded text-[11px] ${activeStageIdx === 1 || activeStageIdx === 2 ? 'bg-[#fed7aa] text-[#c2410c] border border-[#fdba74]' : 'opacity-50'}`}>
              Vertical Drop (2 ↓ 3)
            </span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded text-[11px] ${activeStageIdx >= 3 ? 'bg-[#dcfce7] text-[#15803d] border border-[#86efac]' : 'opacity-50'}`}>
              Horizontal (3 ➔ 5)
            </span>
          </div>

          {/* Scrub cue & stage odometer */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[11px] text-[#5c4033]/70">
              Scroll page to scrub trajectory
            </span>
            <div className="bg-[#fffaf3] border-2 border-[#5c4033] px-3 py-1 rounded-xl font-bold shadow-[2px_2px_0px_#5c4033]">
              Stage {activeStageIdx + 1} of 5
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
