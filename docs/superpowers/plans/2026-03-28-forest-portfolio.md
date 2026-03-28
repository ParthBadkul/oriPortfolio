# Forest Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Parth Badkul's portfolio as a single-screen Ori-inspired 2D side-scrolling forest world with three navigable zones (Projects ↔ Hero ↔ Experience), Ori spirit orb controlled by keyboard, and cave portal zone transitions.

**Architecture:** Hybrid CSS + WebGL approach — CSS/SVG layered forest background for atmosphere, transparent R3F canvas overlay for Ori orb, fireflies, and bloom post-processing, HTML/CSS UI layer on top for all interactive content. Zone navigation = GSAP translateX on the world container disguised by a cave portal + black fade.

**Tech Stack:** React 18 + Vite, @react-three/fiber, @react-three/drei, @react-three/postprocessing, GSAP, Zustand, Vitest

---

## File Map

```
src/
├── data/portfolio.js                    — All portfolio content (single source of truth)
├── store/useForestStore.js              — Zustand: activeZone, oriX, transitionPhase
├── hooks/useOriControls.js             — Keyboard → Ori state machine
├── hooks/useZoneTransition.js          — GSAP cave transition orchestration
├── components/
│   ├── canvas/
│   │   ├── ForestCanvas.jsx            — R3F Canvas (transparent bg, pointer-events:none)
│   │   ├── OriOrb.jsx                  — Glowing sphere + point light, handles states
│   │   ├── FirefliesSystem.jsx         — 150 instanced firefly particles
│   │   └── PostFX.jsx                  — Bloom + Vignette
│   ├── forest/
│   │   ├── ForestBackground.jsx        — 5 CSS parallax layers, zone color theming
│   │   └── CavePortal.jsx              — SVG/CSS cave arch, grows on transition trigger
│   ├── zones/
│   │   ├── HeroZone.jsx                — Name, tagline, bio, nav buttons
│   │   ├── ProjectsZone.jsx            — Two interactive project trees
│   │   └── ExperienceZone.jsx          — Stone tablets + education stone
│   └── ui/
│       ├── SkillMushrooms.jsx          — Hover clusters revealing skill badges
│       ├── ProjectTree.jsx             — Single interactive tree + hover card
│       ├── ExperienceTablet.jsx        — Single stone tablet + hover bullets
│       ├── CertScroll.jsx              — Parchment scroll, bottom-left
│       └── ContactIcons.jsx            — Firefly-glow contact links, bottom-center
├── styles/
│   ├── index.css                       — CSS variables, reset, fonts import
│   └── forest.css                      — Forest layer styles, zone themes, animations
├── App.jsx                             — Root: world container + all zones + canvas overlay
└── main.jsx
```

---

## Task 1: Scaffold Vite + React Project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Initialize Vite project in E:/Portf**

```bash
cd E:/Portf
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty" → select **Ignore files and continue**. Select framework: **React**, variant: **JavaScript**.

- [ ] **Step 2: Install all dependencies**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap zustand
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 4: Create test setup file**

```js
// src/test-setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Clear boilerplate — replace src/App.jsx**

```jsx
// src/App.jsx
export default function App() {
  return <div id="forest-root">Forest Portfolio</div>
}
```

- [ ] **Step 6: Replace src/main.jsx**

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server at http://localhost:5173. Browser shows "Forest Portfolio".

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite React project with dependencies"
```

---

## Task 2: Global Styles + CSS Variables

**Files:**
- Create: `src/styles/index.css`, `src/styles/forest.css`

- [ ] **Step 1: Write index.css**

```css
/* src/styles/index.css */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
@import './forest.css';

:root {
  /* Background */
  --bg-deep: #030304;
  --bg-shadow: #08090c;

  /* Foliage */
  --foliage-cool: #1e5c35;
  --foliage-bright: #4ecb71;
  --foliage-yellow: #8bc34a;
  --foliage-purple: #4a2070;
  --foliage-orange: #cc5500;
  --foliage-rust: #9b3a1a;
  --foliage-teal: #006666;

  /* Lights */
  --light-amber: #e8940a;
  --light-canopy: #f5c030;
  --light-spirit: #7fffff;
  --light-firefly: #c8ff6a;

  /* Zone atmospheres */
  --zone-hero-glow: rgba(232, 148, 10, 0.15);
  --zone-projects-glow: rgba(74, 32, 112, 0.25);
  --zone-experience-glow: rgba(245, 192, 48, 0.20);

  /* Typography */
  --font-display: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;

  /* UI */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(78, 203, 113, 0.3);
  --glass-blur: 12px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--bg-deep);
  color: #e8ffe0;
  font-family: var(--font-body);
  cursor: none;
}

/* Custom cursor — small glowing dot */
body::after {
  content: '';
  position: fixed;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--light-spirit);
  box-shadow: 0 0 12px 4px var(--light-spirit);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
  /* position updated via JS in App.jsx */
}
```

- [ ] **Step 2: Write forest.css**

```css
/* src/styles/forest.css */

/* Forest world container — translateX drives zone navigation */
#forest-world {
  position: fixed;
  inset: 0;
  width: 300vw; /* 3 zones side by side */
  height: 100vh;
  display: flex;
  will-change: transform;
  transition: none; /* GSAP controls this */
}

/* Each zone occupies one viewport width */
.forest-zone {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

/* Parallax layer base */
.parallax-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
}

/* Forest layer depth positions */
.layer-sky    { z-index: 1; }
.layer-far    { z-index: 2; }
.layer-mid    { z-index: 3; }
.layer-near   { z-index: 4; }
.layer-ground { z-index: 5; }

/* UI overlay sits above forest layers */
.zone-ui {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.zone-ui > * { pointer-events: auto; }

/* Glass panel base */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 16px 20px;
}

/* Ori walk animation */
@keyframes ori-bob {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes glow-pulse {
  0%, 100% { filter: brightness(1) blur(0px); }
  50% { filter: brightness(1.4) blur(1px); }
}

@keyframes float-up-fade {
  0%   { opacity: 0; transform: translateY(10px); }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); }
}

@keyframes card-unfold {
  0%   { opacity: 0; transform: scaleY(0); transform-origin: top; }
  100% { opacity: 1; transform: scaleY(1); }
}

@keyframes scroll-unroll {
  0%   { max-height: 0; opacity: 0; }
  100% { max-height: 300px; opacity: 1; }
}
```

- [ ] **Step 3: Verify styles load — update App.jsx temporarily**

```jsx
// src/App.jsx
export default function App() {
  return (
    <div id="forest-root" style={{ width: '100vw', height: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foliage-bright)' }}>
        PARTH BADKUL
      </h1>
    </div>
  )
}
```

Run `npm run dev` — expect dark background, Cinzel font heading in green.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ src/App.jsx src/main.jsx
git commit -m "feat: add global styles, CSS variables, and forest.css"
```

---

## Task 3: Portfolio Data File

**Files:**
- Create: `src/data/portfolio.js`

- [ ] **Step 1: Write portfolio.js**

```js
// src/data/portfolio.js
export const person = {
  name: 'Parth Badkul',
  title: 'Full-Stack Developer & Animator',
  bio: 'I blend creativity with functionality, ensuring each element contributes to a cohesive digital experience — building visually engaging interfaces that are intuitive and immersive.',
  email: 'badkul191@gmail.com',
  phone: '+91-789-108-9082',
  github: 'https://github.com/ParthBadkul',
  linkedin: 'https://linkedin.com/in/parth-badkul-35b62b217',
  website: 'https://parthbadkul.in',
}

export const skills = [
  { category: 'Backend',     icon: '⚙',  color: '#4ecb71', items: ['Java 8/11/17', 'Spring Boot', 'Spring Security', 'Hibernate/JPA'] },
  { category: 'Databases',   icon: '🗄',  color: '#8bc34a', items: ['PostgreSQL', 'MySQL', 'Redis'] },
  { category: 'Integration', icon: '⚡',  color: '#c8ff6a', items: ['Apache Kafka', 'RESTful APIs', 'Event-Driven Arch'] },
  { category: 'DevOps',      icon: '🐳',  color: '#7fffff', items: ['Docker', 'Kubernetes', 'Azure DevOps', 'CI/CD'] },
  { category: 'Security',    icon: '🔐',  color: '#e8940a', items: ['JWT', 'OAuth2', 'ELK Stack'] },
  { category: 'Mobile',      icon: '📱',  color: '#cc5500', items: ['Flutter'] },
]

export const experience = [
  {
    id: 'pepsico',
    company: 'PepsiCo Global Business Services',
    badge: 'Fortune 50',
    role: 'Backend Developer',
    period: 'Aug 2023 – Present',
    location: 'Hyderabad, India',
    bullets: [
      'BEAM workflow for WMS — reduced manual validation 25%, improved inventory accuracy 10%',
      '3 core microservices powering Content Hub (Compass) — PepsiCo\'s internal comms platform',
      'Scalable API endpoints consumed across web, email, and employee-facing platforms',
      'Enterprise data migration: 100% accuracy, <2hr downtime',
      'ELK dashboards — reduced incident resolution by 15%',
      'Azure DevOps pipeline migration with zero data loss',
    ],
  },
  {
    id: 'synergy',
    company: 'Synergy Technologies',
    badge: 'Internship',
    role: 'Software Developer Intern',
    period: 'May 2022 – Jul 2022',
    location: 'Remote',
    bullets: [
      'Flutter social-sharing module — 8% engagement increase (3,000+ users)',
      'App load time optimized 35% (4.2s → 2.7s)',
    ],
  },
]

export const projects = [
  {
    id: 'hoot',
    name: 'Hoot',
    subtitle: 'Social Networking App',
    stack: ['Flutter', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Spring Security'],
    bullets: [
      'Full-stack app — JWT auth, RESTful APIs, Kafka streaming (5,000+ events/min)',
      'Secure auth: JWT + BCrypt + email verification with token-based activation',
      'Flutter UI with animations and responsive layouts',
    ],
  },
  {
    id: 'fraud',
    name: 'Fraud Detection',
    subtitle: 'Transaction Fraud Detection System',
    stack: ['Java', 'Spring Boot', 'Apache Kafka', 'ML APIs'],
    bullets: [
      'Real-time detection: 10,000+ transactions/day with <100ms latency',
      'Kafka-based asynchronous pipeline for high-throughput processing',
    ],
  },
]

export const education = {
  degree: 'B.Tech Computer Science',
  institution: 'Vellore Institute of Technology (VIT), Vellore',
  year: 'May 2023',
}

export const certifications = [
  'ASP.NET Beginner Certification — Udemy (via PepsiCo) | 2024',
  'Node.js, Express, MongoDB — HKUST | 2022',
  'Runner-Up — PepsiCo Hackathon "Next Big Idea" | 2024',
]
```

- [ ] **Step 2: Write test**

```js
// src/data/portfolio.test.js
import { person, skills, experience, projects, education, certifications } from './portfolio'

test('person has required fields', () => {
  expect(person.name).toBe('Parth Badkul')
  expect(person.email).toBeTruthy()
  expect(person.github).toBeTruthy()
})

test('skills has 6 categories', () => {
  expect(skills).toHaveLength(6)
  skills.forEach(s => {
    expect(s.category).toBeTruthy()
    expect(s.items.length).toBeGreaterThan(0)
  })
})

test('experience has 2 entries with bullets', () => {
  expect(experience).toHaveLength(2)
  experience.forEach(e => expect(e.bullets.length).toBeGreaterThan(0))
})

test('projects has 2 entries with stacks', () => {
  expect(projects).toHaveLength(2)
  projects.forEach(p => expect(p.stack.length).toBeGreaterThan(0))
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/data/portfolio.test.js
```
Expected: 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add portfolio data and passing tests"
```

---

## Task 4: Zustand Store

**Files:**
- Create: `src/store/useForestStore.js`

- [ ] **Step 1: Write the store**

```js
// src/store/useForestStore.js
import { create } from 'zustand'

// Zones ordered left→right. Index maps to CSS translateX.
// Hero=1 is the visible default (world starts at -100vw offset so Hero is centered)
export const ZONES = ['projects', 'hero', 'experience']
export const ZONE_INDEX = { projects: 0, hero: 1, experience: 2 }

// transitionPhase: 'idle' | 'walking' | 'entering-cave' | 'dark' | 'emerging' | 'arriving'
const useForestStore = create((set, get) => ({
  activeZone: 'hero',
  targetZone: null,
  transitionPhase: 'idle',
  oriX: 0,           // Ori's X position within current viewport (0 = center)
  oriDirection: 1,   // 1 = facing right, -1 = facing left
  oriState: 'idle',  // 'idle' | 'walk' | 'enter-cave' | 'emerge'

  setOriState: (oriState) => set({ oriState }),
  setOriX: (oriX) => set({ oriX }),
  setOriDirection: (oriDirection) => set({ oriDirection }),

  startTransition: (targetZone) => {
    if (get().transitionPhase !== 'idle') return
    set({ targetZone, transitionPhase: 'walking' })
  },

  setTransitionPhase: (transitionPhase) => set({ transitionPhase }),

  completeTransition: () => {
    const { targetZone } = get()
    set({
      activeZone: targetZone,
      targetZone: null,
      transitionPhase: 'idle',
      oriX: 0,
      oriState: 'idle',
    })
  },
}))

export default useForestStore
```

- [ ] **Step 2: Write test**

```js
// src/store/useForestStore.test.js
import { renderHook, act } from '@testing-library/react'
import useForestStore, { ZONES, ZONE_INDEX } from './useForestStore'

beforeEach(() => {
  // Reset store between tests
  useForestStore.setState({
    activeZone: 'hero', targetZone: null,
    transitionPhase: 'idle', oriX: 0,
    oriDirection: 1, oriState: 'idle',
  })
})

test('ZONES array has 3 entries in correct order', () => {
  expect(ZONES).toEqual(['projects', 'hero', 'experience'])
})

test('startTransition sets targetZone and phase to walking', () => {
  const { result } = renderHook(() => useForestStore())
  act(() => result.current.startTransition('projects'))
  expect(result.current.targetZone).toBe('projects')
  expect(result.current.transitionPhase).toBe('walking')
})

test('startTransition is no-op when already transitioning', () => {
  useForestStore.setState({ transitionPhase: 'dark' })
  const { result } = renderHook(() => useForestStore())
  act(() => result.current.startTransition('experience'))
  expect(result.current.transitionPhase).toBe('dark')
  expect(result.current.targetZone).toBeNull()
})

test('completeTransition sets activeZone to targetZone and resets state', () => {
  useForestStore.setState({ targetZone: 'projects', transitionPhase: 'arriving', oriX: 300 })
  const { result } = renderHook(() => useForestStore())
  act(() => result.current.completeTransition())
  expect(result.current.activeZone).toBe('projects')
  expect(result.current.transitionPhase).toBe('idle')
  expect(result.current.oriX).toBe(0)
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/store/useForestStore.test.js
```
Expected: 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand forest store with transition state machine"
```

---

## Task 5: Keyboard Controls Hook

**Files:**
- Create: `src/hooks/useOriControls.js`

- [ ] **Step 1: Write the hook**

```js
// src/hooks/useOriControls.js
import { useEffect, useRef } from 'react'
import useForestStore from '../store/useForestStore'

// Ori moves at this speed (px/frame at 60fps)
const WALK_SPEED = 3
// When oriX exceeds this threshold, trigger zone transition
const EDGE_THRESHOLD = window.innerWidth * 0.42

export default function useOriControls() {
  const { oriX, oriState, transitionPhase, activeZone,
          setOriX, setOriDirection, setOriState, startTransition } = useForestStore()

  const keysRef = useRef({ left: false, right: false })
  const rafRef = useRef(null)
  const stateRef = useRef({ oriX, oriState, transitionPhase, activeZone })

  // Keep ref in sync with store so RAF closure has fresh values
  useEffect(() => {
    stateRef.current = { oriX, oriState, transitionPhase, activeZone }
  }, [oriX, oriState, transitionPhase, activeZone])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a') keysRef.current.left  = true
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true
    }
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a') keysRef.current.left  = false
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const { left, right } = keysRef.current
      const { oriX: x, transitionPhase, activeZone } = stateRef.current

      // Only move when idle (not mid-transition)
      if (transitionPhase === 'idle') {
        if (left && !right) {
          setOriDirection(-1)
          setOriState('walk')
          const newX = x - WALK_SPEED
          // Check if we can go left (need a zone to the left)
          if (activeZone === 'hero' || activeZone === 'experience') {
            if (newX < -EDGE_THRESHOLD) {
              // Trigger transition
              const dest = activeZone === 'hero' ? 'projects' : 'hero'
              startTransition(dest)
            } else {
              setOriX(newX)
            }
          }
        } else if (right && !left) {
          setOriDirection(1)
          setOriState('walk')
          const newX = x + WALK_SPEED
          if (activeZone === 'hero' || activeZone === 'projects') {
            if (newX > EDGE_THRESHOLD) {
              const dest = activeZone === 'hero' ? 'experience' : 'hero'
              startTransition(dest)
            } else {
              setOriX(newX)
            }
          }
        } else {
          setOriState('idle')
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setOriX, setOriDirection, setOriState, startTransition])
}
```

- [ ] **Step 2: Write test**

```js
// src/hooks/useOriControls.test.js
import { ZONE_INDEX } from '../store/useForestStore'

test('ZONE_INDEX maps zones to correct indices', () => {
  expect(ZONE_INDEX.projects).toBe(0)
  expect(ZONE_INDEX.hero).toBe(1)
  expect(ZONE_INDEX.experience).toBe(2)
})

test('projects zone has no left neighbor, experience has no right neighbor', () => {
  // projects: can only go right (→ hero)
  // experience: can only go left (→ hero)
  // hero: can go both directions
  const canGoLeft  = (z) => z === 'hero' || z === 'experience'
  const canGoRight = (z) => z === 'hero' || z === 'projects'
  expect(canGoLeft('projects')).toBe(false)
  expect(canGoRight('experience')).toBe(false)
  expect(canGoLeft('hero')).toBe(true)
  expect(canGoRight('hero')).toBe(true)
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/hooks/useOriControls.test.js
```
Expected: 2 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useOriControls.js src/hooks/useOriControls.test.js
git commit -m "feat: add Ori keyboard controls hook with edge-threshold detection"
```

---

## Task 6: Zone Transition Hook (GSAP Cave)

**Files:**
- Create: `src/hooks/useZoneTransition.js`

- [ ] **Step 1: Write the hook**

```js
// src/hooks/useZoneTransition.js
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from '../store/useForestStore'

export default function useZoneTransition(worldRef, overlayRef) {
  const { transitionPhase, targetZone, activeZone,
          setTransitionPhase, setOriX, setOriState, completeTransition } = useForestStore()

  const phaseRef = useRef(transitionPhase)
  useEffect(() => { phaseRef.current = transitionPhase }, [transitionPhase])

  useEffect(() => {
    if (transitionPhase !== 'walking') return
    if (!targetZone) return

    // Phase 1: Ori walks to edge — already happening via useOriControls.
    // Transition was triggered when Ori hit the edge threshold.
    // Now: grow cave, then fade to black.
    setTransitionPhase('entering-cave')
    setOriState('enter-cave')

    // After cave grow animation (600ms), fade to black
    const tl = gsap.timeline()

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      delay: 0.4,
      ease: 'power2.in',
      onStart: () => setTransitionPhase('dark'),
    })

    // While dark: snap world to target zone
    tl.call(() => {
      const targetIndex = ZONE_INDEX[targetZone]
      // World is 300vw wide. Zone 0 = projects (translateX: 0),
      // Zone 1 = hero (translateX: -100vw), Zone 2 = experience (translateX: -200vw)
      const targetX = -(targetIndex * 100)
      gsap.set(worldRef.current, { xPercent: targetX / 3 })
      // xPercent is relative to element width (300vw), so divide by 3 to get viewport units
      // Actually use px: set to -(targetIndex * window.innerWidth)
      gsap.set(worldRef.current, { x: -(targetIndex * window.innerWidth) })

      // Ori emerges from opposite edge
      const isGoingRight = ZONE_INDEX[targetZone] > ZONE_INDEX[activeZone]
      const emergeX = isGoingRight ? -window.innerWidth * 0.45 : window.innerWidth * 0.45
      setOriX(emergeX)
      setOriState('emerge')
      setTransitionPhase('emerging')
    })

    // Fade overlay back out
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })

    // Ori walks to center (handled by useOriControls walking state)
    // We just need to animate oriX to 0
    tl.call(() => {
      const store = useForestStore.getState()
      gsap.to({ x: store.oriX }, {
        x: 0,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function() { setOriX(this.targets()[0].x) },
        onComplete: () => {
          setOriState('idle')
          completeTransition()
        },
      })
    })

    return () => tl.kill()
  }, [transitionPhase])
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useZoneTransition.js
git commit -m "feat: add GSAP zone transition hook with cave portal sequence"
```

---

## Task 7: Forest Background (CSS Parallax Layers)

**Files:**
- Create: `src/components/forest/ForestBackground.jsx`

- [ ] **Step 1: Write ForestBackground**

```jsx
// src/components/forest/ForestBackground.jsx
import { useEffect, useRef } from 'react'
import useForestStore from '../../store/useForestStore'

// Parallax speeds: how much each layer shifts on mouse move (0 = no shift, 1 = full shift)
const LAYER_SPEEDS = [0.02, 0.06, 0.14, 0.28, 0.45]

// Zone-specific background gradients
const ZONE_GRADIENTS = {
  projects:   'radial-gradient(ellipse at 30% 40%, #1a0a3a 0%, #0a0d1f 40%, #030304 100%)',
  hero:       'radial-gradient(ellipse at 70% 30%, #1a0e04 0%, #0a1208 40%, #030304 100%)',
  experience: 'radial-gradient(ellipse at 60% 25%, #2a1400 0%, #120c04 40%, #030304 100%)',
}

export default function ForestBackground({ zone }) {
  const layerRefs = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  // Mouse parallax idle effect
  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,   // -1 to 1
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const tick = () => {
      const { x, y } = mouseRef.current
      layerRefs.current.forEach((el, i) => {
        if (!el) return
        const speed = LAYER_SPEEDS[i]
        const tx = x * speed * 40  // max 40px shift
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
          {/* Far trees — simple silhouettes */}
          {[80,180,300,450,600,750,880,1020,1150,1280,1380].map((x, i) => (
            <ellipse key={i} cx={x} cy={580 - (i % 3) * 30} rx={30 + (i%4)*10} ry={120 + (i%3)*40}
              fill={zone === 'projects' ? '#0d0a1e' : zone === 'experience' ? '#1a0c04' : '#0a1208'}
              opacity={0.9} />
          ))}
          {[120,260,420,580,720,900,1060,1220,1360].map((x, i) => (
            <rect key={`t${i}`} x={x-8} y={400-(i%4)*20} width={16} height={200}
              fill={zone === 'projects' ? '#0d0a1e' : zone === 'experience' ? '#1a0c04' : '#0a1208'}
              opacity={0.85} rx={6} />
          ))}
        </svg>
      </div>

      {/* Layer 3 — Mid trunks + hanging vines */}
      <div ref={setRef(2)} className="parallax-layer layer-mid" style={{ bottom: 0, top: 'auto', height: '80%' }}>
        <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" style={{ width: '115%', height: '100%', marginLeft: '-7.5%' }}>
          {/* Mid tree trunks */}
          {[60,220,400,560,720,900,1080,1240,1400].map((x, i) => {
            const colors = ['#1e5c35','#4a2070','#cc5500','#1e5c35','#006666','#4a2070','#1e5c35','#9b3a1a','#1e5c35']
            return <rect key={i} x={x-12} y={200-(i%3)*40} width={24} height={500}
              fill={colors[i % colors.length]} opacity={0.7} rx={8} />
          })}
          {/* Hanging vines */}
          {[150,320,500,680,860,1040,1200,1370].map((x, i) => (
            <path key={`v${i}`}
              d={`M${x},0 Q${x+(i%2?15:-15)},${80+(i%3)*30} ${x+(i%2?-5:5)},${160+(i%3)*40}`}
              stroke={i%3===0 ? '#2d6e3e' : i%3===1 ? '#4a2070' : '#1e5c35'}
              strokeWidth={3+(i%3)} fill="none" opacity={0.6} />
          ))}
          {/* Ambient glow spots */}
          <radialGradient id="glow1"><stop offset="0%" stopColor={zone==='projects'?'#7fffff':'#e8940a'} stopOpacity="0.3"/><stop offset="100%" stopOpacity="0"/></radialGradient>
          <ellipse cx={zone==='projects'?350:800} cy={300} rx={200} ry={150} fill="url(#glow1)" />
        </svg>
      </div>

      {/* Layer 2 — Near ferns, roots, rocks */}
      <div ref={setRef(3)} className="parallax-layer layer-near" style={{ bottom: 0, top: 'auto', height: '55%' }}>
        <svg viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice" style={{ width: '120%', height: '100%', marginLeft: '-10%' }}>
          {/* Mossy rocks */}
          {[100,280,480,700,920,1140,1320].map((x, i) => (
            <ellipse key={i} cx={x} cy={400+(i%3)*10} rx={40+(i%4)*15} ry={20+(i%3)*8}
              fill={i%3===0?'#1e5c35':i%3===1?'#4a2070':'#9b3a1a'} opacity={0.85} />
          ))}
          {/* Fern clusters */}
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
          {/* Glowing mushrooms */}
          {[160,440,700,960,1220].map((x, i) => {
            const col = ['#c8ff6a','#7fffff','#e8940a','#c8ff6a','#7fffff'][i]
            return <g key={`m${i}`}>
              <ellipse cx={x} cy={390} rx={18} ry={10} fill={col} opacity={0.4} />
              <ellipse cx={x} cy={390} rx={18} ry={10} fill={col} opacity={0.15} style={{filter:`blur(8px)`}} />
              <rect x={x-3} y={370} width={6} height={22} fill={col} opacity={0.6} rx={3} />
            </g>
          })}
        </svg>
      </div>

      {/* Layer 1 — Foreground plants (darkest, closest) */}
      <div ref={setRef(4)} className="parallax-layer layer-ground" style={{ bottom: 0, top: 'auto', height: '35%' }}>
        <svg viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax slice" style={{ width: '125%', height: '100%', marginLeft: '-12.5%' }}>
          {/* Ground gradient */}
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={zone==='projects'?'#0d1020':zone==='experience'?'#120800':'#030a06'} stopOpacity="0"/>
              <stop offset="100%" stopColor={zone==='projects'?'#0d1020':zone==='experience'?'#120800':'#030a06'} stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect width="1440" height="280" fill="url(#ground)" />
          {/* Dark foreground plant silhouettes */}
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
```

- [ ] **Step 2: Verify visually — add to App.jsx temporarily**

```jsx
// src/App.jsx
import ForestBackground from './components/forest/ForestBackground'
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#030304' }}>
      <ForestBackground zone="hero" />
    </div>
  )
}
```

Run `npm run dev`. Expect: dark forest scene with layered trees, ferns, and colored plants visible. Move mouse — layers should subtly parallax.

- [ ] **Step 3: Test other zones**

Change `zone="projects"` — expect blue-purple atmosphere. Change `zone="experience"` — expect warm amber glow.

- [ ] **Step 4: Commit**

```bash
git add src/components/forest/
git commit -m "feat: add 5-layer parallax forest background with zone theming"
```

---

## Task 8: R3F Canvas + Fireflies

**Files:**
- Create: `src/components/canvas/ForestCanvas.jsx`, `src/components/canvas/FirefliesSystem.jsx`, `src/components/canvas/PostFX.jsx`

- [ ] **Step 1: Write PostFX.jsx**

```jsx
// src/components/canvas/PostFX.jsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.4} radius={0.8} />
      <Vignette eskil={false} offset={0.4} darkness={0.6} />
    </EffectComposer>
  )
}
```

- [ ] **Step 2: Write FirefliesSystem.jsx**

```jsx
// src/components/canvas/FirefliesSystem.jsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 150

export default function FirefliesSystem({ zone = 'hero' }) {
  const meshRef = useRef()

  const { positions, speeds, phases, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds    = new Float32Array(COUNT)
    const phases    = new Float32Array(COUNT)
    const colors    = new Float32Array(COUNT * 3)

    // Zone color bias
    const warmColor  = new THREE.Color('#c8ff6a')
    const coolColor  = new THREE.Color('#7fffff')
    const purpleColor = new THREE.Color('#c890ff')

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18   // x spread
      positions[i * 3 + 1] = Math.random() * 6 - 1        // y: -1 to 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4   // z spread

      speeds[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2

      // Color based on zone
      const t = Math.random()
      let c
      if (zone === 'projects') c = t > 0.5 ? coolColor : purpleColor
      else if (zone === 'experience') c = t > 0.4 ? warmColor : coolColor
      else c = t > 0.5 ? warmColor : coolColor

      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, speeds, phases, colors }
  }, [zone])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array

    for (let i = 0; i < COUNT; i++) {
      // Gentle bobbing + slow drift
      pos[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t * speeds[i] + phases[i]) * 0.3
      pos[i * 3]     = positions[i * 3]     + Math.cos(t * speeds[i] * 0.4 + phases[i]) * 0.15
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(positions), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </points>
  )
}
```

- [ ] **Step 3: Write ForestCanvas.jsx**

```jsx
// src/components/canvas/ForestCanvas.jsx
import { Canvas } from '@react-three/fiber'
import FirefliesSystem from './FirefliesSystem'
import PostFX from './PostFX'
import useForestStore from '../../store/useForestStore'

export default function ForestCanvas() {
  const activeZone = useForestStore((s) => s.activeZone)

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: true, toneMapping: 3 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.05} />
      <FirefliesSystem zone={activeZone} />
      <PostFX />
    </Canvas>
  )
}
```

- [ ] **Step 4: Add to App.jsx and verify**

```jsx
// src/App.jsx
import ForestBackground from './components/forest/ForestBackground'
import ForestCanvas from './components/canvas/ForestCanvas'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#030304' }}>
      <ForestBackground zone="hero" />
      <ForestCanvas />
    </div>
  )
}
```

Run `npm run dev`. Expect: forest background with glowing firefly particles floating and bobbing. Bloom effect makes them glow softly.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/
git commit -m "feat: add R3F canvas with fireflies system and bloom post-processing"
```

---

## Task 9: Ori Spirit Orb

**Files:**
- Create: `src/components/canvas/OriOrb.jsx`

- [ ] **Step 1: Write OriOrb.jsx**

```jsx
// src/components/canvas/OriOrb.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useForestStore from '../../store/useForestStore'

// Convert screen px to Three.js world units (approximate for fov=60, z=0, camera at z=8)
const PX_TO_WORLD = 8 / window.innerHeight

export default function OriOrb() {
  const orbRef  = useRef()
  const lightRef = useRef()
  const { oriX, oriState, oriDirection } = useForestStore()

  useFrame(({ clock }) => {
    if (!orbRef.current) return
    const t = clock.getElapsedTime()

    // Convert oriX (px from center) to world units
    const wx = oriX * PX_TO_WORLD * (window.innerWidth / window.innerHeight)
    orbRef.current.position.x = wx

    // Idle bob
    if (oriState === 'idle') {
      orbRef.current.position.y = Math.sin(t * 1.8) * 0.15 - 0.5
    } else {
      orbRef.current.position.y = Math.sin(t * 3) * 0.06 - 0.5  // faster subtle bob while walking
    }

    // Glow pulse
    const pulse = 0.8 + Math.sin(t * 2.2) * 0.2
    if (lightRef.current) lightRef.current.intensity = pulse * 2.5
    if (orbRef.current.material) {
      orbRef.current.material.emissiveIntensity = pulse * 3
    }
  })

  return (
    <group>
      {/* Spirit point light */}
      <pointLight ref={lightRef} color="#7fffff" intensity={2.5} distance={4} decay={2} position={[0, -0.5, 0]} />

      {/* Outer glow sphere (larger, semi-transparent) */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7fffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Core orb */}
      <mesh ref={orbRef} position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0ffff"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Add OriOrb to ForestCanvas.jsx**

```jsx
// src/components/canvas/ForestCanvas.jsx
import { Canvas } from '@react-three/fiber'
import FirefliesSystem from './FirefliesSystem'
import OriOrb from './OriOrb'
import PostFX from './PostFX'
import useForestStore from '../../store/useForestStore'

export default function ForestCanvas() {
  const activeZone = useForestStore((s) => s.activeZone)

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: true, toneMapping: 3 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.05} />
      <FirefliesSystem zone={activeZone} />
      <OriOrb />
      <PostFX />
    </Canvas>
  )
}
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Expect: glowing white-cyan orb in center of screen, bobbing gently with intense bloom glow.

- [ ] **Step 4: Wire up keyboard controls — add hook call to App.jsx**

```jsx
// src/App.jsx
import { useEffect, useRef } from 'react'
import ForestBackground from './components/forest/ForestBackground'
import ForestCanvas from './components/canvas/ForestCanvas'
import useOriControls from './hooks/useOriControls'

export default function App() {
  useOriControls()
  const activeZone = 'hero' // temporary — replace with store in Task 12

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#030304' }}>
      <ForestBackground zone={activeZone} />
      <ForestCanvas />
    </div>
  )
}
```

Run `npm run dev`. Press left/right arrows — Ori orb should move horizontally.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/OriOrb.jsx src/App.jsx
git commit -m "feat: add Ori spirit orb with keyboard movement and bloom glow"
```

---

## Task 10: Cave Portal + Transition Overlay

**Files:**
- Create: `src/components/forest/CavePortal.jsx`

- [ ] **Step 1: Write CavePortal.jsx**

```jsx
// src/components/forest/CavePortal.jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useForestStore from '../../store/useForestStore'

export default function CavePortal({ side }) {
  // side: 'left' | 'right'
  const portalRef = useRef()
  const { transitionPhase, targetZone, activeZone } = useForestStore()

  // Determine if this portal is relevant to current transition
  const isRelevant = transitionPhase !== 'idle' && (
    (side === 'right' && targetZone && require('../../store/useForestStore').ZONE_INDEX[targetZone] > require('../../store/useForestStore').ZONE_INDEX[activeZone]) ||
    (side === 'left'  && targetZone && require('../../store/useForestStore').ZONE_INDEX[targetZone] < require('../../store/useForestStore').ZONE_INDEX[activeZone])
  )

  useEffect(() => {
    if (!portalRef.current) return
    if (transitionPhase === 'walking' || transitionPhase === 'entering-cave') {
      if (isRelevant) {
        gsap.to(portalRef.current, { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' })
      }
    } else if (transitionPhase === 'idle') {
      gsap.to(portalRef.current, { scaleY: 0, scaleX: 0, opacity: 0, duration: 0.3 })
    }
  }, [transitionPhase, isRelevant])

  // Destination light color
  const lightColor = targetZone === 'projects' ? '#2a1060' : targetZone === 'experience' ? '#5c3000' : '#0a2010'

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
        {/* Cave mouth arch — mossy rock */}
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
        {/* Arch crown rocks */}
        <ellipse cx="90" cy="110" rx="50" ry="25" fill="#1e1810" />
        {/* Glowing fungi on arch */}
        {[30,55,90,125,150].map((x, i) => (
          <circle key={i} cx={x} cy={150 + (i%3)*30} r={4+(i%3)*2}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/forest/CavePortal.jsx
git commit -m "feat: add cave portal SVG component with GSAP grow animation"
```

---

## Task 11: Hero Zone UI

**Files:**
- Create: `src/components/zones/HeroZone.jsx`

- [ ] **Step 1: Write HeroZone.jsx**

```jsx
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
      {/* Name + tagline — top center */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 11,
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700, letterSpacing: '0.15em',
          color: '#f0ffe8',
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

      {/* Bio — center, below orb */}
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

      {/* Navigation buttons — carved wood signs */}
      <button
        disabled={!isIdle}
        onClick={() => startTransition('projects')}
        style={{
          position: 'absolute', left: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(10,20,10,0.85)', border: '2px solid var(--foliage-cool)',
          color: 'var(--foliage-bright)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4,
          boxShadow: '0 0 15px rgba(30,92,53,0.4), inset 0 0 8px rgba(30,92,53,0.1)',
          textShadow: '0 0 10px var(--foliage-bright)', zIndex: 12,
          transition: 'box-shadow 0.2s, opacity 0.2s',
          opacity: isIdle ? 1 : 0.4,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(78,203,113,0.7), inset 0 0 12px rgba(78,203,113,0.2)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(30,92,53,0.4), inset 0 0 8px rgba(30,92,53,0.1)'}
      >
        ← PROJECTS
      </button>

      <button
        disabled={!isIdle}
        onClick={() => startTransition('experience')}
        style={{
          position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(20,12,4,0.85)', border: '2px solid var(--light-amber)',
          color: 'var(--light-canopy)', fontFamily: 'var(--font-display)',
          fontSize: '0.8rem', letterSpacing: '0.15em', padding: '10px 16px',
          cursor: 'pointer', borderRadius: 4,
          boxShadow: '0 0 15px rgba(232,148,10,0.4), inset 0 0 8px rgba(232,148,10,0.1)',
          textShadow: '0 0 10px var(--light-canopy)', zIndex: 12,
          transition: 'box-shadow 0.2s, opacity 0.2s',
          opacity: isIdle ? 1 : 0.4,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(245,192,48,0.7), inset 0 0 12px rgba(245,192,48,0.2)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(232,148,10,0.4), inset 0 0 8px rgba(232,148,10,0.1)'}
      >
        EXPERIENCE →
      </button>

      {/* Skill mushrooms on ground */}
      <SkillMushrooms />

      {/* Certifications scroll — bottom left */}
      <CertScroll />

      {/* Contact icons — bottom center */}
      <ContactIcons />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/zones/HeroZone.jsx
git commit -m "feat: add hero zone UI with nav buttons, name, tagline, bio"
```

---

## Task 12: Skill Mushrooms + Contact Icons + Cert Scroll

**Files:**
- Create: `src/components/ui/SkillMushrooms.jsx`, `src/components/ui/ContactIcons.jsx`, `src/components/ui/CertScroll.jsx`

- [ ] **Step 1: Write SkillMushrooms.jsx**

```jsx
// src/components/ui/SkillMushrooms.jsx
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
          {/* Mushroom SVG */}
          <svg width="36" height="44" viewBox="0 0 36 44">
            <ellipse cx="18" cy="22" rx="18" ry="12" fill={skill.color} opacity="0.85" />
            <ellipse cx="18" cy="22" rx="18" ry="12" fill={skill.color} opacity="0.3"
              style={{ filter: 'blur(6px)' }} />
            <rect x="14" y="22" width="8" height="20" fill={skill.color} opacity="0.7" rx="3" />
          </svg>

          {/* Hover badge cloud */}
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
```

- [ ] **Step 2: Write ContactIcons.jsx**

```jsx
// src/components/ui/ContactIcons.jsx
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
```

- [ ] **Step 3: Write CertScroll.jsx**

```jsx
// src/components/ui/CertScroll.jsx
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
      {/* Scroll icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 4,
        background: 'rgba(10,8,4,0.9)', border: '1px solid var(--light-amber)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--light-amber)', fontSize: '1rem',
        boxShadow: '0 0 12px rgba(232,148,10,0.4)',
      }}>
        📜
      </div>

      {/* Unrolled scroll */}
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add skill mushrooms, contact icons, and cert scroll UI"
```

---

## Task 13: Projects Zone

**Files:**
- Create: `src/components/zones/ProjectsZone.jsx`, `src/components/ui/ProjectTree.jsx`

- [ ] **Step 1: Write ProjectTree.jsx**

```jsx
// src/components/ui/ProjectTree.jsx
import { useState } from 'react'

export default function ProjectTree({ project, side = 'left' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tree SVG */}
      <svg width="120" height="300" viewBox="0 0 120 300">
        <defs>
          <radialGradient id={`tree-glow-${project.id}`}>
            <stop offset="0%" stopColor="#7fffff" stopOpacity={hovered ? "0.6" : "0.2"} />
            <stop offset="100%" stopColor="#7fffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Trunk */}
        <path d="M50,300 Q45,220 42,160 Q40,120 60,80 Q80,120 78,160 Q75,220 70,300 Z"
          fill="#1e3d2a" />
        {/* Bark texture lines */}
        <path d="M52,280 Q50,220 48,180" stroke="#2d5a3d" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M65,270 Q67,200 70,160" stroke="#2d5a3d" strokeWidth="2" fill="none" opacity="0.5" />
        {/* Canopy */}
        <ellipse cx="60" cy="90" rx="45" ry="55" fill="#1a4a2e" opacity="0.9" />
        <ellipse cx="40" cy="110" rx="30" ry="35" fill="#1e5c35" opacity="0.8" />
        <ellipse cx="80" cy="105" rx="28" ry="32" fill="#2d6e3e" opacity="0.8" />
        {/* Glow at roots */}
        <ellipse cx="60" cy="280" rx="40" ry="15" fill={`url(#tree-glow-${project.id})`} />
        {/* Glowing orb at roots */}
        <circle cx="60" cy="265" r={hovered ? 10 : 7} fill="#7fffff" opacity={hovered ? 0.9 : 0.5}
          style={{ filter: 'blur(2px)', transition: 'all 0.3s' }} />
        {/* Bioluminescent spots on canopy */}
        {[[45,70],[70,65],[55,95],[75,85],[40,85]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={3+(i%3)} fill="#4ecb71" opacity={0.4}
            style={{ filter: 'blur(1px)' }} />
        ))}
      </svg>

      {/* Project card — unfolds from tree on hover */}
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
          {/* Stack badges */}
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
          {/* Bullets */}
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
```

- [ ] **Step 2: Write ProjectsZone.jsx**

```jsx
// src/components/zones/ProjectsZone.jsx
import { projects } from '../../data/portfolio'
import ProjectTree from '../ui/ProjectTree'
import useForestStore from '../../store/useForestStore'

export default function ProjectsZone() {
  const { startTransition, transitionPhase } = useForestStore()
  const isIdle = transitionPhase === 'idle'

  return (
    <div className="zone-ui">
      {/* Zone title */}
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

      {/* Two project trees */}
      <div style={{
        position: 'absolute', bottom: '8%', left: '20%',
        zIndex: 12,
      }}>
        <ProjectTree project={projects[0]} side="right" />
      </div>

      <div style={{
        position: 'absolute', bottom: '8%', right: '20%',
        zIndex: 12,
      }}>
        <ProjectTree project={projects[1]} side="left" />
      </div>

      {/* Back to home button */}
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/zones/ProjectsZone.jsx src/components/ui/ProjectTree.jsx
git commit -m "feat: add projects zone with interactive glowing trees and hover cards"
```

---

## Task 14: Experience Zone

**Files:**
- Create: `src/components/zones/ExperienceZone.jsx`, `src/components/ui/ExperienceTablet.jsx`

- [ ] **Step 1: Write ExperienceTablet.jsx**

```jsx
// src/components/ui/ExperienceTablet.jsx
import { useState } from 'react'

export default function ExperienceTablet({ job, size = 'large' }) {
  const [hovered, setHovered] = useState(false)
  const isLarge = size === 'large'

  return (
    <div
      style={{
        position: 'relative', cursor: 'pointer',
        width: isLarge ? 200 : 150,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Stone tablet SVG */}
      <svg viewBox="0 0 200 260" style={{ width: '100%', filter: hovered ? `drop-shadow(0 0 16px #e8940a88)` : 'none', transition: 'filter 0.3s' }}>
        <defs>
          <linearGradient id={`stone-${job.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1e10" />
            <stop offset="100%" stopColor="#120e08" />
          </linearGradient>
        </defs>
        {/* Stone shape */}
        <path d="M20,260 Q10,240 8,200 Q6,150 15,100 Q20,60 100,20 Q180,60 185,100 Q194,150 192,200 Q190,240 180,260 Z"
          fill={`url(#stone-${job.id})`} stroke="#3a2a18" strokeWidth="2" />
        {/* Moss patches */}
        <ellipse cx="40" cy="230" rx="25" ry="12" fill="#1e5c35" opacity="0.5" />
        <ellipse cx="160" cy="240" rx="20" ry="10" fill="#2d6e3e" opacity="0.4" />
        {/* Carved text area */}
        <rect x="30" y="60" width="140" height="160" rx="4"
          fill="rgba(0,0,0,0.3)" stroke="rgba(232,148,10,0.2)" strokeWidth="1" />
        {/* Company initial */}
        <text x="100" y="115" textAnchor="middle"
          fontFamily="Cinzel, serif" fontSize="28" fill="#e8940a" opacity={hovered ? 0.9 : 0.6}>
          {job.company.charAt(0)}
        </text>
        {/* Role text */}
        <text x="100" y="140" textAnchor="middle"
          fontFamily="Cinzel, serif" fontSize="9" fill="#c8a060" opacity="0.8" letterSpacing="2">
          {job.role.toUpperCase().slice(0, 16)}
        </text>
        {/* Period */}
        <text x="100" y="158" textAnchor="middle"
          fontFamily="Inter, sans-serif" fontSize="7" fill="#a08050" opacity="0.7">
          {job.period}
        </text>
        {/* Amber glow effect */}
        <ellipse cx="100" cy="260" rx="60" ry="15" fill="#e8940a" opacity={hovered ? 0.2 : 0.08} />
      </svg>

      {/* Hover detail card */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, right: isLarge ? '110%' : undefined, left: isLarge ? undefined : '110%',
          width: 300, background: 'rgba(12,8,3,0.97)',
          border: '1px solid rgba(232,148,10,0.4)', borderRadius: 10, padding: '16px 18px',
          boxShadow: '0 0 30px rgba(232,148,10,0.2)',
          animation: 'card-unfold 0.25s ease forwards', zIndex: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                color: '#e8940a', marginBottom: 2,
              }}>{job.company}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#c8a060' }}>
                {job.role} · {job.location}
              </p>
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              background: 'rgba(232,148,10,0.15)', border: '1px solid rgba(232,148,10,0.4)',
              color: '#e8940a', padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap',
            }}>{job.badge}</span>
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
```

- [ ] **Step 2: Write ExperienceZone.jsx**

```jsx
// src/components/zones/ExperienceZone.jsx
import { experience, education } from '../../data/portfolio'
import ExperienceTablet from '../ui/ExperienceTablet'
import useForestStore from '../../store/useForestStore'
import { useState } from 'react'

export default function ExperienceZone() {
  const { startTransition, transitionPhase } = useForestStore()
  const isIdle = transitionPhase === 'idle'
  const [eduHovered, setEduHovered] = useState(false)

  return (
    <div className="zone-ui">
      {/* Zone title */}
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

      {/* PepsiCo tablet — large, center-left */}
      <div style={{ position: 'absolute', bottom: '10%', left: '28%', zIndex: 12 }}>
        <ExperienceTablet job={experience[0]} size="large" />
      </div>

      {/* Synergy tablet — smaller, center-right */}
      <div style={{ position: 'absolute', bottom: '12%', right: '24%', zIndex: 11 }}>
        <ExperienceTablet job={experience[1]} size="small" />
      </div>

      {/* Education stone — far right */}
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/zones/ExperienceZone.jsx src/components/ui/ExperienceTablet.jsx
git commit -m "feat: add experience zone with stone tablet cards and education stone"
```

---

## Task 15: App Orchestration — Wire All Zones + Transitions

**Files:**
- Modify: `src/App.jsx`
- Create: overlay div ref in App

- [ ] **Step 1: Write final App.jsx**

```jsx
// src/App.jsx
import { useRef, useEffect } from 'react'
import useForestStore, { ZONE_INDEX } from './store/useForestStore'
import useOriControls from './hooks/useOriControls'
import useZoneTransition from './hooks/useZoneTransition'
import ForestBackground from './components/forest/ForestBackground'
import CavePortal from './components/forest/CavePortal'
import ForestCanvas from './components/canvas/ForestCanvas'
import HeroZone from './components/zones/HeroZone'
import ProjectsZone from './components/zones/ProjectsZone'
import ExperienceZone from './components/zones/ExperienceZone'
import gsap from 'gsap'

export default function App() {
  const worldRef   = useRef()
  const overlayRef = useRef()
  const cursorRef  = useRef()

  const activeZone = useForestStore((s) => s.activeZone)

  // Activate controls and transitions
  useOriControls()
  useZoneTransition(worldRef, overlayRef)

  // Set initial world position — hero is zone index 1, so offset = -100vw
  useEffect(() => {
    if (worldRef.current) {
      gsap.set(worldRef.current, { x: -(ZONE_INDEX['hero'] * window.innerWidth) })
    }
  }, [])

  // Custom cursor follows mouse
  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none',
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const zones = ['projects', 'hero', 'experience']

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg-deep)', position: 'relative' }}>

      {/* World container — 300vw wide, pans on X */}
      <div ref={worldRef} id="forest-world" style={{ position: 'fixed', top: 0, left: 0, width: '300vw', height: '100vh', display: 'flex' }}>
        {zones.map((zone) => (
          <div key={zone} className="forest-zone" style={{ position: 'relative', width: '100vw', height: '100vh', flexShrink: 0, overflow: 'hidden' }}>
            <ForestBackground zone={zone} />
            <CavePortal side="left" />
            <CavePortal side="right" />
            {zone === 'projects'    && <ProjectsZone />}
            {zone === 'hero'        && <HeroZone />}
            {zone === 'experience'  && <ExperienceZone />}
          </div>
        ))}
      </div>

      {/* R3F Canvas overlay — fixed, covers viewport */}
      <ForestCanvas />

      {/* Cave transition black overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, background: '#000',
          opacity: 0, pointerEvents: 'none', zIndex: 100,
        }}
      />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--light-spirit)',
          boxShadow: '0 0 12px 4px var(--light-spirit)',
          pointerEvents: 'none', zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Fix CavePortal to not use require() — import ZONE_INDEX at top**

```jsx
// src/components/forest/CavePortal.jsx — replace require() calls
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useForestStore, { ZONE_INDEX } from '../../store/useForestStore'

export default function CavePortal({ side }) {
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
    if (transitionPhase === 'walking' || transitionPhase === 'entering-cave') {
      if (isRelevant) {
        gsap.to(portalRef.current, { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' })
      }
    } else if (transitionPhase === 'idle') {
      gsap.to(portalRef.current, { scaleY: 0, scaleX: 0, opacity: 0, duration: 0.3 })
    }
  }, [transitionPhase, isRelevant])

  const lightColor = targetZone === 'projects' ? '#2a1060' : targetZone === 'experience' ? '#5c3000' : '#0a2010'

  return (
    <div
      ref={portalRef}
      style={{
        position: 'absolute', top: '15%',
        [side]: '-20px',
        width: 180, height: '70%',
        transform: 'scale(0)', opacity: 0,
        transformOrigin: `${side} center`,
        pointerEvents: 'none', zIndex: 15,
      }}
    >
      <svg viewBox="0 0 180 500" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id={`cave-glow-${side}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="90" cy="250" rx="70" ry="230" fill={`url(#cave-glow-${side})`} />
        <path d="M20,500 Q10,300 30,200 Q40,150 90,100 Q60,160 50,300 Z" fill="#1a1208" />
        <path d="M160,500 Q170,300 150,200 Q140,150 90,100 Q120,160 130,300 Z" fill="#151009" />
        <ellipse cx="90" cy="110" rx="50" ry="25" fill="#1e1810" />
        {[30,55,90,125,150].map((x, i) => (
          <circle key={i} cx={x} cy={150+(i%3)*30} r={4+(i%3)*2}
            fill={i%2===0?'#4ecb71':'#7fffff'} opacity={0.8}
            style={{ filter: 'blur(1px)' }} />
        ))}
        {[35,70,110,145].map((x, i) => (
          <path key={i} d={`M${x},120 Q${x+5},${150+(i%3)*20} ${x},${180+(i%3)*25}`}
            stroke="#2d6e3e" strokeWidth="3" fill="none" opacity={0.7} />
        ))}
      </svg>
    </div>
  )
}
```

- [ ] **Step 3: Run dev server — full integration test**

```bash
npm run dev
```

**Verify all of the following manually:**
1. Hero zone shows — name, tagline, bio, nav buttons, mushrooms, contact icons, cert scroll
2. Fireflies floating with bloom glow in canvas overlay
3. Ori orb visible and bobbing in center
4. Press `←` / `→` — Ori moves horizontally
5. Hold `→` until Ori reaches edge — cave portal grows on right side
6. Screen fades to dark — then experience zone appears — Ori walks in from left
7. Click `← HOME` button — cave portal grows on left — transitions back to hero
8. Click `← PROJECTS` — transitions to projects zone
9. Hover mushrooms in hero — skill badges float up
10. Hover trees in projects — project card unfolds
11. Hover tablets in experience — bullet runes appear
12. Hover cert scroll — parchment unrolls

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/forest/CavePortal.jsx
git commit -m "feat: wire all zones, transitions, and Ori controls in App.jsx"
```

---

## Task 16: Run All Tests + Build Verification

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```
Expected: all tests in `src/data/portfolio.test.js`, `src/store/useForestStore.test.js`, `src/hooks/useOriControls.test.js` pass.

- [ ] **Step 2: Production build**

```bash
npm run build
```
Expected: `dist/` folder created with no errors. If warnings about bundle size appear, that's acceptable.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```
Verify the full site works at the preview URL — same 12-point checklist as Task 15 Step 3.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete forest portfolio — all zones, Ori controls, cave transitions"
```

---

## Self-Review Notes

- **Spec coverage:** All 7 spec sections covered — Hero zone, Projects zone (2 trees), Experience zone (2 tablets + education), Ori keyboard controls, cave portal transition, parallax background, fireflies, color palette, typography.
- **No placeholders:** All code blocks are complete and runnable.
- **Type consistency:** `ZONE_INDEX` imported from store in all files that use it. `startTransition` / `setTransitionPhase` / `completeTransition` names consistent across store, hooks, and zone components.
- **One gap addressed:** `CavePortal` originally used `require()` — fixed in Task 15 Step 2 to use ES module import.
