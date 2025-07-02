
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Info, Settings, MapPin } from 'lucide-react';

const ExerciseGuidance = () => {
  const navigate = useNavigate();

  const properFormSteps = [
    "Find a comfortable position on the activity station",
    "Ensure your posture is upright and stable", 
    "Start with gentle movements and gradually increase intensity",
    "Listen to your body and take breaks when needed",
    "Maintain steady breathing throughout the exercise"
  ];

  const attachmentSteps = [
    "Locate the sensor mounting point on the activity station",
    "Gently attach the wellness sensor to the designated area", 
    "Check that the green indicator light is visible",
    "Ensure the sensor stays secure during your activity"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      {/* Header */}
      <div className="gradient-bg text-white px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/scan')}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Activity Setup</h1>
          <div className="w-12"></div>
        </div>
        
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MapPin size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Active Corner Station</h2>
          <p className="text-red-100">Senior-Friendly Exercise Equipment</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Video Placeholder with Exercise Image */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl aspect-video flex flex-col items-center justify-center shadow-lg card-hover">
          <div className="text-center text-gray-700 mb-4">
            {/* Exercise illustration */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">🧘‍♂️</span>
              </div>
            </div>
            <Play size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-lg font-semibold">Exercise Demonstration</p>
            <p className="text-sm text-gray-500">Tap to play activity guide</p>
          </div>
        </div>

        {/* Proper Form Instructions */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 card-hover">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 rounded-xl p-3 mr-4">
              <Info size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Exercise Guidelines</h3>
              <p className="text-gray-500 text-sm">Follow these steps for safe activity</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {properFormSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 bg-red-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Device Attachment Guide */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 card-hover">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 rounded-xl p-3 mr-4">
              <Settings size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Wellness Sensor Setup</h3>
              <p className="text-gray-500 text-sm">Attach your health monitoring device</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {attachmentSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 bg-green-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Exercise Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-6 rounded-3xl text-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          Begin Activity Session
        </button>
      </div>
    </div>
  );
};

export default ExerciseGuidance;
