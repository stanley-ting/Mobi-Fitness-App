
import React from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
      <main className="max-w-md mx-auto bg-white/90 backdrop-blur-sm min-h-screen shadow-xl">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
