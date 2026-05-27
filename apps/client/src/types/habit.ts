// --- Type for all the form data ---
export interface HabitFormData {
  name: string
  description: string
  frequency: string
  durationWeeks: string
  triggerCue: string
  microVersion: string
  obstaclePlan: string
  socialMode: string
  reward: string
}

export interface Habit {
  id: number
  name: string
  description: string | null
  frequency: string
  durationWeeks: number | null
  createdAt: string
  currentStreak: number
  totalCompleted: number
  loggedToday: boolean
  logsThisWeek: number
  triggerCue: string | null
  socialMode: string
  isActive: boolean
}