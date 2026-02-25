import React, { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { MOCK_COURSES, MOCK_SCHEDULE, MOCK_USER } from '../constants';
import { User } from '../types';
import { CourseDetailsView } from './CourseDetailsView';
import { BookOpen, Calendar as CalendarIcon } from 'lucide-react';

interface AsignaturasViewProps {
  user: User | null;
}

export const AsignaturasView: React.FC<AsignaturasViewProps> = ({ user }) => {
  const realCourses = user?.enrolledCourses as any[] || [];

  const enrolledCoursesList = React.useMemo(() => {
    return realCourses.length > 0
      ? realCourses.map(c => ({
        id: c._id || c,
        title: c.title || 'Asignatura',
        description: c.description || '',
        professor: c.professor || '',
        image: c.image || 'https://picsum.photos/300/200'
      }))
      : MOCK_COURSES.filter(course => MOCK_USER.enrolledCourses.includes(course.id));
  }, [realCourses]);

  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const hasRestored = React.useRef(false);

  // Restore selected course from localStorage ONLY ONCE on mount
  useEffect(() => {
    if (!hasRestored.current && enrolledCoursesList.length > 0) {
      const savedCourseId = localStorage.getItem('selectedCourse');
      if (savedCourseId) {
        const course = enrolledCoursesList.find(c => c.id === savedCourseId);
        if (course) {
          setSelectedCourse(course);
        }
      }
      hasRestored.current = true;
    }
  }, [enrolledCoursesList]);

  // Save selected course to localStorage
  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem('selectedCourse', selectedCourse.id);
    } else {
      localStorage.removeItem('selectedCourse');
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetch('http://localhost:3005/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedSchedule = data.map((s: any) => ({
            id: s._id,
            courseId: s.courseId,
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            classroom: s.classroom
          }));
          setSchedule(formattedSchedule);
        } else {
          console.error('Schedule fetch returned non-array:', data);
        }
      })
      .catch(err => console.error('Error fetching schedule:', err));
  }, []);

  const enrolledSchedule = (schedule.length > 0 ? schedule : MOCK_SCHEDULE).filter(session => {
    if (realCourses.length > 0) {
      return realCourses.some(c => (c._id || c) === session.courseId);
    }
    return MOCK_USER.enrolledCourses.includes(session.courseId);
  });

  if (selectedCourse) {
    return (
      <CourseDetailsView
        course={selectedCourse}
        user={user}
        userRole={user?.type === 'professor' ? 'TEACHER' : 'STUDENT'}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12 md:space-y-16 transition-colors duration-300">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 uppercase tracking-tight mb-4 transition-colors">
          Gestión Académica
        </h1>
        <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors shadow-sm">
          <span>{enrolledCoursesList.length} Asignaturas Activas</span>
        </div>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all shadow-sm">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
            Mis Asignaturas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {enrolledCoursesList.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
          ))}
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-all shadow-sm">
            <CalendarIcon size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
            Horario de Clases
          </h2>
        </div>
        <div className="bg-white dark:bg-zinc-800/90 rounded-3xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-zinc-700">
          <WeeklyCalendar schedule={enrolledSchedule} courses={enrolledCoursesList} onCourseClick={(course) => setSelectedCourse(course)} />
        </div>
      </section>
    </div>
  );
};