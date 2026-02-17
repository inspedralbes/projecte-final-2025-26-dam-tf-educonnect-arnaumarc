import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { AsignaturasView } from './views/AsignaturasView';
import { ProfileView } from './views/ProfileView';
import { AppView } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return (localStorage.getItem('currentView') as AppView) || AppView.TABLON;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView(AppView.TABLON);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(AppView.LOGIN);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentView');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.TABLON:
        return <TablonView />;
      case AppView.ASIGNATURAS:
        return <AsignaturasView />;

      case AppView.PROFILE:
        return <ProfileView />;
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
    <div className="flex flex-col h-screen w-full bg-white border-8 border-black box-border">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto bg-gray-50">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;