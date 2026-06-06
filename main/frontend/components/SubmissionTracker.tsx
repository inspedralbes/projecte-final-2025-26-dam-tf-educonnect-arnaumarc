import React, { useState } from 'react';
import { X, Clock, AlertCircle, CheckCircle2, Send, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Student {
    _id: string;
    nombre: string;
    apellidos: string;
    profileImage?: string;
}

interface Submission {
    _id: string;
    studentId: any;
    status: 'A TIEMPO' | 'TARDE';
    content: string;
    submittedAt: string;
    submissionType: 'file' | 'comment' | 'done';
    grade?: number;
    feedback?: string;
}

interface SubmissionTrackerProps {
    activity: {
        id: string;
        title: string;
        type: 'resource' | 'event';
    };
    courseId: string;
    allStudents: Student[];
    submissions: Submission[];
    onClose: () => void;
    onRefresh: () => void;
    currentUserId: string;
}

export const SubmissionTracker: React.FC<SubmissionTrackerProps> = ({ 
    activity, 
    courseId, 
    allStudents, 
    submissions: activitySubmissions, 
    onClose,
    onRefresh,
    currentUserId
}) => {
    const [isSendingReminders, setIsSendingReminders] = useState(false);
    const [reminderStatus, setReminderStatus] = useState<string | null>(null);
    const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
    const [grade, setGrade] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [isSavingGrade, setIsSavingGrade] = useState(false);

    // Filtrar entregas para esta actividad específica
    const currentSubmissions = activitySubmissions.filter(s => String(s.activityId || (s as any).activityId) === String(activity.id));

    // Categoritza els alumnes
    const completed = allStudents.filter(student => 
        currentSubmissions.some(s => String(s.studentId?._id || s.studentId) === String(student._id))
    ).map(student => ({
        student,
        submission: currentSubmissions.find(s => String(s.studentId?._id || s.studentId) === String(student._id))!
    }));

    const pending = allStudents.filter(student => 
        !currentSubmissions.some(s => String(s.studentId?._id || s.studentId) === String(student._id))
    );

    const onSendReminders = async () => {
        if (pending.length === 0) return;
        setIsSendingReminders(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/submissions/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    activityId: activity.id,
                    activityTitle: activity.title,
                    pendingStudentIds: pending.map(s => s._id),
                    senderId: currentUserId
                })
            });
            if (response.ok) {
                setReminderStatus('¡Recordatorios enviados!');
                setTimeout(() => setReminderStatus(null), 3000);
            }
        } catch (error) {
            console.error('Error sending reminders:', error);
        } finally {
            setIsSendingReminders(false);
        }
    };

    const handleSaveGrade = async (submissionId: string) => {
        if (!grade || isNaN(Number(grade))) return;
        
        setIsSavingGrade(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/submissions/${submissionId}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grade: Number(grade),
                    feedback,
                    teacherId: currentUserId
                })
            });

            if (response.ok) {
                setEvaluatingId(null);
                setGrade('');
                setFeedback('');
                onRefresh();
            }
        } catch (error) {
            console.error('Error saving grade:', error);
        } finally {
            setIsSavingGrade(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                Seguimiento Live
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {activity.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {allStudents.length} alumnes en total • {completed.length} lliurats • {pending.length} pendents
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-zinc-800 rounded-2xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Columna Izquierda: Pendientes */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={18} />
                                Pendientes ({pending.length})
                            </h3>
                            {pending.length > 0 && (
                                <button
                                    onClick={onSendReminders}
                                    disabled={isSendingReminders}
                                    className="flex items-center gap-2 text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    <Send size={12} />
                                    {isSendingReminders ? 'ENVIANT...' : reminderStatus || 'RECORDAR TOTHOM'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {pending.map(student => (
                                <div key={student._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                    <img src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id}`} className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{student.nombre} {student.apellidos}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">No ha entregado</p>
                                    </div>
                                </div>
                            ))}
                            {pending.length === 0 && (
                                <div className="py-8 text-center bg-green-50 dark:bg-green-900/10 rounded-3xl border-2 border-dashed border-green-200 dark:border-green-900/20">
                                    <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2" />
                                    <p className="text-green-700 dark:text-green-400 font-bold text-sm">¡Todos han entregado!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Completados */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Entregados ({completed.length})
                        </h3>

                        <div className="space-y-3">
                            {completed.map(({ student, submission }) => (
                                <div key={student._id} className="p-4 bg-white dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id}`} className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{student.nombre} {student.apellidos}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${submission.status === 'TARDE' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                    {submission.status}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(submission.submittedAt).toLocaleString('ca-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        {submission.grade !== undefined ? (
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Nota</p>
                                                <p className="text-lg font-black text-blue-600 dark:text-blue-400">{submission.grade}</p>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    setEvaluatingId(submission._id);
                                                    setGrade('');
                                                    setFeedback('');
                                                }}
                                                className="text-[10px] font-black bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                CALIFICAR
                                            </button>
                                        )}
                                    </div>

                                    {/* Visualización del contenido */}
                                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 mb-2">
                                        {submission.submissionType === 'file' ? (
                                            <a 
                                                href={submission.content} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline"
                                            >
                                                <ExternalLink size={14} /> VER ARCHIVO ADJUNTO
                                            </a>
                                        ) : submission.submissionType === 'comment' ? (
                                            <div className="flex gap-2">
                                                <MessageCircle size={14} className="text-gray-400 shrink-0" />
                                                <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{submission.content}"</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold">
                                                <CheckCircle2 size={14} /> TAREA MARCADA COMO COMPLETADA
                                            </div>
                                        )}
                                    </div>

                                    {/* UI de Evaluación */}
                                    {evaluatingId === submission._id && (
                                        <div className="mt-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex gap-3 mb-3">
                                                <div className="w-20">
                                                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1 block">Nota (0-10)</label>
                                                    <input 
                                                        type="number" 
                                                        min="0" 
                                                        max="10" 
                                                        step="0.1"
                                                        value={grade}
                                                        onChange={(e) => setGrade(e.target.value)}
                                                        className="w-full bg-white dark:bg-zinc-900 border border-blue-200 dark:border-zinc-700 rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="8.5"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1 block">Feedback (opcional)</label>
                                                    <textarea 
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        className="w-full bg-white dark:bg-zinc-900 border border-blue-200 dark:border-zinc-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-[38px]"
                                                        placeholder="¡Buen trabajo!"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setEvaluatingId(null)}
                                                    className="px-3 py-1.5 text-[10px] font-black text-gray-500 hover:text-gray-700 uppercase"
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    disabled={isSavingGrade || !grade}
                                                    onClick={() => handleSaveGrade(submission._id)}
                                                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black hover:bg-blue-700 transition-all disabled:opacity-50"
                                                >
                                                    {isSavingGrade ? 'GUARDANDO...' : 'GUARDAR EVALUACIÓN'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mostrar Feedback guardado */}
                                    {submission.feedback && evaluatingId !== submission._id && (
                                        <div className="mt-2 flex gap-2 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                            <MessageCircle size={12} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">"{submission.feedback}"</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 flex justify-center">
                    <button 
                        onClick={onRefresh}
                        className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        <Clock size={14} /> Actualizar lista manualmente
                    </button>
                </div>
            </div>
        </div>
    );
};
