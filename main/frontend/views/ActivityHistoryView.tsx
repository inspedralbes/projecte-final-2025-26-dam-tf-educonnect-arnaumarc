import React, { useState } from 'react';
import { useSocket, NotificationData } from '../src/context/SocketContext';
import { User } from '../types';
import { Bell, Search, Filter, Clock, CheckCircle2, AlertCircle, MessageSquare, Phone, BookOpen, Calendar, Info } from 'lucide-react';

interface ActivityHistoryViewProps {
    user: User | null;
}

export const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({ user }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useSocket();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ACADEMIC' | 'MEET'>('ALL');

    const filteredNotifications = notifications.filter(n => {
        // Search filter
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             n.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        let matchesCategory = true;
        if (filter === 'UNREAD') matchesCategory = !n.read;
        else if (filter === 'ACADEMIC') matchesCategory = ['MATERIAL', 'EXAM', 'ANNOUNCEMENT'].includes(n.type);
        else if (filter === 'MEET') matchesCategory = ['MEET_CALL', 'MEET_MESSAGE'].includes(n.type);

        return matchesSearch && matchesCategory;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'EXAM': return <Calendar className="text-rose-500" />;
            case 'MATERIAL': return <BookOpen className="text-blue-500" />;
            case 'MEET_CALL': return <Phone className="text-blue-600" />;
            case 'MEET_MESSAGE': return <MessageSquare className="text-blue-600" />;
            case 'MESSAGE': return <MessageSquare className="text-green-500" />;
            case 'ANNOUNCEMENT': return <Info className="text-amber-500" />;
            default: return <Bell className="text-gray-400" />;
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-zinc-950 p-4 md:p-8 overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <Clock className="text-blue-600" size={32} />
                            Historial de Actividad
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">Gestiona todos tus avisos y eventos recientes.</p>
                    </div>
                    <button 
                        onClick={markAllNotificationsAsRead}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 w-fit"
                    >
                        <CheckCircle2 size={20} />
                        Marcar todo como leído
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar en notificaciones..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl border-transparent focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {(['ALL', 'UNREAD', 'ACADEMIC', 'MEET'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    filter === f 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200'
                                }`}
                            >
                                {f === 'ALL' ? 'Todo' : f === 'UNREAD' ? 'Pendientes' : f === 'ACADEMIC' ? 'Académico' : 'Meet'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notif => (
                            <div 
                                key={notif._id}
                                className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                                    notif.read 
                                        ? 'bg-white/50 dark:bg-zinc-900/30 border-gray-100 dark:border-zinc-800 grayscale opacity-60' 
                                        : 'bg-white dark:bg-zinc-900 border-blue-100 dark:border-blue-900/20 shadow-sm hover:shadow-md'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                    notif.read ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-blue-50 dark:bg-blue-900/20'
                                }`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{notif.title}</h4>
                                        {notif.count && notif.count > 1 && (
                                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-black">
                                                +{notif.count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">{notif.content}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                    {!notif.read && (
                                        <button 
                                            onClick={() => markNotificationAsRead(notif._id)}
                                            className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest hover:underline"
                                        >
                                            Leer
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-zinc-700">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sin resultados</h3>
                            <p className="text-gray-500 dark:text-gray-400">No se encontraron notificaciones con los filtros actuales.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
