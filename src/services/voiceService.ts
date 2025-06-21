import { VoiceCommand } from '../types';

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private commandCallbacks: ((command: VoiceCommand) => void)[] = [];

  constructor() {
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = this.handleRecognitionResult.bind(this);
        this.recognition.onerror = this.handleRecognitionError.bind(this);
        this.recognition.onend = this.handleRecognitionEnd.bind(this);
      }
    }
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent) {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript.trim();
    
    if (text) {
      const command = this.parseVoiceCommand(text);
      this.notifyCommandListeners(command);
    }
  }

  private handleRecognitionError(event: SpeechRecognitionError) {
    console.error('Speech recognition error:', event.error);
    this.stopListening();
  }

  private handleRecognitionEnd() {
    if (this.isListening) {
      // Restart if it was supposed to be listening
      this.startListening();
    }
  }

  private parseVoiceCommand(text: string): VoiceCommand {
    // Simple intent detection based on keywords
    // In a real app, this would use NLP/ML for more accurate intent detection
    let intent = 'unknown';
    const entities: Record<string, any> = {};
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('start workout') || lowerText.includes('begin workout')) {
      intent = 'start_workout';
      
      // Extract workout type if specified
      const workoutTypes = ['cardio', 'strength', 'yoga', 'hiit', 'full body'];
      for (const type of workoutTypes) {
        if (lowerText.includes(type)) {
          entities.workoutType = type;
          break;
        }
      }
    } else if (lowerText.includes('show meal') || lowerText.includes('nutrition') || lowerText.includes('diet')) {
      intent = 'show_nutrition';
      
      // Extract meal time if specified
      const mealTimes = ['breakfast', 'lunch', 'dinner', 'snack'];
      for (const time of mealTimes) {
        if (lowerText.includes(time)) {
          entities.mealTime = time;
          break;
        }
      }
    } else if (lowerText.includes('track progress') || lowerText.includes('show progress')) {
      intent = 'track_progress';
    } else if (lowerText.includes('set reminder') || lowerText.includes('remind me')) {
      intent = 'set_reminder';
    } else if (lowerText.includes('stop') || lowerText.includes('pause')) {
      intent = 'stop_action';
    } else if (lowerText.includes('help') || lowerText.includes('what can you do')) {
      intent = 'help';
    }
    
    return {
      text,
      intent,
      confidence: 0.8, // Simplified confidence score
      entities,
      timestamp: new Date()
    };
  }

  private notifyCommandListeners(command: VoiceCommand) {
    this.commandCallbacks.forEach(callback => callback(command));
  }

  // Public API
  public startListening(): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return false;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }
  
  public stopListening(): boolean {
    if (!this.recognition) {
      return false;
    }
    
    try {
      this.recognition.stop();
      this.isListening = false;
      return true;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      return false;
    }
  }
  
  public toggleListening(): boolean {
    return this.isListening ? this.stopListening() : this.startListening();
  }
  
  public isSupported(): boolean {
    return !!this.recognition;
  }
  
  public getListeningState(): boolean {
    return this.isListening;
  }
  
  public onCommand(callback: (command: VoiceCommand) => void): () => void {
    this.commandCallbacks.push(callback);
    
    // Return a function to remove this callback
    return () => {
      this.commandCallbacks = this.commandCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Mock method to simulate voice commands for testing or when speech recognition is not available
  public simulateCommand(text: string) {
    const command = this.parseVoiceCommand(text);
    this.notifyCommandListeners(command);
  }
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// Create a singleton instance
const voiceService = new VoiceService();
export default voiceService;