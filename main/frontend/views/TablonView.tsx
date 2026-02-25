import React, { useEffect, useState, useRef } from 'react';
import { Bell, Clock } from 'lucide-react';
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
      console.log('TablonView Socket connected:', socket.id);
      socket.emit('register_user', user._id || (user as any).id);
    });

    socket.on('new_notification', (data: { title: string, content: string, courseId?: string, isPrivate?: boolean, sender?: any }) => {
      console.log('TablonView received real-time notification:', data);

      // We create a new message format based on what is expected on the frontend
      const newMessage = {
        _id: Date.now().toString(), // fake id just for react keys until refresh
        title: data.title,
        content: data.content,
        course: data.courseId ? { _id: data.courseId, title: "Curs" } : undefined, // simplified course to satisfy rendering condition
        sender: { nombre: 'Nou', apellidos: 'Avís' },
        date: new Date().toISOString()
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

  // Filter messages by category based on if they have a course associated
  const personalMessages = messages.filter(msg => !msg.course);
  const classMessages = messages.filter(msg => !!msg.course);
  const generalMessages: any[] = []; // Currently no general messages implemented in DB

  return (
    <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wide text-black dark:text-white">
        [INS PEDRALBES]
      </h1>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12 font-medium">Projecte Educatiu Conectat</p>

      <div className="mb-8 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
        {/* Tabs Header */}
        <div className="flex border-b-2 border-black dark:border-white">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'personal' ? 'bg-green-100 dark:bg-green-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              } border-r-2 border-black dark:border-white`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab('clase')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'clase' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              } border-r-2 border-black dark:border-white`}
          >
            Clase
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'general' ? 'bg-cyan-100 dark:bg-cyan-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`}
          >
            General
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[200px]">
          {activeTab === 'personal' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                <Bell size={20} />
                Notificacions Personals
              </h2>
              <ul className="space-y-3">
                {personalMessages.length > 0 ? personalMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <span className="font-bold text-green-700 dark:text-green-400">•</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{msg.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{msg.content}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        De: {msg.sender?.nombre} {msg.sender?.apellidos}
                      </p>
                    </div>
                  </li>
                )) : (
                  <li className="flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded">
                    <p className="text-gray-500 dark:text-gray-400 font-bold">No tens noves notificacions personals.</p>
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'clase' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                <Bell size={20} />
                Avisos de Classe
              </h2>
              <ul className="space-y-3">
                {classMessages.length > 0 ? classMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <span className="font-bold text-yellow-700 dark:text-yellow-400">•</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{msg.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{msg.content}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        De: {msg.sender?.nombre || 'Professor'} {msg.sender?.apellidos || ''} {msg.course?.title ? `(${msg.course.title})` : ''}
                      </p>
                    </div>
                  </li>
                )) : (
                  <li className="flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded">
                    <p className="text-gray-500 dark:text-gray-400 font-bold">No hi ha avisos de les teves classes.</p>
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                <Bell size={20} />
                Avisos de l'Escola
              </h2>
              <ul className="space-y-3">
                {generalMessages.length > 0 ? generalMessages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded">
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">•</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{msg.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{msg.content}</p>
                    </div>
                  </li>
                )) : (
                  <li className="flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded">
                    <p className="text-gray-500 dark:text-gray-400 font-bold">No hi ha avisos generals de l'escola actualment.</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Calendar Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 text-black dark:text-white transition-colors">
          <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center -rotate-3 italic tracking-tighter shadow-sm">CAL</span>
          CALENDARI ACADÈMIC
        </h3>
        <div className="h-[600px]">
          <MonthlyCalendar events={filteredEvents} />
        </div>
      </div>

      {/* Quick Links / Status indicator section can go here */}
    </div>
  );
};