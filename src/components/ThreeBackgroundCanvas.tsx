import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeBackgroundCanvasProps {
  isCosmicMode: boolean
}

export function ThreeBackgroundCanvas({ isCosmicMode }: ThreeBackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const pointLight = new THREE.PointLight(
      isCosmicMode ? 0x00f0b5 : 0xf59e0b,
      2,
      50
    )
    pointLight.position.set(10, 15, 10)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(
      isCosmicMode ? 0x38bdf8 : 0xa34063,
      1.5,
      50
    )
    pointLight2.position.set(-10, -15, 5)
    scene.add(pointLight2)

    // Floating 3D Objects Group
    const objectsGroup = new THREE.Group()
    scene.add(objectsGroup)

    // Material definitions
    const copperMaterial = new THREE.MeshStandardMaterial({
      color: isCosmicMode ? 0x00f0b5 : 0xd97706,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: isCosmicMode,
      transparent: true,
      opacity: isCosmicMode ? 0.35 : 0.22,
    })

    const mintMaterial = new THREE.MeshStandardMaterial({
      color: isCosmicMode ? 0x38bdf8 : 0x059669,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: isCosmicMode,
      transparent: true,
      opacity: isCosmicMode ? 0.4 : 0.2,
    })

    const items: {
      mesh: THREE.Mesh
      rotSpeed: { x: number; y: number; z: number }
      baseY: number
      scrollFactor: number
    }[] = []

    // 1. Floating 3D Gears (Torus geometries)
    for (let i = 0; i < 6; i++) {
      const geo = new THREE.TorusGeometry(1.2 + Math.random() * 0.8, 0.25, 8, 16)
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? copperMaterial : mintMaterial)
      const x = (i % 2 === 0 ? -1 : 1) * (6 + Math.random() * 5)
      const y = (i - 2.5) * 6
      const z = -2 - Math.random() * 5

      mesh.position.set(x, y, z)
      objectsGroup.add(mesh)
      items.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.008,
        },
        baseY: y,
        scrollFactor: 0.003 + Math.random() * 0.004,
      })
    }

    // 2. Floating 3D Circuit Prisms (Octahedrons)
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.OctahedronGeometry(1.0 + Math.random() * 0.6, 0)
      const mesh = new THREE.Mesh(geo, copperMaterial)
      const x = (i % 2 === 0 ? 1 : -1) * (7 + Math.random() * 4)
      const y = (i - 2) * 7
      const z = -3 - Math.random() * 4

      mesh.position.set(x, y, z)
      objectsGroup.add(mesh)
      items.push({
        mesh,
        rotSpeed: {
          x: 0.008,
          y: 0.012,
          z: 0.006,
        },
        baseY: y,
        scrollFactor: 0.0025 + Math.random() * 0.003,
      })
    }

    // Scroll listener for 3D parallax depth
    let scrollY = window.scrollY
    const handleScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    const animate = () => {
      items.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeed.x
        item.mesh.rotation.y += item.rotSpeed.y
        item.mesh.rotation.z += item.rotSpeed.z

        // Parallax shift based on scroll
        item.mesh.position.y = item.baseY + (scrollY * item.scrollFactor)
      })

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [isCosmicMode])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60"
      aria-hidden="true"
    />
  )
}
