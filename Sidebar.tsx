import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import HomeIcon from './HomeIcon';
import GiftIcon from './GiftIcon';
import TrophyIcon from './TrophyIcon';
import ShieldCheckIcon from './ShieldCheckIcon';
import UserCircleIcon from './UserCircleIcon';
import { useAuth } from './AuthContext';
import { Role } from './types';
const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-teal-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/give-kudos" className={navLinkClasses}>
          <GiftIcon />
          <span>Give Kudos</span>
        </NavLink>
        <NavLink to="/my-kudos" className={navLinkClasses}>
          <UserCircleIcon />
          <span>My Kudos</span>
        </NavLink>
        <NavLink to="/leaderboard" className={navLinkClasses}>
          <TrophyIcon />
          <span>Leaderboard</span>
        </NavLink>
        {user?.role === Role.HR && (
          <NavLink to="/admin" className={navLinkClasses}>
            <ShieldCheckIcon />
            <span>Admin Dashboard</span>
          </NavLink>
        )}
      </nav>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <p className="text-xs text-gray-400">© 2024 EC Group Datasoft</p>
      </div>
    </div>
  );
};
export default Sidebar;
