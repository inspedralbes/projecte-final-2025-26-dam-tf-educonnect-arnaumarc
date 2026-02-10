import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="border-2 border-black bg-gray-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
      <div className="text-sm font-bold mb-2 border-b border-black pb-1 text-black">
        [{course.title}]
      </div>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-cyan-300 border-2 border-black shrink-0 flex items-center justify-center overflow-hidden">
             <img src={course.image} alt={course.title} className="w-full h-full object-cover mix-blend-multiply opacity-80" />
        </div>
        <div className="flex flex-col justify-between text-xs">
          <p className="text-gray-900 leading-relaxed font-medium">
            {course.description}
          </p>
          <p className="font-bold mt-2 text-black">
            Profesor: <span className="font-normal text-gray-800">{course.professor}</span>
          </p>
        </div>
      </div>
    </div>
  );
};