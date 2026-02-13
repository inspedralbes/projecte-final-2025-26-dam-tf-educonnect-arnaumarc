import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { CalendarEvent } from '../types';

export const Dashboard: React.FC = () => {
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
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wide text-black">
        [INS PEDRALBES]
      </h1>
      <p className="text-center text-gray-700 mb-12 font-medium">Projecte Educatiu Conectat</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Box */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            Hola d'acord!
          </h2>
          <p className="text-gray-800 text-sm">
            Has iniciat sessió correctament. Tens <span className="font-bold">2 entregues</span> per aquesta setmana.
          </p>
        </div>

        {/* Next Class Box */}
        <div className="bg-yellow-100 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <Clock size={20} />
            Propera Classe
          </h2>
          <div className="text-3xl font-bold mb-1 text-black">11:00</div>
          <p className="font-semibold text-gray-900">Desenvolupament Web</p>
          <p className="text-xs text-gray-600">Acollida Virtual</p>
        </div>

        {/* Notifications Box */}
        <div className="bg-cyan-100 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <Bell size={20} />
            Avisos de l'Escola
          </h2>
          <ul className="space-y-2 text-xs text-gray-900">
            <li className="border-b border-black/10 pb-1">• Manteniment: Divendres 22:00h.</li>
            <li className="border-b border-black/10 pb-1">• Noves activitats extraescolars.</li>
            <li>• Notes publicades: Accés a Dades.</li>
          </ul>
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