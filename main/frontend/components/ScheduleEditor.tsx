import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, Trash2, AlertCircle } from 'lucide-react';
import { ClassSession, Course } from '../types';
import { API_BASE_URL } from '../config';

interface ScheduleEditorProps {
    courses: Course[];
    onScheduleChange?: () => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const START_HOUR = 8;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ courses, onScheduleChange }) => {
    const [schedule, setSchedule] = useState<ClassSession[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
    const [remainingHours, setRemainingHours] = useState<{ total: number, remaining: number }>({ total: 0, remaining: 0 });
    const [error, setError] = useState<string | null>(null);

    const fetchSchedule = () => {
        fetch(`${API_BASE_URL}/api/schedule`)
            .then(res => res.json())
            .then(data => setSchedule(data.map((s: any) => ({ ...s, id: s._id }))))
            .catch(err => console.error('Error fetching schedule:', err));
    };

    const fetchRemainingHours = (courseId: string) => {
        if (!courseId) return;
        fetch(`${API_BASE_URL}/api/courses/${courseId}/remaining-hours`)
            .then(res => res.json())
            .then(data => setRemainingHours(data))
            .catch(err => console.error('Error fetching remaining hours:', err));
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    useEffect(() => {
        fetchRemainingHours(selectedCourseId);
    }, [selectedCourseId, schedule]);

    const handleAddSession = (day: number, hour: number) => {
        setError(null);
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

        const newSession = {
            courseId: selectedCourseId,
            day,
            startTime,
            endTime,
            classroom: 'Aula Única'
        };

        fetch(`${API_BASE_URL}/api/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSession)
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al añadir sesión');
            fetchSchedule();
            onScheduleChange?.();
        })
        .catch(err => setError(err.message));
    };

    const handleDeleteSession = (id: string) => {
        fetch(`${API_BASE_URL}/api/schedule/${id}`, { method: 'DELETE' })
            .then(() => {
                fetchSchedule();
                onScheduleChange?.();
            })
            .catch(err => console.error('Error deleting session:', err));
    };

    const isPatio = (h: number) => h === 11;
    const isDescanso = (h: number) => h === 14;

    const getSessionAt = (day: number, hour: number) => {
        return schedule.find(s => s.day === day && parseInt(s.startTime.split(':')[0]) === hour);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Asignatura:</label>
                    <select 
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <span className="text-gray-500">Bolsa Semanal:</span>
                        <span className="ml-2 font-bold text-blue-600">{remainingHours.total}h</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Restante:</span>
                        <span className={`ml-2 font-bold ${remainingHours.remaining === 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {remainingHours.remaining}h
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-zinc-700">
                <div className="grid grid-cols-[80px_repeat(5,1fr)] min-w-[800px] bg-white dark:bg-zinc-900">
                    {/* Header */}
                    <div className="h-12 bg-gray-50 dark:bg-zinc-800 border-b border-r border-gray-200 dark:border-zinc-700"></div>
                    {DAYS.map(d => (
                        <div key={d} className="h-12 flex items-center justify-center font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50 dark:bg-zinc-800 border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                            {d}
                        </div>
                    ))}

                    {/* Body */}
                    {HOURS.map(h => (
                        <React.Fragment key={h}>
                            <div className="h-16 flex items-center justify-center text-xs font-medium text-gray-400 border-b border-r border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/20">
                                {h}:00
                            </div>
                            {DAYS.map((_, i) => {
                                const day = i + 1;
                                const session = getSessionAt(day, h);
                                const patio = isPatio(h);
                                const descanso = isDescanso(h);
                                const blocked = patio || descanso;

                                return (
                                    <div key={`${day}-${h}`} className={`h-16 border-b border-r border-gray-100 dark:border-zinc-800 relative group transition-colors ${blocked ? 'bg-gray-100/50 dark:bg-zinc-800/50 cursor-not-allowed' : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}`}>
                                        {blocked ? (
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter opacity-50">
                                                {patio ? 'Patio' : 'Comida'}
                                            </span>
                                        ) : session ? (
                                            <div className={`absolute inset-1 p-2 rounded-lg flex flex-col justify-between border shadow-sm ${session.courseId === selectedCourseId ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400'}`}>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-bold truncate leading-none">
                                                        {courses.find(c => c.id === session.courseId)?.title || 'Asignatura'}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 text-[8px] opacity-70">
                                                    <MapPin size={8} /> {session.classroom}
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleAddSession(day, h)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-blue-500 transition-all transform scale-90 group-hover:scale-100"
                                                title="Añadir sesión de 1h"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
