import React, { useEffect, useState, useRef } from 'react';
import { Bell, User as UserIcon, BookOpen, Building } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { MOCK_EVENTS, MOCK_USER } from '../constants';
import { User, Course } from '../types';

interface TablonViewProps {
  user: User | null;
}

export const TablonView: React.FC<TablonViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'clase' | 'general'>(() => {
    return (localStorage.getItem('tablonActiveTab') as 'personal' | 'clase' | 'general') || 'personal';
  });

  useEffect(() => {
    localStorage.setItem('tablonActiveTab', activeTab);
  }, [activeTab]);

  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/events')
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.map((ev: any) => ({
          type: ev.type,
          data: {
            id: ev._id,
            title: ev.title,
            date: ev.date,
            courseId: ev.courseId?._id
          }
        }));
        setEvents(formattedEvents);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  // Fetch initial messages and Setup Socket.io for Real-time Updates
  useEffect(() => {
    if (!user?._id) return;

    // 1. Fetch initial messages
    fetch(`http://localhost:3005/api/users/${user._id}/messages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(err => console.error('Error fetching messages:', err));

    // 2. Setup Socket.io connection for this view
    socketRef.current = io('http://localhost:3005');
    const socket = socketRef.current;

    socket.on('connect', () => {
      socket.emit('register_user', user._id || (user as any).id);
    });

    socket.on('new_notification', (data: { title: string, content: string, courseId?: string, isPrivate?: boolean, sender?: any }) => {
      // We create a new message format based on what is expected on the frontend
      const newMessage = {
        _id: Date.now().toString(), // fake id just for react keys until refresh
        title: data.title,
        content: data.content,
        course: data.courseId ? { _id: data.courseId, title: "Curso" } : undefined, // simplified course to satisfy rendering condition
        sender: { nombre: 'Nuevo', apellidos: 'Aviso' },
        date: new Date().toISOString(),
        isPrivate: data.isPrivate
      };

      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const filteredEvents = (events.length > 0 ? events : MOCK_EVENTS).filter(ev => {
    if (ev.type === 'activity' || ev.type === 'exam') {
      if (user?.enrolledCourses) {
        // If user has real enrolled courses (as objects or strings)
        const courses = user.enrolledCourses as any[];
        return courses.some(c => (c._id || c) === ev.data.courseId);
      }
      return true;
    }
    return true;
  });

  // Filter messages by category based on if they have a course associated or if marked as private
  const personalMessages = messages.filter(msg => msg.isPrivate || !msg.course);
  const classMessages = messages.filter(msg => !!msg.course && !msg.isPrivate);
  const generalMessages: any[] = []; // Currently no general messages implemented in DB

  return (
    <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
      <h1 className="text-4xl font-black text-center mb-2 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        INS PEDRALBES
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-12 font-medium tracking-wide uppercase text-sm">Proyecto Educativo Conectado</p>

      <div className="mb-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-200 dark:border-zinc-800 transition-all">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'personal' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <UserIcon size={18} className={activeTab === 'personal' ? 'text-blue-600 dark:text-blue-400' : ''} />
            Personal
            {activeTab === 'personal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
          <button
            onClick={() => setActiveTab('clase')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'clase' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <BookOpen size={18} className={activeTab === 'clase' ? 'text-blue-600 dark:text-blue-400' : ''} />
            Clase
            {activeTab === 'clase' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'general' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Building size={18} className={activeTab === 'general' ? 'text-blue-600 dark:text-blue-400' : ''} />
            General
            {activeTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[200px]">
          {activeTab === 'personal' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Bell size={20} className="text-blue-500" />
                Notificaciones Personales
              </h2>
              <ul className="space-y-4">
                {personalMessages.length > 0 ? personalMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex-shrink-0 mt-1 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">{msg.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{msg.content}</p>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-zinc-700/50 flex items-center gap-1">
                        <UserIcon size={12} />
                        De: {msg.sender?.nombre} {msg.sender?.apellidos}
                      </p>
                    </div>
                  </li>
                )) : (
                  <li className="flex flex-col items-center justify-center p-12 bg-gray-50/80 dark:bg-zinc-800/20 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                    <Bell className="text-gray-300 dark:text-zinc-600 mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-center">No tienes nuevas notificaciones personales.</p>
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'clase' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <BookOpen size={20} className="text-amber-500" />
                Avisos de Clase
              </h2>
              <ul className="space-y-4">
                {classMessages.length > 0 ? classMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex-shrink-0 mt-1 p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">{msg.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{msg.content}</p>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-zinc-700/50 flex items-center gap-1">
                        <UserIcon size={12} />
                        De: {msg.sender?.nombre || 'Profesor'} {msg.sender?.apellidos || ''} {msg.course?.title ? `(${msg.course.title})` : ''}
                      </p>
                    </div>
                  </li>
                )) : (
                  <li className="flex flex-col items-center justify-center p-12 bg-gray-50/80 dark:bg-zinc-800/20 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                    <BookOpen className="text-gray-300 dark:text-zinc-600 mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-center">No hay avisos de tus clases.</p>
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Building size={20} className="text-indigo-500" />
                Avisos de la Escuela
              </h2>
              <ul className="space-y-4">
                {generalMessages.length > 0 ? generalMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex-shrink-0 mt-1 p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      <Building size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">{msg.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{msg.content}</p>
                    </div>
                  </li>
                )) : (
                  <li className="flex flex-col items-center justify-center p-12 bg-gray-50/80 dark:bg-zinc-800/20 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                    <Building className="text-gray-300 dark:text-zinc-600 mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-center">No hay avisos generales de la escuela actualmente.</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Calendar Section */}
      <div className="mb-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-200 dark:border-zinc-800 p-6 md:p-8 transition-all">
        <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-gray-900 dark:text-white transition-colors tracking-wide">
          <span className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center -rotate-3 shadow-md">
            <BookOpen size={20} />
          </span>
          Calendario Académico
        </h3>
        <div className="h-[600px]">
          <MonthlyCalendar events={filteredEvents} />
        </div>
      </div>

      {/* Quick Links / Status indicator section can go here */}
    </div>
  );
};