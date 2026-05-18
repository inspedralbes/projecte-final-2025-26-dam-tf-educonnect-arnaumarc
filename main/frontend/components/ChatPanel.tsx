import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, X, MessageSquare, Info } from 'lucide-react';
import { useSocket, MessageData } from '../src/context/SocketContext';
import { User } from '../types';
import { API_BASE_URL } from '../config';

interface ChatPanelProps {
    currentUser: User | null;
    targetUser?: User | null;
    onClose?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ currentUser, targetUser, onClose }) => {
    const { socket, messages: allMessages, setMessages } = useSocket();
    const [message, setMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter relevant messages for this conversation if targetUser exists
    const relevantMessages = targetUser 
        ? allMessages.filter(m => {
            const mSenderId = typeof m.sender === 'string' ? m.sender : m.sender?._id;
            const mReceiverId = typeof m.receiver === 'string' ? m.receiver : m.receiver?._id;
            const currentId = currentUser?._id;
            const targetId = targetUser?._id;

            return (
                (mSenderId === currentId && mReceiverId === targetId) ||
                (mSenderId === targetId && mReceiverId === currentId)
            );
        })
        : [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [relevantMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetId = targetUser?._id;
        const currentId = currentUser?._id;
        
        if (!message.trim() || !currentId || !targetId) return;

        // Map frontend role to backend model name
        const receiverModel = targetUser?.type === 'professor' ? 'Professor' : 'Alumno';

        const messageData = {
            sender: currentId,
            senderModel: currentUser?.type === 'professor' ? 'Professor' : 'Alumno',
            receiver: targetId,
            receiverModel: receiverModel,
            title: 'Mensaje de Meet',
            content: message.trim(),
            isPrivate: true
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();
            if (response.ok && data.success && data.message) {
                setMessage('');
                // The message is added to state via HTTP response. 
                // Socket.io event will be ignored in setMessages if _id already exists.
                setMessages(prev => {
                    if (prev.some(m => m._id === data.message._id)) return prev;
                    return [data.message, ...prev];
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-xl w-80 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">Chat de Meet</h3>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-400">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Info bar if in 1-on-1 */}
            {targetUser && (
                <div className="px-4 py-2 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                        <UserIcon size={10} /> Hablando con {(targetUser as any).nombre} {(targetUser as any).apellidos}
                    </p>
                </div>
            )}

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {relevantMessages.length > 0 ? (
                    relevantMessages.slice().reverse().map((msg) => {
                        const mSenderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                        const isMe = mSenderId === currentUser?._id;
                        return (
                            <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                                    isMe 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 px-1">
                                    {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
                        <MessageSquare size={32} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">No hay mensajes todavía</p>
                        <p className="text-[10px] mt-1">Envía un mensaje para empezar la conversación</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                        disabled={!targetUser}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || !targetUser}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
