import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '../types';

interface MonthlyCalendarProps {
    events: CalendarEvent[];
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthNames = [
        "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
        "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];

    const dayNames = ["dl", "dt", "dc", "dj", "dv", "ds", "dg"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust to start on Monday

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= days; i++) {
        calendarDays.push(i);
    }

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            let dateString: string;
            if (event.type === 'activity') {
                dateString = event.data.dueDate;
            } else {
                dateString = event.data.date;
            }
            const eventDate = new Date(dateString);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        });
    };

    const getEventStyle = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'activity': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            case 'exam': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
            case 'event': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            case 'holiday': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'strike': return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
        }
    };

    const getEventPrefix = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'activity': return '📝 ';
            case 'exam': return '🎯 ';
            case 'event': return '📢 ';
            case 'holiday': return '🎉 ';
            case 'strike': return '⚠️ ';
            default: return '• ';
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-800 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-full transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black dark:border-white bg-white dark:bg-zinc-800 transition-colors">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-black dark:text-white">
                    <CalendarIcon size={24} />
                    {monthNames[month]} {year}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 border-2 border-black dark:border-white text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 border-2 border-black dark:border-white text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b-2 border-black dark:border-white bg-gray-50 dark:bg-zinc-700 transition-colors">
                {dayNames.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-bold uppercase border-r-2 last:border-r-0 border-black dark:border-white text-black dark:text-white transition-colors">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 min-h-[350px] bg-white dark:bg-zinc-800">
                {calendarDays.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                    return (
                        <div
                            key={index}
                            className={`
                min-h-[60px] p-1 border-r-2 border-b-2 border-black dark:border-zinc-600 last:border-r-0 transition-colors
                ${!day
                                    ? 'bg-gray-100/50 dark:bg-zinc-900/50'
                                    : isToday
                                        ? 'bg-yellow-200 dark:bg-yellow-400/30'
                                        : 'bg-white dark:bg-zinc-800'
                                } 
              `}
                        >
                            {day && (
                                <>
                                    <div className={`text-xs font-black mb-1 transition-colors ${isToday ? 'bg-black text-white dark:bg-white dark:text-black px-1 inline-block' : 'text-black dark:text-white'}`}>
                                        {day}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {dayEvents.map((event, i) => (
                                            <div
                                                key={i}
                                                title={event.data.title}
                                                className={`
                          text-[10px] p-0.5 border border-black dark:border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] leading-tight truncate transition-all rounded-sm
                          ${getEventStyle(event.type)}
                        `}
                                            >
                                                <span className="font-bold">{getEventPrefix(event.type)}</span>
                                                {event.data.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="p-3 border-t-2 border-black dark:border-white flex flex-wrap gap-4 text-[10px] font-black bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 border border-black dark:border-white"></div>
                    <span>Activitats</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-rose-100 dark:bg-rose-900/30 border border-black dark:border-white"></div>
                    <span>Exàmens</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-amber-100 dark:bg-amber-900/30 border border-black dark:border-white"></div>
                    <span>Esdeveniments</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-black dark:border-white"></div>
                    <span>Festius</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-white"></div>
                    <span>Vagues</span>
                </div>
            </div>
        </div>
    );
};
