import React, { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { MOCK_SCHEDULE, MOCK_USER } from '../constants';
import { BookOpen, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { courseService } from '../services/courseService';
import { Course } from '../types';

export const AsignaturasView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // MOCK_SCHEDULE uses courseId matching mocks.
  // We assume user is enrolled in these courses.
  const enrolledSchedule = MOCK_SCHEDULE;

  useEffect(() => {
    // Simulate fetching tailored data for the logged-in user
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Using "mock-user-id" as placeholder, real app would pass user.id
        const data = await courseService.getEnrolledCourses('mock-user-id');
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="animate-spin text-cyan-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-16 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 transition-colors">
          GESTIÓ ACADÈMICA
        </h1>
        <div className="inline-block bg-black dark:bg-white text-white dark:text-black px-4 py-1 text-sm font-bold uppercase tracking-widest skew-x-[-12deg] transition-colors">
          <span className="skew-x-[12deg] inline-block">{courses.length} ASIGNATURAS ACTIVES</span>
        </div>
      </div>

      {/* Lista de Asignaturas */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-400 dark:bg-purple-600 border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
            <BookOpen size={24} className="text-black dark:text-white" />
          </div>
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tight transition-colors">
            LES MEVES ASIGNARUTES
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Horario Semanal */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-600 border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
            <CalendarIcon size={24} className="text-black dark:text-white" />
          </div>
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tight transition-colors">
            HORARI DE CLASSES
          </h2>
        </div>
        <WeeklyCalendar schedule={enrolledSchedule} courses={courses} />
      </section>
    </div>
  );
};