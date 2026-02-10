import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AppView } from '../types';
import { LogOut, UserCircle } from 'lucide-react-native';

interface NavbarProps {
    currentView: AppView;
    setView: (view: AppView) => void;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
    const getTabStyle = (view: AppView) => {
        const isActive = currentView === view;
        return [
            styles.tab,
            isActive ? styles.tabActive : styles.tabInactive
        ];
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                <TouchableOpacity
                    onPress={() => setView(AppView.DASHBOARD)}
                    style={getTabStyle(AppView.DASHBOARD)}
                >
                    <Text style={styles.tabText}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setView(AppView.WORKSHOPS)}
                    style={getTabStyle(AppView.WORKSHOPS)}
                >
                    <Text style={styles.tabText}>Talleres</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setView(AppView.COURSES)}
                    style={getTabStyle(AppView.COURSES)}
                >
                    <Text style={styles.tabText}>Mis Cursos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setView(AppView.MEET)}
                    style={getTabStyle(AppView.MEET)}
                >
                    <Text style={styles.tabText}>Meet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setView(AppView.CHAT)}
                    style={getTabStyle(AppView.CHAT)}
                >
                    <Text style={styles.tabText}>Chat</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => setView(AppView.PROFILE)} style={styles.avatar}>
                    <UserCircle size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onLogout} style={styles.logout}>
                    <LogOut size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: 4,
        borderColor: 'black',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    scroll: {
        flex: 1,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRightWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
    },
    tabActive: {
        backgroundColor: '#e9d5ff', // purple-200
    },
    tabInactive: {
        backgroundColor: 'white',
    },
    tabText: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 14,
    },
    actions: {
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#22d3ee',
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logout: {
        padding: 4,
    },
});
