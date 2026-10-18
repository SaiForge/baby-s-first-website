import React, { useState } from 'react'
import { sounds } from '../audio/soundEffects'

interface StickyNoteProps {
  title?: string
  children: React.ReactNode
  color?: 'cream' | 'yellow' | 'pink' | 'mint' | 'cyan'
  tapeColor?: 'kraft' | 'yellow' | 'pink' | 'mint' | 'caution'
  rotation?: number
  pin?: boolean
  stamp?: string
  className?: string
  id?: string
  onClick?: () => void
}

export function StickyNote({
  title,
  children,
  color = 'cream',
  tapeColor = 'kraft',
  rotation = -1,
  pin = false,
  stamp,
  className = '',
  id,
  onClick,
}: StickyNoteProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const bgColors = {
    cream: 'bg-[#fffaf3] border-[#5c4033]',
    yellow: 'bg-[#fef9c3] border-[#78350f]',
    pink: 'bg-[#ffe4e6] border-[#881337]',
    mint: 'bg-[#ecfdf5] border-[#065f46]',
    cyan: 'bg-[#ecfeff] border-[#155e75]',
  }

  const tapeStyles = {
    kraft: 'bg-[#e3d0b9]/85 border-[#5c4033]/20 text-[#5c4033]',
    yellow: 'bg-[#fde047]/85 border-[#a16207]/30 text-[#854d0e]',
    pink: 'bg-[#f472b6]/85 border-[#9d174d]/30 text-[#831843]',
    mint: 'bg-[#6ee7b7]/85 border-[#047857]/30 text-[#065f46]',
    caution: 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 border-dashed border-[#5c4033]/40 text-[#5c4033]',
  }

  const handleMouseEnter = () => {
    sounds.playClick(950)
    setIsHovered(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 10, y: x * 10 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      id={id}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : `perspective(800px) rotate(${rotation}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative p-6 border-2 transition-all duration-150 ease-out hover:shadow-[6px_6px_0px_#5c4033] shadow-[4px_4px_0px_#5c4033] ${bgColors[color]} ${className}`}
    >
      {/* Push Pin or Washi Tape */}
      {pin ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" style={{ transform: 'translateZ(15px)' }}>
          <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-[#5c4033] shadow-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
          </div>
          <div className="w-0.5 h-2 bg-gray-500 mx-auto -mt-0.5"></div>
        </div>
      ) : (
        <div
          style={{ transform: 'translateZ(12px) rotate(1deg)' }}
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 border backdrop-blur-xs shadow-xs flex items-center justify-center text-[10px] font-mono tracking-widest uppercase opacity-90 select-none ${tapeStyles[tapeColor]}`}
        >
          <div className="w-full flex justify-between px-1 text-[8px] opacity-40">
            <span>●</span>
            <span>haX.tape</span>
            <span>●</span>
          </div>
        </div>
      )}

      {/* Decorative Rubber Stamp */}
      {stamp && (
        <div
          style={{ transform: 'translateZ(8px) rotate(12deg)' }}
          className="absolute top-3 right-3 select-none pointer-events-none border-2 border-dashed border-red-500/60 text-red-500/70 font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest rounded"
        >
          {stamp}
        </div>
      )}

      {title && (
        <h3
          style={{ transform: 'translateZ(6px)' }}
          className="font-bold text-[#a34063] mb-2 text-base uppercase tracking-wider flex items-center gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f0b5] border border-[#5c4033]"></span>
          {title}
        </h3>
      )}

      <div style={{ transform: 'translateZ(4px)' }} className="text-[#2b1d14] text-sm leading-relaxed">
        {children}
      </div>

      {/* Corner fold effect */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-black/10 to-transparent pointer-events-none"></div>
    </div>
  )
}
