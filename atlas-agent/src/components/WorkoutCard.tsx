import React from 'react';
import { Clock, Target, ChevronRight } from 'lucide-react';
import { Workout } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface WorkoutCardProps {
  workout: Workout;
  index: number;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card h-full hover:shadow-lg transition-shadow duration-300"
    >
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: workout.imageUrl ? `url(${workout.imageUrl})` : 'url(https://images.pexels.com/photos/4498604/pexels-photo-4498604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      />
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            workout.difficultyLevel === 'beginner' ? 'bg-success-100 text-success-800' :
            workout.difficultyLevel === 'intermediate' ? 'bg-warning-100 text-warning-800' :
            'bg-error-100 text-error-800'
          }`}>
            {workout.difficultyLevel.charAt(0).toUpperCase() + workout.difficultyLevel.slice(1)}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            {workout.estimatedDuration} min
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{workout.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workout.description}</p>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
          <Target size={12} className="mr-1" />
          <div className="flex flex-wrap gap-1">
            {workout.targetMuscleGroups.map((muscle, i) => (
              <span key={i} className="capitalize">
                {muscle}{i < workout.targetMuscleGroups.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
        
        <Link 
          to={`/workouts/${workout.id}`}
          className="flex items-center justify-center w-full py-3 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors duration-200"
        >
          Start Workout <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;