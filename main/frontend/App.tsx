import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AsignaturasView } from './views/AsignaturasView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { ActivityHistoryView } from './views/ActivityHistoryView';
import { AppView, User } from './types';
import { Toaster } from 'react-hot-toast';
import { NotificationBot } from './components/NotificationBot';
import { SocketProvider } from './src/context/SocketContext';

import { API_BASE_URL } from './config';

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
        // Refresh user data from API to ensure we have populated courses and latest info
        fetch(`${API_BASE_URL}/api/user/${parsedUser._id}`)
          .then(res => res.json())
          .then(fullUserData => {
            if (fullUserData && !fullUserData.error) {
              const updatedUser = { ...fullUserData, type: parsedUser.type };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          })
          .catch(err => console.error('Error refreshing user data:', err));
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
    setUser((prev) => {
      // Preserve locally-known fields (e.g. `type`) if backend doesn't return them
      const merged = { ...(prev || {}), ...(updatedUser || {}) } as User;
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const handleLogin = async (userData: any) => {
    const { user: baseUser, type, token } = userData;
    try {
      // Refresh user data from API
      const response = await fetch(`${API_BASE_URL}/api/user/${baseUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let fullUserData = baseUser;
      if (response.ok) {
        fullUserData = await response.json();
      }
      
      const userWithRole = { ...fullUserData, type };
      setUser(userWithRole);
      setIsLoggedIn(true);
      const initialView = type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON;
      setCurrentView(initialView);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userWithRole));
      localStorage.setItem('token', token);
      localStorage.setItem('currentView', initialView);
    } catch (error) {
      console.error('Error fetching full user data:', error);
      const userWithRole = { ...baseUser, type };
      setUser(userWithRole);
      setIsLoggedIn(true);
      const initialView = type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON;
      setCurrentView(initialView);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userWithRole));
      localStorage.setItem('token', token);
      localStorage.setItem('currentView', initialView);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView(AppView.LOGIN);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
        return <TeacherDashboardView user={user} />;

      case AppView.ASIGNATURAS:
        return <AsignaturasView user={user} />;
      case AppView.MEET:
        return <MeetView user={user} />;
      case AppView.PROFILE:
        return <ProfileView user={user} onUpdateUser={updateUser} />;
      case AppView.ACTIVITY_HISTORY:
        return <ActivityHistoryView user={user} />;
      case AppView.WORKSHOPS:
        return user?.type === 'professor' ? <TeacherDashboardView user={user} /> : <TablonView user={user} />;
      default:
        return user?.type === 'professor' ? <TeacherDashboardView user={user} /> : <TablonView user={user} />;
    }
  };

  return (
    <SocketProvider user={user}>
      <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-900 transition-colors duration-300">
        <Navbar
          currentView={currentView}
          setView={setCurrentView}
          onLogout={handleLogout}
          user={user}
        />
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
          {renderContent()}
        </div>
        <Toaster position="top-right" />
        <NotificationBot 
          user={user} 
          currentView={currentView}
          setView={setCurrentView}
        />
      </div>
    </SocketProvider>
  );
}

export default App;
