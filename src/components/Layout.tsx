
import React from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-md mx-auto bg-white min-h-screen">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
