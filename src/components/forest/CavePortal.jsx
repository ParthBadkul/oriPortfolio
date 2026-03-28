// src/components/forest/CavePortal.jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from '../../store/useForestStore'

export default function CavePortal({ side }) {
  // side: 'left' | 'right'
  const portalRef = useRef()
  const transitionPhase = useForestStore((s) => s.transitionPhase)
  const targetZone      = useForestStore((s) => s.targetZone)
  const activeZone      = useForestStore((s) => s.activeZone)

  const isRelevant =
    transitionPhase !== 'idle' && targetZone && (
      (side === 'right' && ZONE_INDEX[targetZone] > ZONE_INDEX[activeZone]) ||
      (side === 'left'  && ZONE_INDEX[targetZone] < ZONE_INDEX[activeZone])
    )

  useEffect(() => {
    if (!portalRef.current) return
    if ((transitionPhase === 'walking' || transitionPhase === 'entering-cave') && isRelevant) {
      gsap.to(portalRef.current, { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' })
    } else if (transitionPhase === 'idle') {
      gsap.to(portalRef.current, { scaleY: 0, scaleX: 0, opacity: 0, duration: 0.3 })
    }
  }, [transitionPhase, isRelevant])

  const lightColor = targetZone === 'projects'
    ? '#2a1060'
    : targetZone === 'experience'
    ? '#5c3000'
    : '#0a2010'

  return (
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: '15%',
        [side]: '-20px',
        width: 180,
        height: '70%',
        transform: 'scale(0)',
        opacity: 0,
        transformOrigin: `${side} center`,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      <svg viewBox="0 0 180 500" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id={`cave-glow-${side}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Inner glow */}
        <ellipse cx="90" cy="250" rx="70" ry="230" fill={`url(#cave-glow-${side})`} />
        {/* Rock arch left side */}
        <path d="M20,500 Q10,300 30,200 Q40,150 90,100 Q60,160 50,300 Z" fill="#1a1208" />
        {/* Rock arch right side */}
        <path d="M160,500 Q170,300 150,200 Q140,150 90,100 Q120,160 130,300 Z" fill="#151009" />
        {/* Arch crown */}
        <ellipse cx="90" cy="110" rx="50" ry="25" fill="#1e1810" />
        {/* Glowing fungi */}
        {[30,55,90,125,150].map((x, i) => (
          <circle key={i} cx={x} cy={150+(i%3)*30} r={4+(i%3)*2}
            fill={i%2===0?'#4ecb71':'#7fffff'} opacity={0.8}
            style={{ filter: 'blur(1px)' }} />
        ))}
        {/* Moss drips */}
        {[35,70,110,145].map((x, i) => (
          <path key={i} d={`M${x},120 Q${x+5},${150+(i%3)*20} ${x},${180+(i%3)*25}`}
            stroke="#2d6e3e" strokeWidth="3" fill="none" opacity={0.7} />
        ))}
      </svg>
    </div>
  )
}
