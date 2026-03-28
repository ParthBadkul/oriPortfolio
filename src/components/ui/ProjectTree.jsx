import { useState } from 'react'

export default function ProjectTree({ project, side = 'left' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="120" height="300" viewBox="0 0 120 300">
        <defs>
          <radialGradient id={`tree-glow-${project.id}`}>
            <stop offset="0%" stopColor="#7fffff" stopOpacity={hovered ? "0.6" : "0.2"} />
            <stop offset="100%" stopColor="#7fffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M50,300 Q45,220 42,160 Q40,120 60,80 Q80,120 78,160 Q75,220 70,300 Z" fill="#1e3d2a" />
        <path d="M52,280 Q50,220 48,180" stroke="#2d5a3d" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M65,270 Q67,200 70,160" stroke="#2d5a3d" strokeWidth="2" fill="none" opacity="0.5" />
        <ellipse cx="60" cy="90" rx="45" ry="55" fill="#1a4a2e" opacity="0.9" />
        <ellipse cx="40" cy="110" rx="30" ry="35" fill="#1e5c35" opacity="0.8" />
        <ellipse cx="80" cy="105" rx="28" ry="32" fill="#2d6e3e" opacity="0.8" />
        <ellipse cx="60" cy="280" rx="40" ry="15" fill={`url(#tree-glow-${project.id})`} />
        <circle cx="60" cy="265" r={hovered ? 10 : 7} fill="#7fffff" opacity={hovered ? 0.9 : 0.5}
          style={{ filter: 'blur(2px)', transition: 'all 0.3s' }} />
        {[[45,70],[70,65],[55,95],[75,85],[40,85]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={3+(i%3)} fill="#4ecb71" opacity={0.4}
            style={{ filter: 'blur(1px)' }} />
        ))}
      </svg>

      {hovered && (
        <div style={{
          position: 'absolute',
          [side === 'left' ? 'left' : 'right']: '110%',
          top: '10%',
          width: 280,
          background: 'rgba(5,12,8,0.96)',
          border: '1px solid rgba(127,255,255,0.4)',
          borderRadius: 10,
          padding: '16px 18px',
          boxShadow: '0 0 30px rgba(127,255,255,0.2)',
          animation: 'card-unfold 0.25s ease forwards',
          zIndex: 20,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#7fffff',
            marginBottom: 4, textShadow: '0 0 12px rgba(127,255,255,0.5)',
          }}>
            {project.name}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            color: 'rgba(200,255,255,0.5)', marginBottom: 10, fontStyle: 'italic',
          }}>
            {project.subtitle}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {project.stack.map(tech => (
              <span key={tech} style={{
                fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                background: 'rgba(127,255,255,0.1)', border: '1px solid rgba(127,255,255,0.3)',
                color: '#7fffff', padding: '2px 8px', borderRadius: 12,
              }}>
                {tech}
              </span>
            ))}
          </div>
          {project.bullets.map((b, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'rgba(220,255,220,0.8)', lineHeight: 1.6,
              paddingLeft: 12, position: 'relative', marginBottom: 4,
            }}>
              <span style={{ position: 'absolute', left: 0, color: '#4ecb71' }}>▸</span>
              {b}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
