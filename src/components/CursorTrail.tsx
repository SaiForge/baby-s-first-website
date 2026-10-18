import { useEffect, useRef, useState } from 'react'

interface Spark {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const sparksRef = useRef<Spark[]>([])
  const nextId = useRef(0)

  const colors = ['#00f0b5', '#f59e0b', '#38bdf8', '#f43f5e', '#ffffff']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })

      // Detect if hovering over clickable element
      const target = e.target as HTMLElement
      const clickable = !!target?.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer')
      setIsPointer(clickable)

      // Spawn subtle circuit sparks
      if (Math.random() < 0.35) {
        sparksRef.current.push({
          id: nextId.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 + 0.5,
          life: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 2,
        })
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Burst of sparks on click
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12
        const speed = Math.random() * 3 + 1.5
        sparksRef.current.push({
          id: nextId.current++,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw sparks
      const sparks = sparksRef.current
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= 0.035

        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }

        ctx.fillStyle = s.color
        ctx.globalAlpha = s.life
        // Draw pixel-style square spark
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size)
      }

      ctx.globalAlpha = 1.0
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      />
      {/* Astrodither style custom reticle cursor */}
      <div
        className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.3 : 1})`,
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer crosshair ring */}
          <div
            className={`w-6 h-6 rounded-full border border-dashed transition-colors duration-200 ${
              isPointer
                ? 'border-[#00f0b5] bg-[#00f0b5]/15 rotate-45'
                : 'border-[#5c4033]/60'
            }`}
          />
          {/* Center glowing pixel core */}
          <div
            className={`absolute w-1.5 h-1.5 rounded-xs transition-colors duration-200 ${
              isPointer ? 'bg-[#00f0b5]' : 'bg-[#f59e0b]'
            }`}
          />
        </div>
      </div>
    </>
  )
}
