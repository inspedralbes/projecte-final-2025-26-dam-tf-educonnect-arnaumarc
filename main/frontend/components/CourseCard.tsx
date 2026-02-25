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
      className={`group border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
      <div className="text-lg font-bold mb-4 text-gray-900 dark:text-white transition-colors flex items-center justify-between">
        <span className="truncate pr-4">{course.title}</span>
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shrink-0 flex items-center justify-center overflow-hidden transition-colors shadow-sm">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500" />
        </div>
        <div className="flex flex-col justify-between text-sm flex-1">
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 transition-colors">
            {course.description}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-300 transition-colors mt-2">
            Profesor: <span className="font-normal text-gray-600 dark:text-gray-400 ml-1">{course.professor}</span>
          </p>
        </div>
      </div>
    </div>
  );
};