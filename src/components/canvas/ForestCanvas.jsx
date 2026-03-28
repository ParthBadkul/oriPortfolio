import { Canvas } from '@react-three/fiber'
import FirefliesSystem from './FirefliesSystem'
import PostFX from './PostFX'
import useForestStore from '../../store/useForestStore'

export default function ForestCanvas() {
  const activeZone = useForestStore((s) => s.activeZone)

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: true, toneMapping: 3 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.05} />
      <FirefliesSystem zone={activeZone} />
      <PostFX />
    </Canvas>
  )
}
