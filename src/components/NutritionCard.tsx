import React from 'react';
import { Utensils, Clock, Info } from 'lucide-react';
import { Meal } from '../types';
import { motion } from 'framer-motion';

interface NutritionCardProps {
  meal: Meal;
  index: number;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ meal, index }) => {
  // Mock meal data for display
  const mockMeal: Meal = {
    id: meal.id || '1',
    name: meal.name || 'Protein-Packed Breakfast Bowl',
    description: meal.description || 'A nutritious breakfast bowl with eggs, avocado, and quinoa',
    calories: meal.calories || 450,
    proteins: meal.proteins || 25,
    carbs: meal.carbs || 35,
    fats: meal.fats || 20,
    ingredients: meal.ingredients || ['Eggs', 'Avocado', 'Quinoa', 'Spinach', 'Cherry tomatoes'],
    preparationSteps: meal.preparationSteps || ['Cook quinoa', 'Fry eggs', 'Slice avocado', 'Combine ingredients'],
    tags: meal.tags || ['high-protein', 'vegetarian', 'breakfast'],
    imageUrl: meal.imageUrl || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  };
  
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
          backgroundImage: `url(${mockMeal.imageUrl})`
        }}
      />
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {mockMeal.tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{mockMeal.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{mockMeal.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-xs text-gray-500">Calories</span>
            <p className="font-semibold">{mockMeal.calories}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-xs text-gray-500">Protein</span>
            <p className="font-semibold">{mockMeal.proteins}g</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-xs text-gray-500">Carbs</span>
            <p className="font-semibold">{mockMeal.carbs}g</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
          <Utensils size={12} className="mr-1" />
          <span>Ingredients: {mockMeal.ingredients.length}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
          <Clock size={12} className="mr-1" />
          <span>Prep: 15 min</span>
        </div>
        
        <button className="flex items-center justify-center w-full py-3 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors duration-200">
          View Recipe <Info size={16} className="ml-1" />
        </button>
      </div>
    </motion.div>
  );
};

export default NutritionCard;