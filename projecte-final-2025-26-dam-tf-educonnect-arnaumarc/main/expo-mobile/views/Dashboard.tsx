import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Bell, BookOpen, Building, Trash2, User as UserIcon } from 'lucide-react-native';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import { User } from '../types';

interface DashboardProps {
    user: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'clase' | 'general'>('personal');
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user?._id) return;

        setLoading(true);
        // 1. Fetch initial messages
        fetch(`${API_BASE_URL}/api/users/${user._id}/messages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching messages:', err);
                setLoading(false);
            });

        // 2. Setup Socket.io connection
        socketRef.current = io(API_BASE_URL);
        const socket = socketRef.current;

        socket.on('connect', () => {
            socket.emit('register_user', user._id);
        });

        socket.on('new_notification', (data: any) => {
            const newMessage = {
                _id: Date.now().toString(),
                title: data.title,
                content: data.content,
                course: data.courseId ? { _id: data.courseId, title: "Curso" } : undefined,
                sender: { nombre: 'Nuevo', apellidos: 'Aviso' },
                date: new Date().toISOString(),
                isPrivate: data.isPrivate
            };
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleDeleteMessage = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessages(prev => prev.filter(msg => msg._id !== id));
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const personalMessages = messages.filter(msg => msg.isPrivate || !msg.course);
    const classMessages = messages.filter(msg => !!msg.course && !msg.isPrivate);
    const generalMessages: any[] = [];

    const renderMessageList = (msgList: any[], type: 'personal' | 'clase' | 'general') => {
        if (loading) return <ActivityIndicator size="large" color="#06b6d4" style={{ marginTop: 20 }} />;

        if (msgList.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Bell size={40} color="#9ca3af" />
                    <Text style={styles.emptyText}>
                        {type === 'personal' ? 'No tienes notificaciones personales.' :
                            type === 'clase' ? 'No hay avisos de tus clases.' :
                                'No hay avisos generales actualmente.'}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.list}>
                {msgList.map((msg, idx) => (
                    <View key={msg._id || idx} style={styles.messageCard}>
                        <View style={styles.messageHeader}>
                            <View style={[styles.iconContainer,
                            type === 'personal' ? styles.blueIcon :
                                type === 'clase' ? styles.amberIcon : styles.indigoIcon]}>
                                {type === 'personal' ? <Bell size={16} color="#2563eb" /> :
                                    type === 'clase' ? <BookOpen size={16} color="#d97706" /> :
                                        <Building size={16} color="#4f46e5" />}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.messageTitle}>{msg.title}</Text>
                                <Text style={styles.messageContent}>{msg.content}</Text>
                                <Text style={styles.messageSender}>
                                    De: {msg.sender?.nombre} {msg.sender?.apellidos}
                                    {msg.course?.title ? ` (${msg.course.title})` : ''}
                                </Text>
                            </View>
                            {type === 'personal' && (
                                <TouchableOpacity onPress={() => handleDeleteMessage(msg._id)} style={styles.deleteButton}>
                                    <Trash2 size={18} color="#ef4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>INS PEDRALBES</Text>
            <Text style={styles.subtitle}>Proyecto Educativo Conectado</Text>

            <View style={styles.tabsCard}>
                <View style={styles.tabsHeader}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('personal')}
                        style={[styles.tab, activeTab === 'personal' && styles.tabActive]}
                    >
                        <UserIcon size={18} color={activeTab === 'personal' ? '#2563eb' : '#6b7280'} />
                        <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>Personal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('clase')}
                        style={[styles.tab, activeTab === 'clase' && styles.tabActive]}
                    >
                        <BookOpen size={18} color={activeTab === 'clase' ? '#2563eb' : '#6b7280'} />
                        <Text style={[styles.tabText, activeTab === 'clase' && styles.tabTextActive]}>Clase</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('general')}
                        style={[styles.tab, activeTab === 'general' && styles.tabActive]}
                    >
                        <Building size={18} color={activeTab === 'general' ? '#2563eb' : '#6b7280'} />
                        <Text style={[styles.tabText, activeTab === 'general' && styles.tabTextActive]}>General</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContent}>
                    {activeTab === 'personal' && renderMessageList(personalMessages, 'personal')}
                    {activeTab === 'clase' && renderMessageList(classMessages, 'clase')}
                    {activeTab === 'general' && renderMessageList(generalMessages, 'general')}
                </View>
            </View>

            {/* Calendario simplificado para móvil */}
            <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                    <View style={styles.calendarIcon}>
                        <BookOpen size={20} color="white" />
                    </View>
                    <Text style={styles.calendarTitle}>CALENDARIO ACADÉMICO</Text>
                </View>
                <View style={styles.calendarPlaceholder}>
                    <Text style={styles.placeholderText}>
                        El calendario completo está disponible en la versión web.
                    </Text>
                    <TouchableOpacity style={styles.viewCalendarButton}>
                        <Text style={styles.viewCalendarText}>VER PRÓXIMOS EVENTOS</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
        color: '#2563eb', // blue-600
        textTransform: 'uppercase',
    },
    subtitle: {
        textAlign: 'center',
        color: '#6b7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 1,
        marginBottom: 30,
    },
    tabsCard: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
        marginBottom: 30,
    },
    tabsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: 'black',
        backgroundColor: '#f9fafb',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 6,
    },
    tabActive: {
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderColor: '#2563eb',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#6b7280',
    },
    tabTextActive: {
        color: '#2563eb',
    },
    tabContent: {
        padding: 16,
        minHeight: 200,
    },
    list: {
        gap: 12,
    },
    messageCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 12,
        borderRadius: 12,
    },
    messageHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blueIcon: { backgroundColor: '#dbeafe' },
    amberIcon: { backgroundColor: '#fef3c7' },
    indigoIcon: { backgroundColor: '#e0e7ff' },
    messageTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111827',
        marginBottom: 2,
    },
    messageContent: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
    },
    messageSender: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9ca3af',
        marginTop: 8,
    },
    deleteButton: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        fontWeight: '500',
        fontSize: 14,
        paddingHorizontal: 20,
    },
    calendarCard: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    calendarIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'black',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-3deg' }],
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: 'black',
        letterSpacing: 1,
    },
    calendarPlaceholder: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    placeholderText: {
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: 15,
        fontSize: 14,
    },
    viewCalendarButton: {
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
    },
    viewCalendarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
