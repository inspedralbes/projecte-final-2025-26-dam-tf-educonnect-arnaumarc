import React, { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { MOCK_COURSES, MOCK_SCHEDULE, MOCK_USER } from '../constants';
import { User } from '../types';
import { CourseDetailsView } from './CourseDetailsView';

interface AsignaturasViewProps {
  user: User | null;
}
import { BookOpen, Calendar as CalendarIcon } from 'lucide-react';

export const AsignaturasView: React.FC<AsignaturasViewProps> = ({ user }) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  const realCourses = user?.enrolledCourses as any[] || [];



  const enrolledCoursesList = realCourses.length > 0
    ? realCourses.map(c => ({
      id: c._id || c,
      title: c.title || 'Asignatura',
      description: c.description || '',
      professor: c.professor || '',
      image: c.image || 'https://picsum.photos/300/200'
    }))
    : MOCK_COURSES.filter(course => MOCK_USER.enrolledCourses.includes(course.id));


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
        userRole={user?.type === 'professor' ? 'TEACHER' : 'STUDENT'}
        onBack={() => setSelectedCourse(null)}
      />
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
          <span className="skew-x-[12deg] inline-block">{enrolledCoursesList.length} ASSIGNATURES ACTIVES</span>
        </div>
      </div>

      {/* Lista de Asignaturas */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-400 dark:bg-purple-600 border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
            <BookOpen size={24} className="text-black dark:text-white" />
          </div>
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tight transition-colors">
            LES MEVES ASSIGNATURES
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {enrolledCoursesList.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
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
        <WeeklyCalendar schedule={enrolledSchedule} courses={enrolledCoursesList} onCourseClick={(course) => setSelectedCourse(course)} />
      </section>
    </div>
  );
};