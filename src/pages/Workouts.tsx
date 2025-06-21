import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import VoiceCommandBar from '../components/VoiceCommandBar';
import WorkoutCard from '../components/WorkoutCard';
import { VoiceCommand, Workout } from '../types';
import apiService from '../services/apiService';
import { motion } from 'framer-motion';

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getWorkouts();
        if (response.success && response.data) {
          setWorkouts(response.data);
          setFilteredWorkouts(response.data);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);
  
  useEffect(() => {
    // Filter workouts based on search term and active filter
    let filtered = workouts;
    
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.targetMuscleGroups.some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (activeFilter) {
      if (activeFilter === 'beginner' || activeFilter === 'intermediate' || activeFilter === 'advanced') {
        filtered = filtered.filter(workout => workout.difficultyLevel === activeFilter);
      } else {
        // Filter by muscle group
        filtered = filtered.filter(workout => 
          workout.targetMuscleGroups.some(muscle => 
            muscle.toLowerCase() === activeFilter.toLowerCase()
          )
        );
      }
    }
    
    setFilteredWorkouts(filtered);
  }, [searchTerm, activeFilter, workouts]);
  
  const handleVoiceCommand = (command: VoiceCommand) => {
    if (command.intent === 'start_workout' && command.entities.workoutType) {
      setSearchTerm(command.entities.workoutType);
    }
  };
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4 md:mb-0"
          >
            Workouts
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 w-full md:w-64"
            />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6"
        >
          <span className="flex items-center text-gray-500 mr-2">
            <Filter size={16} className="mr-1" /> Filters:
          </span>
          <FilterButton 
            label="Beginner" 
            isActive={activeFilter === 'beginner'} 
            onClick={() => handleFilterClick('beginner')} 
          />
          <FilterButton 
            label="Intermediate" 
            isActive={activeFilter === 'intermediate'} 
            onClick={() => handleFilterClick('intermediate')} 
          />
          <FilterButton 
            label="Advanced" 
            isActive={activeFilter === 'advanced'} 
            onClick={() => handleFilterClick('advanced')} 
          />
          <div className="h-6 border-l border-gray-300 mx-2"></div>
          <FilterButton 
            label="Arms" 
            isActive={activeFilter === 'arms'} 
            onClick={() => handleFilterClick('arms')} 
          />
          <FilterButton 
            label="Legs" 
            isActive={activeFilter === 'legs'} 
            onClick={() => handleFilterClick('legs')} 
          />
          <FilterButton 
            label="Core" 
            isActive={activeFilter === 'core'} 
            onClick={() => handleFilterClick('core')} 
          />
          <FilterButton 
            label="Back" 
            isActive={activeFilter === 'back'} 
            onClick={() => handleFilterClick('back')} 
          />
          <FilterButton 
            label="Chest" 
            isActive={activeFilter === 'chest'} 
            onClick={() => handleFilterClick('chest')} 
          />
          <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors p-2">
            <SlidersHorizontal size={16} className="mr-1" /> More
          </button>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        ) : filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout, index) => (
              <WorkoutCard key={workout.id} workout={workout} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No workouts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      <VoiceCommandBar onCommand={handleVoiceCommand} />
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'bg-primary-100 text-primary-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

export default Workouts;