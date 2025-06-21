import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import voiceService from '../services/voiceService';
import { VoiceCommand } from '../types';

interface VoiceCommandBarProps {
  onCommand: (command: VoiceCommand) => void;
}

const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check if voice recognition is supported
    setIsSupported(voiceService.isSupported());
    
    // Set up listener for voice commands
    const unsubscribe = voiceService.onCommand((command) => {
      setLastCommand(command.text);
      onCommand(command);
    });
    
    return () => {
      unsubscribe();
      if (isListening) {
        voiceService.stopListening();
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    const newState = voiceService.toggleListening();
    setIsListening(newState);
  };
  
  const simulateCommand = (text: string) => {
    voiceService.simulateCommand(text);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10">
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button
              onClick={toggleListening}
              disabled={!isSupported}
              className={`rounded-full p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isListening 
                  ? 'bg-primary-500 text-white pulse-anim focus:ring-primary-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <div>
              <p className="text-sm text-gray-500">
                {isListening 
                  ? 'Listening...' 
                  : isSupported 
                    ? 'Click to enable voice commands' 
                    : 'Voice commands not supported in your browser'}
              </p>
              {lastCommand && (
                <p className="text-sm font-medium truncate max-w-xs md:max-w-sm">
                  Last: "{lastCommand}"
                </p>
              )}
            </div>
          </div>
          
          {isListening && (
            <div className="voice-wave text-primary-500">
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="btn btn-outline text-sm py-2"
            >
              {showHelp ? 'Hide Help' : 'Voice Commands Help'}
            </button>
            {!isSupported && (
              <div className="dropdown dropdown-top">
                <button className="btn btn-primary text-sm py-2">
                  Type Command
                </button>
                <input
                  type="text"
                  placeholder="Type a command..."
                  className="mt-2 p-2 border rounded"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      simulateCommand(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        {showHelp && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <h5 className="font-semibold mb-2 flex items-center">
              <Volume2 size={16} className="mr-2 text-primary-500" />
              Available Voice Commands
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium text-gray-700">Workouts:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>"Start workout"</li>
                  <li>"Begin cardio workout"</li>
                  <li>"Show me a HIIT workout"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700">Nutrition:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>"Show me meal plans"</li>
                  <li>"What should I eat for breakfast?"</li>
                  <li>"Nutrition tips"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700">Progress & Reminders:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>"Track my progress"</li>
                  <li>"Set a workout reminder"</li>
                  <li>"Show my stats"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCommandBar;