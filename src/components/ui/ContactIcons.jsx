import { person } from '../../data/portfolio'

const LINKS = [
  { label: 'GitHub',   href: person.github,   icon: 'GH', color: '#c8ff6a' },
  { label: 'LinkedIn', href: person.linkedin,  icon: 'IN', color: '#7fffff' },
  { label: 'Email',    href: `mailto:${person.email}`, icon: '@', color: '#e8940a' },
]

export default function ContactIcons() {
  return (
    <div style={{
      position: 'absolute', bottom: '3%', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 20, zIndex: 13, alignItems: 'center',
    }}>
      {LINKS.map(link => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
          title={link.label}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(5,10,5,0.8)', border: `1px solid ${link.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: link.color, fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            fontWeight: 600, textDecoration: 'none',
            boxShadow: `0 0 12px ${link.color}55`,
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 0 24px ${link.color}99`
            e.currentTarget.style.transform = 'scale(1.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = `0 0 12px ${link.color}55`
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
