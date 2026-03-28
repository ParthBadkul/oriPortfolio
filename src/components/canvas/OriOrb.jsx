// src/components/canvas/OriOrb.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useForestStore from '../../store/useForestStore'

const PX_TO_WORLD = 8 / (typeof window !== 'undefined' ? window.innerHeight : 800)

export default function OriOrb() {
  const orbRef   = useRef()
  const glowRef  = useRef()
  const lightRef = useRef()
  const { oriX, oriState } = useForestStore()

  useFrame(({ clock }) => {
    if (!orbRef.current) return
    const t = clock.getElapsedTime()

    const aspectRatio = window.innerWidth / window.innerHeight
    const wx = oriX * PX_TO_WORLD * aspectRatio

    orbRef.current.position.x = wx
    if (glowRef.current) glowRef.current.position.x = wx
    if (lightRef.current) lightRef.current.position.x = wx

    // Idle bob vs walk bob
    const bobY = oriState === 'idle'
      ? Math.sin(t * 1.8) * 0.15 - 0.5
      : Math.sin(t * 3) * 0.06 - 0.5

    orbRef.current.position.y = bobY
    if (glowRef.current) glowRef.current.position.y = bobY
    if (lightRef.current) lightRef.current.position.y = bobY

    // Glow pulse
    const pulse = 0.8 + Math.sin(t * 2.2) * 0.2
    if (lightRef.current) lightRef.current.intensity = pulse * 2.5
    if (orbRef.current.material) {
      orbRef.current.material.emissiveIntensity = pulse * 4
    }
    if (glowRef.current?.material) {
      glowRef.current.material.emissiveIntensity = pulse * 1.5
    }
  })

  return (
    <group>
      {/* Spirit point light */}
      <pointLight ref={lightRef} color="#7fffff" intensity={2.5} distance={4} decay={2} position={[0, -0.5, 0]} />

      {/* Outer glow sphere */}
      <mesh ref={glowRef} position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7fffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Core orb */}
      <mesh ref={orbRef} position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0ffff"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
