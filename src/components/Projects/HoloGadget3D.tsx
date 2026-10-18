import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { sounds } from '../../audio/soundEffects'
import { Layers, Sparkles, Orbit } from 'lucide-react'

export function HoloGadget3D() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [wireframe, setWireframe] = useState(true)
  const [shape, setShape] = useState<'core' | 'rings' | 'prism'>('core')
  const [isRotating, setIsRotating] = useState(true)
  const sceneRef = useRef<{
    meshGroup: THREE.Group
    particles: THREE.Points
    renderer: THREE.WebGLRenderer
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = 260

    // Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x00f0b5, 2, 50)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)
    const amberLight = new THREE.PointLight(0xf59e0b, 2, 50)
    amberLight.position.set(-5, -5, -5)
    scene.add(amberLight)

    // Main 3D Mesh Group
    const meshGroup = new THREE.Group()
    scene.add(meshGroup)

    // Holographic materials
    const holoMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0b5,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x047857,
      emissiveIntensity: 0.4,
    })

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xb45309,
      emissiveIntensity: 0.5,
    })

    // Construct shapes
    let mainGeometry: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1.6, 2)
    if (shape === 'rings') {
      mainGeometry = new THREE.TorusGeometry(1.4, 0.4, 16, 60)
    } else if (shape === 'prism') {
      mainGeometry = new THREE.OctahedronGeometry(1.8, 1)
    }

    const mainMesh = new THREE.Mesh(mainGeometry, holoMaterial)
    meshGroup.add(mainMesh)

    // Inner Core Orb
    const innerGeo = new THREE.SphereGeometry(0.8, 16, 16)
    const innerMesh = new THREE.Mesh(innerGeo, innerMaterial)
    meshGroup.add(innerMesh)

    // Surrounding floating particle cloud
    const particleCount = 120
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i + 2] = radius * Math.cos(phi)
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    sceneRef.current = { meshGroup, particles, renderer }

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1)
    }
    container.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    let animId: number
    const animate = () => {
      if (isRotating) {
        meshGroup.rotation.x += 0.008
        meshGroup.rotation.y += 0.012
        particles.rotation.y -= 0.004
      }

      // Gentle interactive tilt following mouse
      meshGroup.rotation.y += mouseX * 0.02
      meshGroup.rotation.x -= mouseY * 0.02

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    // Resize handling
    const handleResize = () => {
      if (!container) return
      const newW = container.clientWidth
      camera.aspect = newW / height
      camera.updateProjectionMatrix()
      renderer.setSize(newW, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      mainGeometry.dispose()
      innerGeo.dispose()
      particleGeometry.dispose()
    }
  }, [shape, isRotating])

  // Update wireframe property
  useEffect(() => {
    if (!sceneRef.current) return
    sceneRef.current.meshGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.wireframe = wireframe
      }
    })
  }, [wireframe])

  return (
    <div className="relative bg-[#0d1117] border-2 border-[#5c4033] p-6 shadow-[5px_5px_0px_#5c4033] rounded-xl flex flex-col items-center text-white">
      {/* Top Tape Header */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#10b981] border border-[#047857] shadow-xs rotate-[1deg] text-[11px] font-mono font-bold uppercase text-[#064e3b] flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-white" /> WebGL Three.js: Unit-B04 Core Matrix
      </div>

      <div className="w-full flex justify-between items-center mt-2 mb-2">
        <div>
          <h4 className="font-bold text-lg text-[#00f0b5] tracking-tight">
            3D Holographic Schematics
          </h4>
          <p className="text-xs text-zinc-400 font-mono">
            Interactive Three.js WebGL Hologram
          </p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-[11px] font-mono text-[#00f0b5]">
          <Orbit className="w-3.5 h-3.5" />
          <span>60 FPS</span>
        </div>
      </div>

      {/* THREE.JS WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[260px] cursor-grab active:cursor-grabbing rounded-lg border border-zinc-800 bg-gradient-to-b from-black/80 to-zinc-950/90 relative overflow-hidden flex items-center justify-center"
      >
        {/* Hologram Grid Floor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00f0b5_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* 3D Model Control Toolbar */}
      <div className="w-full flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800">
        <div className="flex gap-1">
          {(['core', 'rings', 'prism'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                sounds.playClick(950)
                setShape(s)
              }}
              className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border transition-all ${
                shape === s
                  ? 'bg-[#00f0b5] border-[#00f0b5] text-black shadow-xs'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => {
              sounds.playClick(850)
              setWireframe(!wireframe)
            }}
            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border transition-all flex items-center gap-1 ${
              wireframe
                ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Wireframe</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick(800)
              setIsRotating(!isRotating)
            }}
            className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            {isRotating ? 'Pause' : 'Spin'}
          </button>
        </div>
      </div>
    </div>
  )
}
