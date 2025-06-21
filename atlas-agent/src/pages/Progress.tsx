import React from 'react';
import { Calendar, Award, TrendingUp, CheckCircle } from 'lucide-react';
import VoiceCommandBar from '../components/VoiceCommandBar';
import ProgressChart from '../components/ProgressChart';
import { VoiceCommand } from '../types';
import { motion } from 'framer-motion';

const Progress: React.FC = () => {
  // Mock data for charts
  const workoutData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [2, 1, 3, 0, 2, 1, 2],
  };
  
  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [320, 250, 450, 0, 380, 200, 400],
  };
  
  const weightData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    values: [81.2, 80.5, 79.8, 79.2, 78.7, 78.1],
  };
  
  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Processing voice command in Progress:', command);
  };
  
  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Your Progress
        </motion.h1>
        
        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center mb-2">
              <Calendar size={18} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-700">This Month</h3>
            </div>
            <p className="text-2xl font-bold">15 Workouts</p>
            <p className="text-sm text-gray-500 mt-1">+3 from last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center mb-2">
              <Award size={18} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-700">Current Streak</h3>
            </div>
            <p className="text-2xl font-bold">5 Days</p>
            <p className="text-sm text-gray-500 mt-1">Keep it going!</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center mb-2">
              <TrendingUp size={18} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-700">Weight Change</h3>
            </div>
            <p className="text-2xl font-bold">-3.1 kg</p>
            <p className="text-sm text-gray-500 mt-1">Last 6 weeks</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center mb-2">
              <CheckCircle size={18} className="text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-700">Goal Progress</h3>
            </div>
            <p className="text-2xl font-bold">62%</p>
            <p className="text-sm text-gray-500 mt-1">Toward weight goal</p>
          </div>
        </motion.div>
        
        {/* Charts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProgressChart 
              title="Workouts Completed" 
              data={workoutData.values} 
              labels={workoutData.labels}
              color="#0D9488"
              yAxisTitle="Workouts"
            />
            <ProgressChart 
              title="Calories Burned" 
              data={calorieData.values} 
              labels={calorieData.labels}
              color="#F97316"
              fillColor="rgba(249, 115, 22, 0.1)"
              yAxisTitle="Calories"
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Weight Trend</h2>
          <div className="bg-white rounded-xl shadow-sm">
            <div className="h-64 p-4">
              <ProgressChart 
                title="Weight Over Time" 
                data={weightData.values} 
                labels={weightData.labels}
                color="#10B981"
                fillColor="rgba(16, 185, 129, 0.1)"
                yAxisTitle="kg"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Recent Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AchievementCard 
                title="5-Day Streak"
                description="Completed workouts for 5 consecutive days"
                icon={<Award size={24} className="text-yellow-500" />}
                date="Today"
              />
              <AchievementCard 
                title="Weight Milestone"
                description="Lost 3kg since starting your journey"
                icon={<TrendingUp size={24} className="text-green-500" />}
                date="2 days ago"
              />
              <AchievementCard 
                title="10 Workouts"
                description="Completed 10 workouts this month"
                icon={<CheckCircle size={24} className="text-blue-500" />}
                date="1 week ago"
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      <VoiceCommandBar onCommand={handleVoiceCommand} />
    </div>
  );
};

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ title, description, icon, date }) => {
  return (
    <div className="flex items-center p-4 border border-gray-100 rounded-lg">
      <div className="bg-gray-50 rounded-full p-3 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
    </div>
  );
};

export default Progress;