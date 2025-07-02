
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Scan as ScanIcon } from 'lucide-react';

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
    <div className="h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">Activity Station Scanner</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* QR Code Image */}
      <div className="absolute top-20 right-6 z-5">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({length: 9}).map((_, i) => (
                <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-900'} rounded-sm`}></div>
              ))}
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-600">Sample QR</p>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative h-full flex items-center justify-center">
        {/* Scanning Frame */}
        <div className="relative">
          <div className={`w-72 h-72 border-4 ${isScanning ? 'border-red-400' : 'border-white'} rounded-3xl relative transition-all duration-300 shadow-2xl`}>
            {/* Corner indicators */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-red-400 rounded-tl-2xl"></div>
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-4 border-r-4 border-red-400 rounded-tr-2xl"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-4 border-l-4 border-red-400 rounded-bl-2xl"></div>
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-red-400 rounded-br-2xl"></div>
            
            {/* Scanning animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-red-400 bg-opacity-20 rounded-3xl">
                <div className="w-full h-2 bg-red-400 animate-pulse rounded-t-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanIcon size={48} className="text-red-400 animate-pulse" />
                </div>
              </div>
            )}

            {/* Success check */}
            {scanComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-3xl">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white text-3xl">✓</span>
                </div>
              </div>
            )}

            {/* Center icon when not scanning */}
            {!isScanning && !scanComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanIcon size={48} className="text-white/70" />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center px-6">
          <p className="text-white text-xl mb-6 font-medium">
            {isScanning ? 'Scanning activity station...' : 
             scanComplete ? 'Station found!' : 
             'Point camera at station QR code'}
          </p>
          
          {!isScanning && !scanComplete && (
            <button 
              onClick={handleScan}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
            >
              Start Scanning
            </button>
          )}
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default Scan;
