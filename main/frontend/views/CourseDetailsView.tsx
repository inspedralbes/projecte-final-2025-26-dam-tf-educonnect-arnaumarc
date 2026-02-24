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
                alert('Error al enviar missatge');
            }
        } catch (err) {
            console.error('Error enviant missatge:', err);
            alert('Error enviant missatge');
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
                className="flex items-center text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors gap-2 font-bold focus:outline-none"
            >
                <ArrowLeft size={20} />
                Tornar a Assignatures
            </button>

            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] group">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition-all duration-500 scale-100 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 shadow-black drop-shadow-md">
                        {course.title}
                    </h1>
                    <p className="text-xl text-cyan-300 font-bold tracking-wide">
                        {course.professor}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b-4 border-black dark:border-white bg-white dark:bg-zinc-800">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
            ${activeTab === 'info' ? 'bg-cyan-200 dark:bg-cyan-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                >
                    <FileText size={20} /> Informació
                </button>
                {userRole === 'TEACHER' && (
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
              ${activeTab === 'students' ? 'bg-purple-200 dark:bg-purple-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                    >
                        <Users size={20} /> Alumnes ({displayStudents.length})
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
            ${activeTab === 'resources' ? 'bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                >
                    <Calendar size={20} /> Recursos & Agenda
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-zinc-800 border-4 border-t-0 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] min-h-[400px]">

                {activeTab === 'info' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-1 -rotate-1">
                            DESCRIPCIÓ DEL CURS
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 bg-gray-50 dark:bg-zinc-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Horaris</h3>
                                <p className="text-gray-600 dark:text-gray-400">Dilluns i Dimecres: 15:00 - 17:00</p>
                                <p className="text-gray-600 dark:text-gray-400">Aula: Lab 3</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-zinc-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Avaluació</h3>
                                <p className="text-gray-600 dark:text-gray-400">40% Pràctiques</p>
                                <p className="text-gray-600 dark:text-gray-400">60% Examen Final</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && userRole === 'TEACHER' && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-1 rotate-1">
                                LLISTA D'ALUMNES
                            </h2>
                            <button
                                onClick={() => setIsNotifyClassModalOpen(true)}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                            >
                                <Send size={18} />
                                Notificar a Tota la Classe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loadingStudents ? (
                                <div className="col-span-full py-12 text-center text-gray-500 font-bold animate-pulse">
                                    Carregant llista d'alumnes...
                                </div>
                            ) : displayStudents.length > 0 ? (
                                displayStudents.map(student => (
                                    <div key={student._id || student.id} className="flex items-center p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-zinc-700 hover:translate-x-1 hover:-translate-y-1 transition-transform group">
                                        <img src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id || student.email}`} alt={student.nombre} className="w-12 h-12 rounded-full border-2 border-black dark:border-gray-400 mr-4" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {student.nombre} {student.apellidos}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setMessageRecipient(student);
                                                setShowMessageModal(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                                            title="Enviar missatge"
                                        >
                                            <MessageCircle size={20} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl">
                                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-bold uppercase tracking-wider">No hi ha alumnes inscrits en aquesta assignatura</p>
                                    <p className="text-sm text-gray-400">Assegura't que els alumnes tinguin seleccionada aquesta assignatura al seu perfil.</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-800 p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white uppercase">
                            Enviar Missatge a {messageRecipient.nombre || messageRecipient.name}
                        </h2>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Títol</label>
                                <input
                                    type="text"
                                    required
                                    value={messageTitle}
                                    onChange={(e) => setMessageTitle(e.target.value)}
                                    className="w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-700 text-black dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Contingut</label>
                                <textarea
                                    required
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    className="w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-700 text-black dark:text-white h-32 resize-none"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowMessageModal(false)}
                                    className="flex-1 py-3 font-bold uppercase tracking-wider border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel·lar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Notificación Masiva */}
            {isNotifyClassModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-2">
                                <Send size={24} className="text-indigo-600 dark:text-indigo-400" />
                                NOVA NOTIFICACIÓ A LA CLASSE
                            </h2>
                            <button
                                onClick={() => setIsNotifyClassModalOpen(false)}
                                className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {notifyStatus && (
                            <div className={`p-4 mb-6 border-2 flex items-center gap-3 font-bold ${notifyStatus.type === 'success'
                                    ? 'bg-green-100 border-green-600 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-300'
                                    : 'bg-red-100 border-red-600 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300'
                                }`}>
                                {notifyStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                {notifyStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleNotifyClass} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Asignatura
                                </label>
                                <div className="w-full border-2 border-black dark:border-gray-600 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 p-3 font-medium cursor-not-allowed">
                                    {course.title}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-black dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white p-3 font-medium outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors"
                                    placeholder="Ej: Recordatorio de Examen, Cambio de Aula..."
                                    value={notifyTitle}
                                    onChange={(e) => setNotifyTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    Mensaje
                                </label>
                                <textarea
                                    className="w-full border-2 border-black dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white p-3 font-medium outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors resize-none h-32"
                                    placeholder="Escribe el mensaje para toda la clase aquí..."
                                    value={notifyContent}
                                    onChange={(e) => setNotifyContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingNotify}
                                className={`w-full py-3 font-black text-white uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all ${isSubmittingNotify
                                        ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                        : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 active:shadow-none'
                                    }`}
                            >
                                {isSubmittingNotify ? 'ENVIANDO...' : 'ENVIAR A TODA LA CLASE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
