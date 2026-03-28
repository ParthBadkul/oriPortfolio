import { ZONE_INDEX } from '../store/useForestStore'

test('ZONE_INDEX maps zones to correct indices', () => {
  expect(ZONE_INDEX.projects).toBe(0)
  expect(ZONE_INDEX.hero).toBe(1)
  expect(ZONE_INDEX.experience).toBe(2)
})

test('projects zone has no left neighbor, experience has no right neighbor', () => {
  const canGoLeft  = (z) => z === 'hero' || z === 'experience'
  const canGoRight = (z) => z === 'hero' || z === 'projects'
  expect(canGoLeft('projects')).toBe(false)
  expect(canGoRight('experience')).toBe(false)
  expect(canGoLeft('hero')).toBe(true)
  expect(canGoRight('hero')).toBe(true)
})
