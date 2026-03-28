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
      "3 core microservices powering Content Hub (Compass) — PepsiCo's internal comms platform",
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
