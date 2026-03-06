import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingCartIcon,
  BeakerIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Medicines', to: '/medicines', icon: <BeakerIcon className="w-5 h-5" /> },
  { name: 'Inventory', to: '/inventory', icon: <CubeIcon className="w-5 h-5" /> },
  { name: 'Sales', to: '/sales', icon: <ShoppingCartIcon className="w-5 h-5" /> },
  { name: 'Customers', to: '/customers', icon: <UserGroupIcon className="w-5 h-5" /> },
  { name: 'Suppliers', to: '/suppliers', icon: <BuildingStorefrontIcon className="w-5 h-5" /> },
  { name: 'Reports', to: '/reports', icon: <ChartBarIcon className="w-5 h-5" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-900">
                Rise Pharmacy
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${collapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            className={`
              flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium
              text-gray-700 hover:bg-gray-100 transition-colors duration-200
              ${collapsed ? 'justify-center' : 'justify-start'}
            `}
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
