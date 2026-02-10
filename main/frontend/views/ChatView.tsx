import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';
import { ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../constants';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Yo',
      text: inputText,
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-[#e5ddd5]">
      {/* Chat Header */}
      <div className="bg-[#075e54] text-white p-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
             <img src="https://picsum.photos/100/100" alt="Group" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold">Clase 2º DAM</h3>
            <p className="text-xs opacity-80">Ana, Carlos, Tú...</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Video size={20} className="cursor-pointer" />
          <Phone size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 px-3 shadow-sm text-sm relative ${
                msg.isMe ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'
              }`}
            >
              {!msg.isMe && (
                <p className="text-xs font-bold text-orange-600 mb-1">{msg.sender}</p>
              )}
              <p className="text-gray-800">{msg.text}</p>
              <p className="text-[10px] text-gray-500 text-right mt-1 ml-4">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-[#f0f0f0] p-2 flex items-center gap-2">
        <button type="button" className="p-2 text-gray-500">
           <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje"
          className="flex-1 rounded-full border-none py-2 px-4 focus:outline-none bg-white"
        />
        <button
          type="submit"
          className="p-2 bg-[#075e54] text-white rounded-full hover:bg-[#128c7e] transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};