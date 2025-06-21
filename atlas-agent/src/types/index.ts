// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals: string[];
  dietaryRestrictions: string[];
  workoutDuration: number; // in minutes
  remindersEnabled: boolean;
}

export interface UserStats {
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  workoutsCompleted: number;
  streakDays: number;
  caloriesBurned: number;
}

// Workout Types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  durationSeconds: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  estimatedDuration: number; // in minutes
  exercises: ExerciseDetail[];
  imageUrl?: string;
}

export interface ExerciseDetail {
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
}

// Nutrition Types
export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  proteins: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  ingredients: string[];
  preparationSteps: string[];
  imageUrl?: string;
  tags: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  targetCalories: number;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
}

// Voice Command Types
export interface VoiceCommand {
  text: string;
  intent: string;
  confidence: number;
  entities: Record<string, any>;
  timestamp: Date;
}

// Progress Types
export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  date: Date;
  duration: number; // in minutes
  caloriesBurned: number;
  completed: boolean;
  exercises: ExerciseLog[];
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface SetLog {
  reps: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  completed: boolean;
}

// Reminder Types
export interface Reminder {
  id: string;
  userId: string;
  type: 'workout' | 'meal' | 'water' | 'sleep' | 'custom';
  title: string;
  description: string;
  datetime: Date;
  recurring: boolean;
  recurrencePattern?: string; // cron-like pattern
  completed: boolean;
}