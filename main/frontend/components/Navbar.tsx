import React, { useState, useEffect } from 'react';
import { AppView, User } from '../types';
import { LogOut, UserCircle } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout, user }) => {
  const profileImage = user?.profileImage || null;

  const getTabClass = (view: AppView) => {
    const isActive = currentView === view;
    return `px-6 py-4 cursor-pointer font-semibold transition-all duration-300 border-r border-gray-200 dark:border-zinc-800 relative flex items-center justify-center ${isActive ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`;
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300 shadow-sm backdrop-blur-sm">
      <div className="flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setView(user?.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON)}
          className={getTabClass(user?.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON)}
        >
          {user?.type === 'professor' ? 'Panel Docente' : 'Tablón'}
        </button>
        {user?.type !== 'professor' && (
          <>
            <button
              onClick={() => setView(AppView.WORKSHOPS)}
              className={getTabClass(AppView.WORKSHOPS)}
            >
              Talleres
            </button>
            <button
              onClick={() => setView(AppView.MEET)}
              className={getTabClass(AppView.MEET)}
            >
              Meet
            </button>
          </>
        )}
        <button
          onClick={() => setView(AppView.ASIGNATURAS)}
          className={getTabClass(AppView.ASIGNATURAS)}
        >
          Asignaturas
        </button>
      </div>
      <div className="px-4 flex items-center space-x-3">
        <button
          onClick={() => setView(AppView.PROFILE)}
          className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors overflow-hidden bg-cover bg-center shadow-sm hover:shadow-md"
          style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}
        >
          {!profileImage && <UserCircle size={24} className="text-white" />}
        </button>
        <button onClick={onLogout} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2">
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
};