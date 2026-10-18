import { useState } from 'react'
import { sounds } from '../../audio/soundEffects'
import { Sun, BatteryCharging, Zap, Sparkles, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'

interface SolarChargingBackpackProps {
  batteryLevel: number
  onChargeChange: (level: number) => void
}

export function SolarChargingBackpack({
  batteryLevel,
  onChargeChange,
}: SolarChargingBackpackProps) {
  const [draggedToken, setDraggedToken] = useState<number | null>(null)
  const [sunTokens, setSunTokens] = useState([1, 2, 3, 4, 5])
  const [solarIntensity, setSolarIntensity] = useState<'mild' | 'bright' | 'superflare'>('bright')

  const handleDropToken = (tokenId: number) => {
    sounds.playZap(batteryLevel > 90 ? 3 : 1)
    const boost = solarIntensity === 'mild' ? 10 : solarIntensity === 'bright' ? 18 : 30
    const newLevel = Math.min(120, batteryLevel + boost)
    onChargeChange(newLevel)

    // Remove token temporarily and respawn after 1.5s
    setSunTokens((prev) => prev.filter((id) => id !== tokenId))
    setTimeout(() => {
      setSunTokens((prev) => [...prev, tokenId])
    }, 1500)

    // Overcharge celebration
    if (newLevel >= 100) {
      sounds.playFanfare()
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#00f0b5', '#38bdf8'],
      })
    }
  }

  const handleResetCharge = () => {
    sounds.playClick(600)
    onChargeChange(24)
  }

  const isOvercharged = batteryLevel >= 100

  return (
    <div className="relative bg-[#fffaf3] border-2 border-[#5c4033] p-6 shadow-[5px_5px_0px_#5c4033] rounded-xl flex flex-col items-center">
      {/* Top Tape Header */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#fed7aa] border border-[#ea580c]/40 shadow-xs rotate-[-1deg] text-[11px] font-mono font-bold uppercase text-[#c2410c] flex items-center gap-1.5">
        <Sun className="w-3.5 h-3.5 text-[#ea580c]" /> Project #03: Solar-Panel Backpack
      </div>

      <div className="w-full flex justify-between items-center mt-2 mb-3">
        <div>
          <h4 className="font-bold text-lg text-[#5c4033] tracking-tight">
            Solar-Panel Backpack
          </h4>
          <p className="text-xs text-[#5c4033]/70 font-mono">
            Tactile Sweet-Tape Charging Dock & Photovoltaic Cell
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-colors ${
            isOvercharged
              ? 'bg-[#fef08a] border-[#d97706] text-[#b45309] animate-pulse'
              : 'bg-[#ecfdf5] border-[#059669] text-[#047857]'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          <span>{batteryLevel}% {isOvercharged ? 'TURBO!' : ''}</span>
        </div>
      </div>

      {/* CHARGING STATION DISPLAY */}
      <div className="w-full relative bg-[#1c1917] border-2 border-[#5c4033] rounded-xl p-5 mb-4 text-center">
        {/* Solar Cell Visualizer */}
        <div className="relative mx-auto max-w-xs">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#f59e0b] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Photovoltaic Receiver Mat
            </span>
          </div>

          {/* Droppable Solar Array Target */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedToken !== null) {
                handleDropToken(draggedToken)
                setDraggedToken(null)
              }
            }}
            className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
              isOvercharged
                ? 'border-[#f59e0b] bg-[#f59e0b]/15 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'border-[#38bdf8]/60 bg-[#0c4a6e]/20 hover:border-[#38bdf8]'
            }`}
          >
            {/* Battery Cell Segment Array */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {[20, 40, 60, 80, 100].map((threshold, i) => {
                const filled = batteryLevel >= threshold
                const over = batteryLevel > 100 && i === 4
                return (
                  <div
                    key={threshold}
                    className={`h-10 rounded border transition-all duration-300 flex items-center justify-center font-mono text-[10px] font-bold ${
                      over
                        ? 'bg-[#f59e0b] border-yellow-300 text-black animate-pulse shadow-md'
                        : filled
                        ? 'bg-[#10b981] border-emerald-400 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {threshold}%
                  </div>
                )
              })}
            </div>

            {/* Target Drop Zone Caption */}
            <div className="text-white text-xs font-mono">
              {isOvercharged ? (
                <div className="text-[#f59e0b] font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" /> 120% OVERDRIVE UNLOCKED!
                </div>
              ) : (
                <span className="text-zinc-400">
                  Drop Sunlight Tokens here or click them below!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TACTILE SUNLIGHT TOKENS (Sweet-tape peelable tokens) */}
      <div className="w-full bg-[#fefce8] border-2 border-[#5c4033] rounded-lg p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-[#854d0e] uppercase tracking-wider flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-[#eab308]" /> Sunlight Tokens (Drag or Click to Feed):
          </span>
          <span className="text-[10px] font-mono text-[#a16207]">
            {sunTokens.length} Available
          </span>
        </div>

        <div className="flex items-center justify-center gap-2.5 flex-wrap min-h-[48px]">
          {sunTokens.map((tokenId) => (
            <button
              key={tokenId}
              draggable
              onDragStart={() => setDraggedToken(tokenId)}
              onClick={() => handleDropToken(tokenId)}
              className="group relative cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-150"
              title="Click or drag onto CutoBot's backpack"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fef08a] via-[#fde047] to-[#eab308] border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                <Sun className="w-6 h-6 text-[#78350f] group-hover:rotate-45 transition-transform duration-300" />
              </div>
              {/* Mini washi tape strip holding token */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#fde047]/80 border border-[#a16207]/30 rotate-3 pointer-events-none" />
            </button>
          ))}
          {sunTokens.length === 0 && (
            <span className="text-xs font-mono text-[#a16207] italic animate-pulse">
              Re-harvesting sunbeams... ✨
            </span>
          )}
        </div>
      </div>

      {/* INTENSITY & CONTROLS */}
      <div className="w-full flex items-center justify-between gap-2 pt-3 border-t border-[#5c4033]/20">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-[#5c4033] font-bold uppercase mr-1">
            Sun:
          </span>
          {(['mild', 'bright', 'superflare'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sounds.playClick(900)
                setSolarIntensity(mode)
              }}
              className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border border-[#5c4033] transition-all ${
                solarIntensity === mode
                  ? 'bg-[#5c4033] text-white'
                  : 'bg-white hover:bg-black/5 text-[#5c4033]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={handleResetCharge}
          className="text-xs font-mono font-semibold px-2.5 py-1 rounded border border-[#5c4033] bg-white hover:bg-black/5 text-[#5c4033] flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Drain
        </button>
      </div>
    </div>
  )
}
