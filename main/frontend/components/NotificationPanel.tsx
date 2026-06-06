import { Bell, Check, Clock, X, ExternalLink, Calendar, BookOpen, MessageSquare, Info, UserPlus, Phone, GraduationCap, Trash2, Award } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { AppView } from '../types';
import { useSocket, NotificationData } from '../src/context/SocketContext';
import toast from 'react-hot-toast';

interface NotificationPanelProps {
    onClose: () => void;
    onViewHistory?: () => void;
    setView?: (view: AppView) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, onViewHistory, setView }) => {
    const { user, notifications, unreadCount, markNotificationAsRead, markNotificationAsReadLocal, markAllNotificationsAsRead, deleteNotification } = useSocket();

    const handleNotificationClick = (notif: any) => {
        if (!notif.read) {
            markNotificationAsRead(notif._id);
        }

        if (notif.link && setView) {
            try {
                // Parse link: /asignaturas?courseId=ID&topicId=ID&resourceId=ID
                const url = new URL(notif.link, window.location.origin);
                const path = url.pathname;

                if (path.includes('asignaturas')) {
                    const courseId = url.searchParams.get('courseId');
                    const topicId = url.searchParams.get('topicId');
                    const resourceId = url.searchParams.get('resourceId');
                    const eventId = url.searchParams.get('eventId');

                    if (courseId) {
                        localStorage.setItem('selectedCourse', courseId);
                        if (topicId || resourceId || eventId) {
                            localStorage.setItem('deepLinkData', JSON.stringify({ topicId, resourceId, eventId }));
                        }
                    }
                    setView(AppView.ASIGNATURAS);
                } else if (path.includes('perfil')) {
                    setView(AppView.PROFILE);
                } else if (path.includes('meet')) {
                    setView(AppView.MEET);
                } else if (path.includes('tablon')) {
                    setView(AppView.TABLON);
                } else if (path.includes('historial')) {
                    setView(AppView.ACTIVITY_HISTORY);
                }
                onClose();
            } catch (e) {
                console.error('Error handling notification click', e);
            }
        }
    };

    const handleInviteAction = async (notifId: string, action: 'accept' | 'reject') => {
        if (!user) return;
        
        const loadingToast = toast.loading(action === 'accept' ? 'Aceptando invitación...' : 'Rechazando invitación...');
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications/${notifId}/respond`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action, userId: user._id })
            });
            const data = await res.json();
            
            toast.dismiss(loadingToast);
            
            if (res.ok && data?.success) {
                markNotificationAsReadLocal(notifId);
                if (action === 'accept') {
                    toast.success(data.message || '¡Inscripción completada con éxito!');
                    // Trigger a refresh or redirect if needed
                } else {
                    toast.success(data.message || 'Invitación rechazada');
                }
            } else {
                toast.error(data.message || 'Error al procesar la invitación');
            }
        } catch (e) {
            toast.dismiss(loadingToast);
            toast.error('Error de conexión al procesar la invitación');
            console.error('Error handling invite', e);
        }
    };

    const getTypeDetails = (notif: NotificationData) => {
        switch (notif.type) {
            case 'COURSE_INVITE':
                return {
                    icon: <UserPlus size={18} className="text-indigo-500" />,
                    label: 'Invitación',
                    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
                    border: 'border-indigo-500'
                };
            case 'MATERIAL':
                return {
                    icon: <BookOpen size={18} className="text-blue-500" />,
                    label: 'Material',
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    border: 'border-blue-500'
                };
            case 'EXAM':
                return {
                    icon: <GraduationCap size={18} className="text-red-500" />,
                    label: 'Examen',
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    border: 'border-red-500'
                };
            case 'MESSAGE':
            case 'MEET_MESSAGE':
                return {
                    icon: <MessageSquare size={18} className="text-green-500" />,
                    label: 'Mensaje',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    border: 'border-green-500'
                };
            case 'MEET_CALL':
                return {
                    icon: <Phone size={18} className="text-green-500 animate-bounce" />,
                    label: 'Llamada',
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    border: 'border-green-500'
                };
            case 'PROFESSOR_ADVISORY':
                return {
                    icon: <Award size={18} className="text-amber-500" />,
                    label: 'Aviso Prof.',
                    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                    border: 'border-amber-500'
                };
            case 'ANNOUNCEMENT':
                return {
                    icon: <Info size={18} className="text-blue-500" />,
                    label: 'Anuncio',
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    border: 'border-blue-500'
                };
            default:
                return {
                    icon: <Bell size={18} className="text-gray-500" />,
                    label: 'Notificación',
                    color: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400',
                    border: 'border-gray-400'
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
                            const details = getTypeDetails(notif);
                            return (
                                <div 
                                    key={notif._id} 
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors relative group cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
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
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-sm font-bold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                            {notif.title}
                                                        </h4>
                                                        {notif.count && notif.count > 1 && (
                                                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                                                +{notif.count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {!notif.read && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markNotificationAsRead(notif._id);
                                                            }}
                                                            className="w-2 h-2 rounded-full bg-blue-600 animate-pulse flex-shrink-0 mt-1"
                                                        />
                                                    )}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notif._id);
                                                        }}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Eliminar notificación"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                                                {notif.content}
                                            </p>

                                            {notif.type === 'COURSE_INVITE' && !notif.read && user && (
                                                <div className="flex gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleInviteAction(notif._id, 'accept')}
                                                        className="flex-1 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-xs uppercase tracking-wider"
                                                    >
                                                        Aceptar
                                                    </button>
                                                    <button
                                                        onClick={() => handleInviteAction(notif._id, 'reject')}
                                                        className="flex-1 py-2 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-xs uppercase tracking-wider"
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                                    <Clock size={10} />
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </div>
                                                {notif.link && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNotificationClick(notif);
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline"
                                                    >
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
                <button 
                    onClick={onViewHistory}
                    className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    Ver historial completo
                </button>
            </div>
        </div>
    );
};
