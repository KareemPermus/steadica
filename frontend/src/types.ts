export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: string;
  color?: string;
  categoryId?: number;
  createdAt: string;
}

export interface HabitWithTags extends Habit {
  tags?: TagRef[];
}

export interface HabitDetail extends HabitWithTags {
  currentStreak?: number;
  longestStreak?: number;
}

export interface Checkin {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  note?: string;
}

export interface CheckinWithName extends Checkin {
  habitName?: string;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface CategoryWithCount extends Category {
  habitCount?: number;
}

export interface Tag {
  id: number;
  name: string;
}

export type TagRef = Tag;

export interface HabitTag {
  id: number;
  habitId: number;
  tagId: number;
}

export interface Reminder {
  id: number;
  habitId: number;
  time: string;
  days: string;
  enabled: boolean;
}

export interface ReminderWithName extends Reminder {
  habitName?: string;
}

export interface DashboardStats {
  totalHabits: number;
  todayCompleted: number;
  todayTotal: number;
  overallCompletionRate: number;
  topStreaks: { habitId: number; habitName: string; currentStreak: number }[];
}

export interface ProgressData {
  daily: { date: string; completionRate: number }[];
  byHabit: { habitId: number; habitName: string; completionRate: number; currentStreak: number; longestStreak: number }[];
  byCategory: { categoryId: number; categoryName: string; completionRate: number }[];
}