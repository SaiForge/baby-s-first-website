import { useEffect, useRef } from 'react'

interface CosmicDitherOverlayProps {
  active: boolean
}

export function CosmicDitherOverlay({ active }: CosmicDitherOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!active) return

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

    // Cosmic starlight particles
    const starCount = 80
    const stars: { x: number; y: number; size: number; speed: number; alpha: number }[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() < 0.2 ? 3 : 1.5,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.8 + 0.2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Twinkling stars
      stars.forEach((s) => {
        s.y -= s.speed
        if (s.y < 0) {
          s.y = canvas.height
          s.x = Math.random() * canvas.width
        }

        ctx.fillStyle = '#00f0b5'
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(Date.now() * 0.003 + s.x) * 0.4)
        ctx.fillRect(s.x, s.y, s.size, s.size)
      })

      ctx.globalAlpha = 1.0
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden mix-blend-screen">
      {/* Astrodither pixel starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2x2 / 4x4 Bayer Dithering Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(#00f0b5 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
          backgroundPosition: '0 0, 2px 2px',
        }}
      />

      {/* CRT Scanline bars */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)',
        }}
      />

      {/* Subtle cosmic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,12,22,0.6)_100%)]" />
    </div>
  )
}
