import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { MOCK_COURSES, MOCK_SCHEDULE } from '../constants';
import { BookOpen, Calendar as CalendarIcon } from 'lucide-react';

export const AsignaturasView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
          GESTIÓ ACADÈMICA
        </h1>
        <div className="inline-block bg-black text-white px-4 py-1 text-sm font-bold uppercase tracking-widest skew-x-[-12deg]">
          <span className="skew-x-[12deg] inline-block">{MOCK_COURSES.length} ASIGNATURAS ACTIVES</span>
        </div>
      </div>

      {/* Lista de Asignaturas */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-400 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen size={24} className="text-black" />
          </div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            LES MEVES ASIGNARUTES
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Horario Semanal */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CalendarIcon size={24} className="text-black" />
          </div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            HORARI DE CLASSES
          </h2>
        </div>
        <WeeklyCalendar schedule={MOCK_SCHEDULE} courses={MOCK_COURSES} />
      </section>
    </div>
  );
};