import React, { useState } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { CoursesView } from './views/CoursesView';
import { ChatView } from './views/ChatView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(AppView.LOGIN);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.COURSES:
        return <CoursesView />;
      case AppView.CHAT:
        return <ChatView />;
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
        return <Dashboard />;
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