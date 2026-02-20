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

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TABLON);

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
  }, [isLoggedIn, user]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogin = async (userData: User) => {
    const type = userData.type;
    try {
      const response = await fetch(`http://localhost:3005/api/user/${userData._id}`);
      const fullUserData = await response.json();
      setUser({ ...fullUserData, type });
      setIsLoggedIn(true);
      setCurrentView(type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON);
    } catch (error) {
      console.error('Error fetching full user data:', error);
      setUser(userData);
      setIsLoggedIn(true);
      setCurrentView(type === 'professor' ? AppView.TEACHER_DASHBOARD : AppView.TABLON);
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
    </div>
  );
}

export default App;