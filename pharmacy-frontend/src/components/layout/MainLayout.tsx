import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div
        className={`
          transition-all duration-300 min-h-screen flex flex-col
          ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            © 2026 Pharmacy Management System. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
