
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';

const Scan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate 3-second scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      
      // Navigate to exercise guidance after brief success message
      setTimeout(() => {
        navigate('/exercise-guidance');
      }, 1000);
    }, 3000);
  };

  return (
    <div className="h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 bg-black bg-opacity-50 rounded-full"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Machine Scanner</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        
        {/* Scanning Frame */}
        <div className="relative">
          <div className={`w-64 h-64 border-4 ${isScanning ? 'border-green-400' : 'border-white'} rounded-2xl relative transition-colors duration-300`}>
            {/* Corner indicators */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
            
            {/* Scanning animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-green-400 bg-opacity-20 rounded-2xl animate-pulse">
                <div className="w-full h-1 bg-green-400 animate-pulse"></div>
              </div>
            )}

            {/* Success check */}
            {scanComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">✓</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center px-6">
          <p className="text-white text-lg mb-6">
            {isScanning ? 'Scanning machine...' : 
             scanComplete ? 'Machine found!' : 
             'Point camera at machine QR code'}
          </p>
          
          {!isScanning && !scanComplete && (
            <button 
              onClick={handleScan}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl text-lg font-semibold transition-colors"
            >
              Find a code to scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;
