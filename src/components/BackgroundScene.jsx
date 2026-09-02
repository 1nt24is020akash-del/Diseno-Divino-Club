/* eslint-disable react-hooks/purity, react-hooks/immutability */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const floatingObjects = [
  { type: 'sphere', color: '#7c3aed', position: [-5.5, 2.8, -2.8], radius: 1.8, speed: 0.26 },
  { type: 'torus', color: '#5fe3ff', position: [4.7, -1.8, -4.2], radius: 1.6, tube: 0.26, speed: 0.2 },
  { type: 'icosa', color: '#c084fc', position: [-1.4, -3.2, -5.5], radius: 1.2, speed: 0.32 },
  { type: 'ring', color: '#7dd3fc', position: [3.3, 3.2, -6.2], radius: 1.7, tube: 0.17, speed: 0.22 },
  { type: 'sphere', color: '#f59e0b', position: [0.6, 4.6, -4.4], radius: 1.1, speed: 0.24 },
  { type: 'octa', color: '#a78bfa', position: [-4.2, -4.5, -7.4], radius: 1.22, speed: 0.3 },
  { type: 'torus', color: '#38bdf8', position: [6.2, 0.4, -8.8], radius: 2, tube: 0.24, speed: 0.18 },
  { type: 'sphere', color: '#60a5fa', position: [7.1, -4.6, -9.4], radius: 1.7, speed: 0.23 },
  { type: 'sphere', color: '#f472b6', position: [-7.2, -0.8, -8.1], radius: 1.35, speed: 0.21 },
]

function ParticleField({ count }) {
  const pointsRef = useRef(null)

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      const spread = 18
      positions[i3] = (Math.random() - 0.5) * spread
      positions[i3 + 1] = (Math.random() - 0.5) * spread
      positions[i3 + 2] = (Math.random() - 0.5) * spread
      base[i3] = positions[i3]
      base[i3 + 1] = positions[i3 + 1]
      base[i3 + 2] = positions[i3 + 2]

      const color = new THREE.Color().setHSL(0.52 + Math.random() * 0.22, 0.8, 0.72)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors, base }
  }, [count])

  useFrame((state) => {
    const { base } = particleData
    const time = state.clock.getElapsedTime()
    const positionArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      positionArray[i3] = base[i3] + Math.sin(time * 0.7 + i * 0.9) * 0.35 + state.pointer.x * 0.8
      positionArray[i3 + 1] = base[i3 + 1] + Math.cos(time * 0.8 + i * 1.1) * 0.45 + state.pointer.y * 1.1
      positionArray[i3 + 2] = base[i3 + 2] + Math.sin(time * 0.55 + i * 1.4) * 0.8
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.08
    pointsRef.current.rotation.x = state.pointer.y * 0.25
    pointsRef.current.rotation.z = state.pointer.x * 0.22
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} transparent opacity={0.9} vertexColors depthWrite={false} />
    </points>
  )
}

function DataGrid() {
  const gridRef = useRef(null)

  useFrame((state) => {
    if (!gridRef.current) return
    const t = state.clock.getElapsedTime()
    gridRef.current.rotation.x = -Math.PI / 2.3
    gridRef.current.position.y = -5.5 + Math.sin(t * 0.45) * 0.5
    gridRef.current.position.z = -12 + Math.sin(t * 0.32) * 0.9
    gridRef.current.rotation.z = state.pointer.x * 0.2
  })

  return (
    <group ref={gridRef} position={[0, -5.5, -12]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <gridHelper args={[30, 36, '#67e8f9', '#1e293b']} position={[0, -1, 0]} />
    </group>
  )
}

function NeuralNetwork() {
  const lineRef = useRef(null)
  const nodes = useMemo(() => {
    const items = []
    for (let i = 0; i < 16; i += 1) {
      const u = i / 16
      const angle = u * Math.PI * 2
      items.push({
        x: Math.cos(angle) * 2.8,
        y: Math.sin(angle * 2.2) * 1.4,
        z: -Math.sin(angle) * 2.5,
      })
    }
    return items
  }, [])

  useFrame((state) => {
    if (!lineRef.current) return
    const time = state.clock.getElapsedTime()

    const linePositions = new Float32Array(nodes.length * 6)
    for (let i = 0; i < nodes.length; i += 1) {
      const start = nodes[i]
      const end = nodes[(i + 1) % nodes.length]
      const i6 = i * 6
      const wave = Math.sin(time * 0.8 + i) * 0.3
      linePositions[i6] = start.x + wave + state.pointer.x * 0.8
      linePositions[i6 + 1] = start.y + state.pointer.y * 0.7
      linePositions[i6 + 2] = start.z + Math.cos(time * 1.1 + i) * 0.5
      linePositions[i6 + 3] = end.x + wave + state.pointer.x * 0.8
      linePositions[i6 + 4] = end.y + state.pointer.y * 0.7
      linePositions[i6 + 5] = end.z + Math.cos(time * 1.1 + i + 1) * 0.5
    }

    const geometry = lineRef.current.geometry
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    lineRef.current.rotation.y = time * 0.15 + state.pointer.x * 0.2
    lineRef.current.rotation.x = state.pointer.y * 0.3
  })

  const nodePositions = new Float32Array(nodes.flatMap((node) => [node.x, node.y, node.z]))

  return (
    <group position={[0, 0.5, -5]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.14} color="#8ffcff" transparent opacity={0.95} sizeAttenuation />
      </points>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#5eead4" transparent opacity={0.5} />
      </line>
    </group>
  )
}

function DataStreams() {
  const streamsRef = useRef(null)
  const streamCount = 5
  const pointCount = 42

  const streamData = useMemo(() => Array.from({ length: streamCount }, (_, streamIndex) => {
    const positions = new Float32Array(pointCount * 3)
    return { positions, offset: streamIndex * 1.7 }
  }), [])

  useFrame((state) => {
    if (!streamsRef.current) return
    const time = state.clock.getElapsedTime()

    streamData.forEach((stream, streamIndex) => {
      const positions = stream.positions
      for (let i = 0; i < pointCount; i += 1) {
        const progress = i / (pointCount - 1)
        const i3 = i * 3
        positions[i3] = -12 + progress * 24
        positions[i3 + 1] = 3.6 - streamIndex * 1.55 + Math.sin(progress * 8 + time * 0.8 + stream.offset) * 0.55
        positions[i3 + 2] = -2.5 - streamIndex * 1.2 + Math.cos(progress * 6 + time * 0.5) * 0.5
      }
      const geometry = streamsRef.current.children[streamIndex].geometry
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    })
    streamsRef.current.rotation.y = state.pointer.x * 0.08
  })

  return (
    <group ref={streamsRef}>
      {streamData.map((stream, index) => (
        <line key={index}>
          <bufferGeometry />
          <lineBasicMaterial color={index % 2 === 0 ? '#67e8f9' : '#a78bfa'} transparent opacity={0.48} />
        </line>
      ))}
    </group>
  )
}

function HorizonWave() {
  const waveRef = useRef(null)
  const pointCount = 64
  const positions = useMemo(() => new Float32Array(pointCount * 3), [])

  useFrame((state) => {
    if (!waveRef.current) return
    const time = state.clock.getElapsedTime()
    for (let i = 0; i < pointCount; i += 1) {
      const progress = i / (pointCount - 1)
      const i3 = i * 3
      positions[i3] = -15 + progress * 30
      positions[i3 + 1] = -1.5 + Math.sin(progress * 13 + time * 0.65) * 0.7 + Math.sin(progress * 28 - time) * 0.25
      positions[i3 + 2] = -10 + Math.cos(progress * 7 + time * 0.3) * 0.8
    }
    waveRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    waveRef.current.rotation.y = state.pointer.x * 0.1
  })

  return (
    <line ref={waveRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#2dd4bf" transparent opacity={0.42} />
    </line>
  )
}

function DigitalCore() {
  const coreRef = useRef(null)
  const haloRef = useRef(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.38
      coreRef.current.rotation.y = t * 0.52
      coreRef.current.position.y = Math.sin(t * 0.8) * 0.7
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.3) * 0.12)
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = -t * 0.4
      haloRef.current.rotation.x = t * 0.25
    }
  })

  return (
    <group position={[4.2, 1.25, -3.5]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.45, 1]} />
        <meshPhysicalMaterial
          color="#7dd3fc"
          emissive="#67e8f9"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.76}
        />
      </mesh>

      <mesh ref={haloRef} rotation={[Math.PI / 2, 0.2, 0]}>
        <torusGeometry args={[2.3, 0.08, 32, 200]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.6} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[0.6, 0.5, 0]}>
        <torusKnotGeometry args={[1.9, 0.08, 140, 22]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.25} wireframe />
      </mesh>
    </group>
  )
}

function FloatingTechObjects() {
  const groupRef = useRef(null)
  const scrollRef = useRef(0)
  const { pointer } = useThree()

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      scrollRef.current = window.scrollY / maxScroll
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.1 + pointer.x * 0.5
    groupRef.current.rotation.x = pointer.y * 0.3 + scrollRef.current * 0.24
    groupRef.current.position.x = pointer.x * 1.4
    groupRef.current.position.y = pointer.y * 0.8 - scrollRef.current * 1.6
  })

  return (
    <group ref={groupRef}>
      {floatingObjects.map((item, index) => {
        const sharedKey = `${item.type}-${index}`

        if (item.type === 'sphere') {
          return (
            <mesh key={sharedKey} position={item.position}>
              <sphereGeometry args={[item.radius, 32, 32]} />
              <meshPhysicalMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          )
        }

        if (item.type === 'torus' || item.type === 'ring') {
          return (
            <mesh key={sharedKey} rotation={[Math.PI / 2, 0, 0]} position={item.position}>
              <torusGeometry args={[item.radius, item.tube, 30, 160]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.42} />
            </mesh>
          )
        }

        if (item.type === 'octa') {
          return (
            <mesh key={sharedKey} position={item.position} rotation={[0.7, 0.8, 0.2]}>
              <octahedronGeometry args={[item.radius, 1]} />
              <meshPhysicalMaterial color={item.color} emissive={item.color} emissiveIntensity={0.75} transparent opacity={0.68} />
            </mesh>
          )
        }

        return (
          <mesh key={sharedKey} position={item.position} rotation={[0.6, 0.4, 0.8]}>
            <icosahedronGeometry args={[item.radius, 1]} />
            <meshPhysicalMaterial color={item.color} emissive={item.color} emissiveIntensity={0.75} transparent opacity={0.68} />
          </mesh>
        )
      })}
    </group>
  )
}

function SceneContent() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const particleCount = prefersReducedMotion ? 260 : window.innerWidth < 768 ? 600 : window.innerWidth < 1200 ? 1250 : 2000

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <fog attach="fog" args={['#070b14', 12, 22]} />

      <ambientLight intensity={0.9} color="#dbeafe" />
      <pointLight position={[-5, 3, 4]} intensity={3} color="#60a5fa" />
      <pointLight position={[5, 0, 2]} intensity={2.5} color="#a78bfa" />
      <pointLight position={[0, -2, -2]} intensity={2.2} color="#67e8f9" />
      <directionalLight position={[6, 6, 6]} intensity={1.1} color="#c4b5fd" />

      <DataGrid />
      <DigitalCore />
      <FloatingTechObjects />
      <NeuralNetwork />
      <DataStreams />
      <HorizonWave />
      <ParticleField count={particleCount} />
    </>
  )
}

export default function BackgroundScene() {
  return (
    <div className="background-scene-wrap" aria-hidden="true">
      <div className="background-atmosphere" />
      <div className="background-sheen" />
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 8.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <SceneContent />
      </Canvas>
      <div className="readability-overlay" />
    </div>
  )
}
