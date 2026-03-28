import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.4} radius={0.8} />
      <Vignette eskil={false} offset={0.4} darkness={0.6} />
    </EffectComposer>
  )
}
