import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { CalendarEvent } from '../types';

export const TablonView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'personal' | 'clase' | 'general'>('personal');
  const mockEvents: CalendarEvent[] = [
    {
      type: 'activity',
      data: { id: '1', title: 'Entrega Projecte Final', dueDate: new Date(2026, 1, 18).toISOString(), courseId: '1' }
    },
    {
      type: 'activity',
      data: { id: '2', title: 'Exercicis Unitat 3', dueDate: new Date(2026, 1, 20).toISOString(), courseId: '2' }
    },
    {
      type: 'exam',
      data: { id: '3', title: 'Examen Matemàtiques', date: new Date(2026, 1, 25).toISOString(), courseId: '3' }
    },
    {
      type: 'exam',
      data: { id: '4', title: 'Global Història', date: new Date(2026, 1, 27).toISOString(), courseId: '4' }
    },
    {
      type: 'event',
      data: { id: '5', title: 'Xerrada Ciberseguretat', date: new Date(2026, 1, 12).toISOString() }
    },
    {
      type: 'holiday',
      data: { id: '6', title: 'Lliure Disposició', date: new Date(2026, 1, 28).toISOString() }
    },
    {
      type: 'strike',
      data: { id: '7', title: 'Vaga Estudiants', date: new Date(2026, 1, 19).toISOString() }
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wide text-black">
        [INS PEDRALBES]
      </h1>
      <p className="text-center text-gray-700 mb-12 font-medium">Projecte Educatiu Conectat</p>

      <div className="mb-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Tabs Header */}
        <div className="flex border-b-2 border-black">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'personal' ? 'bg-green-100' : 'bg-white hover:bg-gray-50'
              } border-r-2 border-black`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab('clase')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'clase' ? 'bg-yellow-100' : 'bg-white hover:bg-gray-50'
              } border-r-2 border-black`}
          >
            Clase
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'general' ? 'bg-cyan-100' : 'bg-white hover:bg-gray-50'
              }`}
          >
            General
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[200px]">
          {activeTab === 'personal' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
                <Bell size={20} />
                Notificacions Personals
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <span className="font-bold text-green-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Missatge del Tutor</p>
                    <p className="text-xs text-gray-600">Recorda portar la documentació de les pràctiques demà.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <span className="font-bold text-green-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Nova Correcció</p>
                    <p className="text-xs text-gray-600">S'ha publicat la nota del teu projecte de M06: Accés a Dades.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'clase' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
                <Bell size={20} />
                Avisos de Classe
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <span className="font-bold text-yellow-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Canvi d'Aula - M07</p>
                    <p className="text-xs text-gray-600">La classe d'Interficies d'avui es farà al laboratori 2.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <span className="font-bold text-yellow-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Recordatori d'Examen</p>
                    <p className="text-xs text-gray-600">L'examen final de Programació serà el proper dimarts a les 09:00.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <span className="font-bold text-yellow-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Nou Material</p>
                    <p className="text-xs text-gray-600">Noves diapositives disponibles al curs de Bases de Dades.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
                <Bell size={20} />
                Avisos de l'Escola
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded">
                  <span className="font-bold text-cyan-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Manteniment Programat</p>
                    <p className="text-xs text-gray-600">La plataforma no estarà disponible aquest divendres a partir de les 22:00h per actualitzacions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded">
                  <span className="font-bold text-cyan-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Activitats Extraescolars</p>
                    <p className="text-xs text-gray-600">S'han obert les inscripcions per al torneig de futbol i el taller de robòtica.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded">
                  <span className="font-bold text-cyan-700">•</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Notes Publicades</p>
                    <p className="text-xs text-gray-600">Ja es poden consultar les notes parcials del mòdul d'Accés a Dades.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Calendar Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-black text-white flex items-center justify-center -rotate-3 italic tracking-tighter">CAL</span>
          CALENDARI ACADÈMIC
        </h3>
        <div className="h-[600px]">
          <MonthlyCalendar events={mockEvents} />
        </div>
      </div>

      {/* Quick Links / Status indicator section can go here */}
    </div>
  );
};