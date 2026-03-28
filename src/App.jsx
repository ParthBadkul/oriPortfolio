import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from './store/useForestStore'
import useOriControls from './hooks/useOriControls'
import useZoneTransition from './hooks/useZoneTransition'
import ForestBackground from './components/forest/ForestBackground'
import CavePortal from './components/forest/CavePortal'
import ForestCanvas from './components/canvas/ForestCanvas'
import HeroZone from './components/zones/HeroZone'
import ProjectsZone from './components/zones/ProjectsZone'
import ExperienceZone from './components/zones/ExperienceZone'

const ZONES = ['projects', 'hero', 'experience']

export default function App() {
  const worldRef   = useRef()
  const overlayRef = useRef()
  const cursorRef  = useRef()

  const activeZone = useForestStore((s) => s.activeZone)

  useOriControls()
  useZoneTransition(worldRef, overlayRef)

  // Set initial world position — hero is index 1, offset = -1 * viewport width
  useEffect(() => {
    if (worldRef.current) {
      gsap.set(worldRef.current, { x: -(ZONE_INDEX['hero'] * window.innerWidth) })
    }
  }, [])

  // Custom glowing cursor follows mouse
  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'none',
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg-deep)', position: 'relative' }}>

      {/* World container — 300vw, pans on X via GSAP */}
      <div
        ref={worldRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '300vw', height: '100vh',
          display: 'flex',
        }}
      >
        {ZONES.map((zone) => (
          <div
            key={zone}
            style={{
              position: 'relative',
              width: '100vw', height: '100vh',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <ForestBackground zone={zone} />
            <CavePortal side="left" />
            <CavePortal side="right" />
            {zone === 'projects'   && <ProjectsZone />}
            {zone === 'hero'       && <HeroZone />}
            {zone === 'experience' && <ExperienceZone />}
          </div>
        ))}
      </div>

      {/* R3F Canvas overlay — transparent, fixed, covers viewport */}
      <ForestCanvas />

      {/* Cave transition overlay — black fade */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0,
          background: '#000',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--light-spirit)',
          boxShadow: '0 0 12px 4px var(--light-spirit)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
