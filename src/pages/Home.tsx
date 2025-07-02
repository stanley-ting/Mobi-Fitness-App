
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Clock, Activity, CheckCircle, Circle, Timer } from 'lucide-react';

const Home = () => {
  const todayProgress = [
    { exercise: 'Shoulder Press', sets: 3, completedSets: 1, repsPerSet: 8, completedReps: 8 },
    { exercise: 'Leg Extension', sets: 3, completedSets: 0, repsPerSet: 10, completedReps: 4 },
    { exercise: 'Chest Press', sets: 2, completedSets: 0, repsPerSet: 8, completedReps: 0 },
  ];

  const totalSets = todayProgress.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = todayProgress.reduce((acc, ex) => acc + ex.completedSets, 0);
  const progressPercentage = Math.round((completedSets / totalSets) * 100);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Good Morning 👋</h1>
        <p className="text-xl text-gray-600">Ah Seng</p>
      </div>

      {/* Scan Machine Button */}
      <Link to="/scan">
        <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-6 rounded-2xl mb-8 hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <QrCode size={32} />
            <span className="text-xl font-semibold">Scan Machine</span>
          </div>
        </button>
      </Link>

      {/* Daily Progress Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Workout Plan</h2>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {todayProgress.map((exercise, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-800 mb-2">{exercise.exercise}</h3>
              <div className="space-y-1">
                {Array.from({ length: exercise.sets }, (_, setIndex) => {
                  const isCompleted = setIndex < exercise.completedSets;
                  const isInProgress = setIndex === exercise.completedSets && exercise.completedReps > 0;
                  
                  return (
                    <div key={setIndex} className="flex items-center space-x-2 text-sm">
                      {isCompleted ? (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-gray-700">Set {setIndex + 1}: ✅ Complete</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Circle size={16} className="text-orange-500" />
                          <span className="text-gray-700">Set {setIndex + 1}: 🔄 {exercise.completedReps}/{exercise.repsPerSet} reps done</span>
                        </>
                      ) : (
                        <>
                          <Timer size={16} className="text-gray-400" />
                          <span className="text-gray-500">Set {setIndex + 1}: ⏳ Pending</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <Clock size={24} className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Today's Training Time</p>
            <p className="text-2xl font-bold text-blue-600">25 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
