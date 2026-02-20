import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border-2 border-black dark:border-white bg-gray-200 dark:bg-zinc-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="text-sm font-bold mb-2 border-b border-black dark:border-white pb-1 text-black dark:text-white transition-colors">
        [{course.title}]
      </div>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-cyan-300 dark:bg-cyan-700 border-2 border-black dark:border-white shrink-0 flex items-center justify-center overflow-hidden transition-colors">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-80 dark:opacity-100 transition-all" />
        </div>
        <div className="flex flex-col justify-between text-xs">
          <p className="text-gray-900 dark:text-gray-300 leading-relaxed font-medium transition-colors">
            {course.description}
          </p>
          <p className="font-bold mt-2 text-black dark:text-white transition-colors">
            Profesor: <span className="font-normal text-gray-800 dark:text-gray-400">{course.professor}</span>
          </p>
        </div>
      </div>
    </div>
  );
};