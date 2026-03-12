import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, AppView } from '../types';
import { Video, X } from 'lucide-react';
import { useSocket } from '../src/context/SocketContext';

interface NotificationBotProps {
    user: User | null;
    currentView?: AppView;
    setView?: (view: AppView) => void;
}

export const NotificationBot: React.FC<NotificationBotProps> = ({ user, currentView, setView }) => {
    const { incomingCall, setIncomingCall } = useSocket();

    useEffect(() => {
        if (!user || !incomingCall) return;

        // If the user is already in MeetView, we let MeetView handle it
        if (currentView === AppView.MEET) return;

        console.log('Global incoming call detection via context:', incomingCall);
        
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
                        <p className="text-lg font-black">{incomingCall.fromName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            setIncomingCall(null);
                        }}
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

    }, [user, currentView, setView, incomingCall, setIncomingCall]);

    return null;
};
