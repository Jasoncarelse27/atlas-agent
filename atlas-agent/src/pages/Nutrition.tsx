import React, { useState } from 'react';
import { Utensils, ChevronDown, Filter, Search } from 'lucide-react';
import NutritionCard from '../components/NutritionCard';
import VoiceCommandBar from '../components/VoiceCommandBar';
import { VoiceCommand, Meal } from '../types';
import { motion } from 'framer-motion';

const Nutrition: React.FC = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock meal data
  const mockMeals: Meal[] = [
    {
      id: '1',
      name: 'Protein-Packed Breakfast Bowl',
      description: 'A nutritious breakfast bowl with eggs, avocado, and quinoa',
      calories: 450,
      proteins: 25,
      carbs: 35,
      fats: 20,
      ingredients: ['Eggs', 'Avocado', 'Quinoa', 'Spinach', 'Cherry tomatoes'],
      preparationSteps: ['Cook quinoa', 'Fry eggs', 'Slice avocado', 'Combine ingredients'],
      tags: ['high-protein', 'vegetarian', 'breakfast'],
      imageUrl: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '2',
      name: 'Mediterranean Lunch Salad',
      description: 'Fresh Mediterranean-style salad with feta, olives, and grilled chicken',
      calories: 380,
      proteins: 28,
      carbs: 20,
      fats: 18,
      ingredients: ['Grilled chicken', 'Mixed greens', 'Feta cheese', 'Olives', 'Cucumbers', 'Cherry tomatoes', 'Olive oil'],
      preparationSteps: ['Grill chicken', 'Chop vegetables', 'Combine ingredients', 'Drizzle with olive oil'],
      tags: ['high-protein', 'low-carb', 'lunch'],
      imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '3',
      name: 'Lean Dinner Stir Fry',
      description: 'Quick and easy vegetable stir fry with lean beef and brown rice',
      calories: 520,
      proteins: 35,
      carbs: 45,
      fats: 15,
      ingredients: ['Lean beef strips', 'Broccoli', 'Bell peppers', 'Carrots', 'Brown rice', 'Low-sodium soy sauce'],
      preparationSteps: ['Cook rice', 'Stir fry beef', 'Add vegetables', 'Season and combine'],
      tags: ['high-protein', 'dinner', 'balanced'],
      imageUrl: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '4',
      name: 'Post-Workout Protein Smoothie',
      description: 'Refreshing protein-packed smoothie ideal for post-workout recovery',
      calories: 320,
      proteins: 30,
      carbs: 40,
      fats: 5,
      ingredients: ['Whey protein', 'Banana', 'Berries', 'Greek yogurt', 'Almond milk', 'Chia seeds'],
      preparationSteps: ['Blend all ingredients', 'Serve cold'],
      tags: ['high-protein', 'post-workout', 'snack'],
      imageUrl: 'https://images.pexels.com/photos/8805368/pexels-photo-8805368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '5',
      name: 'Balanced Grain Bowl',
      description: 'Nutrient-dense grain bowl with a variety of colorful vegetables and lean protein',
      calories: 490,
      proteins: 22,
      carbs: 60,
      fats: 16,
      ingredients: ['Quinoa', 'Roasted sweet potatoes', 'Chickpeas', 'Avocado', 'Kale', 'Tahini dressing'],
      preparationSteps: ['Cook quinoa', 'Roast sweet potatoes', 'Massage kale', 'Assemble bowl', 'Drizzle with dressing'],
      tags: ['plant-based', 'balanced', 'lunch'],
      imageUrl: 'https://images.pexels.com/photos/5966435/pexels-photo-5966435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '6',
      name: 'Energy-Boosting Snack Box',
      description: 'Perfectly portioned snack box with a balance of protein, healthy fats, and complex carbs',
      calories: 280,
      proteins: 15,
      carbs: 25,
      fats: 12,
      ingredients: ['Hard-boiled eggs', 'Apple slices', 'Almond butter', 'Whole grain crackers', 'String cheese'],
      preparationSteps: ['Boil eggs', 'Slice apple', 'Portion ingredients into container'],
      tags: ['snack', 'balanced', 'on-the-go'],
      imageUrl: 'https://images.pexels.com/photos/5801754/pexels-photo-5801754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];
  
  const handleVoiceCommand = (command: VoiceCommand) => {
    if (command.intent === 'show_nutrition' && command.entities.mealTime) {
      setSearchTerm(command.entities.mealTime);
    }
  };
  
  const filteredMeals = mockMeals.filter(meal => {
    if (!searchTerm) return true;
    
    return (
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4 md:mb-0"
          >
            Nutrition
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search meals, recipes..."
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
          className="flex flex-col sm:flex-row items-start sm:items-center mb-8"
        >
          <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-4 sm:mb-0 mr-0 sm:mr-4">
            <button
              onClick={() => setActiveTab('meals')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'meals' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Meals
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'plans' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Meal Plans
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'tracking' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tracking
            </button>
          </div>
          
          <div className="flex items-center ml-auto">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors mr-4">
              <Filter size={16} className="mr-1" />
              Filter
            </button>
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Sort By <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </motion.div>
        
        {activeTab === 'meals' && (
          <>
            <div className="flex items-center mb-6">
              <Utensils size={20} className="text-primary-500 mr-2" />
              <h2 className="text-xl font-semibold">Healthy Meal Ideas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((meal, index) => (
                <NutritionCard key={meal.id} meal={meal} index={index} />
              ))}
            </div>
            
            {filteredMeals.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No meals found</h3>
                <p className="text-gray-500">Try adjusting your search</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'plans' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Meal Plans Coming Soon</h3>
            <p className="text-gray-500">We're working on personalized meal plans for you!</p>
          </div>
        )}
        
        {activeTab === 'tracking' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nutrition Tracking Coming Soon</h3>
            <p className="text-gray-500">Track your daily macros and calories!</p>
          </div>
        )}
      </div>
      
      <VoiceCommandBar onCommand={handleVoiceCommand} />
    </div>
  );
};

export default Nutrition;