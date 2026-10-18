import { useEffect, useState } from 'react'

export function SweetTapeScrollDecor() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {/* 1. Floating Washi Tape Strip Left (Parallax tilt) */}
      <div
        className="absolute left-3 top-1/4 w-32 h-7 bg-[#fde047]/80 border border-[#a16207]/40 shadow-xs hidden lg:flex items-center justify-center text-[9px] font-mono font-bold text-[#854d0e] uppercase tracking-widest transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * -0.05}px) rotate(${-12 + Math.sin(scrollY * 0.005) * 4}deg)`,
        }}
      >
        <span>★ SWEET-TAPE ★</span>
      </div>

      {/* 2. Floating Mint Tape Strip Right */}
      <div
        className="absolute right-4 top-1/3 w-36 h-8 bg-[#6ee7b7]/80 border border-[#047857]/40 shadow-xs hidden lg:flex items-center justify-center text-[9px] font-mono font-bold text-[#065f46] uppercase tracking-widest transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * -0.08}px) rotate(${15 + Math.cos(scrollY * 0.004) * 3}deg)`,
        }}
      >
        <span>UNIT-B04 • SOLAR</span>
      </div>

      {/* 3. Floating Caution Strip Left Lower */}
      <div
        className="absolute left-4 top-2/3 w-40 h-7 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 border border-[#5c4033]/40 shadow-xs hidden lg:flex items-center justify-center text-[9px] font-mono font-bold text-[#5c4033] uppercase tracking-widest transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * -0.04}px) rotate(${8 + Math.sin(scrollY * 0.003) * 5}deg)`,
        }}
      >
        <span>⚡ CAUTION: BABY GRIP ⚡</span>
      </div>

      {/* 4. Floating Berry Tape Strip Right Lower */}
      <div
        className="absolute right-5 top-3/4 w-32 h-7 bg-[#f472b6]/80 border border-[#9d174d]/30 shadow-xs hidden lg:flex items-center justify-center text-[9px] font-mono font-bold text-[#831843] uppercase tracking-widest transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * -0.06}px) rotate(${-9 + Math.cos(scrollY * 0.005) * 4}deg)`,
        }}
      >
        <span>haX.baby • 2026</span>
      </div>
    </div>
  )
}
