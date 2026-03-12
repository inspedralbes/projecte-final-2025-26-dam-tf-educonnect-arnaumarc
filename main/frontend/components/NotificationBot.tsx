import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { User, AppView } from '../types';
import { Bell, Video, X } from 'lucide-react';

import { API_BASE_URL } from '../config';

interface NotificationBotProps {
    user: User | null;
    currentView?: AppView;
    setView?: (view: AppView) => void;
}

export const NotificationBot: React.FC<NotificationBotProps> = ({ user, currentView, setView }) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user) return;

        // Initialize connection
        socketRef.current = io(API_BASE_URL || window.location.origin);

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Notification Bot connected:', socket.id);
            socket.emit('register_user', user._id);
        });

        // Global Incoming Call Handler
        socket.on('incoming_call', (data: { from: string, fromName: string, offer: any }) => {
            console.log('Global incoming call detection:', data);
            
            // If the user is already in MeetView, we let MeetView handle it
            if (currentView === AppView.MEET) return;

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-indigo-600 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-white/20 p-4 text-white overflow-hidden relative group`}
                >
                    <div className="flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                            <Video className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Llamada entrante</p>
                            <p className="text-lg font-black">{data.fromName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                if (setView) setView(AppView.MEET);
                            }}
                                    className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Responder
                        </button>
                    </div>
                    {/* Animated background bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink-width" style={{ animationDuration: '10s' }} />
                </div>
            ), { duration: 10000 });
        });

        socket.on('new_notification', (data: { title: string, content: string, courseId?: string, isPrivate?: boolean }) => {
            // Existing notification logic...
            console.log('Received real-time notification:', data);

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white dark:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-4 border-black dark:border-white pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Bell className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                                    {data.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    {data.content}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l-4 border-black dark:border-white">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none border-l flex items-center justify-center font-bold text-gray-600 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-700 px-4 transition-colors uppercase"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
        });

        socket.on('disconnect', () => {
            console.log('Notification Bot disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [user, currentView, setView]);

    return null;
};
