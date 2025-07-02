
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, QrCode, BarChart3, Compass, Users } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/scan', icon: QrCode, label: 'Scan' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/community', icon: Users, label: 'Community' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-red-100 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform scale-105' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Icon size={22} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
