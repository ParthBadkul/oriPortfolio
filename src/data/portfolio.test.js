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
