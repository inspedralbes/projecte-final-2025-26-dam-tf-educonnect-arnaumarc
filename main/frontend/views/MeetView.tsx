import React, { useState, useEffect, useRef } from 'react';
import { Video, Phone, User as UserIcon, X, Mic, MicOff, VideoOff, MonitorUp } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { User, AppView } from '../types';
import toast from 'react-hot-toast';

interface MeetViewProps {
    currentUser?: User | null;
    globalSocket?: Socket | null;
    acceptedCall?: any | null;
    clearAcceptedCall?: () => void;
}

interface StudentUser {
    _id: string;
    nombre: string;
    apellidos: string;
    role: string;
    isOnline: boolean;
}

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

export const MeetView: React.FC<MeetViewProps> = ({ currentUser, globalSocket, acceptedCall, clearAcceptedCall }) => {
    const [users, setUsers] = useState<StudentUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<StudentUser | null>(null);
    const [isInCall, setIsInCall] = useState(false);
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        if (!globalSocket) return;
        socketRef.current = globalSocket;

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3005/api/all-users');
                const data = await response.json();

                const mappedUsers = data
                    .filter((u: any) => u._id !== currentUser?._id)
                    .map((u: any) => ({
                        ...u,
                        role: u.type === 'professor' ? 'Teacher' : 'Student',
                        isOnline: false
                    }));
                setUsers(mappedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();

        const handleOnlineUsers = (onlineUserIds: string[]) => {
            setUsers(prev => prev.map(u => ({
                ...u,
                isOnline: onlineUserIds.includes(u._id)
            })));
        };

        const handleAnswerMade = async (data: any) => {
            console.log("Answer received");
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        };

        const handleCallRejected = () => {
            endCall();
            toast.error("La llamada ha sido rechazada.");
        };

        const handleIceCandidate = (data: any) => {
            console.log("ICE candidate received");
            if (peerConnectionRef.current) {
                peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        };

        globalSocket.on('online_users', handleOnlineUsers);
        globalSocket.on('answer-made', handleAnswerMade);
        globalSocket.on('call-rejected', handleCallRejected);
        globalSocket.on('ice-candidate', handleIceCandidate);

        return () => {
            globalSocket.off('online_users', handleOnlineUsers);
            globalSocket.off('answer-made', handleAnswerMade);
            globalSocket.off('call-rejected', handleCallRejected);
            globalSocket.off('ice-candidate', handleIceCandidate);

            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [currentUser, globalSocket]);

    useEffect(() => {
        if (acceptedCall && globalSocket) {
            const handleAcceptedCall = async () => {
                setIsReceivingCall(true);
                try {
                    const peerConnection = createPeerConnection(acceptedCall.socket);
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(acceptedCall.offer));

                    const stream = await getLocalStream();
                    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

                    globalSocket.emit('make-answer', {
                        answer,
                        to: acceptedCall.socket
                    });

                    setIsInCall(true);

                    if (clearAcceptedCall) clearAcceptedCall();
                } catch (error) {
                    console.error("Failed to accept call", error);
                    toast.error("Error al aceptar la llamada");
                }
            };
            handleAcceptedCall();
        }
    }, [acceptedCall, globalSocket]);

    useEffect(() => {
        if (acceptedCall && users.length > 0) {
            const callingUser = users.find(u => u._id === acceptedCall.caller);
            if (callingUser) {
                setSelectedUser(callingUser);
            }
        }
    }, [acceptedCall, users]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream, isInCall]);

    const getLocalStream = async () => {
        if (localStream) return localStream;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            setIsMuted(false);
            setIsVideoOff(false);
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            alert("No se pudo acceder a la cámara o micrófono. Por favor verifica tus permisos.");
            throw error;
        }
    };

    const createPeerConnection = (targetSocketId?: string, targetUserId?: string) => {
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', {
                    candidate: event.candidate,
                    toSocketId: targetSocketId,
                    toUserId: targetUserId
                });
            }
        };

        peerConnection.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        return peerConnection;
    };

    const startCall = async (user: StudentUser) => {
        if (!user.isOnline) return;

        try {
            const stream = await getLocalStream();
            const peerConnection = createPeerConnection(undefined, user._id);

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

            socketRef.current?.emit('call-user', {
                offer,
                to: user._id,
                caller: currentUser?._id
            });

            setSelectedUser(user);
            setIsInCall(true);
        } catch (error) {
            console.error("Failed to start call", error);
        }
    };

    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setIsInCall(false);
        setSelectedUser(null);
        setIsReceivingCall(false);
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
                    {users.map((user) => {
                        return (
                            <div
                                key={user._id}
                                className={`flex flex-col p-3 rounded-xl border transition-all ${user.isOnline ? 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-gray-200' : 'bg-gray-50 dark:bg-zinc-800/20 border-transparent opacity-70'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold uppercase">
                                                {user.nombre.charAt(0)}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize truncate max-w-[120px]" title={`${user.nombre} ${user.apellidos}`}>
                                                {user.nombre} {user.apellidos}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => startCall(user)}
                                        disabled={!user.isOnline || isInCall}
                                        className={`p-2.5 rounded-full transition-all flex-shrink-0 ${user.isOnline && !isInCall
                                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                                            }`}
                                    >
                                        <Video size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {users.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-zinc-500 text-sm mt-4">No hay estudiantes en la base de datos.</p>
                    )}
                </div>
            </div>

            {/* Main Area - Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">

                {/* Incoming Central Notification logic removed for sidebar inline mode */}

                {isInCall && selectedUser ? (
                    <div className="w-full max-w-4xl bg-black/95 rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex flex-col ring-1 ring-white/10 animate-in zoom-in-95 duration-500">
                        {/* Remote Video */}
                        <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-zinc-800 to-zinc-900">
                            {remoteStream ? (
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center animate-in fade-in duration-700">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl font-bold text-white shadow-lg ring-4 ring-white/10 uppercase">
                                        {selectedUser.nombre.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide capitalize">{selectedUser.nombre} {selectedUser.apellidos}</h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-green-400 text-sm font-medium">Conectando...</p>
                                    </div>
                                </div>
                            )}

                            {/* Local Video Placeholder (Real Stream) */}
                            <div className="absolute bottom-6 right-6 w-48 h-36 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl ring-2 ring-white/20 transition-all hover:scale-105 duration-300">
                                <video
                                    ref={localVideoRef}
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