import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../config';
import { User } from '../../types';
import toast from 'react-hot-toast';

interface CallData {
    from: string;
    fromName: string;
    offer: any;
}

export interface NotificationData {
    _id: string;
    type: 'EXAM' | 'MATERIAL' | 'MESSAGE' | 'ANNOUNCEMENT' | 'COURSE_INVITE' | 'SYSTEM' | 'MEET_CALL' | 'MEET_MESSAGE' | 'PROFESSOR_ADVISORY';
    title: string;
    content: string;
    link?: string;
    meta?: {
        courseId?: string;
        professorId?: string;
    };
    read: boolean;
    priority?: 'LOW' | 'HIGH';
    createdAt: string;
    senderModel?: 'Professor' | 'Alumno' | 'System' | 'Admin';
}

export interface MessageData {
    _id: string;
    sender: any;
    receiver: string;
    course?: any;
    title: string;
    content: string;
    date: string;
    read: boolean;
    isPrivate: boolean;
}

export type FeedItem = {
    id: string;
    type: NotificationData['type'] | 'DIRECT_MESSAGE';
    title: string;
    content: string;
    date: string;
    source: 'notification' | 'message';
    raw: NotificationData | MessageData;
    courseId?: string;
    sender?: any;
    read: boolean;
};

interface SocketContextType {
    socket: Socket | null;
    incomingCall: CallData | null;
    user: User | null;
    notifications: NotificationData[];
    messages: MessageData[];
    feed: FeedItem[];
    unreadCount: number;
    isInCall: boolean;
    isCalling: boolean;
    activeCallUser: { id: string, name: string } | null;
    startCall: (targetId: string, targetName: string, offer: any) => void;
    acceptCall: (fromId: string) => void;
    rejectCall: (fromId: string) => void;
    endCall: (targetId: string) => void;
    setInCall: (value: boolean) => void;
    setCalling: (value: boolean) => void;
    setActiveCallUser: (user: { id: string, name: string } | null) => void;
    setIncomingCall: (call: CallData | null) => void;
    setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
    markNotificationAsRead: (id: string) => void;
    markNotificationAsReadLocal: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    deleteMessage: (id: string) => Promise<boolean>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ user: User | null, children: React.ReactNode }> = ({ user, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isInCall, setIsInCall] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [activeCallUser, setActiveCallUser] = useState<{ id: string, name: string } | null>(null);

    const socketRef = useRef<Socket | null>(null);

    // Unify notifications and messages into a feed
    const feed: FeedItem[] = [
        ...notifications.map(n => ({
            id: n._id,
            type: n.type,
            title: n.title,
            content: n.content,
            date: n.createdAt,
            source: 'notification' as const,
            raw: n,
            courseId: n.meta?.courseId,
            read: n.read
        })),
        ...messages.map(m => ({
            id: m._id,
            type: m.title === 'Mensaje de Meet' ? 'MEET_MESSAGE' : 'DIRECT_MESSAGE' as const,
            title: m.title,
            content: m.content,
            date: m.date,
            source: 'message' as const,
            raw: m,
            courseId: m.course?._id || m.course,
            sender: m.sender,
            read: m.read
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Cargar notificaciones iniciales vía API
    const fetchNotifications = async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/messages`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
            setNotifications([]);
            setMessages([]);
            setUnreadCount(0);
            return;
        }

        fetchNotifications(user._id);
        fetchMessages(user._id);

        const newSocket = io(API_BASE_URL || window.location.origin);
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            newSocket.emit('register_user', user._id);
        });

        newSocket.on('incoming_call', (data: CallData) => {
            setIncomingCall(data);
            // Add a local notification for the feed
            const meetNotif: NotificationData = {
                _id: `temp-${Date.now()}`,
                type: 'MEET_CALL',
                title: 'Llamada de Meet entrante',
                content: `Llamada de ${data.fromName}`,
                read: false,
                createdAt: new Date().toISOString(),
                senderModel: 'Professor' // Assuming professor initiated
            };
            setNotifications(prev => [meetNotif, ...prev]);
        });

        newSocket.on('new_notification', (data: NotificationData) => {
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.success(`Notificación: ${data.title}`);
        });

        newSocket.on('new_message', (data: MessageData) => {
            console.log('Real-time message received:', data);
            setMessages(prev => {
                // Prevent duplicates from multiple socket events or manual updates
                if (prev.some(m => m._id === data._id)) return prev;
                return [data, ...prev];
            });
            
            // Only show toast if it's not from the current user
            if (data.sender?._id !== user?._id) {
                toast.success(`Nuevo mensaje de ${data.sender?.nombre || 'Alguien'}`);
            }
        });

        newSocket.on('sync_notifications', (data: NotificationData[]) => {
            // Mezclar con las actuales evitando duplicados
            setNotifications(prev => {
                const existingIds = new Set(prev.map(n => n._id));
                const newOnes = data.filter(n => !existingIds.has(n._id));
                return [...newOnes, ...prev];
            });
            setUnreadCount(prev => prev + data.length);
        });

        newSocket.on('call_failed', (data: { reason: string }) => {
            toast.error(`Llamada fallida: ${data.reason}`);
            setIsCalling(false);
            setActiveCallUser(null);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user?._id]);

    const markNotificationAsRead = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markNotificationAsReadLocal = (id: string) => {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllNotificationsAsRead = async () => {
        if (!user) return;
        try {
            await fetch(`${API_BASE_URL}/api/notifications/user/${user._id}/read-all`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessages(prev => prev.filter(msg => msg._id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    };

    const startCall = (targetId: string, targetName: string, offer: any) => {
        if (!socketRef.current || !user) return;

        setIsCalling(true);
        setActiveCallUser({ id: targetId, name: targetName });

        socketRef.current.emit('call_user', {
            to: targetId,
            offer: offer,
            from: user._id,
            fromName: `${user.nombre} ${user.apellidos}`
        });
    };

    const acceptCall = (fromId: string) => {
        setIncomingCall(null);
        setIsInCall(true);
    };

    const rejectCall = (fromId: string) => {
        if (!socketRef.current || !user) return;
        socketRef.current.emit('reject_call', { to: fromId, from: user._id });
        setIncomingCall(null);
    };

    const endCall = (targetId: string) => {
        if (!socketRef.current || !user) return;
        socketRef.current.emit('end_call', { to: targetId, from: user._id });
        setIsInCall(false);
        setIsCalling(false);
        setActiveCallUser(null);
        setIncomingCall(null);
    };

    return (
        <SocketContext.Provider value={{
            socket,
            incomingCall,
            user,
            notifications,
            messages,
            feed,
            unreadCount,
            isInCall,
            isCalling,
            activeCallUser,
            startCall,
            acceptCall,
            rejectCall,
            endCall,
            setInCall: setIsInCall,
            setCalling: setIsCalling,
            setActiveCallUser,
            setIncomingCall,
            setMessages,
            markNotificationAsRead,
            markNotificationAsReadLocal,
            markAllNotificationsAsRead,
            deleteMessage
        }}>
            {children}
        </SocketContext.Provider>
    );
};
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
