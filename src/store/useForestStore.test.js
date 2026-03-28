import { renderHook, act } from '@testing-library/react'
import useForestStore, { ZONES, ZONE_INDEX } from './useForestStore'

beforeEach(() => {
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
