import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AsignaturasView } from './views/AsignaturasView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView, User } from './types';
import { ChatWidget } from './components/ChatWidget';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedView = localStorage.getItem('currentView');
    const savedUser = localStorage.getItem('user');
    if (savedView) return savedView as AppView;

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON;
      } catch (e) {
        return AppView.TABLON;
      }
    }
    return AppView.TABLON;
  });

  // Re-sync with backend in background or handle cleanup if localStorage is corrupt
  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('user');

    if (savedIsLoggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Optional: verify with backend if token/session is still valid
        // For now, we trust localStorage as per user requirements for simple persistence
      } catch (error) {
        console.error('Error restoring session:', error);
        handleLogout();
      }
    } else if (savedIsLoggedIn && !savedUser) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [user]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView, isLoggedIn]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogin = async (userData: User) => {
    const type = userData.type;
    try {
      const response = await fetch(`http://localhost:3005/api/user/${userData._id}`);
      const fullUserData = await response.json();
      const userWithRole = { ...fullUserData, type };
      setUser(userWithRole);
      setIsLoggedIn(true);
      const initialView = type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON;
      setCurrentView(initialView);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userWithRole));
      localStorage.setItem('currentView', initialView);
    } catch (error) {
      console.error('Error fetching full user data:', error);
      setUser(userData);
      setIsLoggedIn(true);
      const initialView = type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON;
      setCurrentView(initialView);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('currentView', initialView);
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
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() => setShowRegister(false)}
          onNavigateToLogin={() => setShowRegister(false)}
        />
      );
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} />;
  }


  const renderContent = () => {
    switch (currentView) {
      case AppView.TABLON:
        return <TablonView user={user} />;
      case AppView.TEACHER_DASHBOARD:
        return <TeacherDashboardView />;

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
        return user?.type === 'professor' ? <TeacherDashboardView /> : <TablonView user={user} />;
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
      <ChatWidget currentUser={user} />
    </div>
  );
}

export default App;