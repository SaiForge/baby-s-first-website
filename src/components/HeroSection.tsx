import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { CutoBotAvatar, type MoodType } from './CutoBotAvatar'
import { StickyNote } from './StickyNote'
import { Sparkles, ArrowDown, Award, Zap, Heart } from 'lucide-react'

interface HeroSectionProps {
  mood: MoodType
  onMoodChange: (mood: MoodType) => void
  batteryLevel: number
}

export function HeroSection({ mood, onMoodChange, batteryLevel }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
  })

  // Scrubbed parallax & 3D tilt for the Avatar Stand
  const standRotateX = useTransform(smoothProgress, [0, 1], [0, 12])
  const standRotateY = useTransform(smoothProgress, [0, 1], [0, -8])
  const standY = useTransform(smoothProgress, [0, 1], [0, 50])
  const watermarkX = useTransform(smoothProgress, [0, 1], ['0%', '-15%'])

  const scrollTo = (id: string) => {
    sounds.playClick(850)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} id="hero" className="relative py-12 md:py-16 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Background Cutting Mat Grid Guide Marks */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#5c4033_1px,transparent_1px),linear-gradient(to_bottom,#5c4033_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Oversized Background Watermark Kinetic Typography */}
      <motion.div
        style={{ x: watermarkX }}
        className="absolute top-1/2 left-0 -translate-y-1/2 font-black text-[12vw] text-[#5c4033]/5 select-none pointer-events-none whitespace-nowrap leading-none tracking-tighter"
      >
        UNIT-B04 • BOLT • haX.baby
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Introduction */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Track 2 Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#fef08a] border-2 border-[#5c4033] px-3 py-1 rounded-full text-xs font-mono font-bold text-[#854d0e] shadow-[2px_2px_0px_#5c4033] mb-4"
          >
            <Award className="w-3.5 h-3.5 text-[#d97706]" />
            <span>haX.baby 2026 • Track 2 Original Character</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2b1d14] tracking-tight leading-[1.08] mb-4"
          >
            Meet <span className="text-[#a34063] underline decoration-[#00f0b5] decoration-wavy">CutoBot</span>.
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-mono text-[#5c4033] font-normal block mt-2">
              "Small circuits, bright sparks."
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5c4033] leading-relaxed max-w-xl mb-6 font-sans"
          >
            Unit-B04 (affectionately called <strong>"Bolt"</strong>) is a copper-plated, solar-powered baby robot assembled out of spare parts in a midnight garage. Now on a quest across the digital workbench building whimsical inventions!
          </motion.p>

          {/* Quick Action Badges / CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <button
              onClick={() => scrollTo('projects')}
              className="px-5 py-2.5 bg-[#00f0b5] hover:bg-[#00d8a3] text-[#2b1d14] font-bold font-mono text-sm uppercase rounded-lg border-2 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#5c4033] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#2b1d14]" />
              <span>Explore 3+ Inventions</span>
            </button>

            <button
              onClick={() => scrollTo('character-sheet')}
              className="px-5 py-2.5 bg-[#fffaf3] hover:bg-orange-50 text-[#5c4033] font-bold font-mono text-sm uppercase rounded-lg border-2 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#5c4033] flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Character Sheet</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Sweet-tape Pinned Quick Notes with Staggered Scroll Settle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <motion.div
              initial={{ opacity: 0, rotate: -6, y: 30 }}
              animate={{ opacity: 1, rotate: -1.5, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StickyNote
                title="Maker Log #01"
                color="cream"
                tapeColor="kraft"
                rotation={-1.5}
              >
                <p className="font-hand text-lg leading-tight text-[#451a03]">
                  "Assembled at 2:43 AM with a broken clock radio, two servo motors, and a heart forged from genuine curiosity."
                </p>
              </StickyNote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: 6, y: 30 }}
              animate={{ opacity: 1, rotate: 1.5, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <StickyNote
                title="Daily Objective"
                color="yellow"
                tapeColor="yellow"
                rotation={1.5}
              >
                <p className="font-hand text-lg leading-tight text-[#78350f]">
                  "1. Soak up morning photons ☀️<br />
                  2. Test Holo-Rattle rattle frequencies<br />
                  3. Don't drive off the workbench edge!"
                </p>
              </StickyNote>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Interactive CutoBot Avatar Showcase with 3D Tilt */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative" style={{ perspective: 1000 }}>
          {/* Tactile Cutting Mat Stand with Scroll-linked 3D Perspective Tilt */}
          <motion.div
            style={{
              rotateX: standRotateX,
              rotateY: standRotateY,
              y: standY,
              transformStyle: 'preserve-3d',
            }}
            className="relative p-6 bg-gradient-to-b from-[#fbf5eb] to-[#f4e8d4] border-4 border-[#5c4033] rounded-2xl shadow-[8px_8px_0px_#5c4033] flex flex-col items-center transition-shadow hover:shadow-[12px_12px_0px_#5c4033]"
          >
            {/* Top Washi Tape Corner Pins */}
            <div className="absolute -top-3 -left-3 w-16 h-6 bg-[#fde047]/85 border border-[#a16207]/40 rotate-[-15deg] shadow-xs" />
            <div className="absolute -top-3 -right-3 w-16 h-6 bg-[#6ee7b7]/85 border border-[#047857]/40 rotate-[15deg] shadow-xs" />

            {/* Hint Badge */}
            <div className="mb-2 bg-[#2b1d14] text-[#00f0b5] px-3 py-1 rounded-full text-[11px] font-mono border border-[#5c4033] flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#f59e0b] animate-bounce" />
              <span>Eyes track your cursor! Tap antenna for confetti!</span>
            </div>

            {/* The Avatar */}
            <CutoBotAvatar
              mood={mood}
              onMoodChange={onMoodChange}
              batteryLevel={batteryLevel}
              size="lg"
              interactive={true}
            />

            {/* Bottom Hardware Info Bar */}
            <div className="mt-4 w-full grid grid-cols-3 gap-2 border-t-2 border-[#5c4033]/20 pt-3 text-center">
              <div>
                <span className="text-[10px] font-mono text-[#5c4033]/70 uppercase block">Model</span>
                <span className="font-mono text-xs font-bold text-[#2b1d14]">Unit-B04</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5c4033]/70 uppercase block">Power</span>
                <span className="font-mono text-xs font-bold text-[#10b981]">{batteryLevel}% Solar</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5c4033]/70 uppercase block">Heart</span>
                <span className="font-mono text-xs font-bold text-[#f43f5e] flex items-center justify-center gap-0.5">
                  <Heart className="w-3 h-3 fill-current" /> 60Hz
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
