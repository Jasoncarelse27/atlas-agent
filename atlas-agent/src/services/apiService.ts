import { ApiResponse, User, Workout, Meal, MealPlan, Reminder, WorkoutLog } from '../types';

const API_BASE_URL = '/api'; // This would be replaced with the actual API URL in production

class ApiService {
  private token: string | null = null;

  // Helper method for making API requests
  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Auth methods
  public setToken(token: string) {
    this.token = token;
  }

  public clearToken() {
    this.token = null;
  }

  // Mock method to simulate API responses for development
  public async mockResponse<T>(data: T, delay: number = 500): Promise<ApiResponse<T>> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
        });
      }, delay);
    });
  }

  // User endpoints
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    // For development, we'll return mock data
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      preferences: {
        fitnessLevel: 'intermediate',
        fitnessGoals: ['weight loss', 'muscle gain'],
        dietaryRestrictions: ['vegetarian'],
        workoutDuration: 45,
        remindersEnabled: true,
      },
      stats: {
        height: 180, // in cm
        weight: 75, // in kg
        bmi: 23.1,
        workoutsCompleted: 15,
        streakDays: 5,
        caloriesBurned: 1250,
      },
    };
    
    return this.mockResponse(mockUser);
    // In production, this would be:
    // return this.request<User>('/users/me');
  }

  // Workout endpoints
  public async getWorkouts(): Promise<ApiResponse<Workout[]>> {
    // Mock data for development
    const mockWorkouts: Workout[] = [
      {
        id: '1',
        name: 'Full Body HIIT',
        description: 'High-intensity interval training targeting the entire body',
        difficultyLevel: 'intermediate',
        targetMuscleGroups: ['core', 'legs', 'arms', 'chest'],
        estimatedDuration: 30,
        exercises: [],
        imageUrl: 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        id: '2',
        name: 'Upper Body Strength',
        description: 'Focus on building upper body strength and muscle definition',
        difficultyLevel: 'advanced',
        targetMuscleGroups: ['arms', 'shoulders', 'chest', 'back'],
        estimatedDuration: 45,
        exercises: [],
        imageUrl: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        id: '3',
        name: 'Core Blast',
        description: 'Intense workout focused on abdominal and core muscles',
        difficultyLevel: 'beginner',
        targetMuscleGroups: ['abs', 'obliques', 'lower back'],
        estimatedDuration: 20,
        exercises: [],
        imageUrl: 'https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
    ];
    
    return this.mockResponse(mockWorkouts);
    // In production: return this.request<Workout[]>('/workouts');
  }

  public async getWorkoutById(id: string): Promise<ApiResponse<Workout>> {
    return this.request<Workout>(`/workouts/${id}`);
  }

  // Nutrition endpoints
  public async getMealPlans(): Promise<ApiResponse<MealPlan[]>> {
    // Mock implementation
    return this.request<MealPlan[]>('/meal-plans');
  }

  // Logging endpoints
  public async logWorkout(workoutLog: WorkoutLog): Promise<ApiResponse<WorkoutLog>> {
    return this.request<WorkoutLog>('/logs/workout', 'POST', workoutLog);
  }

  // Reminder endpoints
  public async getReminders(): Promise<ApiResponse<Reminder[]>> {
    return this.request<Reminder[]>('/reminders');
  }

  public async createReminder(reminder: Omit<Reminder, 'id'>): Promise<ApiResponse<Reminder>> {
    return this.request<Reminder>('/reminders', 'POST', reminder);
  }

  // Webhook endpoints for n8n integration
  public async registerWebhook(url: string, events: string[]): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/webhooks', 'POST', { url, events });
  }

  public async processVoiceCommand(commandText: string): Promise<ApiResponse<any>> {
    return this.request<any>('/voice-commands', 'POST', { command: commandText });
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;