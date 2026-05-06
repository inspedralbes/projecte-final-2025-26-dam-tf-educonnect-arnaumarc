import React from 'react';
import { useSocket, NotificationData } from '../src/context/SocketContext';
import { Bell, Check, Clock, X, ExternalLink, Calendar, BookOpen, MessageSquare, Info } from 'lucide-react';

interface NotificationPanelProps {
    onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useSocket();

    const getTypeDetails = (type: NotificationData['type']) => {
        switch (type) {
            case 'EXAM': return { 
                icon: <Calendar size={18} className="text-rose-500" />, 
                label: 'Examen', 
                color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
                border: 'border-rose-500'
            };
            case 'MATERIAL': return { 
                icon: <BookOpen size={18} className="text-blue-500" />, 
                label: 'Material', 
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                border: 'border-blue-500'
            };
            case 'MESSAGE': return { 
                icon: <MessageSquare size={18} className="text-green-500" />, 
                label: 'Mensaje', 
                color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                border: 'border-green-500'
            };
            case 'ANNOUNCEMENT': return { 
                icon: <Info size={18} className="text-amber-500" />, 
                label: 'Aviso', 
                color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                border: 'border-amber-500'
            };
            default: return { 
                icon: <Bell size={18} className="text-gray-500" />, 
                label: 'Sistema', 
                color: 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400',
                border: 'border-gray-500'
            };
        }
    };

    return (
        <div className="absolute top-16 right-4 w-80 md:w-96 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Notificaciones</h3>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
                        {unreadCount} sin leer
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button 
                            onClick={() => markAllNotificationsAsRead()}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                            title="Marcar todo como leído"
                        >
                            <Check size={18} />
                        </button>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-400">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {notifications.map((notif) => {
                            const details = getTypeDetails(notif.type);
                            return (
                                <div 
                                    key={notif._id} 
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors relative group ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                >
                                    {/* Lateral bar for color coding */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${details.border} border-l-4 opacity-70`} />
                                    
                                    <div className="flex gap-4 pl-1">
                                        <div className="mt-1">
                                            {details.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${details.color} w-fit`}>
                                                        {details.label}
                                                    </span>
                                                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {notif.title}
                                                    </h4>
                                                </div>
                                                {!notif.read && (
                                                    <button 
                                                        onClick={() => markNotificationAsRead(notif._id)}
                                                        className="w-2 h-2 rounded-full bg-blue-600 animate-pulse flex-shrink-0 mt-1"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                                                {notif.content}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                                    <Clock size={10} />
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </div>
                                                {notif.link && (
                                                    <button className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                                        Ir <ExternalLink size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-zinc-700">
                            <Bell size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Todo al día</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 text-center">
                <button className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Ver historial completo
                </button>
            </div>
        </div>
    );
};
