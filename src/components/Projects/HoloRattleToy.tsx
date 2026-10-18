import { useState, useEffect, useRef } from 'react'
import { sounds } from '../../audio/soundEffects'
import { RefreshCw, Sparkles, Volume2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Bead {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  type: 'star' | 'circle' | 'gear'
}

export function HoloRattleToy() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [shakeCount, setShakeCount] = useState(0)
  const [shakeEnergy, setShakeEnergy] = useState(0)
  const [beadTheme, setBeadTheme] = useState<'stars' | 'neon' | 'bolts'>('stars')
  const [isDragging, setIsDragging] = useState(false)
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 })
  const beadsRef = useRef<Bead[]>([])

  const themeColors = {
    stars: ['#00f0b5', '#38bdf8', '#fbbf24', '#f43f5e', '#ffffff'],
    neon: ['#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#f59e0b'],
    bolts: ['#d9be9b', '#b69168', '#5c4033', '#9ca3af', '#fcd34d'],
  }

  // Initialize beads
  const initBeads = () => {
    const beads: Bead[] = []
    const colors = themeColors[beadTheme]
    for (let i = 0; i < 22; i++) {
      beads.push({
        x: 150 + (Math.random() - 0.5) * 60,
        y: 110 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        radius: Math.random() * 5 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'gear',
      })
    }
    beadsRef.current = beads
  }

  useEffect(() => {
    initBeads()
  }, [beadTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const domeCenterX = 150
    const domeCenterY = 110
    const domeRadius = 78

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // DRAW RATTLE HANDLE & BASE
      // Wooden/copper handle stem
      ctx.save()
      ctx.fillStyle = '#b69168'
      ctx.strokeStyle = '#5c4033'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(140, 180, 20, 100, [6])
      ctx.fill()
      ctx.stroke()

      // Handle grip ribs
      ctx.fillStyle = '#5c4033'
      for (let y = 195; y <= 265; y += 14) {
        ctx.fillRect(139, y, 22, 3)
      }

      // Handle end knob
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(150, 290, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // DOME BACKGROUND
      ctx.save()
      const grad = ctx.createRadialGradient(
        domeCenterX - 20,
        domeCenterY - 20,
        10,
        domeCenterX,
        domeCenterY,
        domeRadius
      )
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)')
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.65)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(domeCenterX, domeCenterY, domeRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // UPDATE & DRAW BEADS
      const beads = beadsRef.current
      const gravity = 0.22

      beads.forEach((b) => {
        b.vy += gravity
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.985
        b.vy *= 0.985

        // Circle boundary collision
        const dx = b.x - domeCenterX
        const dy = b.y - domeCenterY
        const dist = Math.hypot(dx, dy)
        const maxDist = domeRadius - b.radius

        if (dist > maxDist) {
          const angle = Math.atan2(dy, dx)
          b.x = domeCenterX + Math.cos(angle) * maxDist
          b.y = domeCenterY + Math.sin(angle) * maxDist

          // Reflect velocity
          const normalX = Math.cos(angle)
          const normalY = Math.sin(angle)
          const dot = b.vx * normalX + b.vy * normalY

          b.vx = (b.vx - 2 * dot * normalX) * 0.75
          b.vy = (b.vy - 2 * dot * normalY) * 0.75

          // Collision audio with dynamic velocity-based pitch
          const speed = Math.hypot(b.vx, b.vy)
          if (speed > 1.8 && Math.random() < 0.25) {
            sounds.playRattle(400 + Math.min(600, speed * 80))
          }
        }

        // Draw bead
        ctx.save()
        ctx.fillStyle = b.color
        ctx.strokeStyle = '#2b1d14'
        ctx.lineWidth = 1.5

        if (b.type === 'star') {
          // Draw mini star
          ctx.beginPath()
          for (let s = 0; s < 5; s++) {
            const rot = (Math.PI / 2) * 3
            const x = b.x + Math.cos(rot + (s * Math.PI) / 2.5) * b.radius
            const y = b.y + Math.sin(rot + (s * Math.PI) / 2.5) * b.radius
            if (s === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
            const xi = b.x + Math.cos(rot + ((s + 0.5) * Math.PI) / 2.5) * (b.radius * 0.5)
            const yi = b.y + Math.sin(rot + ((s + 0.5) * Math.PI) / 2.5) * (b.radius * 0.5)
            ctx.lineTo(xi, yi)
          }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        } else if (b.type === 'gear') {
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          // Inner hole
          ctx.fillStyle = '#1e293b'
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.radius * 0.4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        ctx.restore()
      })

      // GLASS DOME HIGHLIGHTS & RIM
      ctx.save()
      ctx.strokeStyle = '#5c4033'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(domeCenterX, domeCenterY, domeRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Shiny curved specular highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(domeCenterX, domeCenterY, domeRadius - 8, -Math.PI * 0.75, -Math.PI * 0.25)
      ctx.stroke()

      // Holographic shimmer ring
      ctx.strokeStyle = 'rgba(0, 240, 181, 0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(domeCenterX, domeCenterY, domeRadius - 16, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [beadTheme])

  // Shake rattle button action
  const triggerShake = (intensity = 18) => {
    sounds.playBoing()
    sounds.playRattle(650)
    setShakeCount((prev) => prev + 1)
    setShakeEnergy((prev) => {
      const next = Math.min(100, prev + 25)
      if (next >= 100) {
        // Trigger celebration
        sounds.playFanfare()
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0b5', '#38bdf8', '#f59e0b'],
        })
      }
      return next
    })

    beadsRef.current.forEach((b) => {
      b.vx += (Math.random() - 0.5) * intensity
      b.vy -= Math.random() * intensity + 4
    })
  }

  // Energy decay over time
  useEffect(() => {
    const timer = setInterval(() => {
      setShakeEnergy((prev) => Math.max(0, prev - 3))
    }, 200)
    return () => clearInterval(timer)
  }, [])

  // Mouse drag handling to shake physics
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: Date.now() }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const now = Date.now()
    const dt = Math.max(1, now - lastMousePos.current.time)
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    const speed = Math.hypot(dx, dy) / dt

    if (speed > 0.4) {
      beadsRef.current.forEach((b) => {
        b.vx += dx * 0.15
        b.vy += dy * 0.15
      })
      if (Math.random() < 0.2) {
        sounds.playRattle(450 + Math.min(500, speed * 200))
      }
      setShakeEnergy((prev) => Math.min(100, prev + 2))
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative bg-[#fffaf3] border-2 border-[#5c4033] p-6 shadow-[5px_5px_0px_#5c4033] rounded-xl flex flex-col items-center">
      {/* Top Tape Header */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#fef08a] border border-[#a16207]/40 shadow-xs rotate-[-1deg] text-[11px] font-mono font-bold uppercase text-[#854d0e] flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-[#d97706]" /> Toy #01: The Holo-Rattle
      </div>

      <div className="w-full flex justify-between items-center mt-2 mb-3">
        <div>
          <h4 className="font-bold text-lg text-[#5c4033] tracking-tight">
            The Holo-Rattle
          </h4>
          <p className="text-xs text-[#5c4033]/70 font-mono">
            Unit-B04's sensory kinetic test chamber
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#fff8f1] border border-[#5c4033] px-2 py-1 rounded-md text-xs font-mono">
          <Volume2 className="w-3.5 h-3.5 text-[#00f0b5]" />
          <span>Shakes: {shakeCount}</span>
        </div>
      </div>

      {/* Physics Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative border-2 border-dashed border-[#5c4033]/40 rounded-xl bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]/40 p-2 cursor-grab active:cursor-grabbing select-none transition-shadow ${
          isDragging ? 'shadow-inner' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={310}
          className="rounded-lg block"
        />
        <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
          <span className="text-[10px] font-mono text-[#5c4033]/60 bg-white/80 px-2 py-0.5 rounded-full border border-[#5c4033]/20">
            Drag to shake, or press button below!
          </span>
        </div>
      </div>

      {/* Energy Shake Progress Bar */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-xs font-mono mb-1 text-[#5c4033]">
          <span>Joy Resonance</span>
          <span>{shakeEnergy}%</span>
        </div>
        <div className="w-full h-3 bg-[#e2e8f0] border-2 border-[#5c4033] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#00f0b5] via-[#38bdf8] to-[#f43f5e] rounded-full transition-all duration-150"
            style={{ width: `${shakeEnergy}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#5c4033]/20">
        <div className="flex gap-1">
          {(['stars', 'neon', 'bolts'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sounds.playClick(900)
                setBeadTheme(t)
              }}
              className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border border-[#5c4033] transition-all ${
                beadTheme === t
                  ? 'bg-[#5c4033] text-white shadow-xs'
                  : 'bg-white hover:bg-black/5 text-[#5c4033]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => initBeads()}
            title="Reset beads"
            className="p-1.5 rounded border border-[#5c4033] bg-white hover:bg-black/5 text-[#5c4033]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => triggerShake(22)}
            className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold text-xs uppercase font-mono flex items-center gap-1 rounded"
          >
            <Sparkles className="w-3.5 h-3.5" /> Shake It!
          </button>
        </div>
      </div>
    </div>
  )
}
