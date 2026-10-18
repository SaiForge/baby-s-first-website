import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { Sparkles, Sun, Wrench, Music, Award } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ShowcaseCard {
  id: string
  title: string
  number: string
  subtitle: string
  desc: string
  tag: string
  tapeColor: string
  rotation: number
  icon: typeof Sparkles
  badge: string
}

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 'c1',
    number: '01',
    title: 'THE HOLO-RATTLE',
    subtitle: 'Sensory Physics Toy',
    desc: 'Kinetic chamber with 2D gravity simulation, starlight beads, and collision chimes.',
    tag: 'PHYSICS',
    tapeColor: 'bg-[#fde047]',
    rotation: -2,
    icon: Sparkles,
    badge: 'INTERACTIVE',
  },
  {
    id: 'c2',
    number: '02',
    title: 'CLOCKWORK LULLABY',
    subtitle: '8-Bit Chime Box',
    desc: 'Winding brass gears and Web Audio API synthesis playing soothing bedtime frequencies.',
    tag: 'AUDIO SYNTH',
    tapeColor: 'bg-[#6ee7b7]',
    rotation: 1.5,
    icon: Music,
    badge: 'WEB AUDIO',
  },
  {
    id: 'c3',
    number: '03',
    title: 'SOLAR BACKPACK',
    subtitle: 'Photovoltaic Charger',
    desc: 'Tactile sweet-tape charging station with sunlight tokens and 120% turbo overdrive.',
    tag: 'SOLAR CELL',
    tapeColor: 'bg-[#fed7aa]',
    rotation: -1,
    icon: Sun,
    badge: '120% OVERDRIVE',
  },
]

export function TactileScrollJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const craftStickyRef = useRef<HTMLDivElement | null>(null)
  const typographyRef = useRef<HTMLDivElement | null>(null)
  const dropperRef = useRef<HTMLDivElement | null>(null)

  // Global Scroll for container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth springs for pseudo-3D transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  // 1. Hero 3D Rolling Disc / Tape Roll transforms
  const coinRotateY = useTransform(smoothProgress, [0, 0.35], [0, 720])
  const coinRotateZ = useTransform(smoothProgress, [0, 0.35], [0, 180])
  const coinY = useTransform(smoothProgress, [0, 0.35], [0, 260])
  const coinScale = useTransform(smoothProgress, [0, 0.25, 0.35], [1, 1.25, 0.85])

  // Kinetic marquee ribbons sliding in opposite directions
  const ribbonLeftX = useTransform(smoothProgress, [0, 1], ['0%', '-40%'])
  const ribbonRightX = useTransform(smoothProgress, [0, 1], ['-30%', '10%'])

  // 2. Unrolling Craft Section Scroll progress
  const { scrollYProgress: craftProgress } = useScroll({
    target: craftStickyRef,
    offset: ['start start', 'end end'],
  })

  const smoothCraft = useSpring(craftProgress, { stiffness: 100, damping: 20 })

  // Tape unrolling width & card translations
  const tapeWidth = useTransform(smoothCraft, [0.05, 0.85], ['0%', '100%'])
  const rollerX = useTransform(smoothCraft, [0.05, 0.85], ['0%', '92%'])
  const rollerRotate = useTransform(smoothCraft, [0.05, 0.85], [0, 1080])

  // Staggered card reveals
  const card1Y = useTransform(smoothCraft, [0.1, 0.35], [80, 0])
  const card1Opacity = useTransform(smoothCraft, [0.1, 0.3], [0, 1])

  const card2Y = useTransform(smoothCraft, [0.35, 0.6], [80, 0])
  const card2Opacity = useTransform(smoothCraft, [0.35, 0.55], [0, 1])

  const card3Y = useTransform(smoothCraft, [0.6, 0.85], [80, 0])
  const card3Opacity = useTransform(smoothCraft, [0.6, 0.8], [0, 1])

  // 3. Giant Punchy Transition
  const { scrollYProgress: punchProgress } = useScroll({
    target: typographyRef,
    offset: ['start end', 'end start'],
  })

  const curveScaleY = useTransform(punchProgress, [0, 0.45, 0.9], [0.4, 1.4, 0.6])
  const textTrack1X = useTransform(punchProgress, [0, 1], ['20%', '-30%'])
  const textTrack2X = useTransform(punchProgress, [0, 1], ['-30%', '20%'])
  const textTrack3X = useTransform(punchProgress, [0, 1], ['15%', '-25%'])

  // 4. Sandbox Dropper
  const { scrollYProgress: dropProgress } = useScroll({
    target: dropperRef,
    offset: ['start end', 'center center'],
  })

  const token1Y = useTransform(dropProgress, [0.3, 0.9], [-200, 0])
  const token2Y = useTransform(dropProgress, [0.4, 0.95], [-240, 0])
  const token3Y = useTransform(dropProgress, [0.2, 0.85], [-180, 0])
  const token4Y = useTransform(dropProgress, [0.5, 1.0], [-260, 0])
  const token5Y = useTransform(dropProgress, [0.35, 0.9], [-220, 0])

  const [tossedToken, setTossedToken] = useState<string | null>(null)

  const handleTokenClick = (label: string) => {
    sounds.playBoing()
    setTossedToken(label)
    confetti({
      particleCount: 25,
      spread: 60,
      colors: ['#00f0b5', '#f59e0b', '#38bdf8', '#f43f5e'],
    })
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-x-clip select-none">
      {/* =========================================================================
          SECTION 1: HERO ENTRY (Oversized Typography + Pseudo-3D Rolling Tape Disc)
          ========================================================================= */}
      <section className="relative min-h-[90vh] py-16 px-4 flex flex-col items-center justify-center text-center">
        {/* Kinetic Horizontal Ribbon 1 (Sliding Left) */}
        <div className="w-full overflow-hidden py-2 bg-[#5c4033] text-[#fff8f1] border-y-2 border-[#382419] shadow-sm mb-8 -rotate-1">
          <motion.div style={{ x: ribbonLeftX }} className="flex gap-8 whitespace-nowrap font-mono text-xs font-extrabold uppercase tracking-widest">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-[#00f0b5]">★</span>
                <span>UNIT-B04 ONLINE</span>
                <span className="text-[#f59e0b]">●</span>
                <span>SMALL CIRCUITS BRIGHT SPARKS</span>
                <span className="text-[#38bdf8]">▲</span>
                <span>HAX.BABY 2026 TRACK 2</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* OVERSIZED BOLD HEADLINE */}
        <div className="max-w-6xl mx-auto px-4 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-extrabold tracking-tighter leading-[0.88] text-[#2b1d14]"
            style={{ fontSize: 'clamp(3rem, 10vw, 7.8rem)' }}
          >
            STICK BY YOU.
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="font-extrabold tracking-tighter leading-[0.88] text-[#a34063] mt-2"
            style={{ fontSize: 'clamp(2.5rem, 8.5vw, 6.8rem)' }}
          >
            TO INVENT & CREATE.
          </motion.h3>

          <p className="mt-6 text-sm sm:text-base font-mono text-[#5c4033] max-w-xl mx-auto">
            Scroll down to watch Unit-B04 unroll tactile project blueprints and roll his pseudo-3D solar cylinder across the workbench.
          </p>
        </div>

        {/* PSEUDO-3D ROLLING CYLINDER / TAPE COIN (Pure CSS/SVG 3D - Lighthouse 95+ Score) */}
        <div
          className="relative my-10 py-6 flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateY: coinRotateY,
              rotateZ: coinRotateZ,
              y: coinY,
              scale: coinScale,
              transformStyle: 'preserve-3d',
            }}
            onClick={() => sounds.playBoing()}
            className="relative w-36 h-36 sm:w-44 sm:h-44 cursor-pointer group"
            title="Click CutoBot's 3D Solar Coin!"
          >
            {/* FRONT FACE (Golden Solar Disc) */}
            <div
              style={{
                transform: 'translateZ(14px)',
                backfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#b45309] border-4 border-[#5c4033] shadow-[8px_8px_0px_#5c4033] flex flex-col items-center justify-center p-3 text-center"
            >
              {/* Outer geared rim */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#78350f] opacity-60" />

              {/* Embossed Baby Robot Visor */}
              <div className="w-16 h-8 bg-[#2b1d14] rounded-md border-2 border-[#5c4033] flex items-center justify-center gap-1.5 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#00f0b5] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#00f0b5] animate-pulse" />
              </div>

              <span className="mt-2 text-[10px] font-mono font-extrabold text-[#451a03] uppercase tracking-wider">
                Unit-B04
              </span>
              <span className="text-[8px] font-mono text-[#78350f] font-bold">
                100% BRASS
              </span>
            </div>

            {/* CYLINDER THICKNESS RIM LAYERS (Stacked depth for pseudo-3D coin edge) */}
            {[-10, -5, 0, 5, 10].map((z) => (
              <div
                key={z}
                style={{
                  transform: `translateZ(${z}px)`,
                }}
                className="absolute inset-0 rounded-full border-2 border-[#78350f]/60 bg-[#d97706]/40 pointer-events-none"
              />
            ))}

            {/* BACK FACE (haX.baby Seal) */}
            <div
              style={{
                transform: 'rotateY(180deg) translateZ(14px)',
                backfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6ee7b7] via-[#059669] to-[#064e3b] border-4 border-[#5c4033] shadow-[8px_8px_0px_#5c4033] flex flex-col items-center justify-center p-3 text-center text-white"
            >
              <Award className="w-8 h-8 text-[#fef08a] mb-1" />
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-tight text-[#fef08a]">
                haX.baby 2026
              </span>
              <span className="text-[9px] font-mono opacity-80">
                Track 2 Seal
              </span>
            </div>
          </motion.div>
        </div>

        {/* Kinetic Horizontal Ribbon 2 (Sliding Right) */}
        <div className="w-full overflow-hidden py-2 bg-[#fef08a] text-[#854d0e] border-y-2 border-[#ca8a04] shadow-sm rotate-1">
          <motion.div style={{ x: ribbonRightX }} className="flex gap-8 whitespace-nowrap font-mono text-xs font-extrabold uppercase tracking-widest">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <span>⚡ TACTILE WASHI TAPE</span>
                <span>●</span>
                <span>ROTATING 3D CYLINDER</span>
                <span>●</span>
                <span>PHYSICAL WEB INTERACTIONS</span>
                <span>★</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE "UNROLLING / CRAFT" SECTION (Sticky Pinned Container)
          ========================================================================= */}
      <section ref={craftStickyRef} className="relative h-[240vh]">
        <div className="sticky top-16 min-h-screen py-12 px-4 flex flex-col justify-start items-center">
          {/* Section Header */}
          <div className="text-center mb-6 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 bg-[#fffaf3] border-2 border-[#5c4033] rounded-full text-[#a34063] shadow-[2px_2px_0px_#5c4033]">
              Tactile Pinboard
            </span>
            <h3
              className="font-extrabold tracking-tight text-[#2b1d14] mt-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              THE CRAFT BENCH.
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#5c4033]">
              Scroll down to watch the washi tape unroll and slap showcase cards into place!
            </p>
          </div>

          {/* DYNAMIC UNROLLING TAPE RIBBON */}
          <div className="w-full max-w-5xl mx-auto relative h-14 my-4 flex items-center">
            {/* Background guide channel */}
            <div className="absolute inset-x-0 h-4 bg-[#eadecc] border-2 border-dashed border-[#5c4033]/40 rounded-full" />

            {/* Unrolling Washi Tape Strip */}
            <motion.div
              style={{ width: tapeWidth }}
              className="relative h-9 bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#eab308] border-2 border-[#5c4033] shadow-[3px_3px_0px_#5c4033] rounded-sm overflow-hidden flex items-center px-4"
            >
              <div className="whitespace-nowrap font-mono text-[10px] font-extrabold text-[#78350f] uppercase tracking-widest flex items-center gap-4">
                <span>★ SWEET-TAPE DISPENSER ACTIVE</span>
                <span>●</span>
                <span>PINNING SHOWCASE MODULES</span>
                <span>●</span>
                <span>UNIT-B04 CRAFTED</span>
              </div>
            </motion.div>

            {/* Rolling Tape Spool Badge traveling along the strip */}
            <motion.div
              style={{
                left: rollerX,
                rotate: rollerRotate,
              }}
              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#5c4033] border-3 border-[#fef08a] shadow-[4px_4px_0px_#000] flex items-center justify-center z-20 cursor-grab"
            >
              <div className="w-4 h-4 rounded-full bg-[#00f0b5]" />
            </motion.div>
          </div>

          {/* PINNED SHOWCASE CARDS (Unroll into view with scroll progress) */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Card 1 */}
            <motion.div
              style={{ y: card1Y, opacity: card1Opacity }}
              className="relative bg-[#fffaf3] border-3 border-[#5c4033] p-6 rounded-2xl shadow-[6px_6px_0px_#5c4033] rotate-[-2deg] transition-transform hover:rotate-0"
            >
              {/* Washi Tape Strip on Card */}
              <div className="absolute -top-3.5 left-8 w-24 h-6 bg-[#fde047]/90 border border-[#a16207]/40 shadow-xs rotate-[-3deg] flex items-center justify-center text-[9px] font-mono font-bold text-[#854d0e]">
                haX.tape #01
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-2xl font-black text-[#a34063]">01</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-[#854d0e] border border-amber-300">
                  {SHOWCASE_CARDS[0].tag}
                </span>
              </div>

              <h4 className="font-extrabold text-lg text-[#2b1d14] tracking-tight">
                {SHOWCASE_CARDS[0].title}
              </h4>
              <p className="text-xs font-mono text-[#5c4033]/70 mb-3">
                {SHOWCASE_CARDS[0].subtitle}
              </p>
              <p className="text-xs text-[#2b1d14] leading-relaxed mb-4">
                {SHOWCASE_CARDS[0].desc}
              </p>

              <button
                onClick={() => {
                  sounds.playClick(900)
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full py-2 bg-[#00f0b5] hover:bg-[#00d8a3] text-[#2b1d14] font-mono text-xs font-bold uppercase rounded-lg border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
              >
                Launch Sandbox
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              style={{ y: card2Y, opacity: card2Opacity }}
              className="relative bg-[#fffaf3] border-3 border-[#5c4033] p-6 rounded-2xl shadow-[6px_6px_0px_#5c4033] rotate-[1.5deg] transition-transform hover:rotate-0"
            >
              {/* Push Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-[#5c4033] shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-2xl font-black text-[#a34063]">02</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#065f46] border border-emerald-300">
                  {SHOWCASE_CARDS[1].tag}
                </span>
              </div>

              <h4 className="font-extrabold text-lg text-[#2b1d14] tracking-tight">
                {SHOWCASE_CARDS[1].title}
              </h4>
              <p className="text-xs font-mono text-[#5c4033]/70 mb-3">
                {SHOWCASE_CARDS[1].subtitle}
              </p>
              <p className="text-xs text-[#2b1d14] leading-relaxed mb-4">
                {SHOWCASE_CARDS[1].desc}
              </p>

              <button
                onClick={() => {
                  sounds.playClick(900)
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#2b1d14] font-mono text-xs font-bold uppercase rounded-lg border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
              >
                Wind Music Box
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              style={{ y: card3Y, opacity: card3Opacity }}
              className="relative bg-[#fffaf3] border-3 border-[#5c4033] p-6 rounded-2xl shadow-[6px_6px_0px_#5c4033] rotate-[-1deg] transition-transform hover:rotate-0"
            >
              {/* Washi Tape Strip on Card */}
              <div className="absolute -top-3.5 right-8 w-24 h-6 bg-[#fed7aa]/90 border border-[#ea580c]/40 shadow-xs rotate-[2deg] flex items-center justify-center text-[9px] font-mono font-bold text-[#c2410c]">
                haX.tape #03
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-2xl font-black text-[#a34063]">03</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-[#c2410c] border border-orange-300">
                  {SHOWCASE_CARDS[2].tag}
                </span>
              </div>

              <h4 className="font-extrabold text-lg text-[#2b1d14] tracking-tight">
                {SHOWCASE_CARDS[2].title}
              </h4>
              <p className="text-xs font-mono text-[#5c4033]/70 mb-3">
                {SHOWCASE_CARDS[2].subtitle}
              </p>
              <p className="text-xs text-[#2b1d14] leading-relaxed mb-4">
                {SHOWCASE_CARDS[2].desc}
              </p>

              <button
                onClick={() => {
                  sounds.playClick(900)
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-mono text-xs font-bold uppercase rounded-lg border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
              >
                Charge Solar Cell
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: GIANT PUNCHY TRANSITION (Curved Divider + Kinetic Typography)
          ========================================================================= */}
      <section ref={typographyRef} className="relative py-24 bg-[#2b1d14] text-[#fff8f1] overflow-hidden">
        {/* Dynamic Curved SVG Divider on Top */}
        <motion.div
          style={{ scaleY: curveScaleY, transformOrigin: 'top center' }}
          className="absolute -top-1 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none"
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 sm:h-24 fill-[#fff8f1]"
          >
            <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" />
          </svg>
        </motion.div>

        {/* Floating Kinetic Giant Typography Tracks */}
        <div className="py-12 space-y-2">
          {/* Track 1: Moving Right */}
          <motion.div
            style={{ x: textTrack1X, fontSize: 'clamp(3.5rem, 11vw, 8.5rem)' }}
            className="whitespace-nowrap font-black tracking-tighter opacity-90 leading-none select-none text-[#00f0b5]"
          >
            <span>
              TO DISCOVER • TO EXPLORE • TO INVENT •
            </span>
          </motion.div>

          {/* Track 2: Moving Left */}
          <motion.div
            style={{ x: textTrack2X, fontSize: 'clamp(3.5rem, 11vw, 8.5rem)' }}
            className="whitespace-nowrap font-black tracking-tighter opacity-80 leading-none select-none text-[#f59e0b]"
          >
            <span>
              SMALL CIRCUITS • BRIGHT SPARKS • BOLT-B04 •
            </span>
          </motion.div>

          {/* Track 3: Moving Right */}
          <motion.div
            style={{ x: textTrack3X, fontSize: 'clamp(3.5rem, 11vw, 8.5rem)' }}
            className="whitespace-nowrap font-black tracking-tighter opacity-60 leading-none select-none text-[#38bdf8]"
          >
            <span>
              MIDNIGHT GARAGE • 48-HOUR HACKATHON • 2026 •
            </span>
          </motion.div>
        </div>

        {/* Center Quotation Card */}
        <div className="max-w-xl mx-auto px-4 mt-8 relative z-10 text-center">
          <div className="p-6 bg-[#18181b] border-2 border-[#5c4033] rounded-2xl shadow-[6px_6px_0px_#00f0b5]">
            <p className="font-mono text-sm sm:text-base text-zinc-300 leading-relaxed italic">
              "We didn't set out to build an imposing mechanical giant. We built a curious little tinkerer whose heart beats to the hum of warm circuits."
            </p>
            <span className="block mt-3 text-xs font-mono font-bold text-[#00f0b5] uppercase tracking-wider">
              — haX.baby Engineering Logbook
            </span>
          </div>
        </div>

        {/* Dynamic Curved SVG Divider on Bottom */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 sm:h-24 fill-[#fff8f1]"
          >
            <path d="M0,120 C300,0 900,0 1200,120 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INTERACTIVE SANDBOX DROPPER (Physical Tokens Settling at Bottom)
          ========================================================================= */}
      <section ref={dropperRef} className="py-20 px-4 max-w-5xl mx-auto text-center">
        <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 bg-[#fef08a] border-2 border-[#854d0e] rounded-full text-[#854d0e] shadow-[2px_2px_0px_#854d0e]">
          Sandbox Chamber
        </span>
        <h3
          className="font-extrabold tracking-tight text-[#2b1d14] mt-3 mb-2"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          THE TINKER TRAY.
        </h3>
        <p className="text-xs sm:text-sm font-mono text-[#5c4033] max-w-md mx-auto mb-6">
          Scroll here to watch physical workshop tokens tumble and settle into Bolt's parts tray! Tap each token to toss it!
        </p>

        {tossedToken && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#00f0b5] border-2 border-[#5c4033] rounded-full text-xs font-mono font-bold text-[#2b1d14] shadow-xs animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tossed: {tossedToken}!</span>
          </div>
        )}

        {/* Wooden Parts Tray with Falling Physical Tokens */}
        <div className="relative min-h-[300px] sm:min-h-[360px] bg-[#fbf2e3] border-4 border-[#5c4033] rounded-3xl p-8 shadow-[10px_10px_0px_#5c4033] flex flex-wrap items-end justify-center gap-6 overflow-hidden">
          {/* Tray grid texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#5c4033_2px,transparent_2px)] [background-size:20px_20px]" />

          {/* TOKEN 1: Enamel CutoBot Badge */}
          <motion.div
            style={{ y: token1Y }}
            onClick={() => handleTokenClick('CutoBot Badge')}
            className="relative cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#00f0b5] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex flex-col items-center justify-center p-2 rotate-[-6deg]">
              <div className="w-10 h-6 bg-[#0d1117] rounded-sm flex items-center justify-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0b5] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0b5] animate-pulse" />
              </div>
              <span className="text-[9px] font-mono font-black text-[#2b1d14] uppercase">
                Bolt Pin
              </span>
            </div>
            {/* Washi tape pin */}
            <div className="absolute -top-2 left-2 w-8 h-3 bg-[#e3d0b9]/90 border border-[#5c4033]/30 rotate-3" />
          </motion.div>

          {/* TOKEN 2: Solar Sunbeam Coin */}
          <motion.div
            style={{ y: token2Y }}
            onClick={() => handleTokenClick('Sunbeam Coin')}
            className="relative cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fef08a] to-[#f59e0b] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex flex-col items-center justify-center p-2 rotate-[4deg]">
              <Sun className="w-8 h-8 text-[#78350f] mb-0.5" />
              <span className="text-[8px] font-mono font-extrabold text-[#78350f] uppercase">
                Sun Token
              </span>
            </div>
          </motion.div>

          {/* TOKEN 3: Washi Tape Spool */}
          <motion.div
            style={{ y: token3Y }}
            onClick={() => handleTokenClick('Tape Spool')}
            className="relative cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-28 h-20 rounded-xl bg-[#f472b6] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex flex-col items-center justify-center p-2 rotate-[-3deg]">
              <span className="text-base font-extrabold text-white tracking-wider">
                SWEET
              </span>
              <span className="text-[9px] font-mono text-[#831843] font-bold">
                WASHI TAPE
              </span>
            </div>
            <div className="absolute -bottom-2 right-2 w-10 h-3 bg-[#fde047] border border-[#a16207]/30 rotate-6" />
          </motion.div>

          {/* TOKEN 4: 10K Resistor Badge */}
          <motion.div
            style={{ y: token4Y }}
            onClick={() => handleTokenClick('Resistor Badge')}
            className="relative cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#38bdf8] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex flex-col items-center justify-center p-2 rotate-[8deg]">
              <Wrench className="w-7 h-7 text-[#0c4a6e] mb-1" />
              <span className="text-[9px] font-mono font-black text-[#0c4a6e] uppercase">
                10kΩ Tinker
              </span>
            </div>
          </motion.div>

          {/* TOKEN 5: haX.baby Gold Medal */}
          <motion.div
            style={{ y: token5Y }}
            onClick={() => handleTokenClick('Gold Medal')}
            className="relative cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#fbbf24] via-[#f59e0b] to-[#fef08a] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex flex-col items-center justify-center p-2 rotate-[-5deg]">
              <Award className="w-8 h-8 text-[#78350f]" />
              <span className="text-[8px] font-mono font-extrabold text-[#78350f] uppercase">
                Track 2
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
