
import React, { useState } from 'react';
import { Filter, Clock, Users, Dumbbell } from 'lucide-react';

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Chair Exercises', 'Resistance Training', 'Balance & Flexibility'];
  
  const exercises = [
    {
      name: 'Seated Shoulder Press',
      category: 'Chair Exercises',
      targetMuscle: 'Shoulders & Arms',
      difficulty: 'Beginner',
      equipment: 'Chair, Light Weights',
      duration: '10-15 mins',
      description: 'Perfect for building upper body strength while seated'
    },
    {
      name: 'Leg Extensions',
      category: 'Resistance Training', 
      targetMuscle: 'Quadriceps',
      difficulty: 'Beginner',
      equipment: 'Leg Extension Machine',
      duration: '8-12 mins',
      description: 'Strengthen your leg muscles safely'
    },
    {
      name: 'Chest Press',
      category: 'Resistance Training',
      targetMuscle: 'Chest & Arms', 
      difficulty: 'Intermediate',
      equipment: 'Chest Press Machine',
      duration: '10-15 mins',
      description: 'Build upper body strength with proper support'
    },
    {
      name: 'Lat Pulldown',
      category: 'Resistance Training',
      targetMuscle: 'Back & Biceps',
      difficulty: 'Beginner',
      equipment: 'Lat Pulldown Machine',
      duration: '8-12 mins',
      description: 'Improve posture and back strength'
    },
    {
      name: 'Standing Balance',
      category: 'Balance & Flexibility',
      targetMuscle: 'Core & Balance',
      difficulty: 'Beginner', 
      equipment: 'None',
      duration: '5-10 mins',
      description: 'Improve stability and prevent falls'
    },
    {
      name: 'Seated Bike',
      category: 'Chair Exercises',
      targetMuscle: 'Cardiovascular',
      difficulty: 'Beginner',
      equipment: 'Recumbent Bike',
      duration: '15-30 mins',
      description: 'Low-impact cardio exercise'
    }
  ];

  const filteredExercises = selectedCategory === 'All' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Explore Exercises</h1>
        <p className="text-gray-600">Discover senior-friendly workouts</p>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Filter by category:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {filteredExercises.map((exercise, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Exercise Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{exercise.name}</h3>
                <p className="text-blue-600 text-sm font-medium">{exercise.targetMuscle}</p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>

            {/* Exercise Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Dumbbell size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{exercise.equipment}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{exercise.duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>

            {/* Action Button */}
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl font-medium transition-colors">
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No exercises found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
