// src/components/forest/ForestBackground.jsx
import { useEffect, useRef } from 'react'

const LAYER_SPEEDS = [0.02, 0.06, 0.14, 0.28, 0.45]

const ZONE_GRADIENTS = {
  projects:   'radial-gradient(ellipse at 30% 40%, #1a0a3a 0%, #0a0d1f 40%, #030304 100%)',
  hero:       'radial-gradient(ellipse at 70% 30%, #1a0e04 0%, #0a1208 40%, #030304 100%)',
  experience: 'radial-gradient(ellipse at 60% 25%, #2a1400 0%, #120c04 40%, #030304 100%)',
}

export default function ForestBackground({ zone }) {
  const layerRefs = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const tick = () => {
      const { x, y } = mouseRef.current
      layerRefs.current.forEach((el, i) => {
        if (!el) return
        const speed = LAYER_SPEEDS[i]
        const tx = x * speed * 40
        const ty = y * speed * 20
        el.style.transform = `translate(${tx}px, ${ty}px)`
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const setRef = (i) => (el) => { layerRefs.current[i] = el }

  return (
    <div className="forest-bg" style={{ position: 'absolute', inset: 0, background: ZONE_GRADIENTS[zone] }}>

      {/* Layer 5 — Sky / far fog */}
      <div ref={setRef(0)} className="parallax-layer layer-sky" style={{
        background: zone === 'projects'
          ? 'radial-gradient(ellipse at 40% 50%, rgba(74,32,112,0.5) 0%, transparent 70%)'
          : zone === 'experience'
          ? 'radial-gradient(ellipse at 65% 35%, rgba(245,192,48,0.25) 0%, transparent 65%)'
          : 'radial-gradient(ellipse at 70% 30%, rgba(232,148,10,0.2) 0%, transparent 60%)',
      }} />

      {/* Layer 4 — Distant tree silhouettes */}
      <div ref={setRef(1)} className="parallax-layer layer-far" style={{ bottom: 0, top: 'auto', height: '75%' }}>
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" style={{ width: '110%', height: '100%', marginLeft: '-5%' }}>
          {[80,180,300,450,600,750,880,1020,1150,1280,1380].map((x, i) => (
            <ellipse key={i} cx={x} cy={580 - (i % 3) * 30} rx={30 + (i%4)*10} ry={120 + (i%3)*40}
              fill={zone === 'projects' ? '#1a0f30' : zone === 'experience' ? '#2a1808' : '#152b1e'}
              opacity={0.95} />
          ))}
          {[120,260,420,580,720,900,1060,1220,1360].map((x, i) => (
            <rect key={`t${i}`} x={x-8} y={400-(i%4)*20} width={16} height={200}
              fill={zone === 'projects' ? '#1a0f30' : zone === 'experience' ? '#2a1808' : '#152b1e'}
              opacity={0.9} rx={6} />
          ))}
        </svg>
      </div>

      {/* Layer 3 — Mid trunks + hanging vines */}
      <div ref={setRef(2)} className="parallax-layer layer-mid" style={{ bottom: 0, top: 'auto', height: '80%' }}>
        <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" style={{ width: '115%', height: '100%', marginLeft: '-7.5%' }}>
          {[60,220,400,560,720,900,1080,1240,1400].map((x, i) => {
            const colors = ['#1e5c35','#4a2070','#cc5500','#1e5c35','#006666','#4a2070','#1e5c35','#9b3a1a','#1e5c35']
            return <rect key={i} x={x-12} y={200-(i%3)*40} width={24} height={500}
              fill={colors[i % colors.length]} opacity={0.7} rx={8} />
          })}
          {[150,320,500,680,860,1040,1200,1370].map((x, i) => (
            <path key={`v${i}`}
              d={`M${x},0 Q${x+(i%2?15:-15)},${80+(i%3)*30} ${x+(i%2?-5:5)},${160+(i%3)*40}`}
              stroke={i%3===0 ? '#2d6e3e' : i%3===1 ? '#4a2070' : '#1e5c35'}
              strokeWidth={3+(i%3)} fill="none" opacity={0.6} />
          ))}
          <defs>
            <radialGradient id={`glow1-${zone}`}>
              <stop offset="0%" stopColor={zone==='projects'?'#7fffff':'#e8940a'} stopOpacity="0.3"/>
              <stop offset="100%" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx={zone==='projects'?350:800} cy={300} rx={200} ry={150} fill={`url(#glow1-${zone})`} />
        </svg>
      </div>

      {/* Layer 2 — Near ferns, roots, rocks */}
      <div ref={setRef(3)} className="parallax-layer layer-near" style={{ bottom: 0, top: 'auto', height: '55%' }}>
        <svg viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice" style={{ width: '120%', height: '100%', marginLeft: '-10%' }}>
          {[100,280,480,700,920,1140,1320].map((x, i) => (
            <ellipse key={i} cx={x} cy={400+(i%3)*10} rx={40+(i%4)*15} ry={20+(i%3)*8}
              fill={i%3===0?'#1e5c35':i%3===1?'#4a2070':'#9b3a1a'} opacity={0.85} />
          ))}
          {[60,200,380,560,740,920,1080,1260,1400].map((x, i) => {
            const col = ['#4ecb71','#8bc34a','#4a2070','#2d6e3e','#cc5500','#006666','#4ecb71','#9b3a1a','#8bc34a'][i]
            return <g key={`f${i}`}>
              {[-20,-10,0,10,20].map((dx, j) => (
                <ellipse key={j} cx={x+dx} cy={360+(i%3)*15} rx={8} ry={30+(j*4)}
                  fill={col} opacity={0.7+(j*0.05)}
                  transform={`rotate(${dx*2}, ${x+dx}, ${380+(i%3)*15})`} />
              ))}
            </g>
          })}
          {[160,440,700,960,1220].map((x, i) => {
            const col = ['#c8ff6a','#7fffff','#e8940a','#c8ff6a','#7fffff'][i]
            return <g key={`m${i}`}>
              <ellipse cx={x} cy={390} rx={18} ry={10} fill={col} opacity={0.4} />
              <ellipse cx={x} cy={390} rx={18} ry={10} fill={col} opacity={0.15} style={{filter:'blur(8px)'}} />
              <rect x={x-3} y={370} width={6} height={22} fill={col} opacity={0.6} rx={3} />
            </g>
          })}
        </svg>
      </div>

      {/* Layer 1 — Foreground plants */}
      <div ref={setRef(4)} className="parallax-layer layer-ground" style={{ bottom: 0, top: 'auto', height: '35%' }}>
        <svg viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax slice" style={{ width: '125%', height: '100%', marginLeft: '-12.5%' }}>
          <defs>
            <linearGradient id={`ground-${zone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={zone==='projects'?'#0d1020':zone==='experience'?'#120800':'#030a06'} stopOpacity="0"/>
              <stop offset="100%" stopColor={zone==='projects'?'#0d1020':zone==='experience'?'#120800':'#030a06'} stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="280" fill={`url(#ground-${zone})`} />
          {[0,140,300,480,660,840,1020,1180,1340,1440].map((x, i) => (
            <path key={i}
              d={`M${x},280 Q${x+30},${220-(i%4)*20} ${x+20},${180-(i%3)*15} Q${x+35},${200-(i%4)*10} ${x+60},280`}
              fill={i%3===0?'#020804':i%3===1?'#05020a':'#080300'} />
          ))}
        </svg>
      </div>
    </div>
  )
}
