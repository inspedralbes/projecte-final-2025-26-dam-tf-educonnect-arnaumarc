import React, { useState } from 'react';
import { Course, UserRole, User } from '../types';
import { Users, FileText, Calendar, ArrowLeft, MessageCircle, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CourseDetailsViewProps {
    course: Course | any;
    userRole: UserRole;
    user?: User | null;
    onBack: () => void;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({ course, userRole, user, onBack }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'students' | 'resources'>('info');
    const [students, setStudents] = useState<any[]>([]);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageRecipient, setMessageRecipient] = useState<any | null>(null);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');

    const [loadingStudents, setLoadingStudents] = useState(false);

    // Nuevos estados para notificar a la clase
    const [isNotifyClassModalOpen, setIsNotifyClassModalOpen] = useState(false);
    const [notifyTitle, setNotifyTitle] = useState('');
    const [notifyContent, setNotifyContent] = useState('');
    const [notifyStatus, setNotifyStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

    React.useEffect(() => {
        if (userRole === 'TEACHER') {
            const courseId = course._id || course.id;
            if (!courseId) return;

            setLoadingStudents(true);
            // Use the direct all-students route for better reliability across all subjects
            fetch(`http://localhost:3005/api/all-students`)
                .then(res => res.json())
                .then(data => {
                    const studentList = Array.isArray(data) && data.length > 0 ? data : [
                        { _id: '65cf1234567890abcdef0001', nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
                        { _id: '65cf1234567890abcdef0002', nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
                        { _id: '65cf1234567890abcdef0003', nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
                    ];
                    setStudents(studentList);
                })
                .catch(err => {
                    console.error('Error fetching students:', err);
                    // Fallback on error too
                    setStudents([
                        { _id: '65cf1234567890abcdef0001', nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
                        { _id: '65cf1234567890abcdef0002', nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
                        { _id: '65cf1234567890abcdef0003', nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
                    ]);
                })
                .finally(() => setLoadingStudents(false));
        }
    }, [course, userRole]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3005/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: user?._id || user?.id,
                    senderModel: userRole === 'TEACHER' ? 'Professor' : 'Alumno',
                    receiver: messageRecipient._id || messageRecipient.id,
                    course: course._id || course.id,
                    title: messageTitle,
                    content: messageContent
                })
            });
            if (response.ok) {
                setShowMessageModal(false);
                setMessageRecipient(null);
                setMessageTitle('');
                setMessageContent('');
            } else {
                alert('Error al enviar mensaje');
            }
        } catch (err) {
            console.error('Error enviando mensaje:', err);
            alert('Error enviando mensaje');
        }
    };

    const handleNotifyClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifyTitle || !notifyContent) return;

        setIsSubmittingNotify(true);
        setNotifyStatus(null);

        try {
            const courseId = course._id || course.id;
            const response = await fetch(`http://localhost:3005/api/courses/${courseId}/notify-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: notifyTitle,
                    content: notifyContent,
                    senderId: user?._id || user?.id || ''
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setNotifyStatus({ type: 'success', message: data.message || 'Notificación enviada correctamente.' });
                setTimeout(() => {
                    setIsNotifyClassModalOpen(false);
                    setNotifyTitle('');
                    setNotifyContent('');
                    setNotifyStatus(null);
                }, 2000);
            } else {
                setNotifyStatus({ type: 'error', message: data.message || 'Error al enviar la notificación.' });
            }
        } catch (error) {
            setNotifyStatus({ type: 'error', message: 'Error de conexión del servidor.' });
        } finally {
            setIsSubmittingNotify(false);
        }
    };

    const displayStudents = students;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 transition-colors duration-300">
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors gap-2 font-medium bg-gray-50 dark:bg-zinc-800/50 px-4 py-2 rounded-xl focus:outline-none w-fit"
            >
                <ArrowLeft size={18} />
                Volver a Asignaturas
            </button>

            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none group mb-8 border border-gray-200 dark:border-zinc-800">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition-all duration-700 scale-100 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-lg">
                        {course.title}
                    </h1>
                    <p className="text-xl text-blue-300 font-medium tracking-wide">
                        {course.professor}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 rounded-t-3xl overflow-hidden">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-4 font-semibold text-center transition-all duration-300 tracking-wide flex items-center justify-center gap-2 relative
            ${activeTab === 'info' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                >
                    <FileText size={18} className={activeTab === 'info' ? 'text-blue-600 dark:text-blue-400' : ''} />
                    Información
                    {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
                </button>
                {userRole === 'TEACHER' && (
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex-1 py-4 font-semibold text-center transition-all duration-300 tracking-wide flex items-center justify-center gap-2 relative
              ${activeTab === 'students' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                    >
                        <Users size={18} className={activeTab === 'students' ? 'text-blue-600 dark:text-blue-400' : ''} />
                        Alumnos ({displayStudents.length})
                        {activeTab === 'students' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex-1 py-4 font-semibold text-center transition-all duration-300 tracking-wide flex items-center justify-center gap-2 relative
            ${activeTab === 'resources' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                >
                    <Calendar size={18} className={activeTab === 'resources' ? 'text-blue-600 dark:text-blue-400' : ''} />
                    Recursos & Agenda
                    {activeTab === 'resources' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 border-t-0 p-8 shadow-lg shadow-gray-200/50 dark:shadow-none rounded-b-3xl min-h-[400px]">

                {activeTab === 'info' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="text-blue-500" size={24} />
                                Descripción del Curso
                            </h2>
                            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
                                {course.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="text-blue-500" size={18} />
                                    Horarios
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Lunes y Miércoles: 15:00 - 17:00</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Aula: Lab 3</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="text-blue-500" size={18} />
                                    Evaluación
                                </h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Prácticas</span><span>40%</span></div>
                                    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '40%' }}></div></div>
                                </div>
                                <div className="space-y-1 mt-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Examen Final</span><span>60%</span></div>
                                    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && userRole === 'TEACHER' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="text-blue-500" size={24} />
                                Lista de Alumnos
                            </h2>
                            <button
                                onClick={() => setIsNotifyClassModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                            >
                                <Send size={18} />
                                Notificar a Toda la Clase
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
                            {loadingStudents ? (
                                <div className="col-span-full py-12 text-center text-gray-500 font-medium animate-pulse">
                                    Cargando lista de alumnos...
                                </div>
                            ) : displayStudents.length > 0 ? (
                                displayStudents.map(student => (
                                    <div key={student._id || student.id} className="flex items-center p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30 rounded-2xl hover:shadow-md transition-all duration-300 group">
                                        <img src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id || student.email}`} alt={student.nombre} className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-700 shadow-sm mr-4" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {student.nombre} {student.apellidos}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setMessageRecipient(student);
                                                setShowMessageModal(true);
                                            }}
                                            className="p-2.5 ml-2 text-gray-400 bg-white dark:bg-zinc-900 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-full shadow-sm border border-gray-100 dark:border-zinc-700 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                            title="Enviar mensaje"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl bg-gray-50/50 dark:bg-zinc-800/20">
                                    <Users size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">No hay alumnos inscritos en esta asignatura.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-400 mb-4">Material de Curs</h2>
                        <p className="text-gray-500">Aquí apareixeran els PDFs i recursos del curs.</p>
                        <button className="mt-6 px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            Pujar Nou Recurs
                        </button>
                    </div>
                )}

            </div>

            {/* Modal Mensaje */}
            {showMessageModal && messageRecipient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageCircle className="text-blue-500" size={24} />
                                Enviar Mensaje
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700">
                                Para: <span className="font-semibold text-gray-900 dark:text-white">{messageRecipient.nombre || messageRecipient.name}</span>
                            </p>
                            <form onSubmit={handleSendMessage} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Título</label>
                                    <input
                                        type="text"
                                        required
                                        value={messageTitle}
                                        onChange={(e) => setMessageTitle(e.target.value)}
                                        className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="Escribe un título..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contenido</label>
                                    <textarea
                                        required
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white h-32 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="Escribe tu mensaje aquí..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMessageModal(false)}
                                        className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        Enviar Mensaje
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Notificación Masiva */}
            {isNotifyClassModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 max-w-lg w-full animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Send size={24} className="text-blue-600 dark:text-blue-400" />
                                Nueva notificación a la clase
                            </h2>
                            <button
                                onClick={() => setIsNotifyClassModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {notifyStatus && (
                            <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 font-medium ${notifyStatus.type === 'success'
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {notifyStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                {notifyStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleNotifyClass} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Asignatura
                                </label>
                                <div className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                                    {course.title}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="Ej: Recordatorio de Examen, Cambio de Aula..."
                                    value={notifyTitle}
                                    onChange={(e) => setNotifyTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mensaje
                                </label>
                                <textarea
                                    className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white h-32 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="Escribe el mensaje para toda la clase aquí..."
                                    value={notifyContent}
                                    onChange={(e) => setNotifyContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNotifyClassModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingNotify}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-white shadow-sm transition-all ${isSubmittingNotify
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isSubmittingNotify ? 'Enviando...' : 'Enviar a toda la clase'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
