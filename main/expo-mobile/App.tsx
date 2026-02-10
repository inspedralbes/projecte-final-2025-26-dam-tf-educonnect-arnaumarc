import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { CoursesView } from './views/CoursesView';
import { ChatView } from './views/ChatView';
import { MeetView } from './views/MeetView';
import { ProfileView } from './views/ProfileView';
import { AppView } from './types';

export default function App() {
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
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Login onLogin={handleLogin} />
      </SafeAreaProvider>
    );
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
          <View style={styles.construction}>
            <Text style={styles.constructionText}>Sección de Talleres en construcción</Text>
          </View>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.outerBorder}>
          <Navbar
            currentView={currentView}
            setView={setCurrentView}
            onLogout={handleLogout}
          />
          <View style={styles.content}>
            {renderContent()}
          </View>
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
  outerBorder: {
    flex: 1,
    borderWidth: 8,
    borderColor: 'black',
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
