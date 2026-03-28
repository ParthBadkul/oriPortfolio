# Forest Portfolio — Design Spec
**Date:** 2026-03-28
**Project:** Parth Badkul Portfolio Website
**Inspiration:** Ori and the Will of the Wisps
**Style:** Dark atmospheric 2D side-scroller forest, single screen, no scroll

---

## 1. Overview

A single-screen React portfolio website styled as a 2D side-scrolling game world inspired by *Ori and the Will of the Wisps*. The user navigates three forest zones horizontally — Projects (left), Hero/About (center), Work Experience (right) — by controlling a glowing spirit orb (Ori) via keyboard arrow keys or by clicking navigation buttons. No vertical scrolling. All content fits within the viewport. Content is revealed through hover interactions on interactive forest elements.

---

## 2. Tech Stack

| Package | Purpose |
|---|---|
| React + Vite | App framework and build tool |
| @react-three/fiber | R3F — Three.js in React |
| @react-three/drei | Helpers: parallax, sprites, fog, environment |
| @react-three/postprocessing | Bloom, vignette, chromatic aberration |
| gsap + @gsap/react | Camera pan animation, zone transitions, Ori walk |
| zustand | Global state: active zone, Ori position, transition phase |
| leva | Dev debug panel (stripped in prod build) |

---

## 3. World Architecture — 2D Side-Scroller

The world is **purely 2D horizontal**. The R3F camera is fixed, facing the forest wall (orthographic-style perspective). Ori moves only on the **X axis**. Depth is simulated through **5 parallax layers** moving at different speeds during camera pan.

### Parallax Layers
```
Layer 5 (speed: 0.05x) — Far background: fog gradient, sky glow (amber center, purple edges)
Layer 4 (speed: 0.15x) — Distant tree silhouettes, misty canopy
Layer 3 (speed: 0.30x) — Mid tree trunks, hanging vines, moss
Layer 2 (speed: 0.55x) — Near ferns, roots, mossy rocks, mushroom clusters
Layer 1 (speed: 0.85x) — Foreground plants, ground debris
```

### Zone Layout (X axis)
```
[PROJECTS ZONE]    [HERO ZONE]    [EXPERIENCE ZONE]
   x: -1 unit         x: 0            x: +1 unit
```
Camera pans on X only. Each zone is one viewport width. Zones are pre-loaded; only the visible one renders at full opacity.

---

## 4. Color Palette

### Background
| Role | Hex |
|---|---|
| Deep background | `#030304` |
| Shadow layer | `#08090c` |

### Foliage (multi-color variety)
| Role | Hex |
|---|---|
| Cool mid green | `#1e5c35` |
| Bright lime green | `#4ecb71` |
| Yellow-green fronds | `#8bc34a` |
| Deep purple undergrowth | `#4a2070` |
| Warm orange moss/fungus | `#cc5500` |
| Rust-red plant tips | `#9b3a1a` |
| Deep teal bioluminescence | `#006666` |

### Lights & FX
| Role | Hex |
|---|---|
| Amber god-ray | `#e8940a` |
| Warm canopy glow | `#f5c030` |
| Spirit orb cyan | `#7fffff` |
| Firefly yellow-green | `#c8ff6a` |

### Per-Zone Atmosphere
| Zone | Dominant atmosphere |
|---|---|
| Hero (center) | Deep green + amber god-rays from upper right |
| Projects (left) | Blue-purple bioluminescent, cool teal light |
| Experience (right) | Warm amber-orange, golden volumetric light |

---

## 5. Typography

| Role | Font | Weight |
|---|---|---|
| Name (PARTH BADKUL) | Cinzel | 700 |
| Section headings | Cinzel | 600 |
| Body / descriptions | Inter | 400 |
| Skill badges / tags | Inter | 500 |

Both fonts loaded from Google Fonts.

---

## 6. The Ori Spirit Orb

Ori is a **glowing white sprite** — a small luminous creature that is the user's avatar and the site's navigation mechanism.

### Visual
- Small glowing white ellipse/teardrop shape
- Soft cyan bloom around it (post-processing)
- Emits a point light that illuminates nearby plants/ground
- Shadow cast beneath it on the ground

### States
| State | Description |
|---|---|
| Idle | Gentle vertical bobbing (sine wave, ~1.5s period). Glow pulses slowly. |
| Walk Left | Sprite flips left, horizontal movement animation. Light trail behind. |
| Walk Right | Sprite faces right, same animation mirrored. |
| Enter Cave | Ori moves toward cave mouth, slight scale-down as "depth" effect. Fades out. |
| Emerge | Fades in from cave mouth on new zone, walks to center. |
| Hover | When mouse is near: glow intensifies, small floating particles emit. |

### Controls
- `← Arrow` or `A` key → Ori walks left
- `→ Arrow` or `D` key → Ori walks right
- Reaching zone boundary triggers cave transition automatically
- Navigation buttons trigger auto-walk + transition (same as keyboard)

---

## 7. Zone Transition — Cave Portal

When Ori reaches the zone boundary (keyboard) or when a nav button is clicked:

```
Step 1: Ori begins walk animation toward destination edge
Step 2: Cave mouth arch grows from the edge of the screen
        — Mossy rock archway, glowing fungi lining the rim
        — Light bleeds from inside: blue-purple (Projects) or amber (Experience)
Step 3: Ori walks through the arch and exits the screen edge
Step 4: Screen fades to near-black (cave interior)
        — Faint ambient particles (dripping water sparkles, dust motes)
        — Only Ori's glow trail briefly visible, then gone
Step 5: New zone's atmosphere bleeds in from darkness
        — Color fog expands outward from center
        — Parallax layers fade in at staggered intervals (back → front)
Step 6: Ori enters from the opposite edge of the new zone
        — Still in walk animation, no transition pause
Step 7: Ori walks horizontally to screen center
Step 8: Ori slows and returns to idle float
```

**Reverse transition (back to Hero)** is the same flow, mirrored direction.

Cave mouth is **not visible** during normal idle — it only grows/appears when transition is triggered.

---

## 8. Hero Zone — Center

### Content
- **PARTH BADKUL** — large Cinzel heading, center-top area
- **"Full-Stack Developer & Animator"** — tagline below name
- **Bio** (2 lines): *"I blend creativity with functionality, ensuring each element contributes to a cohesive digital experience — building visually engaging interfaces that are intuitive and immersive."*
- Ori spirit orb floats at vertical center of screen

### Interactive Elements
- **Glowing mushroom clusters** on the forest floor — each cluster = one skill category
  - Hover mushroom cluster → skill badges float up from it like spores
  - Categories: Backend (Java/Spring Boot/Kafka), Databases (PostgreSQL/MySQL/Redis), DevOps (Docker/K8s/Azure), Security (JWT/OAuth2/ELK), Testing (JUnit/Mockito), Mobile (Flutter)
- **Certifications scroll** — small glowing parchment scroll pinned bottom-left
  - Hover → unrolls to show: ASP.NET cert, Node.js/MongoDB cert, PepsiCo Hackathon Runner-Up
- **Contact icons** — bottom center, persistent, styled as small firefly-glow orbs
  - GitHub (github.com/ParthBadkul), LinkedIn, Email (badkul191@gmail.com)

### Navigation Buttons
- `[← Projects]` — left side, styled as carved mossy wood sign
- `[Experience →]` — right side, same style
- Clicking either triggers Ori auto-walk + cave transition

---

## 9. Projects Zone — Left (Blue-Purple Biome)

### Atmosphere
- Background fog: deep indigo-blue `#0d0d2b` bleeding into the scene
- Bioluminescent blue-green plants, purple mushrooms dominant
- Cooler ambient light, cyan undertones
- Fireflies concentrated here, slightly more dense

### Content — 2 Trees = 2 Projects

**Tree 1: Hoot — Social Networking App**
- Large ancient tree with glowing blue orb in its roots
- Hover → tree bark splits/opens, a glowing card unfolds:
  - Name: **Hoot**
  - Stack badges: Flutter, Spring Boot, PostgreSQL, Apache Kafka, Spring Security
  - Description: *Full-stack social networking app with JWT auth, RESTful APIs, and Kafka streaming (5,000+ events/min)*
  - Key stats: JWT + BCrypt auth, responsive Flutter UI with animations

**Tree 2: Transaction Fraud Detection System**
- Smaller gnarled tree, amber-tinged glow
- Hover → card unfolds:
  - Name: **Fraud Detection System**
  - Stack badges: Java, Spring Boot, Apache Kafka, ML APIs
  - Description: *Real-time fraud detection processing 10,000+ transactions/day with <100ms latency*

### Navigation
- `[→ Back to Home]` — mossy stone button, right side of zone
- Keyboard `→` / `D` walks Ori back through cave to Hero zone

---

## 10. Experience Zone — Right (Amber Biome)

### Atmosphere
- Background: warm amber-orange god-rays, golden volumetric fog
- Warm orange-brown palette, rich golden light
- Feels like late-evening forest glow, corporate warmth

### Content — Floating Stone Tablets

**Tablet 1: PepsiCo Global Business Services**
*(Large, foreground, partially lit)*
- Company: **PepsiCo** (Fortune 50)
- Role: Backend Developer
- Period: Aug 2023 – Present | Hyderabad, India
- Hover → tablet glows brighter, bullet runes appear:
  - BEAM workflow for WMS — reduced manual validation by 25%
  - 3 core microservices for Content Hub (Compass)
  - Enterprise data migration: 100% accuracy, <2hr downtime
  - ELK dashboards — reduced incident resolution by 15%
  - Migrated Azure DevOps pipelines with zero data loss

**Tablet 2: Synergy Technologies**
*(Smaller, mid-background)*
- Role: Software Developer Intern
- Period: May 2022 – Jul 2022 | Remote
- Hover → bullet runes:
  - Flutter social-sharing module — 8% engagement increase (3,000+ users)
  - App load time optimized 35% (4.2s → 2.7s)

**Education Stone** — far right edge, always partially visible
- Hover → reveals: B.Tech Computer Science, VIT Vellore, May 2023

### Navigation
- `[← Back to Home]` — mossy stone button, left side of zone
- Keyboard `←` / `A` walks Ori back through cave to Hero zone

---

## 11. Fireflies System

- ~150–200 particles across all zones
- Each firefly: small bright sprite with bloom glow
- Movement: sine-wave bobbing + slow random drift on X
- Colors: `#c8ff6a` (warm yellow-green) primary, `#7fffff` (cyan) secondary
- Density higher in Projects zone (bioluminescent feel)
- Each firefly has a tiny point light contributing to scene illumination
- No interaction — purely ambient

---

## 12. Post-Processing (via @react-three/postprocessing)

| Effect | Settings |
|---|---|
| Bloom | Threshold 0.2, strength 1.2, radius 0.8 — applied to all emissive objects |
| Vignette | Darkness 0.6, offset 0.4 — darkens screen edges |
| Chromatic Aberration | Very subtle — 0.002 offset — adds slight lens feel |

---

## 13. Component Tree

```
src/
├── components/
│   ├── canvas/
│   │   ├── ForestScene.jsx          — R3F Canvas root, post-processing
│   │   ├── ParallaxBackground.jsx   — 5-layer parallax system
│   │   ├── FirefliesSystem.jsx      — 150-200 particle fireflies
│   │   ├── OriSprite.jsx            — Spirit orb with states + keyboard control
│   │   ├── CavePortal.jsx           — Cave mouth that grows on transition
│   │   └── ZoneLighting.jsx         — Per-zone ambient/point lights
│   ├── zones/
│   │   ├── HeroZone.jsx             — Center zone content
│   │   ├── ProjectsZone.jsx         — Left zone, 2 interactive trees
│   │   └── ExperienceZone.jsx       — Right zone, stone tablets
│   ├── ui/
│   │   ├── Navbar.jsx               — Name + nav buttons (wood signs)
│   │   ├── SkillMushrooms.jsx       — Hover-reveal skill clusters
│   │   ├── ProjectCard.jsx          — Unfolds from tree on hover
│   │   ├── ExperienceTablet.jsx     — Stone tablet hover card
│   │   ├── CertificationsScroll.jsx — Bottom-left parchment scroll
│   │   └── ContactIcons.jsx         — Bottom center firefly-orb icons
│   └── shared/
│       └── GlassPanel.jsx           — Frosted glass card base component
├── store/
│   └── useForestStore.js            — Zustand: activeZone, oriPosition, transitionPhase
├── hooks/
│   ├── useOriControls.js            — Keyboard input → Ori state machine
│   └── useZoneTransition.js         — GSAP cave transition orchestration
├── data/
│   └── portfolio.js                 — All portfolio content (single source of truth)
├── App.jsx
└── main.jsx
```

---

## 14. Portfolio Data Reference

```js
// data/portfolio.js
export const person = {
  name: "Parth Badkul",
  title: "Full-Stack Developer & Animator",
  bio: "I blend creativity with functionality, ensuring each element contributes to a cohesive digital experience — building visually engaging interfaces that are intuitive and immersive.",
  email: "badkul191@gmail.com",
  phone: "+91-789-108-9082",
  github: "https://github.com/ParthBadkul",
  linkedin: "https://linkedin.com/in/parth-badkul-35b62b217",
  website: "https://parthbadkul.in",
}

export const skills = [
  { category: "Backend", items: ["Java 8/11/17", "Spring Boot", "Spring Security", "Hibernate/JPA"] },
  { category: "Databases", items: ["PostgreSQL", "MySQL", "Redis"] },
  { category: "Integration", items: ["Apache Kafka", "RESTful APIs", "Event-Driven Architecture"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "Azure DevOps", "CI/CD"] },
  { category: "Security", items: ["JWT", "OAuth2", "ELK Stack"] },
  { category: "Mobile", items: ["Flutter"] },
  { category: "Testing", items: ["JUnit", "Mockito"] },
]

export const experience = [
  {
    company: "PepsiCo Global Business Services",
    role: "Backend Developer",
    period: "Aug 2023 – Present",
    location: "Hyderabad, India",
    type: "Fortune 50",
    bullets: [
      "BEAM workflow for WMS — reduced manual validation by 25%, improved inventory accuracy by 10%",
      "3 core microservices powering PepsiCo's Content Hub (Compass) — corporate communications platform",
      "Scalable API endpoints consumed across web, email, and employee-facing platforms",
      "Enterprise data migration: 100% accuracy, <2hr downtime",
      "ELK dashboards — reduced incident resolution by 15%",
      "Azure DevOps pipeline migration with zero data loss",
    ],
  },
  {
    company: "Synergy Technologies",
    role: "Software Developer Intern",
    period: "May 2022 – Jul 2022",
    location: "Remote",
    bullets: [
      "Flutter social-sharing module — 8% engagement increase (3,000+ users)",
      "App load time optimized 35% (4.2s → 2.7s)",
    ],
  },
]

export const projects = [
  {
    name: "Hoot",
    subtitle: "Social Networking App",
    stack: ["Flutter", "Spring Boot", "PostgreSQL", "Apache Kafka", "Spring Security"],
    bullets: [
      "Full-stack app with JWT auth, RESTful APIs, Kafka streaming (5,000+ events/min)",
      "Secure auth: JWT + BCrypt + email verification with token-based activation",
      "Flutter UI with animations and responsive layouts",
    ],
  },
  {
    name: "Transaction Fraud Detection",
    subtitle: "Academic Project",
    stack: ["Java", "Spring Boot", "Apache Kafka", "ML APIs"],
    bullets: [
      "Real-time detection: 10,000+ transactions/day, <100ms latency",
      "Kafka-based asynchronous pipeline",
    ],
  },
]

export const education = {
  degree: "Bachelor of Technology (B.Tech) in Computer Science",
  institution: "Vellore Institute of Technology (VIT), Vellore",
  year: "May 2023",
}

export const certifications = [
  "ASP.NET Beginner Certification — Udemy (via PepsiCo) | 2024",
  "Server-Side Development with Node.js, Express, MongoDB — HKUST | 2022",
  "Runner-Up — PepsiCo Internal Hackathon 'Next Big Idea' | 2024",
]
```

---

## 15. Non-Goals (Out of Scope)

- No backend / contact form submission (email link only)
- No CMS or admin panel
- No mobile touch drag for Ori (keyboard only; touch tap on nav buttons still works)
- No dark/light mode toggle
- No routing (single page, no URLs per zone)
