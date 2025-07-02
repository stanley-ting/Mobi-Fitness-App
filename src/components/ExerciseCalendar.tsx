
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ExerciseCalendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Generate days for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Mock exercise data - red for exercised days
  const exercisedDays = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate();
      const hasExercised = exercisedDays.includes(day);
      
      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-all ${
            isToday
              ? 'bg-red-600 text-white shadow-lg transform scale-110'
              : hasExercised
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Exercised</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 rounded-full border"></div>
          <span className="text-gray-600">No exercise</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCalendar;
