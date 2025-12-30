
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  reminders: Date[];
  isAnnoying: boolean;
  tags: string[];
  assignedTo?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  history: Record<string, boolean>;
  targetPerWeek: number;
  icon: string;
  color: string;
  isAutoSynced?: boolean;
  healthMetric?: 'STEPS' | 'SLEEP' | 'WATER';
  goalValue?: number;
}

export interface HealthStats {
  steps: number;
  stepsGoal: number;
  sleepHours: number;
  sleepGoal: number;
  waterGlassCount: number;
  waterGoal: number;
  lastUpdated: Date;
  isSyncing: boolean;
  permissionsGranted: boolean;
}

export interface RoutineBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'TASK' | 'HABIT' | 'MOTIVATION' | 'REVIEW' | 'COLLAB' | 'HEALTH';
  timestamp: Date;
  isPersistent: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type AppView = 'HOME' | 'TASKS' | 'HABITS' | 'PLANNER' | 'STATS' | 'SETTINGS';
