// src/hooks/useZoneTransition.js
import { useEffect } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from '../store/useForestStore'

export default function useZoneTransition(worldRef, overlayRef) {
  const transitionPhase = useForestStore((s) => s.transitionPhase)
  const targetZone      = useForestStore((s) => s.targetZone)
  const activeZone      = useForestStore((s) => s.activeZone)
  const setTransitionPhase = useForestStore((s) => s.setTransitionPhase)
  const setOriX            = useForestStore((s) => s.setOriX)
  const setOriState        = useForestStore((s) => s.setOriState)
  const completeTransition = useForestStore((s) => s.completeTransition)

  useEffect(() => {
    if (transitionPhase !== 'walking') return
    if (!targetZone) return
    if (!worldRef?.current || !overlayRef?.current) return

    setTransitionPhase('entering-cave')
    setOriState('enter-cave')

    const tl = gsap.timeline()

    // Fade to black (cave interior)
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      delay: 0.4,
      ease: 'power2.in',
      onStart: () => setTransitionPhase('dark'),
    })

    // While dark: snap world to target zone position
    tl.call(() => {
      const targetIndex = ZONE_INDEX[targetZone]
      gsap.set(worldRef.current, { x: -(targetIndex * window.innerWidth) })

      // Ori emerges from opposite edge
      const isGoingRight = ZONE_INDEX[targetZone] > ZONE_INDEX[activeZone]
      const emergeX = isGoingRight ? -window.innerWidth * 0.45 : window.innerWidth * 0.45
      setOriX(emergeX)
      setOriState('emerge')
      setTransitionPhase('emerging')
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
      const currentOriX = useForestStore.getState().oriX
      const proxy = { x: currentOriX }
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

    return () => tl.kill()
  }, [transitionPhase])
}
