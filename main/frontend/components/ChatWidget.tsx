import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Users, MessageCircle } from 'lucide-react';
import { ChatMessage, User as UserType } from '../types';

interface ChatWidgetProps {
    currentUser: UserType | null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'personal' | 'grupos'>('personal');
    const [message, setMessage] = useState('');

    const [personalMessages, setPersonalMessages] = useState<ChatMessage[]>([
        {
            id: 'p1',
            sender: 'Suport EduConnect',
            text: 'Hola! En què et podem ajudar avui?',
            isMe: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([
        {
            id: 'g1',
            sender: 'Grup 2DAM',
            text: 'Heu acabat la pràctica de PSP?',
            isMe: false,
            timestamp: '09:00 AM'
        },
        {
            id: 'g2',
            sender: 'Nil Perera',
            text: 'Jo gairebé, em falta un últim detall.',
            isMe: false,
            timestamp: '09:15 AM'
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, personalMessages, groupMessages, activeSection]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: currentUser?.nombre || 'Jo',
            text: message,
            isMe: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (activeSection === 'personal') {
            setPersonalMessages([...personalMessages, newMessage]);
            // Simulate auto-response only for personal
            setTimeout(() => {
                const botResponse: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'Suport EduConnect',
                    text: 'Gràcies pel teu missatge. Un agent et respondrà aviat.',
                    isMe: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setPersonalMessages(prev => [...prev, botResponse]);
            }, 1000);
        } else {
            setGroupMessages([...groupMessages, newMessage]);
        }

        setMessage('');
    };

    const currentMessages = activeSection === 'personal' ? personalMessages : groupMessages;

    return (
        <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-6 w-80 md:w-96 h-[500px] bg-white dark:bg-zinc-800 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-black dark:bg-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                                <MessageCircle size={16} className="text-black" />
                            </div>
                            <h3 className="font-bold text-white dark:text-black uppercase tracking-wider text-sm">Missatgeria</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white dark:text-black hover:rotate-90 transition-transform p-1"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Section Selector */}
                    <div className="flex border-b-4 border-black dark:border-white shrink-0">
                        <button
                            onClick={() => setActiveSection('personal')}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-colors
                                ${activeSection === 'personal' ? 'bg-purple-200 dark:bg-purple-900/50 text-black dark:text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200'}`}
                        >
                            <User size={14} /> Personal
                        </button>
                        <button
                            onClick={() => setActiveSection('grupos')}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-colors border-l-4 border-black dark:border-white
                                ${activeSection === 'grupos' ? 'bg-cyan-200 dark:bg-cyan-900/50 text-black dark:text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200'}`}
                        >
                            <Users size={14} /> Grups
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-900/50">
                        {currentMessages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-3 border-2 border-black dark:border-white font-bold 
                                    ${msg.isMe
                                        ? 'bg-purple-200 dark:bg-purple-900/50 text-black dark:text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                                        : 'bg-white dark:bg-zinc-700 text-black dark:text-white rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                    }`}>
                                    <p className="text-sm leading-tight">{msg.text}</p>
                                </div>
                                <span className="text-[10px] mt-1 font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                                    {msg.sender} • {msg.timestamp}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-zinc-800 border-t-4 border-black dark:border-white flex gap-2 shrink-0">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={activeSection === 'personal' ? "Missatge al suport..." : "Escriu al grup..."}
                            className="flex-1 p-2 border-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-700 text-black dark:text-white font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-600 transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-black dark:bg-white text-white dark:text-black p-2 border-2 border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}

            {/* Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
                    ${isOpen ? 'bg-red-400 dark:bg-red-600 rotate-90' : 'bg-cyan-400 dark:bg-cyan-600 hover:scale-110'}`}
            >
                {isOpen ? (
                    <X size={32} className="text-black dark:text-white" />
                ) : (
                    <div className="relative">
                        <MessageSquare size={32} className="text-black dark:text-white" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                            2
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
};
