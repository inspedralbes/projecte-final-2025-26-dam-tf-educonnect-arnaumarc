import React, { useState, useEffect } from 'react';
import { AppView, User } from '../types';
import { LogOut, UserCircle, Bell } from 'lucide-react';
import { useSocket } from '../src/context/SocketContext';
import { NotificationPanel } from './NotificationPanel';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout, user }) => {
  const profileImage = user?.profileImage || null;
  const { unreadCount } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  const getTabClass = (view: AppView) => {
    const isActive = currentView === view;
    return `px-8 py-5 cursor-pointer font-bold text-xs uppercase tracking-widest transition-all duration-300 relative flex items-center justify-center gap-2 ${
      isActive 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`;
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center z-50 transition-colors duration-300 shadow-sm shrink-0 h-16 md:h-20">
      <div className="flex h-full overflow-x-auto no-scrollbar">
        <button
          onClick={() => setView(user?.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON)}
          className={getTabClass(user?.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON)}
        >
          {user?.type === 'professor' ? 'Panel Docente' : 'Tablón'}
          {currentView === (user?.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON) && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setView(AppView.ASIGNATURAS)}
          className={getTabClass(AppView.ASIGNATURAS)}
        >
          Asignaturas
          {currentView === AppView.ASIGNATURAS && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setView(AppView.MEET)}
          className={getTabClass(AppView.MEET)}
        >
          Meet
          {currentView === AppView.MEET && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
          )}
        </button>
      </div>
      <div className="px-6 flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-in zoom-in duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationPanel 
              onClose={() => setShowNotifications(false)} 
              onViewHistory={() => {
                setView(AppView.ACTIVITY_HISTORY);
                setShowNotifications(false);
              }}
              setView={setView}
            />
          )}
        </div>

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