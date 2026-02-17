import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { ClassSession, Course } from '../types';

interface WeeklyCalendarProps {
    schedule: ClassSession[];
    courses: Course[];
}

const DAYS = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
const START_HOUR = 8;
const END_HOUR_ACTUAL = 21;
const HOURS = Array.from({ length: END_HOUR_ACTUAL - START_HOUR + 1 }, (_, i) => START_HOUR + i);

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ schedule, courses }) => {
    const getCourse = (id: string) => courses.find(c => c.id === id);

    const getPositionStyle = (session: ClassSession) => {
        const [startH, startM] = session.startTime.split(':').map(Number);
        const [endH, endM] = session.endTime.split(':').map(Number);

        // 44px height per hour
        const startRow = (startH - START_HOUR) * 2 + (startM >= 30 ? 1 : 0) + 2;
        const endRow = (endH - START_HOUR) * 2 + (endM >= 30 ? 1 : 0) + 2;

        return {
            gridColumn: session.day + 1,
            gridRowStart: startRow,
            gridRowEnd: endRow,
        };
    };

    const getCourseColor = (courseId: string) => {
        const colors = [
            'bg-[#ff90e8] hover:bg-[#ff70e0]',   // Pink
            'bg-[#7dd3fc] hover:bg-[#60a5fa]',   // Blue
            'bg-[#fde047] hover:bg-[#facc15]',   // Yellow
            'bg-[#86efac] hover:bg-[#4ade80]',   // Green
            'bg-[#fdba74] hover:bg-[#fb923c]',   // Orange
            'bg-[#c4b5fd] hover:bg-[#a78bfa]',   // Purple
        ];
        const index = parseInt(courseId) % colors.length;
        return colors[index];
    };

    return (
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden w-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-white">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <CalendarIcon size={24} strokeWidth={2.5} />
                    HORARI SEMANAL
                </h2>
                <div className="text-xs font-black px-4 py-2 bg-yellow-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    CURS 2025-26
                </div>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-0 w-full min-w-[800px] text-sm">

                    {/* Corner */}
                    <div className="col-start-1 row-start-1 bg-black text-white flex items-center justify-center border-r-2 border-b-2 border-black font-black text-lg">
                        #
                    </div>

                    {/* Day Headers - Pop Style */}
                    {DAYS.map((day, i) => (
                        <div key={day} className={`
                            row-start-1 h-12 flex items-center justify-center font-black uppercase tracking-wide border-b-2 border-black border-r-2 last:border-r-0
                            ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}>
                            {day.slice(0, 3)}
                        </div>
                    ))}

                    {/* Time Column & Grid */}
                    {HOURS.map((hour, index) => {
                        const rowStart = (hour - START_HOUR) * 2 + 2;
                        return (
                            <React.Fragment key={hour}>
                                {/* Time Label */}
                                <div
                                    className="col-start-1 text-center font-black border-r-2 border-black flex items-start justify-center pt-1 text-[11px] bg-black text-white"
                                    style={{ gridRow: `${rowStart} / span 2` }}
                                >
                                    {hour}h
                                </div>

                                {/* Grid Cells */}
                                {DAYS.map((_, dayIndex) => (
                                    <React.Fragment key={`${dayIndex}-${hour}`}>
                                        <div
                                            className="border-b border-gray-300 border-r-2 border-black last:border-r-0 h-[22px] bg-white opacity-50"
                                            style={{ gridRow: rowStart, gridColumn: dayIndex + 2 }}
                                        />
                                        <div
                                            className="border-b-2 border-black border-r-2 border-black last:border-r-0 h-[22px] bg-white opacity-50"
                                            style={{ gridRow: rowStart + 1, gridColumn: dayIndex + 2 }}
                                        />
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        );
                    })}

                    {/* Class Sessions */}
                    {schedule.map((session) => {
                        const course = getCourse(session.courseId);
                        if (!course) return null;

                        const colorClass = getCourseColor(session.courseId);

                        return (
                            <div
                                key={session.id}
                                style={getPositionStyle(session)}
                                className={`
                    m-1 p-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                    flex flex-col justify-between transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                    cursor-pointer overflow-hidden ${colorClass} group z-10
                `}
                                title={`${course.title} (${session.startTime} - ${session.endTime})`}
                            >
                                <div className="font-black text-[10px] uppercase leading-3 line-clamp-2 text-black">
                                    {course.title}
                                </div>

                                <div className="mt-1 space-y-0.5">
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-black/80 bg-white/30 rounded px-1 w-fit">
                                        <MapPin size={8} strokeWidth={3} />
                                        {session.classroom}
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-black/80">
                                        <Clock size={8} strokeWidth={3} />
                                        {session.startTime}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
