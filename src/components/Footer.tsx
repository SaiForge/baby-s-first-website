import { useState } from 'react'
import { motion } from 'framer-motion'
import { sounds } from '../audio/soundEffects'
import { Heart, ArrowUp, Radio } from 'lucide-react'
import confetti from 'canvas-confetti'

export function Footer() {
  const [isPlayingMorse, setIsPlayingMorse] = useState(false)

  const scrollToTop = () => {
    sounds.playBoing()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Play Morse Code for "BOLT" (.--. --- .-.. -) via Web Audio
  const playMorseCode = () => {
    if (isPlayingMorse) return
    setIsPlayingMorse(true)

    // B: -...  O: ---  L: .-..  T: -
    const morsePattern = [
      { t: 0.18, pause: 0.08 }, // dah
      { t: 0.06, pause: 0.08 }, // dit
      { t: 0.06, pause: 0.08 }, // dit
      { t: 0.06, pause: 0.2 },  // dit
      { t: 0.18, pause: 0.08 }, // dah
      { t: 0.18, pause: 0.08 }, // dah
      { t: 0.18, pause: 0.2 },  // dah
      { t: 0.06, pause: 0.08 }, // dit
      { t: 0.18, pause: 0.08 }, // dah
      { t: 0.06, pause: 0.08 }, // dit
      { t: 0.06, pause: 0.2 },  // dit
      { t: 0.18, pause: 0.2 },  // dah
    ]

    let timeOffset = 0
    morsePattern.forEach((item) => {
      setTimeout(() => {
        sounds.playChime(800, item.t)
      }, timeOffset * 1000)
      timeOffset += item.t + item.pause
    })

    setTimeout(() => {
      setIsPlayingMorse(false)
      confetti({
        particleCount: 20,
        spread: 40,
        colors: ['#00f0b5', '#38bdf8'],
      })
    }, timeOffset * 1000 + 100)
  }

  return (
    <footer className="w-full bg-[#2b1d14] text-[#fff8f1] border-t-4 border-[#5c4033] py-12 px-4 relative overflow-hidden">
      {/* Top Curved Divider connecting workbench to footer */}
      <div className="absolute -top-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="relative block w-full h-8 sm:h-12 fill-[#fff8f1]"
        >
          <path d="M0,0 C300,60 900,60 1200,0 L1200,0 L0,0 Z" />
        </svg>
      </div>

      {/* Top Washi Tape Divider */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-6 py-1 bg-[#fed7aa] border-2 border-[#5c4033] shadow-xs rotate-[-0.5deg] text-xs font-mono font-bold uppercase text-[#7c2d12] z-10">
        Official haX.baby 2026 Hackathon Submission
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-6 mb-8 relative z-10">
        {/* Brand & Mission with Motion */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00f0b5] animate-pulse" />
            <h4 className="font-extrabold text-xl text-white tracking-tight">
              CutoBot (Unit-B04)
            </h4>
            <span className="bg-[#00f0b5] text-[#2b1d14] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
              Track 2: Baby Robo
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            "Small circuits, bright sparks." Assembled with copper wire, solder rosin, and curious wonder for the 48-Hour haX.baby Online Hackathon (October 17–19, 2026).
          </p>
        </motion.div>

        {/* Secret Morse Code Radio Transmitter Easter Egg */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-4 bg-[#1c1917] border-2 border-[#5c4033] p-4 rounded-2xl shadow-[4px_4px_0px_#000] text-center"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1.5 flex items-center justify-center gap-1">
            <Radio className="w-3.5 h-3.5 text-amber-400" /> Secret AM Radio Transmitter
          </span>
          <button
            onClick={playMorseCode}
            disabled={isPlayingMorse}
            className="px-3.5 py-1.5 bg-[#5c4033] hover:bg-[#78350f] text-white rounded-lg font-mono text-xs font-bold transition-all border border-amber-600/40 flex items-center justify-center gap-1.5 mx-auto active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isPlayingMorse ? 'TRANSMITTING MORSE...' : 'Broadcast "B-O-L-T"'}</span>
          </button>
          <span className="text-[9px] font-mono text-zinc-500 block mt-1.5">
            Sends 800Hz audio carrier wave to cosmos
          </span>
        </motion.div>

        {/* Back to top */}
        <div className="md:col-span-3 flex justify-start md:justify-end">
          <button
            onClick={scrollToTop}
            className="px-4 py-2 bg-[#00f0b5] hover:bg-[#00d8a3] text-[#2b1d14] border-2 border-[#5c4033] font-mono text-xs font-bold uppercase rounded-lg shadow-[3px_3px_0px_#000] active:translate-y-0.5 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 gap-2 relative z-10">
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#f43f5e] fill-current" />
          <span>for haX.baby Hackathon 2026 • MIT Licensed</span>
        </div>
        <div className="text-zinc-500">
          Vite • React 19 • Tailwind CSS v4 • WebGL Three.js • Web Audio API
        </div>
      </div>
    </footer>
  )
}
