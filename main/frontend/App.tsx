import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { AsignaturasView } from './views/AsignaturasView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView, User } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (localStorage.getItem('currentView') as AppView) || AppView.TABLON;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Apply user's theme
      if (user.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.removeItem('user');
      // Default theme if no user
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isLoggedIn, user]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };


  const handleLogin = async (userData: User) => {
    try {
      const response = await fetch(`http://localhost:3005/api/user/${userData._id}`);
      const fullUserData = await response.json();
      setUser({ ...fullUserData, type: userData.type });
      setIsLoggedIn(true);
      setCurrentView(AppView.TABLON);
    } catch (error) {
      console.error('Error fetching full user data:', error);
      // Fallback to basic data if fetch fails
      setUser(userData);
      setIsLoggedIn(true);
      setCurrentView(AppView.TABLON);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView(AppView.LOGIN);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('currentView');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.TABLON:
        return <TablonView user={user} />;
      case AppView.ASIGNATURAS:
      case AppView.ASIGNATURAS:
        return <AsignaturasView user={user} />;
      case AppView.MEET:
        return <MeetView />;

      case AppView.PROFILE:
        return <ProfileView user={user} onUpdateUser={updateUser} />;
      case AppView.WORKSHOPS:
        return (
          <div className="flex items-center justify-center h-[calc(100vh-60px)]">
            <h2 className="text-2xl text-gray-500 font-bold">Sección de Talleres en construcción</h2>
          </div>
        );
      default:
        return <TablonView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-900 border-8 border-black dark:border-zinc-800 box-border transition-colors duration-300">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
        user={user}
      />
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;