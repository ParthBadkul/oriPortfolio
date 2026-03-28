import { useEffect, useRef } from 'react'
import useForestStore from '../store/useForestStore'

const WALK_SPEED = 3
const EDGE_THRESHOLD = window.innerWidth * 0.42

export default function useOriControls() {
  const { oriX, oriState, transitionPhase, activeZone,
          setOriX, setOriDirection, setOriState, startTransition } = useForestStore()

  const keysRef = useRef({ left: false, right: false })
  const rafRef = useRef(null)
  const stateRef = useRef({ oriX, oriState, transitionPhase, activeZone })

  useEffect(() => {
    stateRef.current = { oriX, oriState, transitionPhase, activeZone }
  }, [oriX, oriState, transitionPhase, activeZone])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a') keysRef.current.left  = true
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true
    }
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a') keysRef.current.left  = false
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const { left, right } = keysRef.current
      const { oriX: x, transitionPhase, activeZone } = stateRef.current

      if (transitionPhase === 'idle') {
        if (left && !right) {
          setOriDirection(-1)
          setOriState('walk')
          const newX = x - WALK_SPEED
          if (activeZone === 'hero' || activeZone === 'experience') {
            if (newX < -EDGE_THRESHOLD) {
              const dest = activeZone === 'hero' ? 'projects' : 'hero'
              startTransition(dest)
            } else {
              setOriX(newX)
            }
          }
        } else if (right && !left) {
          setOriDirection(1)
          setOriState('walk')
          const newX = x + WALK_SPEED
          if (activeZone === 'hero' || activeZone === 'projects') {
            if (newX > EDGE_THRESHOLD) {
              const dest = activeZone === 'hero' ? 'experience' : 'hero'
              startTransition(dest)
            } else {
              setOriX(newX)
            }
          }
        } else {
          setOriState('idle')
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setOriX, setOriDirection, setOriState, startTransition])
}
