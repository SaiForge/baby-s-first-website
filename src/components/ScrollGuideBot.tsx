import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { sounds } from '../audio/soundEffects'
import { ChevronUp, ChevronDown, Layers, X, MessageSquare } from 'lucide-react'
import confetti from 'canvas-confetti'

interface SectionInfo {
  id: string
  name: string
  quip: string
}

const SECTIONS: SectionInfo[] = [
  { id: 'hero', name: 'Start', quip: "Welcome to my workshop! Scroll down to see my blueprints! 👇" },
  { id: 'character-sheet', name: 'Specs', quip: "Here's my official specs! 12.7cm of copper curiosity! 🛠️" },
  { id: 'journey', name: 'Journey', quip: "Follow my rolling tracks across the cutting mat plains! 🗺️" },
  { id: 'projects', name: 'Inventions', quip: "Try shaking the Holo-Rattle or play the 8-bit Lullaby Box! 🎵" },
  { id: 'workbench', name: 'Pegboard', quip: "Tape your own note on my pegboard and give me a high-five! ❤️" },
]

export function ScrollGuideBot() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')
  const [speech, setSpeech] = useState(SECTIONS[0].quip)
  const [isScrolling, setIsScrolling] = useState(false)
  const [is3DMode, setIs3DMode] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canvas3DRef = useRef<HTMLDivElement | null>(null)

  // Track scroll position & active section
  useEffect(() => {
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalH > 0 ? Math.min(100, Math.max(0, (window.scrollY / totalH) * 100)) : 0
      setScrollProgress(Math.round(progress))

      setIsScrolling(true)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 200)

      // Detect current section in view
      const scrollPos = window.scrollY + window.innerHeight * 0.4
      let currentSec = SECTIONS[0].id

      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.offsetTop <= scrollPos) {
          currentSec = s.id
        }
      }

      if (currentSec !== activeSection) {
        setActiveSection(currentSec)
        const found = SECTIONS.find((s) => s.id === currentSec)
        if (found) {
          setSpeech(found.quip)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [activeSection])

  // Click companion robot
  const handleBotClick = (e: React.MouseEvent) => {
    sounds.playBoing()
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 600)

    confetti({
      particleCount: 20,
      spread: 50,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#00f0b5', '#f59e0b', '#38bdf8'],
    })

    const funQuips = [
      "Tread speed maximum! Wheee! ⚡",
      "I spotted a shiny screw over there! 👀",
      "Beep boop! You're my favorite navigator! 🤖",
      "My battery loves this workshop energy! ☀️",
    ]
    setSpeech(funQuips[Math.floor(Math.random() * funQuips.length)])
  }

  // Jump to next or previous section
  const navigateSection = (direction: 'prev' | 'next') => {
    sounds.playClick(850)
    const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection)
    let nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1
    if (nextIdx < 0) nextIdx = 0
    if (nextIdx >= SECTIONS.length) nextIdx = SECTIONS.length - 1

    const target = document.getElementById(SECTIONS[nextIdx].id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 3D Mini Drone WebGL view when 3D mode is toggled
  useEffect(() => {
    if (!is3DMode) return
    const container = canvas3DRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(90, 90)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set(2, 3, 4)
    scene.add(light)
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))

    // Mini Robot 3D Mesh
    const botGroup = new THREE.Group()
    scene.add(botGroup)

    // Dome head
    const headGeo = new THREE.SphereGeometry(0.75, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const headMat = new THREE.MeshStandardMaterial({ color: 0xd9be9b, metalness: 0.8, roughness: 0.3 })
    const head = new THREE.Mesh(headGeo, headMat)
    botGroup.add(head)

    // LED Visor
    const visorGeo = new THREE.BoxGeometry(0.8, 0.3, 0.4)
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x00f0b5, emissive: 0x00f0b5, emissiveIntensity: 0.6 })
    const visor = new THREE.Mesh(visorGeo, visorMat)
    visor.position.set(0, 0.25, 0.45)
    botGroup.add(visor)

    // Mini antenna
    const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5)
    const antMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 })
    const ant = new THREE.Mesh(antGeo, antMat)
    ant.position.set(0, 0.9, 0)
    botGroup.add(ant)

    // Top glowing bulb
    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e })
    const bulb = new THREE.Mesh(bulbGeo, bulbMat)
    bulb.position.set(0, 1.15, 0)
    botGroup.add(bulb)

    let animId: number
    const animate = () => {
      botGroup.rotation.y += 0.02
      botGroup.position.y = Math.sin(Date.now() * 0.004) * 0.1
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      headGeo.dispose()
      headMat.dispose()
      visorGeo.dispose()
      visorMat.dispose()
      antGeo.dispose()
      antMat.dispose()
      bulbGeo.dispose()
      bulbMat.dispose()
    }
  }, [is3DMode])

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble Guide */}
      {minimized ? (
        <button
          onClick={() => {
            sounds.playClick(850)
            setMinimized(false)
          }}
          title="Open Guide Dialogue"
          className="mb-2 p-2 bg-[#fffaf3] border-2 border-[#5c4033] rounded-full shadow-[2px_2px_0px_#5c4033] hover:bg-orange-50 text-[#5c4033] flex items-center gap-1 font-mono text-[10px] font-bold"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#00f0b5]" />
          <span>Ask Bolt</span>
        </button>
      ) : (
        <div className="relative mb-2 max-w-xs animate-fade-in">
          <div className="relative bg-[#fffaf3] border-2 border-[#5c4033] p-3 shadow-[4px_4px_0px_#5c4033] rounded-2xl text-left">
            {/* Top Washi Tape & Close Button */}
            <div className="flex items-center justify-between mb-1">
              <div className="px-2 py-0.2 bg-[#fde047] border border-[#a16207]/40 text-[9px] font-mono font-bold uppercase text-[#854d0e] rotate-[-1deg]">
                Guide Unit-B04
              </div>
              <button
                onClick={() => setMinimized(true)}
                title="Minimize guide tips"
                className="text-[#5c4033]/60 hover:text-[#5c4033] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-start gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#00f0b5] mt-1 shrink-0 animate-pulse" />
              <p className="font-mono text-xs text-[#2b1d14] leading-snug">
                {speech}
              </p>
            </div>

            {/* Quick Section Teleport Buttons */}
            <div className="mt-2.5 pt-2 border-t border-[#5c4033]/20 flex items-center justify-between gap-1">
              <div className="flex gap-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      sounds.playClick(900)
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    title={`Jump to ${sec.name}`}
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#5c4033] text-white border-[#5c4033]'
                        : 'bg-white text-[#5c4033] border-[#5c4033]/40 hover:bg-orange-50'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>

              {/* 2D / 3D Mode Toggle */}
              <button
                onClick={() => {
                  sounds.playClick(950)
                  setIs3DMode(!is3DMode)
                }}
                title={is3DMode ? 'Switch to 2D SVG Guide' : 'Switch to 3D WebGL Drone'}
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#5c4033] bg-[#00f0b5] text-[#2b1d14] flex items-center gap-0.5"
              >
                <Layers className="w-2.5 h-2.5" />
                <span>{is3DMode ? '3D' : '2D'}</span>
              </button>
            </div>

            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-8 w-3 h-3 bg-[#fffaf3] border-r-2 border-b-2 border-[#5c4033] rotate-45" />
          </div>
        </div>
      )}

      {/* COMPANION ROBOT DOCK */}
      <div className="flex items-center gap-2">
        {/* Navigation Arrows & Progress Ring */}
        <div className="flex flex-col gap-1 items-center bg-[#fffaf3] border-2 border-[#5c4033] p-1 rounded-xl shadow-[3px_3px_0px_#5c4033]">
          <button
            onClick={() => navigateSection('prev')}
            title="Previous Section"
            className="p-1 hover:bg-[#5c4033]/10 rounded text-[#5c4033]"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <span className="text-[9px] font-mono font-bold text-[#5c4033] py-0.5">
            {scrollProgress}%
          </span>

          <button
            onClick={() => navigateSection('next')}
            title="Next Section"
            className="p-1 hover:bg-[#5c4033]/10 rounded text-[#5c4033]"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CutoBot Traveling Avatar (Clickable Guide) */}
        <div
          onClick={handleBotClick}
          className={`relative cursor-pointer transition-transform duration-200 ${
            isJumping ? '-translate-y-4 scale-110' : 'hover:scale-105 active:scale-95'
          }`}
          title="Click CutoBot for a boing & tip!"
        >
          {/* Circular Stand with Progress border */}
          <div className="relative w-16 h-16 rounded-full bg-[#fbf5eb] border-3 border-[#5c4033] shadow-[4px_4px_0px_#5c4033] flex items-center justify-center overflow-hidden">
            {is3DMode ? (
              /* 3D WebGL Drone Canvas */
              <div ref={canvas3DRef} className="w-[90px] h-[90px] flex items-center justify-center" />
            ) : (
              /* 2D Interactive Baby Bot Face & Treads */
              <div className="relative flex flex-col items-center">
                {/* Antenna */}
                <div className="w-0.5 h-2 bg-[#5c4033] mx-auto relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping" />
                </div>
                {/* Dome Head */}
                <div className="w-9 h-6 rounded-t-full bg-[#d9be9b] border-2 border-[#5c4033] flex items-center justify-center relative">
                  {/* Visor */}
                  <div className="w-6 h-3 bg-[#0d1117] rounded-sm flex items-center justify-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#00f0b5] animate-pulse" />
                    <span className="w-1 h-1 rounded-full bg-[#00f0b5] animate-pulse" />
                  </div>
                </div>
                {/* Treads */}
                <div
                  className={`w-10 h-2.5 bg-[#382419] border border-[#2b1d14] rounded-sm -mt-0.5 flex items-center justify-around overflow-hidden ${
                    isScrolling ? 'animate-tread' : ''
                  }`}
                >
                  <span className="w-1 h-1 rounded-full bg-[#d97706]" />
                  <span className="w-1 h-1 rounded-full bg-[#d97706]" />
                  <span className="w-1 h-1 rounded-full bg-[#d97706]" />
                </div>
              </div>
            )}
          </div>

          {/* Activity Beacon indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00f0b5] border-2 border-[#5c4033] flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white" />
          </span>
        </div>
      </div>
    </div>
  )
}
