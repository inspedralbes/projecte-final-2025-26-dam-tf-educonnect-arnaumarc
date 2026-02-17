import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Bell, Settings, CreditCard, ChevronRight, Camera, Moon, Sun } from 'lucide-react';
import { MOCK_USER } from '../constants';

export const ProfileView: React.FC = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedImage = localStorage.getItem('user_profile_image');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                localStorage.setItem('user_profile_image', base64String);
                // Dispatch custom event to notify Navbar and other components
                window.dispatchEvent(new Event('profile_image_updated'));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-zinc-900 min-h-screen p-4 md:p-8 overflow-auto transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-indigo-500 border-4 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden bg-cover bg-center transition-all"
                            style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}>
                            {!profileImage && <User size={64} className="text-white" />}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-black dark:bg-white text-white dark:text-black p-2 rounded-full border-2 border-white dark:border-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-110 shadow-lg"
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
                        <h1 className="text-3xl font-black text-black dark:text-white transition-colors">{MOCK_USER.name}</h1>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-sm mt-1">{MOCK_USER.role}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden divide-x-4 divide-black dark:divide-white transition-all">
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{MOCK_USER.stats.courses}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Cursos</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{MOCK_USER.stats.average}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Promedio</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black dark:text-white">{MOCK_USER.stats.certificates}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Certificados</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Information Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-black dark:text-white ml-2 uppercase italic transition-colors">Información Personal</h2>
                        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden transition-all">
                            <ProfileItem icon={<User size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Nombre Completo" value={MOCK_USER.name} />
                            <ProfileItem icon={<Mail size={20} className="text-indigo-600 dark:text-indigo-400" />} label="Gmail" value={MOCK_USER.email} last />
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-black dark:text-white ml-2 uppercase italic transition-colors">Ajustes</h2>
                        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden transition-all">
                            <NotificationsDropdown />
                            <PreferencesDropdown />
                        </div>
                    </div>
                </div>

                {/* Support Button */}
                <button className="w-full bg-white dark:bg-zinc-800 border-4 border-black dark:border-white py-4 rounded-2xl font-black text-black dark:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none uppercase italic">
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
        <div className="border-b-2 border-gray-100 dark:border-zinc-700">
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
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t-2 border-gray-100 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200">
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

const PreferencesDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

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
                <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t-2 border-gray-100 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200 space-y-4">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white rounded-xl shadow-sm transition-colors">
                        <div className="flex items-center gap-2">
                            {isDarkMode ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">Modo Oscuro</span>
                        </div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-12 h-6 rounded-full border-2 border-black dark:border-white flex items-center transition-all p-1 shadow-sm ${isDarkMode ? 'bg-black justify-end' : 'bg-gray-200 justify-start'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full border border-black dark:border-white ${isDarkMode ? 'bg-white' : 'bg-white'}`}></div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileItem = ({ icon, label, value, last }: { icon: React.ReactNode, label: string, value: string, last?: boolean }) => (
    <div className={`p-4 flex items-center space-x-4 ${!last ? 'border-b-2 border-gray-100 dark:border-zinc-700' : ''} transition-colors`}>
        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-700 flex items-center justify-center border-2 border-gray-200 dark:border-zinc-600 transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">{label}</p>
            <p className="text-sm font-bold text-black dark:text-white transition-colors">{value}</p>
        </div>
    </div>
);
