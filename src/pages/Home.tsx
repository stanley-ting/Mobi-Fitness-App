import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Clock, Activity, CheckCircle, Circle, Timer, Sparkles } from 'lucide-react';

const Home = () => {
  const todayProgress = [
    { exercise: 'Seated Chest Press', sets: 3, completedSets: 2, repsPerSet: 8, completedReps: 8 },
    { exercise: 'Seated Shoulder Press', sets: 3, completedSets: 1, repsPerSet: 10, completedReps: 4 },
    { exercise: 'Leg Press', sets: 2, completedSets: 0, repsPerSet: 8, completedReps: 0 },
  ];

  const totalSets = todayProgress.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = todayProgress.reduce((acc, ex) => acc + ex.completedSets, 0);
  const progressPercentage = Math.round((completedSets / totalSets) * 100);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="gradient-bg text-white px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              Good Morning <span className="text-yellow-300">👋</span>
            </h1>
            <p className="text-xl text-red-100 font-medium">Ah Seng</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Sparkles size={32} className="text-yellow-300" />
          </div>
        </div>

        {/* Mobi Brand & Tagline */}
        <div className="text-center mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h2 className="text-2xl font-bold text-white mb-2">Mobi</h2>
          <p className="text-red-100 text-sm font-medium italic">
            "Confidence with Every Rep, Fitness that Brings Us Together"
          </p>
        </div>

        {/* Scan Machine Button */}
        <Link to="/scan">
          <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-6 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <div className="flex items-center justify-center space-x-3">
              <QrCode size={36} className="drop-shadow-sm" />
              <span className="text-xl font-semibold">Scan Activity Station</span>
            </div>
          </button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Daily Progress Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-2">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Today's Activities</h2>
              <p className="text-gray-500 text-sm">Keep up the great work!</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-red-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {todayProgress.map((exercise, index) => (
              <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">{exercise.exercise}</h3>
                <div className="space-y-2">
                  {Array.from({ length: exercise.sets }, (_, setIndex) => {
                    const isCompleted = setIndex < exercise.completedSets;
                    const isInProgress = setIndex === exercise.completedSets && exercise.completedReps > 0;
                    
                    return (
                      <div key={setIndex} className="flex items-center space-x-3 text-sm bg-white/60 rounded-lg p-2">
                        {isCompleted ? (
                          <>
                            <CheckCircle size={18} className="text-green-500" />
                            <span className="text-gray-700 font-medium">Set {setIndex + 1}: ✅ Complete</span>
                          </>
                        ) : isInProgress ? (
                          <>
                            <Circle size={18} className="text-orange-500" />
                            <span className="text-gray-700">Set {setIndex + 1}: 🔄 {exercise.completedReps}/{exercise.repsPerSet} reps done</span>
                          </>
                        ) : (
                          <>
                            <Timer size={18} className="text-gray-400" />
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-lg card-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Clock size={28} className="text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-red-100 text-sm font-medium">Today's Active Time</p>
                <p className="text-3xl font-bold">25 minutes</p>
                <p className="text-red-100 text-xs">Great progress! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
