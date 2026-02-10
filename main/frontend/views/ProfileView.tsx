import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Bell, Settings, CreditCard, ChevronRight, Camera } from 'lucide-react';

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
        <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-indigo-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-cover bg-center"
                            style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}>
                            {!profileImage && <User size={64} className="text-white" />}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-gray-800 transition-all transform hover:scale-110 shadow-lg"
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
                        <h1 className="text-3xl font-black text-black">Arnau Perera</h1>
                        <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mt-1">Estudiante Premium</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden divide-x-4 divide-black">
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black">12</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Cursos</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black">85%</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Promedio</span>
                    </div>
                    <div className="py-6 flex flex-col items-center">
                        <span className="text-2xl font-black">4</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Certificados</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Information Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-black ml-2 uppercase italic">Información Personal</h2>
                        <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <ProfileItem icon={<Mail size={20} className="text-indigo-600" />} label="Email" value="arnau.marc@educonnect.com" />
                            <ProfileItem icon={<Shield size={20} className="text-indigo-600" />} label="Seguridad" value="Verificada" last />
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-black ml-2 uppercase italic">Ajustes</h2>
                        <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <ActionItem icon={<Bell size={20} className="text-amber-500" />} label="Notificaciones" />
                            <ActionItem icon={<CreditCard size={20} className="text-emerald-500" />} label="Suscripción" />
                            <ActionItem icon={<Settings size={20} className="text-gray-500" />} label="Preferencias" last />
                        </div>
                    </div>
                </div>

                {/* Support Button */}
                <button className="w-full bg-white border-4 border-black py-4 rounded-2xl font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none uppercase italic">
                    Contactar Soporte
                </button>
            </div>
        </div>
    );
};

const ProfileItem = ({ icon, label, value, last }: { icon: React.ReactNode, label: string, value: string, last?: boolean }) => (
    <div className={`p-4 flex items-center space-x-4 ${!last ? 'border-b-2 border-gray-100' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border-2 border-gray-200">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-black">{value}</p>
        </div>
    </div>
);

const ActionItem = ({ icon, label, last }: { icon: React.ReactNode, label: string, last?: boolean }) => (
    <button className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${!last ? 'border-b-2 border-gray-100' : ''}`}>
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border-2 border-gray-200">
                {icon}
            </div>
            <span className="text-sm font-black text-black uppercase">{label}</span>
        </div>
        <ChevronRight size={20} className="text-gray-300" />
    </button>
);
