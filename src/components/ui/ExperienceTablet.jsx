import { useState } from 'react'

export default function ExperienceTablet({ job, size = 'large' }) {
  const [hovered, setHovered] = useState(false)
  const isLarge = size === 'large'

  return (
    <div
      style={{ position: 'relative', cursor: 'pointer', width: isLarge ? 200 : 150 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 200 260" style={{ width: '100%', filter: hovered ? 'drop-shadow(0 0 16px #e8940a88)' : 'none', transition: 'filter 0.3s' }}>
        <defs>
          <linearGradient id={`stone-${job.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1e10" />
            <stop offset="100%" stopColor="#120e08" />
          </linearGradient>
        </defs>
        <path d="M20,260 Q10,240 8,200 Q6,150 15,100 Q20,60 100,20 Q180,60 185,100 Q194,150 192,200 Q190,240 180,260 Z"
          fill={`url(#stone-${job.id})`} stroke="#3a2a18" strokeWidth="2" />
        <ellipse cx="40" cy="230" rx="25" ry="12" fill="#1e5c35" opacity="0.5" />
        <ellipse cx="160" cy="240" rx="20" ry="10" fill="#2d6e3e" opacity="0.4" />
        <rect x="30" y="60" width="140" height="160" rx="4"
          fill="rgba(0,0,0,0.3)" stroke="rgba(232,148,10,0.2)" strokeWidth="1" />
        <text x="100" y="115" textAnchor="middle"
          fontFamily="Cinzel, serif" fontSize="28" fill="#e8940a" opacity={hovered ? 0.9 : 0.6}>
          {job.company.charAt(0)}
        </text>
        <text x="100" y="140" textAnchor="middle"
          fontFamily="Cinzel, serif" fontSize="9" fill="#c8a060" opacity="0.8" letterSpacing="2">
          {job.role.toUpperCase().slice(0, 16)}
        </text>
        <text x="100" y="158" textAnchor="middle"
          fontFamily="Inter, sans-serif" fontSize="7" fill="#a08050" opacity="0.7">
          {job.period}
        </text>
        <ellipse cx="100" cy="260" rx="60" ry="15" fill="#e8940a" opacity={hovered ? 0.2 : 0.08} />
      </svg>

      {hovered && (
        <div style={{
          position: 'absolute', top: 0,
          right: isLarge ? '110%' : undefined,
          left: isLarge ? undefined : '110%',
          width: 300,
          background: 'rgba(12,8,3,0.97)',
          border: '1px solid rgba(232,148,10,0.4)',
          borderRadius: 10, padding: '16px 18px',
          boxShadow: '0 0 30px rgba(232,148,10,0.2)',
          animation: 'card-unfold 0.25s ease forwards',
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#e8940a', marginBottom: 2 }}>
                {job.company}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#c8a060' }}>
                {job.role} · {job.location}
              </p>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              background: 'rgba(232,148,10,0.15)', border: '1px solid rgba(232,148,10,0.4)',
              color: '#e8940a', padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap',
            }}>
              {job.badge}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'rgba(255,220,150,0.5)', marginBottom: 10 }}>
            {job.period}
          </p>
          {job.bullets.map((b, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'rgba(255,235,200,0.8)', lineHeight: 1.6,
              paddingLeft: 12, position: 'relative', marginBottom: 4,
            }}>
              <span style={{ position: 'absolute', left: 0, color: '#e8940a' }}>▸</span>
              {b}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
