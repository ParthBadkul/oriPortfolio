import { useState } from 'react'
import { certifications } from '../../data/portfolio'

export default function CertScroll() {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ position: 'absolute', bottom: '3%', left: '2%', zIndex: 13, cursor: 'pointer' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 4,
        background: 'rgba(10,8,4,0.9)', border: '1px solid var(--light-amber)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--light-amber)', fontSize: '1rem',
        boxShadow: '0 0 12px rgba(232,148,10,0.4)',
      }}>
        📜
      </div>

      {open && (
        <div style={{
          position: 'absolute', bottom: '110%', left: 0,
          background: 'rgba(12,8,2,0.95)', border: '1px solid var(--light-amber)',
          borderRadius: 8, padding: '12px 16px', width: 260,
          boxShadow: '0 0 20px rgba(232,148,10,0.3)',
          animation: 'scroll-unroll 0.25s ease forwards',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            color: 'var(--light-amber)', letterSpacing: '0.12em', marginBottom: 8,
          }}>
            ACHIEVEMENTS
          </div>
          {certifications.map((cert, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'rgba(255,240,200,0.85)', lineHeight: 1.7,
              borderBottom: i < certifications.length - 1 ? '1px solid rgba(232,148,10,0.15)' : 'none',
              paddingBottom: 4, marginBottom: 4,
            }}>
              {cert}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
