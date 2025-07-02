
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Info, Settings } from 'lucide-react';

const ExerciseGuidance = () => {
  const navigate = useNavigate();

  const properFormSteps = [
    "Sit with back straight against pad",
    "Grip handles at shoulder height", 
    "Press up smoothly without locking elbows",
    "Lower slowly with control",
    "Keep core engaged throughout movement"
  ];

  const attachmentSteps = [
    "Locate the sensor attachment point on weight stack",
    "Secure sensor to the cable mechanism", 
    "Ensure green light indicates connection",
    "Check sensor stays in place during movement"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/scan')}
            className="p-2 bg-white bg-opacity-20 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Exercise Setup</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Shoulder Press Machine</h2>
          <p className="text-blue-100">Device Attachment - Chest Press</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Video Placeholder */}
        <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <Play size={48} className="mx-auto mb-4 text-blue-400" />
            <p className="text-lg">Exercise Demonstration</p>
            <p className="text-sm text-gray-300">Tap to play workout guide</p>
          </div>
        </div>

        {/* Proper Form Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Info size={24} className="text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Proper Form Instructions</h3>
          </div>
          
          <div className="space-y-3">
            {properFormSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Device Attachment Guide */}
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Settings size={24} className="text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Device Attachment Guide</h3>
          </div>
          
          <div className="space-y-3">
            {attachmentSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Exercise Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-6 rounded-2xl text-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
        >
          Start Exercise
        </button>
      </div>
    </div>
  );
};

export default ExerciseGuidance;
