// --- Type for all the form data ---
export interface HabitFormData {
  name: string;
  description: string;
  frequency: string;
  durationWeeks: string;
  triggerCue: string;
  microVersion: string;
  obstaclePlan: string;
  socialMode: string;
  reward: string;
  pactPartnerUsername: string;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  frequency: string;
  durationWeeks: number | null;
  createdAt: string;
  currentStreak: number;
  totalCompleted: number;
  loggedToday: boolean;
  logDates: string[];
  logsThisWeek: number;
  triggerCue: string | null;
  socialMode: string;
  isActive: boolean;
  microVersion: string | null;
  reward: string | null;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  visibility: string;
  createdAt: string;
  isEdited?: boolean;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  user: {
    username: string;
    displayName?: string | null;
    avatarUrl?: string | null;
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

export interface FriendUser {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ProfileStats {
  currentStreak: number;
  activeHabits: number;
  completionRate: number;
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  isPartner: boolean;
  createdAt: string;
  stats: ProfileStats;
  following: FriendUser[];
  followers: FriendUser[];
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
}

export interface PactInvite {
  id: number;
  habitId: number;
  userId: number;
  status: string;
  habit: {
    id: number;
    name: string;
    user: {
      username: string;
    };
  };
}