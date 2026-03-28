import { useState } from 'react'
import { experience, education } from '../../data/portfolio'
import ExperienceTablet from '../ui/ExperienceTablet'
import useForestStore from '../../store/useForestStore'

export default function ExperienceZone() {
  const { startTransition, transitionPhase } = useForestStore()
  const isIdle = transitionPhase === 'idle'
  const [eduHovered, setEduHovered] = useState(false)

  return (
    <div className="zone-ui">
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 11,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          color: '#e8940a', letterSpacing: '0.2em',
          textShadow: '0 0 25px rgba(232,148,10,0.5)',
        }}>
          EXPERIENCE
        </h2>
      </div>

      {/* PepsiCo tablet */}
      <div style={{ position: 'absolute', bottom: '10%', left: '28%', zIndex: 12 }}>
        <ExperienceTablet job={experience[0]} size="large" />
      </div>

      {/* Synergy tablet */}
      <div style={{ position: 'absolute', bottom: '12%', right: '24%', zIndex: 11 }}>
        <ExperienceTablet job={experience[1]} size="small" />
      </div>

      {/* Education stone */}
      <div
        style={{ position: 'absolute', bottom: '8%', right: '4%', zIndex: 10, cursor: 'pointer' }}
        onMouseEnter={() => setEduHovered(true)}
        onMouseLeave={() => setEduHovered(false)}
      >
        <svg width="80" height="100" viewBox="0 0 80 100">
          <ellipse cx="40" cy="85" rx="36" ry="18" fill="#2a1e10" />
          <ellipse cx="40" cy="70" rx="32" ry="25" fill="#1a1208" stroke="#3a2a18" strokeWidth="1.5" />
          <text x="40" y="68" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="9"
            fill="#e8940a" opacity="0.7">EDU</text>
        </svg>
        {eduHovered && (
          <div style={{
            position: 'absolute', bottom: '110%', right: 0,
            width: 240, background: 'rgba(12,8,3,0.97)',
            border: '1px solid rgba(232,148,10,0.4)', borderRadius: 8, padding: '12px 14px',
            boxShadow: '0 0 20px rgba(232,148,10,0.2)',
            animation: 'card-unfold 0.2s ease forwards',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: '#e8940a', marginBottom: 6 }}>
              EDUCATION
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,235,200,0.9)', lineHeight: 1.6 }}>
              {education.degree}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(255,220,160,0.6)', marginTop: 4 }}>
              {education.institution}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#e8940a', marginTop: 4 }}>
              {education.year}
            </p>
          </div>
        )}
      </div>

      {/* Back to home */}
      <button
        disabled={!isIdle}
        onClick={() => startTransition('hero')}
        style={{
          position: 'absolute', left: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(12,8,2,0.85)', border: '2px solid var(--light-amber)',
          color: 'var(--light-canopy)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4, opacity: isIdle ? 1 : 0.4,
          boxShadow: '0 0 15px rgba(232,148,10,0.4)',
          transition: 'box-shadow 0.2s, opacity 0.2s', zIndex: 12,
        }}
      >
        ← HOME
      </button>
    </div>
  )
}
