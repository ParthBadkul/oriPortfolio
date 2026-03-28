import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 150

export default function FirefliesSystem({ zone = 'hero' }) {
  const meshRef = useRef()

  const { positions, speeds, phases, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds    = new Float32Array(COUNT)
    const phases    = new Float32Array(COUNT)
    const colors    = new Float32Array(COUNT * 3)

    const warmColor   = new THREE.Color('#c8ff6a')
    const coolColor   = new THREE.Color('#7fffff')
    const purpleColor = new THREE.Color('#c890ff')

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = Math.random() * 6 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4

      speeds[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2

      const t = Math.random()
      let c
      if (zone === 'projects') c = t > 0.5 ? coolColor : purpleColor
      else if (zone === 'experience') c = t > 0.4 ? warmColor : coolColor
      else c = t > 0.5 ? warmColor : coolColor

      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, speeds, phases, colors }
  }, [zone])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t * speeds[i] + phases[i]) * 0.3
      pos[i * 3]     = positions[i * 3]     + Math.cos(t * speeds[i] * 0.4 + phases[i]) * 0.15
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(positions), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </points>
  )
}
