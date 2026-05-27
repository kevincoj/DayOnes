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
  id: number;
  name: string;
  description: string | null;
  frequency: string;
  triggerCue: string | null;
  socialMode: string;
  isActive: boolean;
}
