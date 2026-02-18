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
            <div className="w-80 bg-white dark:bg-zinc-800 border-r-4 border-black dark:border-zinc-700 flex flex-col">
                <div className="p-4 border-b-2 border-black dark:border-zinc-700">
                    <h2 className="text-xl font-bold dark:text-white">Usuarios Conectados</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {MOCK_USERS.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-zinc-700 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <div>
                                    <p className="font-bold text-sm dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => startCall(user)}
                                disabled={!user.isOnline}
                                className={`p-2 rounded-full ${user.isOnline
                                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-zinc-600 dark:text-zinc-500'
                                    }`}
                            >
                                <Video size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area - Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {isInCall && selectedUser ? (
                    <div className="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 relative aspect-video flex flex-col">
                        {/* Remote Video Placeholder */}
                        <div className="flex-1 bg-zinc-800 flex items-center justify-center relative">
                            <div className="text-center">
                                <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-white border-4 border-white">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{selectedUser.name}</h3>
                                <p className="text-green-400 animate-pulse">Conectado...</p>
                            </div>

                            {/* Local Video Placeholder (Real Stream) */}
                            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border-2 border-white/20 flex items-center justify-center overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                                />
                                {isVideoOff && <p className="text-white text-xs">Cámara apagada</p>}
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="h-20 bg-zinc-900 flex items-center justify-center space-x-6 border-t border-zinc-700">
                            <button
                                onClick={toggleMute}
                                className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <button
                                onClick={toggleVideo}
                                className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
                            >
                                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                            </button>

                            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                                <MonitorUp size={24} />
                            </button>

                            <button
                                onClick={endCall}
                                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors ml-8"
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
