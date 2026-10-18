import { useState } from 'react'
import { motion } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { StickyNote } from './StickyNote'
import { Cpu, ShieldCheck, Volume2, Sparkles } from 'lucide-react'

export function CharacterSheet() {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null)

  const voiceClips = [
    { label: '"Greetings creator!"', text: 'Beep beep! Hello there, human friend!', freq: 650 },
    { label: '"Small circuits, bright sparks!"', text: 'Small circuits, bright sparks! That is my life motto!', freq: 720 },
    { label: '"Check my antenna!"', text: 'Boing! Antenna tuned to 108.4 MHz cosmic radio!', freq: 880 },
    { label: '"Solder smells sweet!"', text: 'Mmm, nothing like rosin-core solder in the morning!', freq: 560 },
  ]

  const playVoice = (clip: typeof voiceClips[0]) => {
    sounds.playSqueak()
    setActiveSpeech(clip.text)
    setTimeout(() => {
      sounds.playChime(clip.freq, 0.4)
    }, 150)
  }

  return (
    <section id="character-sheet" className="py-16 px-4 max-w-6xl mx-auto relative">
      {/* SECTION HEADER WITH OVERSIZED BOLD TYPOGRAPHY & RIBBON */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-[#fbcfe8] border-2 border-[#831843] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#831843] shadow-[2px_2px_0px_#831843] mb-3"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Track 2 Official Character Dossier</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-extrabold text-[#2b1d14] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          THE 5-POINT CHARACTER SHEET.
        </motion.h2>

        <p className="text-sm sm:text-base text-[#5c4033] font-mono mt-1 max-w-xl mx-auto">
          Everything you need to know about Unit-B04 ("Bolt") — documented with sweet-tape field notes.
        </p>
      </div>

      {/* Grid of 5 Track 2 Pillars with Staggered Physics Drop/Settle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Point 1: Name */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <StickyNote
            title="1. Official Designation"
            color="cream"
            tapeColor="kraft"
            rotation={-1}
            stamp="VERIFIED"
          >
            <div className="space-y-1">
              <p className="font-extrabold text-lg text-[#2b1d14]">
                CutoBot (Unit-B04)
              </p>
              <p className="text-xs text-[#5c4033] font-mono">
                Affectionately nicknamed <strong className="text-[#a34063]">"Bolt"</strong> by the midnight garage mice who helped solder his first jumper wire.
              </p>
            </div>
          </StickyNote>
        </motion.div>

        {/* Point 2: What They Are */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <StickyNote
            title="2. What They Are"
            color="mint"
            tapeColor="mint"
            rotation={1}
            stamp="PROTOTYPE"
          >
            <p className="text-xs leading-relaxed text-[#064e3b]">
              A pint-sized, copper-plated baby robot with a rounded dome head, pulsing LED eye visor (mood-reactive), and squiggly magnetic antenna. Stands 12.7 cm tall on baby caterpillar treads!
            </p>
          </StickyNote>
        </motion.div>

        {/* Point 3: What They Do */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -5 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <StickyNote
            title="3. What They Do"
            color="yellow"
            tapeColor="yellow"
            rotation={-1.5}
          >
            <div className="space-y-1">
              <span className="inline-block bg-[#f59e0b] text-black font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                Junior Circuit Tinker
              </span>
              <p className="text-xs text-[#78350f]">
                Builds tiny useless-but-adorable machines that solve problems nobody knew existed—like music boxes for sleepy circuits and holographic rattles!
              </p>
            </div>
          </StickyNote>
        </motion.div>

        {/* Point 4: Their Story */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1.2 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="md:col-span-2"
        >
          <StickyNote
            title="4. Origin Story"
            color="pink"
            tapeColor="pink"
            rotation={1.2}
          >
            <p className="text-xs leading-relaxed text-[#831843]">
              Assembled out of spare parts in a midnight garage from a salvaged 1980s bedside alarm clock, broken vacuum tubes, and an old solar calculator cell. Having awakened to discover a gigantic workshop table, Bolt set out on a grand expedition across cutting mats, solder puddles, and coffee rings to map the universe, one circuit at a time.
            </p>
          </StickyNote>
        </motion.div>

        {/* Point 5: Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <StickyNote
            title="5. Core Tagline"
            color="cyan"
            tapeColor="caution"
            rotation={-0.8}
          >
            <blockquote className="font-mono font-bold text-base text-[#155e75] italic my-1 border-l-4 border-[#0891b2] pl-2">
              “Small circuits, bright sparks.”
            </blockquote>
            <p className="text-[11px] text-[#155e75]/80">
              A reminder that you don't need a supercomputer to ignite wonder in someone's heart.
            </p>
          </StickyNote>
        </motion.div>
      </div>

      {/* BLUEPRINT SCHEMATIC SHOWCASE & HARDWARE SPECS (3D PERSPECTIVE CONTAINER) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        style={{ perspective: 1200 }}
        className="relative bg-[#fdf8f0] border-4 border-[#5c4033] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#5c4033] transition-all hover:shadow-[12px_12px_0px_#5c4033]"
      >
        {/* Washi Tape Header Strip */}
        <div className="absolute -top-4 left-8 px-6 py-1 bg-[#fed7aa] border-2 border-[#5c4033] shadow-xs rotate-[-1deg] text-xs font-mono font-bold uppercase text-[#7c2d12] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Schematic Blueprint: Drawing #B04-SPEC</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
          {/* Blueprint Image Preview with Zoom elevation */}
          <div className="lg:col-span-7">
            <div className="relative border-2 border-[#5c4033] rounded-2xl overflow-hidden shadow-md group">
              <img
                src="/assets/cutobot_blueprint.jpg"
                alt="Engineering blueprint of CutoBot Unit-B04"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute bottom-2 right-2 bg-black/75 text-[#00f0b5] text-[10px] font-mono px-2 py-0.5 rounded border border-[#00f0b5]/40 backdrop-blur-xs">
                SPEC-SHEET: REVISION 2.4
              </div>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-bold text-[#5c4033] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#f59e0b]" />
              <span>Hardware Architecture</span>
            </h3>

            <div className="border-2 border-[#5c4033] rounded-xl bg-white overflow-hidden text-xs font-mono shadow-inner">
              <table className="w-full divide-y divide-[#5c4033]/20">
                <tbody className="divide-y divide-[#5c4033]/10">
                  <tr className="bg-[#fffaf3]">
                    <td className="p-2.5 font-bold text-[#5c4033]">Chassis Material</td>
                    <td className="p-2.5 text-[#2b1d14]">Electroplated Copper & Brass</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#5c4033]">Height / Weight</td>
                    <td className="p-2.5 text-[#2b1d14]">12.7 cm / 380 grams</td>
                  </tr>
                  <tr className="bg-[#fffaf3]">
                    <td className="p-2.5 font-bold text-[#5c4033]">Power Unit</td>
                    <td className="p-2.5 text-[#2b1d14]">Dual-Cell Monocrystalline Solar Pack</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#5c4033]">Visual Sensor</td>
                    <td className="p-2.5 text-[#2b1d14]">64-Pixel OLED Visor (4 Expressive Modes)</td>
                  </tr>
                  <tr className="bg-[#fffaf3]">
                    <td className="p-2.5 font-bold text-[#5c4033]">Locomotion</td>
                    <td className="p-2.5 text-[#2b1d14]">Dual Micro-Gear Caterpillar Treads</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#5c4033]">Antenna Band</td>
                    <td className="p-2.5 text-[#2b1d14]">Floppy Copper Spring (Cosmic AM/FM)</td>
                  </tr>
                  <tr className="bg-[#fffaf3]">
                    <td className="p-2.5 font-bold text-[#5c4033]">OS Kernel</td>
                    <td className="p-2.5 text-[#2b1d14]">BabyRobo-RTOS v0.4.2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Voice Box */}
            <div className="bg-[#fef9c3] border-2 border-[#ca8a04] p-3.5 rounded-xl shadow-[3px_3px_0px_#ca8a04]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#854d0e] mb-2">
                <Volume2 className="w-4 h-4 text-[#d97706]" />
                <span>Test Bolt's Synthesizer Voicebox:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {voiceClips.map((clip, i) => (
                  <button
                    key={i}
                    onClick={() => playVoice(clip)}
                    className="px-2 py-1.5 bg-white hover:bg-amber-100 border border-[#ca8a04] text-[11px] font-mono font-semibold text-[#854d0e] rounded shadow-xs active:translate-y-0.5 text-left truncate cursor-pointer transition-all"
                  >
                    🔊 {clip.label}
                  </button>
                ))}
              </div>
              {activeSpeech && (
                <div className="mt-2 text-xs font-mono bg-white border border-[#ca8a04] p-2 rounded text-[#a16207] italic animate-fade-in">
                  "{activeSpeech}"
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
