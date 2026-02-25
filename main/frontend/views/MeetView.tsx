import React, { useState } from 'react';
import { Video, Phone, User as UserIcon, X, Mic, MicOff, VideoOff, MonitorUp } from 'lucide-react';

interface MockUser {
    id: string;
    name: string;
    role: 'Student' | 'Teacher';
    isOnline: boolean;
    avatar?: string;
}

const MOCK_USERS: MockUser[] = [
    { id: '1', name: 'Dr. Roberto Martínez', role: 'Teacher', isOnline: true },
    { id: '2', name: 'Ana Gómez', role: 'Student', isOnline: true },
    { id: '3', name: 'Carlos Ruiz', role: 'Student', isOnline: false },
    { id: '4', name: 'Elena Foix', role: 'Teacher', isOnline: true },
];

export const MeetView: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
    const [isInCall, setIsInCall] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (isInCall && videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [isInCall, localStream]);

    const startCall = async (user: MockUser) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            setSelectedUser(user);
            setIsInCall(true);
            setIsMuted(false);
            setIsVideoOff(false);
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("No se pudo acceder a la cámara o micrófono. Por favor, verifica los permisos.");
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setIsInCall(false);
        setSelectedUser(null);
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="flex h-full w-full bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
            {/* Sidebar - User List */}
            <div className="w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col shadow-sm z-10">
                <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserIcon className="text-blue-500" size={20} />
                        Usuarios Conectados
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {MOCK_USERS.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${user.isOnline ? 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5' : 'bg-gray-50 dark:bg-zinc-800/20 border-transparent opacity-70'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => startCall(user)}
                                disabled={!user.isOnline}
                                className={`p-2.5 rounded-full transition-all ${user.isOnline
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                                    }`}
                            >
                                <Video size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area - Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {isInCall && selectedUser ? (
                    <div className="w-full max-w-4xl bg-black/95 rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex flex-col ring-1 ring-white/10 animate-in zoom-in-95 duration-500">
                        {/* Remote Video Placeholder */}
                        <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-zinc-800 to-zinc-900">
                            <div className="text-center animate-in fade-in duration-700">
                                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl font-bold text-white shadow-lg ring-4 ring-white/10">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{selectedUser.name}</h3>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-green-400 text-sm font-medium">Conectado</p>
                                </div>
                            </div>

                            {/* Local Video Placeholder (Real Stream) */}
                            <div className="absolute bottom-6 right-6 w-48 h-36 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl ring-2 ring-white/20 transition-all hover:scale-105 duration-300">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 text-zinc-400">
                                        <VideoOff size={24} className="mb-2" />
                                        <p className="text-xs font-medium">Cámara apagada</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="h-24 bg-zinc-900/90 backdrop-blur-md flex items-center justify-center space-x-4 px-8 border-t border-white/5">
                            <div className="flex items-center space-x-4 bg-zinc-800/80 p-2 rounded-full">
                                <button
                                    onClick={toggleMute}
                                    className={`p-3.5 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                >
                                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`p-3.5 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                >
                                    {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                                </button>

                                <button className="p-3.5 rounded-full bg-transparent hover:bg-white/10 text-white transition-colors">
                                    <MonitorUp size={22} />
                                </button>
                            </div>

                            <button
                                onClick={endCall}
                                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-105 shadow-lg shadow-red-900/20 ml-4"
                            >
                                <Phone size={24} className="transform rotate-135" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6 opacity-75">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-gray-400 dark:text-zinc-600">
                            <Video size={64} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">EduConnect Meet</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Selecciona un usuario de la lista lateral para iniciar una videollamada de alta calidad.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
