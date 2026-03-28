import { useState } from 'react'
import { skills } from '../../data/portfolio'

const MUSHROOM_POSITIONS = [
  { left: '12%', bottom: '14%' }, { left: '24%', bottom: '12%' },
  { left: '38%', bottom: '15%' }, { left: '52%', bottom: '13%' },
  { left: '66%', bottom: '14%' }, { left: '78%', bottom: '12%' },
]

export default function SkillMushrooms() {
  const [hovered, setHovered] = useState(null)

  return (
    <>
      {skills.map((skill, i) => (
        <div
          key={skill.category}
          style={{ position: 'absolute', ...MUSHROOM_POSITIONS[i], zIndex: 13, cursor: 'pointer' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <svg width="36" height="44" viewBox="0 0 36 44">
            <ellipse cx="18" cy="22" rx="18" ry="12" fill={skill.color} opacity="0.85" />
            <ellipse cx="18" cy="22" rx="18" ry="12" fill={skill.color} opacity="0.3"
              style={{ filter: 'blur(6px)' }} />
            <rect x="14" y="22" width="8" height="20" fill={skill.color} opacity="0.7" rx="3" />
          </svg>

          {hovered === i && (
            <div style={{
              position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(5,10,5,0.92)', border: `1px solid ${skill.color}`,
              borderRadius: 8, padding: '10px 14px', minWidth: 140,
              boxShadow: `0 0 20px ${skill.color}44`,
              animation: 'card-unfold 0.2s ease forwards',
              pointerEvents: 'none', whiteSpace: 'nowrap',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '0.7rem',
                color: skill.color, letterSpacing: '0.1em', marginBottom: 6,
              }}>
                {skill.category.toUpperCase()}
              </div>
              {skill.items.map(item => (
                <div key={item} style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'rgba(220,255,210,0.85)', lineHeight: 1.6,
                }}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
