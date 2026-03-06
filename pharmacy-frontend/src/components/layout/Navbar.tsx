import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  Bars3Icon,
  UserCircleIcon,
  ChevronDownIcon,
  BellIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon with Badge */}
            <Link to="/sales/checkout" className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <BellIcon className="w-5 h-5" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <UserCircleIcon className="w-6 h-6 text-gray-400" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.full_name || 'Admin User'}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`
                          block w-full px-4 py-2 text-left text-sm
                          ${active ? 'bg-gray-100' : ''}
                        `}
                      >
                        Your Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`
                          block w-full px-4 py-2 text-left text-sm
                          ${active ? 'bg-gray-100' : ''}
                        `}
                      >
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          localStorage.removeItem('auth_token');
                          localStorage.removeItem('user');
                          window.location.href = '/login';
                        }}
                        className={`
                          block w-full px-4 py-2 text-left text-sm
                          ${active ? 'bg-gray-100' : ''}
                        `}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
