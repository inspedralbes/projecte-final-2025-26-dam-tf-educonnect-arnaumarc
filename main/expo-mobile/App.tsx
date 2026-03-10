import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { CoursesView } from './views/CoursesView';
import { ChatView } from './views/ChatView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView, User } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView(userData.type === 'professor' ? AppView.DASHBOARD : AppView.DASHBOARD); // For now both go to Dashboard
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(AppView.LOGIN);
  };

  if (!isLoggedIn) {
    if (currentView === AppView.REGISTER) {
      return (
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <Register
            onRegisterSuccess={() => setCurrentView(AppView.LOGIN)}
            onNavigateToLogin={() => setCurrentView(AppView.LOGIN)}
          />
        </SafeAreaProvider>
      );
    }

    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentView(AppView.REGISTER)}
        />
      </SafeAreaProvider>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return user?.type === 'professor' ? <TeacherDashboardView user={user} /> : <Dashboard user={user} />;
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
          <View style={styles.construction}>
            <Text style={styles.constructionText}>Sección de Talleres en construcción</Text>
          </View>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Navbar
          currentView={currentView}
          setView={setCurrentView}
          onLogout={handleLogout}
          user={user}
        />
        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  construction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  constructionText: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
