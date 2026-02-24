import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { MOCK_EVENTS, MOCK_USER } from '../constants';
import { User } from '../types';

interface TablonViewProps {
  user: User | null;
}

export const TablonView: React.FC<TablonViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = React.useState<'personal' | 'clase' | 'general'>(() => {
    return (localStorage.getItem('tablonActiveTab') as 'personal' | 'clase' | 'general') || 'personal';
  });

  React.useEffect(() => {
    localStorage.setItem('tablonActiveTab', activeTab);
  }, [activeTab]);
  const [events, setEvents] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:3005/api/users/${user._id}/messages`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch(err => console.error('Error fetching messages:', err));
    }
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
                {messages.length > 0 ? messages.map((msg, idx) => (
                  <li key={msg._id || idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <span className="font-bold text-green-700 dark:text-green-400">•</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{msg.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{msg.content}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">De: {msg.sender?.nombre} {msg.sender?.apellidos} {msg.course ? `(${msg.course.title})` : ''}</p>
                    </div>
                  </li>
                )) : (
                  <>
                    <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <span className="font-bold text-green-700 dark:text-green-400">•</span>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Missatge del Tutor</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Recorda portar la documentació de les pràctiques demà.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <span className="font-bold text-green-700 dark:text-green-400">•</span>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Nova Correcció</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">S'ha publicat la nota del teu projecte de M06: Accés a Dades.</p>
                      </div>
                    </li>
                  </>
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
                <li className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Canvi d'Aula - M07</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">La classe d'Interficies d'avui es farà al laboratori 2.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Recordatori d'Examen</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">L'examen final de Programació serà el proper dimarts a les 09:00.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Nou Material</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Noves diapositives disponibles al curs de Bases de Dades.</p>
                  </div>
                </li>
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
                <li className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded">
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Manteniment Programat</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">La plataforma no estarà disponible aquest divendres a partir de les 22:00h per actualitzacions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded">
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Activitats Extraescolars</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">S'han obert les inscripcions per al torneig de futbol i el taller de robòtica.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded">
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">•</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Notes Publicades</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Ja es poden consultar les notes parcials del mòdul d'Accés a Dades.</p>
                  </div>
                </li>
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