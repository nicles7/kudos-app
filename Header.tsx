
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from './icons/LogoutIcon';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Welcome, {user.name}!</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-gray-700">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
            </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200 p-2 rounded-md hover:bg-red-50"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
