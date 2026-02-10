import React from 'react';
import { AppView } from '../types';
import { LogOut, UserCircle } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const getTabClass = (view: AppView) => {
    const isActive = currentView === view;
    // Added text-black explicitly to ensure visibility
    return `px-6 py-3 cursor-pointer border-r-2 border-black font-bold text-black transition-colors ${isActive ? 'bg-purple-200' : 'bg-white hover:bg-gray-100'
      }`;
  };

  return (
    <div className="w-full border-b-4 border-black bg-white flex justify-between items-center sticky top-0 z-50">
      <div className="flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setView(AppView.DASHBOARD)}
          className={getTabClass(AppView.DASHBOARD)}
        >
          Inicio
        </button>
        <button
          onClick={() => setView(AppView.WORKSHOPS)}
          className={getTabClass(AppView.WORKSHOPS)}
        >
          Talleres
        </button>
        <button
          onClick={() => setView(AppView.COURSES)}
          className={getTabClass(AppView.COURSES)}
        >
          Mis Cursos
        </button>
        <button
          onClick={() => setView(AppView.MEET)}
          className={getTabClass(AppView.MEET)}
        >
          Meet
        </button>
        <button
          onClick={() => setView(AppView.CHAT)}
          className={getTabClass(AppView.CHAT)}
        >
          Chat
        </button>
      </div>
      <div className="px-4 flex items-center space-x-3">
        <button
          onClick={() => setView(AppView.PROFILE)}
          className="w-8 h-8 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center hover:bg-cyan-300 transition-colors"
        >
          <UserCircle size={20} className="text-white" />
        </button>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};