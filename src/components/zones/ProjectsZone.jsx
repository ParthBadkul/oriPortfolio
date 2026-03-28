import { projects } from '../../data/portfolio'
import ProjectTree from '../ui/ProjectTree'
import useForestStore from '../../store/useForestStore'

export default function ProjectsZone() {
  const { startTransition, transitionPhase } = useForestStore()
  const isIdle = transitionPhase === 'idle'

  return (
    <div className="zone-ui">
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 11,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          color: '#c890ff', letterSpacing: '0.2em',
          textShadow: '0 0 25px rgba(200,144,255,0.5)',
        }}>
          PROJECTS
        </h2>
      </div>

      <div style={{ position: 'absolute', bottom: '8%', left: '20%', zIndex: 12 }}>
        <ProjectTree project={projects[0]} side="right" />
      </div>

      <div style={{ position: 'absolute', bottom: '8%', right: '20%', zIndex: 12 }}>
        <ProjectTree project={projects[1]} side="left" />
      </div>

      <button
        disabled={!isIdle}
        onClick={() => startTransition('hero')}
        style={{
          position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(5,8,5,0.85)', border: '2px solid var(--foliage-cool)',
          color: 'var(--foliage-bright)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4, opacity: isIdle ? 1 : 0.4,
          boxShadow: '0 0 15px rgba(30,92,53,0.4)',
          transition: 'box-shadow 0.2s, opacity 0.2s', zIndex: 12,
        }}
      >
        HOME →
      </button>
    </div>
  )
}
