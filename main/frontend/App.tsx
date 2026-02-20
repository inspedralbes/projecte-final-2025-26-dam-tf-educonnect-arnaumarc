import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AsignaturasView } from './views/AsignaturasView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView, UserRole } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'STUDENT';
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (localStorage.getItem('currentView') as AppView) || AppView.TABLON;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'TEACHER') {
      setCurrentView(AppView.TEACHER_DASHBOARD);
    } else {
      setCurrentView(AppView.TABLON);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('STUDENT'); // Reset role
    setCurrentView(AppView.LOGIN);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentView');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.TABLON:
        return <TablonView />;
      case AppView.TEACHER_DASHBOARD:
        return <TeacherDashboardView />;
      case AppView.ASIGNATURAS:
        return <AsignaturasView />;
      case AppView.MEET:
        return <MeetView />;
      case AppView.PROFILE:
        return <ProfileView />;
      case AppView.WORKSHOPS:
        return (
          <div className="flex items-center justify-center h-[calc(100vh-60px)]">
            <h2 className="text-2xl text-gray-500 font-bold">Sección de Talleres en construcción</h2>
          </div>
        );
      default:
        return userRole === 'TEACHER' ? <TeacherDashboardView /> : <TablonView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-900 border-8 border-black dark:border-zinc-800 box-border transition-colors duration-300">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
        userRole={userRole}
      />
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;