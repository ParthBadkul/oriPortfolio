// src/components/zones/HeroZone.jsx
import { person } from '../../data/portfolio'
import useForestStore from '../../store/useForestStore'
import SkillMushrooms from '../ui/SkillMushrooms'
import CertScroll from '../ui/CertScroll'
import ContactIcons from '../ui/ContactIcons'

export default function HeroZone() {
  const { startTransition, transitionPhase } = useForestStore()
  const isIdle = transitionPhase === 'idle'

  return (
    <div className="zone-ui">
      {/* Name + tagline */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 11,
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700, letterSpacing: '0.15em', color: '#f0ffe8',
          textShadow: '0 0 30px rgba(200,255,106,0.4), 0 0 60px rgba(232,148,10,0.2)',
        }}>
          {person.name.toUpperCase()}
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
          letterSpacing: '0.2em', color: 'var(--light-amber)',
          marginTop: 8, opacity: 0.9,
          textShadow: '0 0 20px rgba(232,148,10,0.5)',
        }}>
          {person.title.toUpperCase()}
        </p>
      </div>

      {/* Bio */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(520px, 80vw)', textAlign: 'center', zIndex: 11,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
          lineHeight: 1.7, color: 'rgba(220,255,210,0.75)',
          textShadow: '0 1px 8px rgba(0,0,0,0.8)',
        }}>
          {person.bio}
        </p>
      </div>

      {/* Nav button — Projects (left) */}
      <button
        disabled={!isIdle}
        onClick={() => startTransition('projects')}
        style={{
          position: 'absolute', left: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(10,20,10,0.85)', border: '2px solid var(--foliage-cool)',
          color: 'var(--foliage-bright)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4, zIndex: 12,
          boxShadow: '0 0 15px rgba(30,92,53,0.4), inset 0 0 8px rgba(30,92,53,0.1)',
          textShadow: '0 0 10px var(--foliage-bright)',
          transition: 'box-shadow 0.2s, opacity 0.2s',
          opacity: isIdle ? 1 : 0.4,
        }}
        onMouseEnter={e => { if (isIdle) e.currentTarget.style.boxShadow = '0 0 25px rgba(78,203,113,0.7), inset 0 0 12px rgba(78,203,113,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(30,92,53,0.4), inset 0 0 8px rgba(30,92,53,0.1)' }}
      >
        ← PROJECTS
      </button>

      {/* Nav button — Experience (right) */}
      <button
        disabled={!isIdle}
        onClick={() => startTransition('experience')}
        style={{
          position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(20,12,4,0.85)', border: '2px solid var(--light-amber)',
          color: 'var(--light-canopy)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4, zIndex: 12,
          boxShadow: '0 0 15px rgba(232,148,10,0.4), inset 0 0 8px rgba(232,148,10,0.1)',
          textShadow: '0 0 10px var(--light-canopy)',
          transition: 'box-shadow 0.2s, opacity 0.2s',
          opacity: isIdle ? 1 : 0.4,
        }}
        onMouseEnter={e => { if (isIdle) e.currentTarget.style.boxShadow = '0 0 25px rgba(245,192,48,0.7), inset 0 0 12px rgba(245,192,48,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(232,148,10,0.4), inset 0 0 8px rgba(232,148,10,0.1)' }}
      >
        EXPERIENCE →
      </button>

      <SkillMushrooms />
      <CertScroll />
      <ContactIcons />
    </div>
  )
}
