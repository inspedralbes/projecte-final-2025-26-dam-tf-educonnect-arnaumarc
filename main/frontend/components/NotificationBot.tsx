import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { User, AppView } from '../types';
import { Bell } from 'lucide-react';

interface NotificationBotProps {
    user: User | null;
    setView: (view: AppView) => void;
    globalSocket: Socket | null;
}

export const NotificationBot: React.FC<NotificationBotProps> = ({ user, setView, globalSocket }) => {

    useEffect(() => {
        if (!user || user.type !== 'alumno' || !globalSocket) return;

        const handleNewNotification = (data: { title: string, content: string, courseId?: string, isPrivate?: boolean }) => {
            console.log('Received real-time notification:', data);

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-4 border-black dark:border-white pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative`}
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
        };

        globalSocket.on('new_notification', handleNewNotification);

        return () => {
            globalSocket.off('new_notification', handleNewNotification);
        };
    }, [user, globalSocket]);

    return null;
};
