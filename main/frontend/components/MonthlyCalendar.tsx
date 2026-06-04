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
            const dateString = event.data.date || event.data.dueDate;
            if (!dateString) return false;

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
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col h-full transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <CalendarIcon size={20} />
                    </div>
                    {monthNames[month]} <span className="text-gray-400 font-medium">{year}</span>
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-zinc-800/50 transition-colors">
                {dayNames.map(day => (
                    <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 min-h-[400px] bg-white dark:bg-zinc-900">
                {calendarDays.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                    return (
                        <div
                            key={index}
                            className={`
                                min-h-[80px] p-2 border-r border-b border-gray-100 dark:border-zinc-800 last:border-r-0 transition-colors relative group
                                ${!day ? 'bg-gray-50/30 dark:bg-zinc-900/50' : 'bg-white dark:bg-zinc-900'} 
                            `}
                        >
                            {day && (
                                <>
                                    <div className={`text-xs font-bold mb-2 transition-colors flex items-center justify-center w-6 h-6 rounded-lg ${
                                        isToday 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                                    }`}>
                                        {day}
                                    </div>
                                    <div className="flex flex-col gap-1.5 overflow-hidden">
                                        {dayEvents.map((event, i) => (
                                            <div
                                                key={i}
                                                title={event.data.title}
                                                className={`
                                                    text-[9px] p-1.5 border border-transparent leading-tight truncate transition-all rounded-lg font-bold flex items-center gap-1
                                                    ${getEventStyle(event.type)}
                                                `}
                                            >
                                                <span className="shrink-0">{getEventPrefix(event.type)}</span>
                                                <span className="truncate">{event.data.title}</span>
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
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap justify-center gap-5 bg-gray-50/50 dark:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Activitats</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Exàmens</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Esdeveniments</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Festius</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.5)]"></div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vagues</span>
                </div>
            </div>
        </div>
    );
};
