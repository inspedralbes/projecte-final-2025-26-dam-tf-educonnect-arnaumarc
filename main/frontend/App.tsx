import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { Phone } from 'lucide-react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { TablonView } from './views/TablonView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AsignaturasView } from './views/AsignaturasView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView, User, IncomingCallData } from './types';
import { NotificationBot } from './components/NotificationBot';

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

  const socketRef = useRef<Socket | null>(null);
  const [acceptedCall, setAcceptedCall] = useState<IncomingCallData | null>(null);
  const toastIdRef = useRef<string | null>(null);

  // Global Socket.io configuration
  useEffect(() => {
    if (isLoggedIn && user) {
      // Connect to global socket
      const socket = io('http://localhost:3005');
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('register_user', user._id || (user as any).id);
      });

      socket.on('call-made', (data: IncomingCallData) => {
        // Play ringtone or simply show toast
        const acceptCallHandler = () => {
          setAcceptedCall(data);
          setCurrentView(AppView.MEET);
          if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        };

        const rejectCallHandler = () => {
          socket.emit('call-rejected', { to: data.socket });
          if (toastIdRef.current) toast.dismiss(toastIdRef.current);
        };

        const callerName = data.callerName || 'un compañero';

        toastIdRef.current = toast.custom(
          (t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white dark:bg-zinc-800 shadow-xl rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black/5 dark:ring-white/10 overflow-hidden`}
            >
              <div className="p-4 flex items-center gap-4 bg-blue-50/80 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 flex items-center justify-center font-bold shadow-inner">
                  {callerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Videollamada Entrante</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{callerName} te está llamando...</p>
                </div>
              </div>
              <div className="flex bg-gray-50 dark:bg-zinc-800/80">
                <button
                  onClick={rejectCallHandler}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors border-r border-gray-200 dark:border-zinc-700"
                >
                  <Phone size={16} className="transform rotate-135" />
                  Rechazar
                </button>
                <button
                  onClick={acceptCallHandler}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Phone size={16} />
                  Aceptar
                </button>
              </div>
            </div>
          ),
          { duration: 30000, id: `call-${data.socket}` }
        );
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [isLoggedIn, user]);

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
        return <MeetView
          currentUser={user}
          globalSocket={socketRef.current}
          acceptedCall={acceptedCall}
          clearAcceptedCall={() => setAcceptedCall(null)}
        />;
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
      <NotificationBot user={user} setView={setCurrentView} globalSocket={socketRef.current} />
    </div>
  );
}

export default App;