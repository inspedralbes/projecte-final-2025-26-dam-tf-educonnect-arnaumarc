import React from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wide text-black">
        [INS PEDRALBES]
      </h1>
      <p className="text-center text-gray-700 mb-12 font-medium">Panel de Control del Estudiante</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Box */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            Bienvenido
          </h2>
          <p className="text-gray-800">
            Hola, has iniciado sesión correctamente. Tienes <span className="font-bold">3 tareas pendientes</span> para esta semana.
          </p>
        </div>

        {/* Next Class Box */}
        <div className="bg-yellow-100 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <Clock size={20} />
            Siguiente Clase
          </h2>
          <div className="text-3xl font-bold mb-1 text-black">11:00 AM</div>
          <p className="font-semibold text-gray-900">Matemáticas Avanzadas</p>
          <p className="text-sm text-gray-600">Aula Virtual 01</p>
        </div>

        {/* Notifications Box */}
        <div className="bg-cyan-100 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
            <Bell size={20} />
            Avisos
          </h2>
          <ul className="space-y-2 text-sm text-gray-900">
            <li className="border-b border-black/10 pb-1">• Mantenimiento programado: Viernes 22:00h.</li>
            <li className="border-b border-black/10 pb-1">• Nuevos talleres disponibles.</li>
            <li>• Calificaciones publicadas: Historia.</li>
          </ul>
        </div>
      </div>

      {/* Schedule Preview */}
      <div className="bg-white border-2 border-black p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
          <Calendar size={20} />
          Horario de hoy
        </h3>
        <div className="space-y-3">
          <div className="flex border-l-4 border-purple-500 pl-4 py-1">
            <div className="w-24 font-bold text-gray-500">09:00 AM</div>
            <div className="text-black font-semibold">Historia del Arte</div>
          </div>
          <div className="flex border-l-4 border-green-500 pl-4 py-1 bg-gray-50">
            <div className="w-24 font-bold text-gray-500">11:00 AM</div>
            <div className="text-black font-semibold">Matemáticas Avanzadas</div>
          </div>
           <div className="flex border-l-4 border-orange-500 pl-4 py-1">
            <div className="w-24 font-bold text-gray-500">13:00 PM</div>
            <div className="text-black font-semibold">Descanso</div>
          </div>
        </div>
      </div>
    </div>
  );
};