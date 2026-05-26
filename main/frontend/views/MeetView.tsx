import React, { useState, useEffect, useRef } from 'react';
import { Video, Phone, User as UserIcon, X, Mic, MicOff, VideoOff, MonitorUp, PhoneOff, PhoneIncoming, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { User } from '../types';
import toast from 'react-hot-toast';
import { useSocket } from '../src/context/SocketContext';
import { ChatPanel } from '../components/ChatPanel';

interface MeetViewProps {
    user: User | null;
}

export const MeetView: React.FC<MeetViewProps> = ({ user }) => {
    const { 
        socket, 
        incomingCall, 
        isInCall, 
        isCalling, 
        activeCallUser,
        userStates,
        startCall: signalStartCall,
        acceptCall: signalAcceptCall,
        rejectCall: signalRejectCall,
        endCall: signalEndCall,
        setInCall,
        setCalling,
        setActiveCallUser,
        setIncomingCall
    } = useSocket();

    const [users, setUsers] = useState<User[]>([]);
    const [activeChatUser, setActiveChatUser] = useState<User | null>(activeCallUser as User | null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const videoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const cleanupCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
        setInCall(false);
        setCalling(false);
        setIncomingCall(null);
        setActiveCallUser(null);
    };

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    useEffect(() => {
        if (!socket) return;

        const handleCallAnswered = async (data: any) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                setCalling(false);
                setInCall(true);
            }
        };

        const handleIceCandidate = async (data: any) => {
            if (peerConnection.current) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (e) {
                    console.error("Error adding ice candidate:", e);
                }
            }
        };

        const handleCallRejected = () => {
            toast.error("Llamada rechazada");
            cleanupCall();
        };

        const handleCallEnded = () => {
            toast("Llamada finalizada");
            cleanupCall();
        };

        socket.on('call_answered', handleCallAnswered);
        socket.on('ice_candidate', handleIceCandidate);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/all-users`);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const formattedUsers = data.filter(u => u._id !== user?._id);
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
            socket.off('call_answered', handleCallAnswered);
            socket.off('ice_candidate', handleIceCandidate);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
            cleanupCall();
        };
    }, [socket, user?._id]);

    useEffect(() => {
        if (isInCall && videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
        if (isInCall && remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [isInCall, localStream, remoteStream]);

    // Sync activeChatUser with activeCallUser from context if no chat user is selected
    useEffect(() => {
        if (activeCallUser && !activeChatUser) {
            const foundUser = users.find(u => u._id === activeCallUser._id);
            if (foundUser) {
                setActiveChatUser(foundUser);
            } else {
                setActiveChatUser(activeCallUser);
            }
        }
    }, [activeCallUser, users, activeChatUser]);

    const createPeerConnection = (targetUserId: string) => {
        const pc = new RTCPeerConnection(iceServers);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('ice_candidate', {
                    to: targetUserId,
                    candidate: event.candidate,
                    from: user?._id
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        peerConnection.current = pc;
        return pc;
    };

    const startCall = async (targetUser: User) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;
            setActiveChatUser(targetUser);

            const pc = createPeerConnection(targetUser._id);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            signalStartCall(targetUser, offer);
        } catch (error) {
            console.error("Error starting call:", error);
            toast.error("No se pudo acceder a la cámara o micrófono");
        }
    };

    const startChat = (targetUser: User) => {
        setActiveChatUser(targetUser);
        setIsChatOpen(true);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const acceptCall = async () => {
        if (!incomingCall) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;
            
            // Set active chat user to the caller
            const caller = users.find(u => u._id === incomingCall.from) || {
                _id: incomingCall.from,
                nombre: incomingCall.fromName,
                apellidos: '',
                type: 'alumno' as const,
                email: ''
            } as User;
            setActiveChatUser(caller);
            setActiveCallUser(caller);

            const pc = createPeerConnection(incomingCall.from);
            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket?.emit('answer_call', {
                to: incomingCall.from,
                answer: answer,
                from: user?._id
            });
            
            signalAcceptCall(incomingCall.from);
        } catch (error) {
            console.error("Error accepting call:", error);
            cleanupCall();
        }
    };

    const rejectCall = () => {
        if (!incomingCall) return;
        signalRejectCall(incomingCall.from);
    };

    const endCall = () => {
        const targetId = activeCallUser?._id || incomingCall?.from;
        if (targetId) {
            signalEndCall(targetId);
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
            {incomingCall && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 relative">
                            <UserIcon className="text-blue-600 dark:text-blue-400" size={40} />
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{incomingCall.fromName}</h3>
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
                        <p className="text-gray-900 dark:text-white font-bold mb-4">Llamando a {activeCallUser?.nombre}...</p>
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
            <div className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col shadow-sm z-20 absolute lg:relative inset-0 lg:inset-auto`}>
                <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserIcon className="text-blue-500" size={20} />
                        Usuarios
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading ? (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">Cargando usuarios...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">No hay otros usuarios disponibles.</div>
                    ) : (
                        users.map((u) => {
                            const isSelectedForChat = u._id === activeChatUser?._id;
                            const isSelectedForCall = u._id === activeCallUser?._id;
                            const state = userStates[u._id] || 'OFFLINE';
                            const stateColor = state === 'ONLINE' ? 'bg-green-500' : state === 'BUSY' ? 'bg-rose-500' : 'bg-zinc-400';
                            const isBusy = state === 'BUSY';
                            const isOffline = state === 'OFFLINE';
                            
                            return (
                                <div
                                    key={u._id}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSelectedForChat || isSelectedForCall ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            {u.profileImage ? (
                                                <img src={u.profileImage} alt={u.nombre} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-zinc-700" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                                                    {u.nombre.charAt(0)}
                                                </div>
                                            )}
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${stateColor}`} title={state} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.nombre} {u.apellidos}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{u.type === 'professor' ? 'Teacher' : 'Student'} • {state.toLowerCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setActiveChatUser(u);
                                                setIsChatOpen(true);
                                            }}
                                            className="p-2.5 rounded-full transition-all bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                                            title="Chatear"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        <button
                                            onClick={() => startCall(u)}
                                            disabled={isInCall || isCalling || !!incomingCall || isBusy || isOffline}
                                            className={`p-2.5 rounded-full transition-all ${!isInCall && !isCalling && !incomingCall && !isBusy && !isOffline
                                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                                                }`}
                                            title={isBusy ? "Ocupado" : isOffline ? "Desconectado" : "Llamada de video"}
                                        >
                                            <Video size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Area - Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 relative">
                {isInCall && activeCallUser ? (
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
                                        {activeCallUser.nombre.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{activeCallUser.nombre} {activeCallUser.apellidos}</h3>
                                    <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        Conectando medios...
                                    </p>
                                </div>
                            )}

                            {/* Remote User Label */}
                            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <p className="text-white text-sm font-semibold">{activeCallUser.nombre} {activeCallUser.apellidos}</p>
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

                        {/* Controls Bar (Floating) */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-6 px-6 py-4 bg-zinc-900/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl transition-all hover:bg-zinc-900/80">
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className={`p-3 md:p-4 rounded-full transition-all ${isSidebarOpen ? 'bg-blue-500 text-white' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                    title="Usuarios"
                                >
                                    <UserIcon size={24} />
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className={`p-3 md:p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                    title={isMuted ? "Activar Micro" : "Mutear"}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 md:p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                    title={isVideoOff ? "Activar Cámara" : "Apagar Cámara"}
                                >
                                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                                </button>

                                <button className="p-3 md:p-4 rounded-full bg-transparent hover:bg-white/10 text-white transition-colors hidden md:flex">
                                    <MonitorUp size={24} />
                                </button>

                                <button 
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className={`p-3 md:p-4 rounded-full transition-all ${isChatOpen ? 'bg-blue-500 text-white' : 'bg-transparent hover:bg-white/10 text-white'}`}
                                    title="Chat"
                                >
                                    <MessageSquare size={24} />
                                </button>
                            </div>

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            <button
                                onClick={endCall}
                                className="p-4 md:p-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-110 shadow-xl shadow-red-900/40 active:scale-95"
                                title="Colgar"
                            >
                                <PhoneOff size={28} />
                            </button>
                        </div>
                    </div>
                ) : activeChatUser ? (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-lg w-full p-8 bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-700 shadow-xl">
                        <div className="relative inline-block">
                            {activeChatUser.profileImage ? (
                                <img src={activeChatUser.profileImage} alt={activeChatUser.nombre} className="w-40 h-40 rounded-full object-cover border-4 border-blue-500/20 shadow-lg" />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-5xl font-bold text-blue-600 dark:text-blue-400 border-4 border-blue-500/20 shadow-lg">
                                    {activeChatUser.nombre.charAt(0)}
                                </div>
                            )}
                            <div className={`absolute bottom-2 right-2 w-8 h-8 border-4 border-white dark:border-zinc-800 rounded-full shadow-md ${
                                (userStates[activeChatUser._id] || 'OFFLINE') === 'ONLINE' ? 'bg-green-500' : 
                                (userStates[activeChatUser._id] || 'OFFLINE') === 'BUSY' ? 'bg-rose-500' : 'bg-zinc-400'
                            }`} />
                        </div>
                        
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{activeChatUser.nombre} {activeChatUser.apellidos}</h3>
                            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                                <MessageSquare size={18} />
                                <span>Chateando ahora</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => startCall(activeChatUser)}
                                disabled={(userStates[activeChatUser._id] || 'OFFLINE') !== 'ONLINE'}
                                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 ${
                                    (userStates[activeChatUser._id] || 'OFFLINE') === 'ONLINE' 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none'
                                }`}
                            >
                                <Video size={22} /> Iniciar Videollamada
                            </button>
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold pt-2">
                                {activeChatUser.type === 'professor' ? 'Teacher' : 'Student'} • {userStates[activeChatUser._id] || 'OFFLINE'}
                            </p>
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
                                Colabora en tiempo real con alumnos y profesores. Selecciona un contacto para iniciar una videollamada o chatear.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Panel */}
            {isChatOpen && (
                <div className="absolute lg:relative right-0 top-0 bottom-0 z-40 w-full lg:w-80 h-full shadow-2xl">
                    <ChatPanel 
                        currentUser={user} 
                        targetUser={activeChatUser}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};
