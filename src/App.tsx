import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { TactileScrollJourney } from './components/TactileScrollJourney'
import { CharacterSheet } from './components/CharacterSheet'
import { RobotJourney } from './components/RobotJourney'
import { ProjectsSection } from './components/ProjectsSection'
import { TactileWorkbench } from './components/TactileWorkbench'
import { CosmicDitherOverlay } from './components/CosmicDitherOverlay'
import { CursorTrail } from './components/CursorTrail'
import { ThreeBackgroundCanvas } from './components/ThreeBackgroundCanvas'
import { SweetTapeScrollDecor } from './components/SweetTapeScrollDecor'
import { ScrollGuideBot } from './components/ScrollGuideBot'
import { Footer } from './components/Footer'
import type { MoodType } from './components/CutoBotAvatar'

export function App() {
  const [isCosmicMode, setIsCosmicMode] = useState(false)
  const [mood, setMood] = useState<MoodType>('happy')
  const [batteryLevel, setBatteryLevel] = useState(84)

  // Cosmic mode toggle
  const handleToggleCosmic = () => {
    setIsCosmicMode((prev) => !prev)
  }

  // Reflect overcharge in robot mood
  useEffect(() => {
    if (batteryLevel >= 100 && mood !== 'overcharged') {
      setMood('overcharged')
    }
  }, [batteryLevel, mood])

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative ${
        isCosmicMode
          ? 'bg-[#0a0c16] text-[#e2e8f0]'
          : 'bg-[#fff8f1] text-[#2b1d14]'
      }`}
    >
      {/* 3D WebGL Parallax Background (Floating Gears, Solar Prisms & Resistors) */}
      <ThreeBackgroundCanvas isCosmicMode={isCosmicMode} />

      {/* Sweet-Tape Style Parallax Floating Washi Tapes & Ribbons */}
      <SweetTapeScrollDecor />

      {/* AstroDither Custom Spark Trail & Pointer */}
      <CursorTrail />

      {/* AstroDither Cosmic Pixel Shader & Starfield Overlay */}
      <CosmicDitherOverlay active={isCosmicMode} />

      {/* Top Sticky Header */}
      <Navbar
        isCosmicMode={isCosmicMode}
        onToggleCosmic={handleToggleCosmic}
      />

      {/* Main Content Area */}
      <main className="relative z-10 space-y-16 pb-16">
        {/* 1. Hero Showcase with Interactive Robot Avatar & Sweet-Tape Sticky Notes */}
        <HeroSection
          mood={mood}
          onMoodChange={setMood}
          batteryLevel={batteryLevel}
        />

        {/* 2. Tactile Scroll Journey: Pseudo-3D Elements, Kinetic Typography, Unrolling Tape & Sandbox Dropper */}
        <TactileScrollJourney />

        {/* 3. Track 2 Requirements: The 5-Point Character Sheet & Blueprint */}
        <CharacterSheet />

        {/* 3. The Robot Journey: Modular Narrative Scroll inspired by cutobot.byholm.co */}
        <RobotJourney />

        {/* 4. Showcase Projects: Holo-Rattle (Toy #1), Clockwork Lullaby Box (#2), Solar Backpack (#3), and Three.js 3D WebGL Matrix */}
        <ProjectsSection
          batteryLevel={batteryLevel}
          onChargeChange={setBatteryLevel}
        />

        {/* 5. Tactile Workbench: Sweet-Tape pegboard, Live Hit Counter, Community Notes */}
        <TactileWorkbench />
      </main>

      {/* Cutobot.byholm.co Inspired Interactive Scroll Companion Guide */}
      <ScrollGuideBot />

      {/* Footer with Morse Code AM Radio Easter Egg */}
      <Footer />
    </div>
  )
}

export default App
