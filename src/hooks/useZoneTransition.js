// src/hooks/useZoneTransition.js
import { useEffect } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from '../store/useForestStore'

export default function useZoneTransition(worldRef, overlayRef) {
  const transitionPhase = useForestStore((s) => s.transitionPhase)
  const targetZone      = useForestStore((s) => s.targetZone)
  const activeZone      = useForestStore((s) => s.activeZone)
  const setOriX            = useForestStore((s) => s.setOriX)
  const setOriState        = useForestStore((s) => s.setOriState)
  const completeTransition = useForestStore((s) => s.completeTransition)

  useEffect(() => {
    if (transitionPhase !== 'walking') return
    if (!targetZone) return
    if (!worldRef?.current || !overlayRef?.current) return

    // Capture current values — they'll change during animation
    const capturedTarget = targetZone
    const capturedActive = activeZone

    const tl = gsap.timeline()

    // Fade to black (cave interior)
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      delay: 0.4,
      ease: 'power2.in',
    })

    // While dark: snap world to target zone position + position Ori at edge
    tl.call(() => {
      gsap.set(worldRef.current, { x: -(ZONE_INDEX[capturedTarget] * window.innerWidth) })

      const isGoingRight = ZONE_INDEX[capturedTarget] > ZONE_INDEX[capturedActive]
      const emergeX = isGoingRight ? -window.innerWidth * 0.45 : window.innerWidth * 0.45
      setOriX(emergeX)
      setOriState('emerge')
    })

    // Fade back in
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    // Animate Ori walking to center
    tl.call(() => {
      const proxy = { x: useForestStore.getState().oriX }
      gsap.to(proxy, {
        x: 0,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function() {
          setOriX(proxy.x)
        },
        onComplete: () => {
          setOriState('idle')
          completeTransition()
        },
      })
    })
  }, [transitionPhase])
}
