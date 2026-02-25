import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Bell, Settings, CreditCard, ChevronRight, Camera, Moon, Sun } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { User as UserType } from '../types';

interface ProfileViewProps {
    user: UserType | null;
    onUpdateUser: (user: UserType) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
    const displayName = user ? `${user.nombre} ${user.apellidos}` : MOCK_USER.name;
    const displayEmail = user ? user.email : MOCK_USER.email;
    const displayRole = user ? (user.type === 'professor' ? 'Profesor' : 'Alumno') : MOCK_USER.role;
    const displayClass = user?.clase || 'N/A';
    const displaySpecialty = user?.especialidad || 'N/A';
    const profileImage = user?.profileImage || null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // No longer needed to load from localStorage as it's in the user prop
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                try {
                    const response = await fetch(`http://localhost:3005/api/user/${user._id}/settings`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profileImage: base64String })
                    });
                    const data = await response.json();
                    if (data.success) {
                        onUpdateUser({ ...user, profileImage: base64String });
                        window.dispatchEvent(new Event('profile_image_updated'));
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-zinc-900 min-h-screen p-4 md:p-8 overflow-auto transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group mt-4">
                        <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-white dark:border-zinc-800 flex items-center justify-center shadow-xl overflow-hidden bg-cover bg-center transition-all ring-4 ring-indigo-50 dark:ring-indigo-900/20"
                            style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}>
                            {!profileImage && <User size={64} className="text-indigo-300 dark:text-indigo-600" />}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-md border-2 border-white dark:border-zinc-900"
                        >
                            <Camera size={16} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept=".jpg,.jpeg,.png"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-black dark:text-white transition-colors">{displayName}</h1>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-sm mt-1">{displayRole}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-lg overflow-hidden divide-x divide-gray-200 dark:divide-zinc-700 transition-all">
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{user?.enrolledCourses?.length || 0}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Cursos</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{user?.type === 'alumno' ? '8.5' : '--'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Promedio</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{user?.type === 'alumno' ? '4' : '--'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Certificados</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Information Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-2 tracking-wide transition-colors">Información Personal</h2>
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-md overflow-hidden transition-all">
                            <ProfileItem icon={<User size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Nombre Completo" value={displayName} />
                            <ProfileItem icon={<Mail size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Gmail" value={displayEmail} />
                            {user?.type === 'alumno' ? (
                                <ProfileItem icon={<Settings size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Clase" value={displayClass} last />
                            ) : (
                                <ProfileItem icon={<Settings size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Especialidad" value={displaySpecialty} last />
                            )}
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-2 tracking-wide transition-colors">Ajustes</h2>
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-md overflow-hidden transition-all">
                            <NotificationsDropdown />
                            <PreferencesDropdown user={user} onUpdateUser={onUpdateUser} />
                        </div>
                    </div>
                </div>

                {/* Support Button */}
                <button className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 py-4 rounded-2xl font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-600 transition-all uppercase tracking-wider text-sm">
                    Contactar Soporte
                </button>
            </div>
        </div>
    );
};

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Entrega Projecte Final mañana", type: "urgent" },
        { id: 2, text: "Nueva nota publicada: M07", type: "info" }
    ]);
    const [activeCount, setActiveCount] = useState(2);

    const markAsRead = () => {
        setActiveCount(0);
        // In a real app, this would update the backend
    };

    return (
        <div className="border-b-2 border-gray-200 dark:border-zinc-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-700 flex items-center justify-center border-2 border-gray-200 dark:border-zinc-600 relative transition-colors">
                        <Bell size={20} className="text-amber-500" />
                        {activeCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white dark:border-zinc-800 animate-pulse"></span>
                        )}
                    </div>
                    <span className="text-sm font-black text-black dark:text-white uppercase transition-colors">Notificaciones</span>
                </div>
                <ChevronRight size={20} className={`text-gray-300 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t-2 border-gray-200 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">Recientes</p>
                        {activeCount > 0 && (
                            <button
                                onClick={markAsRead}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase underline"
                            >
                                Marcar como leídas
                            </button>
                        )}
                    </div>
                    {notifications.length > 0 ? (
                        <ul className="space-y-2">
                            {notifications.map((notif) => (
                                <li key={notif.id} className={`text-xs font-bold text-black dark:text-white flex items-center gap-2 ${activeCount === 0 ? 'opacity-50' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full ${notif.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                    {notif.text}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">No tienes notificaciones nuevas.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const PreferencesDropdown = ({ user, onUpdateUser }: { user: UserType | null, onUpdateUser: (user: UserType) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDarkMode = user?.theme === 'dark';

    const toggleDarkMode = async () => {
        if (!user) return;
        const newTheme = isDarkMode ? 'light' : 'dark';

        try {
            const response = await fetch(`http://localhost:3005/api/user/${user._id}/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
            });
            const data = await response.json();
            if (data.success) {
                onUpdateUser({ ...user, theme: newTheme });
            }
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    };


    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-700 flex items-center justify-center border-2 border-gray-200 dark:border-zinc-600 transition-colors">
                        <Settings size={20} className="text-gray-500 dark:text-zinc-400" />
                    </div>
                    <span className="text-sm font-black text-black dark:text-white uppercase transition-colors">Preferencias</span>
                </div>
                <ChevronRight size={20} className={`text-gray-300 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t-2 border-gray-200 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm transition-colors">
                        <div className="flex items-center gap-3">
                            {isDarkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Modo Oscuro</span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-12 h-6 rounded-full flex items-center transition-all p-1 shadow-inner ${isDarkMode ? 'bg-indigo-600 justify-end' : 'bg-gray-300 dark:bg-zinc-600 justify-start'}`}
                        >
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileItem = ({ icon, label, value, last }: { icon: React.ReactNode, label: string, value: string, last?: boolean }) => (
    <div className={`p-4 flex items-center space-x-4 ${!last ? 'border-b border-gray-50 dark:border-zinc-700/50' : ''} transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-700/30`}>
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">{label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors">{value}</p>
        </div>
    </div>
);
