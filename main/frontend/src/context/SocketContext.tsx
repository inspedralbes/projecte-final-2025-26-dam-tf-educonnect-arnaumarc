import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../config';
import { User } from '../../types';
import toast from 'react-hot-toast';

interface CallData {
    from: string;
    fromName: string;
    offer: any;
}

interface SocketContextType {
    socket: Socket | null;
    incomingCall: CallData | null;
    isInCall: boolean;
    isCalling: boolean;
    activeCallUser: { id: string, name: string } | null;
    startCall: (targetId: string, targetName: string, offer: any) => void;
    acceptCall: (fromId: string) => void;
    rejectCall: (fromId: string) => void;
    endCall: (targetId: string) => void;
    setInCall: (value: boolean) => void;
    setCalling: (value: boolean) => void;
    setActiveCallUser: (user: { id: string, name: string } | null) => void;
    setIncomingCall: (call: CallData | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ user: User | null, children: React.ReactNode }> = ({ user, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
    const [isInCall, setIsInCall] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [activeCallUser, setActiveCallUser] = useState<{ id: string, name: string } | null>(null);
    
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
            return;
        }

        const newSocket = io(API_BASE_URL || window.location.origin);
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            newSocket.emit('register_user', user._id);
        });

        newSocket.on('incoming_call', (data: CallData) => {
            setIncomingCall(data);
        });

        newSocket.on('call_failed', (data: { reason: string }) => {
            toast.error(`Llamada fallida: ${data.reason}`);
            setIsCalling(false);
            setActiveCallUser(null);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user?._id]);

    const startCall = (targetId: string, targetName: string, offer: any) => {
        if (!socketRef.current || !user) return;
        
        setIsCalling(true);
        setActiveCallUser({ id: targetId, name: targetName });
        
        socketRef.current.emit('call_user', {
            to: targetId,
            offer: offer,
            from: user._id,
            fromName: `${user.nombre} ${user.apellidos}`
        });
    };

    const acceptCall = (fromId: string) => {
        setIncomingCall(null);
        setIsInCall(true);
    };

    const rejectCall = (fromId: string) => {
        if (!socketRef.current || !user) return;
        socketRef.current.emit('reject_call', { to: fromId, from: user._id });
        setIncomingCall(null);
    };

    const endCall = (targetId: string) => {
        if (!socketRef.current || !user) return;
        socketRef.current.emit('end_call', { to: targetId, from: user._id });
        setIsInCall(false);
        setIsCalling(false);
        setActiveCallUser(null);
        setIncomingCall(null);
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            incomingCall, 
            isInCall, 
            isCalling, 
            activeCallUser,
            startCall,
            acceptCall,
            rejectCall,
            endCall,
            setInCall: setIsInCall,
            setCalling: setIsCalling,
            setActiveCallUser,
            setIncomingCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
