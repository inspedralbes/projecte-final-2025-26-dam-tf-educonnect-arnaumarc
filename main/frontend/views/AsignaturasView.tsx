import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { MOCK_COURSES } from '../constants';

export const AsignaturasView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        <h2 className="text-2xl font-bold text-black uppercase">Asignaturas</h2>
        <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded-full">
          {MOCK_COURSES.length} Activos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {MOCK_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};