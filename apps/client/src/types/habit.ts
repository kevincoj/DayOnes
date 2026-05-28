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
  logDates: string[]
  logsThisWeek: number
  triggerCue: string | null
  socialMode: string
  isActive: boolean
  microVersion: string | null
  reward: string | null
}

export interface Post {
  id: number;
  content: string;
  visibility: string;
  createdAt: string;
  user: {
    username: string;
  };
  habit: {
    name: string;
  };
}

export interface PartnerUser {
  id: number;
  username: string;
  email: string;
}

export interface Partner {
  id: number;
  userId: number;
  partnerId: number;
  status: string;
  user: PartnerUser;
  partner: PartnerUser;
}