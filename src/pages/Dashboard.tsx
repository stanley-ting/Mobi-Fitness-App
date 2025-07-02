
import React, { useState } from 'react';
import { RefreshCw, Activity, Heart, Zap, Clock, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import ExerciseCalendar from '../components/ExerciseCalendar';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState('2 minutes ago');
  const [metrics, setMetrics] = useState({
    exercisesCompleted: 3,
    totalExercises: 5,
    trainingTime: 45,
    spo2: { high: 98, low: 94, avg: 96 },
    heartRate: { avg: 125, max: 142, min: 88 },
    fatigueScore: 72
  });

  // Mock data for charts
  const heartRateData = [
    { time: '9AM', value: 88 },
    { time: '10AM', value: 125 },
    { time: '11AM', value: 142 },
    { time: '12PM', value: 118 },
    { time: '1PM', value: 95 },
    { time: '2PM', value: 102 },
    { time: '3PM', value: 89 }
  ];

  const fatigueData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 70 },
    { day: 'Wed', score: 68 },
    { day: 'Thu', score: 72 },
    { day: 'Fri', score: 75 },
    { day: 'Sat', score: 78 },
    { day: 'Sun', score: 72 }
  ];

  const handleSync = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate realistic random variations
      setMetrics(prev => ({
        exercisesCompleted: Math.min(prev.exercisesCompleted + Math.floor(Math.random() * 2), 5),
        totalExercises: 5,
        trainingTime: prev.trainingTime + Math.floor(Math.random() * 15),
        spo2: {
          high: 96 + Math.floor(Math.random() * 4),
          low: 92 + Math.floor(Math.random() * 4),
          avg: 94 + Math.floor(Math.random() * 4)
        },
        heartRate: {
          avg: 120 + Math.floor(Math.random() * 20),
          max: 140 + Math.floor(Math.random() * 15),
          min: 85 + Math.floor(Math.random() * 10)
        },
        fatigueScore: 65 + Math.floor(Math.random() * 25)
      }));
      
      setLastSync('Just now');
      setIsLoading(false);
    }, 2000);
  };

  const aiInsights = [
    "Your fatigue score is 15% better than yesterday! 💪",
    "You trained 30 minutes more than your weekly average",
    "Your heart rate recovery improved by 8%",
    "Great job maintaining consistent SpO2 levels today!"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Personal Dashboard</h1>
          <p className="text-gray-600">Last synced: {lastSync}</p>
        </div>
        
        <button
          onClick={handleSync}
          disabled={isLoading}
          className={`p-3 rounded-full ${isLoading ? 'bg-gray-200' : 'bg-red-100 hover:bg-red-200'} transition-colors`}
        >
          <RefreshCw 
            size={24} 
            className={`text-red-600 ${isLoading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* Exercise Calendar */}
      <ExerciseCalendar />

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Exercises Completed */}
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Activity size={24} className="text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Exercises</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {metrics.exercisesCompleted}/{metrics.totalExercises}
          </p>
          <p className="text-sm text-gray-600">done today</p>
        </div>

        {/* Training Time */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Clock size={24} className="text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Training</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{metrics.trainingTime}</p>
          <p className="text-sm text-gray-600">minutes today</p>
        </div>

        {/* SpO2 Levels */}
        <div className="bg-purple-50 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Zap size={24} className="text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">SpO2 Levels</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-purple-600">Avg: {metrics.spo2.avg}%</p>
            <p className="text-xs text-gray-600">High: {metrics.spo2.high}% Low: {metrics.spo2.low}%</p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-red-50 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Heart size={24} className="text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Heart Rate</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{metrics.heartRate.avg}</p>
          <p className="text-sm text-gray-600">bpm average</p>
        </div>
      </div>

      {/* Heart Rate Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
        <div className="flex items-center mb-4">
          <Heart size={24} className="text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">Heart Rate Trend</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={heartRateData}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fatigue Score Chart */}
      <div className="bg-orange-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain size={24} className="text-orange-600 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Weekly Fatigue Score</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">{metrics.fatigueScore}/100</span>
        </div>
        
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fatigueData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-sm text-gray-600">
          {metrics.fatigueScore >= 80 ? 'Excellent' : 
           metrics.fatigueScore >= 60 ? 'Good' : 
           metrics.fatigueScore >= 40 ? 'Fair' : 'Needs Rest'}
        </p>
      </div>

      {/* AI Health Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Health Insights</h3>
        </div>
        
        <div className="space-y-3">
          {aiInsights.slice(0, 3).map((insight, index) => (
            <div key={index} className="bg-white bg-opacity-50 rounded-lg p-3">
              <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
