import { trackGA4Event } from './useGA4'

const METRIKA_ID = 109307843

export function trackGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.ym?.(METRIKA_ID, 'reachGoal', goal, params)
  trackGA4Event(goal, params)
}
