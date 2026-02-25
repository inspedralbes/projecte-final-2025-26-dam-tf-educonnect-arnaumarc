import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { ClassSession, Course } from '../types';

interface WeeklyCalendarProps {
    schedule: ClassSession[];
    courses: Course[];
    onCourseClick?: (course: Course) => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const START_HOUR = 8;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ schedule, courses, onCourseClick }) => {
    const getCourse = (id: string) => courses.find((c) => c.id === id);

    const getPosition = (session: ClassSession) => {
        const [sH, sM] = session.startTime.split(':').map(Number);
        const [eH, eM] = session.endTime.split(':').map(Number);
        // Row 1 is header. Each hour is 2 rows (30m increments).
        return {
            gridColumn: session.day + 1,
            gridRowStart: (sH - START_HOUR) * 2 + (sM >= 30 ? 1 : 0) + 2,
            gridRowEnd: (eH - START_HOUR) * 2 + (eM >= 30 ? 1 : 0) + 2,
        };
    };

    const colors = [
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/40 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
        'bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/40 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/40 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    ];

    return (
        <div className="w-full overflow-x-auto rounded-3xl transition-colors duration-300">
            {/* 50px for time col, remaining space split evenly */}
            <div className="grid grid-cols-[50px_repeat(5,1fr)] min-w-[600px] text-xs">

                {/* Header Row */}
                <div className="bg-transparent dark:bg-transparent text-gray-400 flex items-center justify-center font-medium border-b border-r border-transparent p-2 h-12 transition-colors">

                </div>
                {DAYS.map((d) => (
                    <div key={d} className="flex items-center justify-center font-bold text-gray-500 uppercase tracking-widest bg-transparent border-b border-gray-100 dark:border-zinc-800 p-2 h-12 transition-colors">
                        {d}
                    </div>
                ))}

                {/* Grid Body */}
                {HOURS.map((h) => {
                    const row = (h - START_HOUR) * 2 + 2;
                    return (
                        <React.Fragment key={h}>
                            {/* Time Label */}
                            <div
                                className="col-start-1 bg-transparent text-gray-400 font-medium flex items-start justify-center pt-2 border-r border-gray-100 dark:border-zinc-800 transition-colors"
                                style={{ gridRow: `${row} / span 2`, height: '44px' }}
                            >
                                {h}:00
                            </div>
                            {/* Empty Cells (Grid Background) */}
                            {DAYS.map((_, i) => (
                                <React.Fragment key={`${i}-${h}`}>
                                    {/* Top half (0-30m) */}
                                    <div
                                        style={{ gridRow: row, gridColumn: i + 2 }}
                                        className="border-b border-r border-gray-50 dark:border-zinc-800/50 border-r-gray-50 dark:border-r-zinc-800/50 last:border-r-0 bg-transparent transition-colors"
                                    />
                                    {/* Bottom half (30-60m) */}
                                    <div
                                        style={{ gridRow: row + 1, gridColumn: i + 2 }}
                                        className="border-b border-r border-gray-100 dark:border-zinc-700/50 border-r-gray-50 dark:border-r-zinc-800/50 last:border-r-0 bg-transparent transition-colors"
                                    />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    );
                })}

                {/* Events Overlay */}
                {schedule.map((s) => {
                    const course = getCourse(s.courseId);
                    if (!course) return null;

                    // Simple hash to consistently pick a color from the string ID
                    const idHash = s.courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const colorClass = colors[idHash % colors.length];

                    return (
                        <div
                            key={s.id}
                            style={getPosition(s)}
                            onClick={() => onCourseClick?.(course)}
                            className={`m-1 p-2 rounded-xl flex flex-col justify-between border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 z-10 ${colorClass}`}
                            title={`${course.title} (${s.startTime} - ${s.endTime})`}
                        >
                            <span className="font-bold truncate leading-tight">{course.title}</span>
                            <div className="flex justify-between items-end text-[10px] font-medium opacity-80 mt-1">
                                <span className="flex items-center gap-1"><MapPin size={10} /> {s.classroom}</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {s.startTime}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
