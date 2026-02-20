import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { ClassSession, Course } from '../types';

interface WeeklyCalendarProps {
    schedule: ClassSession[];
    courses: Course[];
    onCourseClick?: (course: Course) => void;
}

const DAYS = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
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
        'bg-pink-300 hover:bg-pink-400 dark:bg-pink-600 dark:hover:bg-pink-500 dark:text-white',
        'bg-cyan-300 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:text-white',
        'bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:text-white',
        'bg-green-300 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500 dark:text-white',
        'bg-orange-300 hover:bg-orange-400 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-white',
        'bg-purple-300 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-500 dark:text-white',
    ];

    return (
        <div className="w-full overflow-x-auto border-2 border-black dark:border-white bg-white dark:bg-zinc-800 transition-colors duration-300">
            {/* 50px for time col, remaining space split evenly */}
            <div className="grid grid-cols-[50px_repeat(5,1fr)] min-w-[600px] text-xs">

                {/* Header Row */}
                <div className="bg-black dark:bg-zinc-900 text-white flex items-center justify-center font-bold border-b-2 border-r-2 border-black dark:border-white p-2 h-10 transition-colors">

                </div>
                {DAYS.map((d) => (
                    <div key={d} className="flex items-center justify-center font-black uppercase bg-gray-100 dark:bg-zinc-700 dark:text-white border-b-2 border-r-2 border-black dark:border-white last:border-r-0 p-2 h-10 transition-colors">
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
                                className="col-start-1 bg-black dark:bg-zinc-900 text-white font-bold flex items-start justify-center pt-1 border-r-2 border-black dark:border-white border-b border-gray-700 dark:border-zinc-600 transition-colors"
                                style={{ gridRow: `${row} / span 2`, height: '44px' }}
                            >
                                {h}h
                            </div>
                            {/* Empty Cells (Grid Background) */}
                            {DAYS.map((_, i) => (
                                <React.Fragment key={`${i}-${h}`}>
                                    {/* Top half (0-30m) */}
                                    <div
                                        style={{ gridRow: row, gridColumn: i + 2 }}
                                        className="border-b border-r border-gray-300 dark:border-zinc-600 border-r-gray-400 dark:border-r-zinc-500 last:border-r-0 bg-white dark:bg-zinc-800 transition-colors"
                                    />
                                    {/* Bottom half (30-60m) */}
                                    <div
                                        style={{ gridRow: row + 1, gridColumn: i + 2 }}
                                        className="border-b border-r border-gray-700 dark:border-zinc-500 border-r-gray-400 dark:border-r-zinc-500 last:border-r-0 bg-white dark:bg-zinc-800 transition-colors"
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
                    return (
                        <div
                            key={s.id}
                            style={getPosition(s)}
                            onClick={() => onCourseClick?.(course)}
                            className={`m-0.5 p-1 flex flex-col justify-between border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer transition-all hover:-translate-y-0.5 ${colors[parseInt(s.courseId) % colors.length]}`}
                            title={`${course.title} (${s.startTime} - ${s.endTime})`}
                        >
                            <span className="font-black uppercase truncate leading-tight">{course.title}</span>
                            <div className="flex justify-between items-end text-[9px] font-bold opacity-90 mt-1">
                                <span className="flex items-center gap-0.5 bg-white/40 dark:bg-black/30 px-1 rounded"><MapPin size={8} /> {s.classroom}</span>
                                <span className="flex items-center gap-0.5"><Clock size={8} /> {s.startTime}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
