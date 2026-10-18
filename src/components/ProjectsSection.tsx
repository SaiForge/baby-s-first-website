import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { HoloRattleToy } from './Projects/HoloRattleToy'
import { ClockworkLullabyBox } from './Projects/ClockworkLullabyBox'
import { SolarChargingBackpack } from './Projects/SolarChargingBackpack'
import { HoloGadget3D } from './Projects/HoloGadget3D'
import { Wrench, Sparkles, ArrowRight, Award, Compass } from 'lucide-react'
import { sounds } from '../audio/soundEffects'

interface ProjectsSectionProps {
  batteryLevel: number
  onChargeChange: (level: number) => void
}

export function ProjectsSection({
  batteryLevel,
  onChargeChange,
}: ProjectsSectionProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)

  // Track vertical scroll to convert into horizontal translation
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })

  // Ultra-smooth spring physics for 60fps cinematic horizontal scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  })

  // Horizontal translation range: scrolls from start card through all 4 gadgets to summary
  const x = useTransform(smoothProgress, [0, 1], ['0%', '-76%'])
  const rulerX = useTransform(smoothProgress, [0, 1], ['0%', '-45%'])
  const botTrackX = useTransform(smoothProgress, [0, 1], ['5%', '92%'])
  const botRotate = useTransform(smoothProgress, [0, 1], [0, 1440])

  return (
    <div
      ref={targetRef}
      id="projects"
      className="relative h-[380vh] w-full"
    >
      {/* PINNED STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 select-none bg-gradient-to-b from-[#fff8f1] via-[#fffbf6] to-[#fff8f1]">
        {/* Background Cutting Mat Grid Guide Marks */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#5c4033_1px,transparent_1px),linear-gradient(to_bottom,#5c4033_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* TOP HEADER: Oversized Title & Interactive Progress Telemetry */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#fef08a] border-2 border-[#854d0e] px-3 py-0.5 rounded-full text-xs font-mono font-bold text-[#854d0e] shadow-[2px_2px_0px_#854d0e] mb-1">
              <Wrench className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Horizontal Rail Showcase • Track 2</span>
            </div>
            <h2
              className="font-extrabold text-[#2b1d14] tracking-tight leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              WHIMSICAL INVENTIONS.
            </h2>
          </div>

          {/* Scroll Direction Prompt Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#fffaf3] border-2 border-[#5c4033] px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_#5c4033]">
            <Compass className="w-4 h-4 text-[#00f0b5] animate-spin" />
            <div className="text-left font-mono text-[11px]">
              <span className="font-bold text-[#2b1d14] block leading-tight">
                Scroll Vertically
              </span>
              <span className="text-[#5c4033]/70 text-[9px]">
                Glides Horizontally Across Bench →
              </span>
            </div>
          </div>
        </div>

        {/* HORIZONTAL CARDS TRACK */}
        <div className="relative z-10 w-full overflow-visible my-auto py-2">
          <motion.div
            style={{ x }}
            className="flex flex-row items-center gap-8 px-6 sm:px-16 w-max"
          >
            {/* 1. STATION BILLBOARD (Intro Card) */}
            <div className="w-[320px] sm:w-[380px] shrink-0 bg-[#fffaf3] border-4 border-[#5c4033] p-7 rounded-3xl shadow-[8px_8px_0px_#5c4033] rotate-[-1deg] relative">
              {/* Washi Tape Strip */}
              <div className="absolute -top-3.5 left-10 w-32 h-6 bg-[#fde047]/90 border border-[#a16207]/40 shadow-xs rotate-[-2deg] flex items-center justify-center text-[10px] font-mono font-bold text-[#854d0e]">
                haX.rail • STATION 01
              </div>

              <span className="font-mono text-3xl font-black text-[#a34063] block mb-2">
                00 // RAIL
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2b1d14] tracking-tight mb-2">
                BOLT'S GADGET WORKBENCH.
              </h3>
              <p className="text-xs sm:text-sm text-[#5c4033] leading-relaxed mb-6 font-sans">
                Each machine was built from spare parts found in the midnight garage. Roll down to test the physics, chime synthesizers, and photovoltaic cells!
              </p>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a34063]">
                <span>Scroll down to inspect</span>
                <ArrowRight className="w-4 h-4 animate-bounce-x" />
              </div>
            </div>

            {/* 2. GADGET 1: THE HOLO-RATTLE */}
            <div className="w-[340px] sm:w-[420px] shrink-0">
              <HoloRattleToy />
            </div>

            {/* 3. GADGET 2: CLOCKWORK LULLABY BOX */}
            <div className="w-[380px] sm:w-[480px] shrink-0">
              <ClockworkLullabyBox />
            </div>

            {/* 4. GADGET 3: SOLAR-PANEL BACKPACK */}
            <div className="w-[340px] sm:w-[430px] shrink-0">
              <SolarChargingBackpack
                batteryLevel={batteryLevel}
                onChargeChange={onChargeChange}
              />
            </div>

            {/* 5. GADGET 4: THREE.JS WEBGL HOLOGRAPHIC CORE */}
            <div className="w-[340px] sm:w-[430px] shrink-0">
              <HoloGadget3D />
            </div>

            {/* 6. STATION OUTRO & COMMENDATION */}
            <div className="w-[320px] sm:w-[380px] shrink-0 bg-[#2b1d14] text-[#fff8f1] border-4 border-[#5c4033] p-7 rounded-3xl shadow-[8px_8px_0px_#00f0b5] rotate-[1.5deg] relative">
              <div className="absolute -top-3.5 right-10 w-32 h-6 bg-[#00f0b5] border border-[#047857] shadow-xs rotate-[2deg] flex items-center justify-center text-[10px] font-mono font-bold text-[#064e3b]">
                ★ VERIFIED TINKER ★
              </div>

              <Award className="w-10 h-10 text-[#f59e0b] mb-3" />
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                ALL 4 GADGETS TESTED!
              </h3>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed mb-6">
                Unit-B04 has logged your test telemetry. Continue scrolling to visit the Community Pegboard & leave a note!
              </p>

              <button
                onClick={() => {
                  sounds.playBoing()
                  document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full py-2.5 bg-[#00f0b5] hover:bg-[#00d8a3] text-[#2b1d14] font-mono text-xs font-bold uppercase rounded-xl border-2 border-[#5c4033] shadow-[3px_3px_0px_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#2b1d14]" />
                <span>Visit Community Pegboard</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM WORKBENCH RULER & TRAVELING ROBOT GUIDE TRACK */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          {/* Traveling Mini CutoBot along horizontal track */}
          <div className="relative w-full h-8 mb-1 overflow-hidden">
            <motion.div
              style={{ left: botTrackX }}
              className="absolute top-0 -translate-x-1/2 flex items-center gap-1.5"
            >
              <motion.div
                style={{ rotate: botRotate }}
                className="w-6 h-6 rounded-full bg-[#5c4033] border-2 border-[#fef08a] flex items-center justify-center shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#00f0b5]" />
              </motion.div>
              <span className="text-[10px] font-mono font-bold text-[#5c4033] bg-[#fffaf3] border border-[#5c4033] px-1.5 rounded shadow-xs whitespace-nowrap">
                Bolt rolling across bench →
              </span>
            </motion.div>
          </div>

          {/* Metal Workbench Measuring Ruler Markings */}
          <div className="w-full h-8 bg-[#eadecc] border-2 border-[#5c4033] rounded-lg shadow-inner overflow-hidden relative flex items-center">
            <motion.div
              style={{ x: rulerX }}
              className="flex items-center gap-8 whitespace-nowrap font-mono text-[10px] font-bold text-[#5c4033]/80 px-4"
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex items-end gap-1 h-6">
                  <span className="border-l-2 border-[#5c4033] h-full" />
                  <span className="border-l border-[#5c4033]/40 h-2" />
                  <span className="border-l border-[#5c4033]/40 h-3" />
                  <span className="border-l border-[#5c4033]/40 h-2" />
                  <span className="border-l border-[#5c4033] h-4" />
                  <span className="text-[9px] -mb-1">{i * 10}cm</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
