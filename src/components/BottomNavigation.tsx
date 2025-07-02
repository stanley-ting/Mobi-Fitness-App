
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, QrCode, BarChart3, Compass, Users } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/scan', icon: QrCode, label: 'Scan', isCenter: true },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/community', icon: Users, label: 'Community' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-red-100 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label, isCenter }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                isCenter 
                  ? `${isActive 
                      ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-xl transform scale-110 -translate-y-2' 
                      : 'text-red-500 bg-red-50 border-2 border-red-200 transform scale-110 -translate-y-2 hover:bg-red-100'}`
                  : `${isActive 
                      ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform scale-105' 
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`
              }`}
            >
              <Icon size={isCenter ? 28 : 22} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
