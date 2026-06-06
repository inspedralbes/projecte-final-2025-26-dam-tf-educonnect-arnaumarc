import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ClassSession, Course } from '../types';
import { API_BASE_URL } from '../config';

interface ScheduleEditorProps {
    courses: Course[];
    onScheduleChange?: () => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const CLASSROOMS = ['Aula Única'];
const START_HOUR = 8;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
    const h = START_HOUR + i;
    return `${h.toString().padStart(2, '0')}:00`;
});

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ courses, onScheduleChange }) => {
    const [schedule, setSchedule] = useState<ClassSession[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
    const [selectedClassroom] = useState<string>(CLASSROOMS[0]);
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [remainingHours, setRemainingHours] = useState<{ total: number, remaining: number }>({ total: 0, remaining: 0 });
    const [error, setError] = useState<string | null>(null);

    // Auto-select first course when courses load
    useEffect(() => {
        if (courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0].id);
        }
    }, [courses]);

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':').map(Number);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const fetchSchedule = () => {
        fetch(`${API_BASE_URL}/api/schedule`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSchedule(data.map((s: any) => ({
                        ...s,
                        id: s._id,
                        startTime: formatTime(s.startTime),
                        endTime: formatTime(s.endTime)
                    })));
                } else {
                    setSchedule([]);
                }
            })
            .catch(err => {
                console.error('Error fetching schedule:', err);
                setSchedule([]);
            });
    };

    const fetchRemainingHours = (courseId: string) => {
        if (!courseId) return;
        fetch(`${API_BASE_URL}/api/courses/${courseId}/remaining-hours`)
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.remaining === 'number') {
                    setRemainingHours(data);
                }
            })
            .catch(err => console.error('Error fetching remaining hours:', err));
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    useEffect(() => {
        fetchRemainingHours(selectedCourseId);
    }, [selectedCourseId, schedule]);

    const handleAddSession = (day: number, timeStr: string) => {
        setError(null);
        const [h, m] = timeStr.split(':').map(Number);
        const startTime = timeStr;

        const totalMinutes = h * 60 + m + (selectedDuration * 60);
        const endH = Math.floor(totalMinutes / 60);
        const endM = totalMinutes % 60;

        const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

        const newSession = {
            courseId: selectedCourseId,
            day,
            startTime,
            endTime
            // classroom is now forced by backend
        };

        fetch(`${API_BASE_URL}/api/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSession)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al añadir sesión');
                toast.success('Sesión añadida correctamente');
                fetchSchedule();
                onScheduleChange?.();
            })
            .catch(err => {
                setError(err.message);
                toast.error(err.message);
            });
    };

    const handleDeleteSession = (id: string) => {
        fetch(`${API_BASE_URL}/api/schedule/${id}`, { method: 'DELETE' })
            .then(() => {
                toast.success('Sesión eliminada');
                fetchSchedule();
                onScheduleChange?.();
            })
            .catch(err => {
                console.error('Error deleting session:', err);
                toast.error('Error al eliminar la sesión');
            });
    };

    const isPatio = (timeStr: string) => {
        const [h] = timeStr.split(':').map(Number);
        // Patio is 11:00 - 11:30. In a 1h grid, the 11:00 block is affected.
        return h === 11;
    };

    const isDescanso = (timeStr: string) => {
        const [h] = timeStr.split(':').map(Number);
        // Comida is 15:30 - 17:00. In a 1h grid, blocks 15:00 and 16:00 are affected.
        return h === 15 || h === 16;
    };

    const getSessionAt = (day: number, timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const currentMinutes = h * 60 + m;

        return schedule.find(s => {
            if (s.day !== day) return false;
            const [sH, sM] = s.startTime.split(':').map(Number);
            const startMinutes = sH * 60 + sM;

            // In a 1h grid, sessions can only start at the beginning of the hour
            return startMinutes === currentMinutes;
        });
    };

    const isSlotOccupied = (day: number, timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const currentMinutes = h * 60 + m;

        return schedule.some(s => {
            if (s.day !== day) return false;
            const [sH, sM] = s.startTime.split(':').map(Number);
            const [eH, eM] = s.endTime.split(':').map(Number);
            const startMinutes = sH * 60 + sM;
            const endMinutes = eH * 60 + eM;

            return currentMinutes >= startMinutes && currentMinutes < endMinutes;
        });
    };

    const getSessionSpan = (session: ClassSession) => {
        const [sH, sM] = session.startTime.split(':').map(Number);
        const [eH, eM] = session.endTime.split(':').map(Number);
        const durationMinutes = (eH * 60 + eM) - (sH * 60 + sM);
        // Each row is now 60 minutes
        return Math.round(durationMinutes / 60);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-700">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Assignatura:</label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
                        >
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Duración:</label>
                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(parseFloat(e.target.value))}
                            className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={1}>1 hora</option>
                            <option value={2}>2 horas</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <span className="text-gray-500">Hores setmanals:</span>
                        <span className="ml-2 font-bold text-blue-600">{remainingHours.total}h</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Restantes:</span>
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

            <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-zinc-700 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-[80px_repeat(5,1fr)] min-w-[800px] bg-white dark:bg-zinc-900">
                    {/* Header */}
                    <div className="h-12 sticky top-0 z-20 bg-gray-50 dark:bg-zinc-800 border-b border-r border-gray-200 dark:border-zinc-700"></div>
                    {DAYS.map(d => (
                        <div key={d} className="h-12 sticky top-0 z-20 flex items-center justify-center font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50 dark:bg-zinc-800 border-b border-r border-gray-200 dark:border-zinc-700 last:border-r-0">
                            {d}
                        </div>
                    ))}

                    {/* Body */}
                    {HOURS.map(timeStr => (
                        <React.Fragment key={timeStr}>
                            <div className="h-12 flex items-start justify-center pt-2 text-[10px] font-bold text-gray-400 border-b border-r border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/20">
                                {timeStr}
                            </div>
                            {DAYS.map((_, i) => {
                                const day = i + 1;
                                const session = getSessionAt(day, timeStr);
                                const occupied = isSlotOccupied(day, timeStr);
                                const patio = isPatio(timeStr);
                                const descanso = isDescanso(timeStr);
                                const blocked = patio || descanso;

                                return (
                                    <div key={`${day}-${timeStr}`} className={`h-12 border-b border-r border-gray-100 dark:border-zinc-800 relative group transition-colors ${blocked ? 'bg-gray-100/50 dark:bg-zinc-800/50 cursor-not-allowed' : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}`}>
                                        {blocked ? (
                                            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter opacity-50">
                                                {patio ? 'Patio (11:00-11:30)' : 'Comida (15:30-17:00)'}
                                            </span>
                                        ) : session ? (
                                            <div
                                                className={`absolute inset-x-1 top-0 z-10 p-2 rounded-lg flex flex-col justify-between border shadow-md transition-all ${session.courseId === selectedCourseId ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-200' : 'bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-400 grayscale-[0.5]'}`}
                                                style={{ height: `calc(${getSessionSpan(session)} * 3rem - 1px)` }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-black truncate leading-none uppercase">
                                                        {courses.find(c => c.id === session.courseId)?.title || 'Ocupat'}
                                                    </span>
                                                    {courses.some(c => c.id === session.courseId) && (
                                                        <button
                                                            onClick={() => handleDeleteSession(session.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-[9px] font-bold opacity-80">
                                                    <Clock size={10} /> {session.startTime} - {session.endTime}
                                                </div>
                                            </div>
                                        ) : occupied ? null : (
                                            <button
                                                onClick={() => handleAddSession(day, timeStr)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-blue-500 transition-all transform scale-90 group-hover:scale-100"
                                                title="Afegir sessió"
                                            >
                                                <Plus size={16} />
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
