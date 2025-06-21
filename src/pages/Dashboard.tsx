import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  TrendingUp, 
  Flame, 
  Calendar, 
  Plus, 
  ChevronRight,
  Trophy,
  Activity
} from 'lucide-react';
import { VoiceCommand, Workout } from '../types';
import VoiceCommandBar from '../components/VoiceCommandBar';
import WorkoutCard from '../components/WorkoutCard';
import apiService from '../services/apiService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getWorkouts();
        if (response.success && response.data) {
          // Just take the first 3 for recents
          setRecentWorkouts(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleVoiceCommand = (command: VoiceCommand) => {
    // Process the voice command
    console.log('Processing voice command:', command);
    
    // Provide feedback based on the intent
    switch (command.intent) {
      case 'start_workout':
        setFeedback(`Starting ${command.entities.workoutType || 'your'} workout...`);
        break;
      case 'show_nutrition':
        setFeedback(`Showing nutrition information for ${command.entities.mealTime || 'today'}...`);
        break;
      case 'track_progress':
        setFeedback('Opening your progress tracking...');
        break;
      case 'set_reminder':
        setFeedback('Setting up a new reminder for you...');
        break;
      case 'help':
        setFeedback('Here are some commands you can try...');
        break;
      default:
        setFeedback("I didn't understand that command. Try saying 'help' for assistance.");
    }
    
    // Clear feedback after 5 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };
  
  return (
    <div className="pb-20">
      {/* Hero section with today's overview */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-primary-100 mb-8">Stay motivated and keep up the good work.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Dumbbell size={18} className="mr-2" />
                  <h3 className="font-medium">Workouts</h3>
                </div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-primary-100">This month</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Flame size={18} className="mr-2" />
                  <h3 className="font-medium">Calories</h3>
                </div>
                <p className="text-2xl font-bold">1,250</p>
                <p className="text-xs text-primary-100">Burned this week</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="mr-2" />
                  <h3 className="font-medium">Streak</h3>
                </div>
                <p className="text-2xl font-bold">5 days</p>
                <p className="text-xs text-primary-100">Current streak</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp size={18} className="mr-2" />
                  <h3 className="font-medium">Progress</h3>
                </div>
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-xs text-primary-100">From last month</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Feedback from voice commands */}
      {feedback && (
        <div className="container mx-auto px-4 mt-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary-50 border border-primary-200 text-primary-800 rounded-lg p-4 flex items-center"
          >
            <Activity size={20} className="mr-3 text-primary-500" />
            <p>{feedback}</p>
          </motion.div>
        </div>
      )}
      
      {/* Today's suggestion */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:w-2/3">
              <span className="text-secondary-600 font-medium text-sm">TODAY'S PICK</span>
              <h2 className="text-2xl font-bold mt-1 mb-2">Full Body HIIT Challenge</h2>
              <p className="text-gray-600 mb-4">High-intensity workout to boost your metabolism and burn calories.</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">30 min</span>
                </div>
                <div className="flex items-center">
                  <Flame size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">300 cal</span>
                </div>
                <div className="flex items-center">
                  <Trophy size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">Intermediate</span>
                </div>
              </div>
              
              <button className="btn btn-secondary">
                Start Workout
              </button>
            </div>
            <div className="md:w-1/3 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' }}></div>
          </div>
        </div>
      </section>
      
      {/* Recent workouts */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Workouts</h2>
          <Link to="/workouts" className="text-primary-600 flex items-center hover:text-primary-700 transition-colors duration-200">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWorkouts.map((workout, index) => (
              <WorkoutCard key={workout.id} workout={workout} index={index} />
            ))}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 cursor-pointer"
            >
              <Plus size={32} className="mb-2" />
              <p className="font-medium">Create Custom Workout</p>
              <p className="text-sm mt-1 text-center">Design your own workout routine</p>
            </motion.div>
          </div>
        )}
      </section>
      
      {/* Voice command bar */}
      <VoiceCommandBar onCommand={handleVoiceCommand} />
    </div>
  );
};

// Needed for component
const Clock = Flame;

export default Dashboard;