import React, { useState, useEffect, useRef } from 'react';
import { Video, Phone, User as UserIcon, X, Mic, MicOff, VideoOff, MonitorUp, PhoneOff, PhoneIncoming } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { io, Socket } from 'socket.io-client';
import { User } from '../types';
import toast from 'react-hot-toast';

interface MockUser {
    id: string;
    name: string;
    role: 'Student' | 'Teacher';
    isOnline: boolean;
    avatar?: string;
}

interface MeetViewProps {
    user: User | null;
}

export const MeetView: React.FC<MeetViewProps> = ({ user }) => {
    const [users, setUsers] = useState<MockUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
    const [isInCall, setIsInCall] = useState(false);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [incomingCallData, setIncomingCallData] = useState<any>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const cleanupCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        // Use ref for local stream to avoid stale closure in useEffect cleanup
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
        setIsInCall(false);
        setIsCalling(false);
        setIsIncomingCall(false);
        setIncomingCallData(null);
        setSelectedUser(null);
    };

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    useEffect(() => {
        // Initialize socket
        socketRef.current = io(API_BASE_URL || window.location.origin);
        const socket = socketRef.current;

        if (user) {
            socket.emit('register_user', user._id);
        }

        socket.on('incoming_call', (data) => {
            setIncomingCallData(data);
            setIsIncomingCall(true);
        });

        socket.on('call_answered', async (data) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                setIsCalling(false);
                setIsInCall(true);
            }
        });

        socket.on('ice_candidate', async (data) => {
            if (peerConnection.current) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (e) {
                    console.error("Error adding ice candidate:", e);
                }
            }
        });

        socket.on('call_rejected', () => {
            toast.error("Llamada rechazada");
            cleanupCall();
        });

        socket.on('call_ended', () => {
            toast("Llamada finalizada");
            cleanupCall();
        });

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/all-users`);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const formattedUsers = data
                        .filter(u => u._id !== user?._id) // Don't show myself
                        .map((user: any) => ({
                            id: user._id,
                            name: `${user.nombre} ${user.apellidos}`,
                            role: user.role === 'Student' ? 'Student' : 'Teacher',
                            isOnline: true, // Simplified
                            avatar: user.profileImage
                        }));
                    setUsers(formattedUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();

        return () => {
            socket.disconnect();
            cleanupCall();
        };
    }, [user]);

    useEffect(() => {
        if (isInCall && videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
        if (isInCall && remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [isInCall, localStream, remoteStream]);

    const createPeerConnection = (targetUserId: string) => {
        const pc = new RTCPeerConnection(iceServers);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice_candidate', {
                    to: targetUserId,
                    candidate: event.candidate,
                    from: user?._id
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        if (localStream) {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        peerConnection.current = pc;
        return pc;
    };

    const startCall = async (targetUser: MockUser) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;
            setSelectedUser(targetUser);
            setIsCalling(true);

            const pc = createPeerConnection(targetUser.id);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socketRef.current?.emit('call_user', {
                to: targetUser.id,
                offer: offer,
                from: user?._id,
                fromName: `${user?.nombre} ${user?.apellidos}`
            });
        } catch (error) {
            console.error("Error starting call:", error);
            toast.error("No se pudo acceder a la cámara o micrófono");
        }
    };

    const acceptCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;
            setIsIncomingCall(false);
            setIsInCall(true);
            
            // Set selected user to the caller
            const caller = users.find(u => u.id === incomingCallData.from) || {
                id: incomingCallData.from,
                name: incomingCallData.fromName,
                role: 'Student' as const,
                isOnline: true
            };
            setSelectedUser(caller);

            const pc = createPeerConnection(incomingCallData.from);
            await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.offer));
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketRef.current?.emit('answer_call', {
                to: incomingCallData.from,
                answer: answer,
                from: user?._id
            });
        } catch (error) {
            console.error("Error accepting call:", error);
            cleanupCall();
        }
    };

    const rejectCall = () => {
        socketRef.current?.emit('reject_call', {
            to: incomingCallData.from,
            from: user?._id
        });
        setIsIncomingCall(false);
        setIncomingCallData(null);
    };

    const endCall = () => {
        const targetId = selectedUser?.id || incomingCallData?.from;
        if (targetId) {
            socketRef.current?.emit('end_call', { to: targetId, from: user?._id });
        }
        cleanupCall();
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
        <div className="flex h-full w-full bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 relative overflow-hidden">
            {/* Incoming Call Overlay */}
            {isIncomingCall && incomingCallData && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 relative">
                            <UserIcon className="text-blue-600 dark:text-blue-400" size={40} />
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{incomingCallData.fromName}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2">
                            <PhoneIncoming size={16} className="animate-bounce" />
                            Llamada entrante...
                        </p>
                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={rejectCall}
                                className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <X size={20} /> Rechazar
                            </button>
                            <button 
                                onClick={acceptCall}
                                className="flex-1 bg-green-500 text-white hover:bg-green-600 py-3 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Video size={20} /> Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calling State Overlay */}
            {isCalling && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Phone className="text-blue-500 animate-pulse" size={32} />
                        </div>
                        <p className="text-gray-900 dark:text-white font-bold mb-4">Llamando a {selectedUser?.name}...</p>
                        <button 
                            onClick={endCall}
                            className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-all"
                        >
                            <PhoneOff size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar - User List */}
            <div className="w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col shadow-sm z-10">
                <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserIcon className="text-blue-500" size={20} />
                        Usuarios Conectados
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading ? (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">Cargando usuarios...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">No hay otros usuarios disponibles.</div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u.id}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${u.id === selectedUser?.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        {u.avatar ? (
                                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-zinc-700" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${u.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => startCall(u)}
                                    disabled={isInCall || isCalling || isIncomingCall}
                                    className={`p-2.5 rounded-full transition-all ${!isInCall && !isCalling && !isIncomingCall
                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                                        }`}
                                >
                                    <Video size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Area - Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {isInCall && selectedUser ? (
                    <div className="w-full h-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-2xl relative flex flex-col ring-1 ring-white/10 animate-in zoom-in-95 duration-500">
                        {/* Remote Video */}
                        <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
                            {remoteStream ? (
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center flex flex-col items-center animate-in fade-in duration-700">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-6 text-5xl font-bold text-white shadow-lg ring-4 ring-white/10">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{selectedUser.name}</h3>
                                    <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        Conectando medios...
                                    </p>
                                </div>
                            )}

                            {/* Remote User Label */}
                            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <p className="text-white text-sm font-semibold">{selectedUser.name}</p>
                            </div>

                            {/* Local Video Picture-in-Picture */}
                            <div className="absolute bottom-6 right-6 w-48 aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl ring-2 ring-white/20 transition-all hover:scale-105 duration-300 z-10">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 text-zinc-400">
                                        <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                                            <VideoOff size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="h-28 bg-zinc-900/90 backdrop-blur-md flex items-center justify-center space-x-6 px-8 border-t border-white/5">
                            <div className="flex items-center space-x-4 bg-zinc-800/80 p-2.5 rounded-full border border-white/5">
                                <button
                                    onClick={toggleMute}
                                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                >
                                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                                </button>

                                <button className="p-4 rounded-full bg-transparent hover:bg-white/10 text-white transition-colors">
                                    <MonitorUp size={24} />
                                </button>
                            </div>

                            <button
                                onClick={endCall}
                                className="p-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-110 shadow-xl shadow-red-900/20 active:scale-95"
                            >
                                <PhoneOff size={28} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-500 shadow-inner">
                            <Video size={64} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">EduConnect Meet</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg">
                                Colabora en tiempo real con alumnos y profesores. Selecciona un contacto para iniciar una videollamada.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
