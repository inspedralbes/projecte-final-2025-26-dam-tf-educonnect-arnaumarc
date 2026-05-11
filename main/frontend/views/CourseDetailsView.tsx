import React, { useState, useEffect } from 'react';
import { Course, UserRole, User, Topic, Resource } from '../types';
import { API_BASE_URL } from '../config';
import { MOCK_SCHEDULE } from '../constants';
import {
    Users, FileText, Calendar, ArrowLeft, MessageCircle, Send, X, AlertCircle,
    CheckCircle2, Plus, ChevronDown, ChevronUp, Link, File, ClipboardList,
    Trash2, Eye, EyeOff, ExternalLink, FileDown, BookOpen, Clock, Award, Pencil, UserPlus
} from 'lucide-react';

interface CourseDetailsViewProps {
    course: Course | any;
    userRole: UserRole;
    user?: User | null;
    onBack: () => void;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({ course: initialCourse, userRole, user, onBack }) => {
    const [course, setCourse] = useState(initialCourse);
    const [activeTab, setActiveTab] = useState<'info' | 'students' | 'resources'>('info');
    const [students, setStudents] = useState<any[]>([]);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageRecipient, setMessageRecipient] = useState<any | null>(null);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');

    const [loadingStudents, setLoadingStudents] = useState(false);

    // Invite students (teachers only)
    const [isInviteStudentModalOpen, setIsInviteStudentModalOpen] = useState(false);
    const [availableStudents, setAvailableStudents] = useState<any[]>([]);
    const [loadingAvailableStudents, setLoadingAvailableStudents] = useState(false);
    const [invitingStudentId, setInvitingStudentId] = useState<string | null>(null);
    const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Nuevos estados para notificar a la clase
    const [isNotifyClassModalOpen, setIsNotifyClassModalOpen] = useState(false);
    const [notifyTitle, setNotifyTitle] = useState('');
    const [notifyContent, setNotifyContent] = useState('');
    const [notifyStatus, setNotifyStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

    // Estados para Temarios (Moodle-like)
    const [topics, setTopics] = useState<Topic[]>([]);
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicDesc, setNewTopicDesc] = useState('');

    const [showAddResourceModal, setShowAddResourceModal] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
    const [newResource, setNewResource] = useState({
        type: 'material' as Resource['type'],
        title: '',
        url: '',
        link: '',
        content: '',
        dueDate: ''
    });

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        type: 'activity' as 'activity' | 'exam' | 'event' | 'holiday' | 'strike',
        title: '',
        date: new Date().toISOString().split('T')[0],
        topicId: '',
        modality: 'digital' as 'paper' | 'digital',
        status: 'scheduled' as 'scheduled' | 'done' | 'graded'
    });
    const [courseEvents, setCourseEvents] = useState<any[]>([]);
    const [courseSchedule, setCourseSchedule] = useState<any[]>([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    const fetchTopics = async () => {
        try {
            const courseId = course._id || course.id;
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/topics`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setTopics(data);
                if (Object.keys(expandedTopics).length === 0 && data.length > 0) {
                    setExpandedTopics({ [data[0]._id]: true });
                }
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const courseId = course._id || course.id;
            const response = await fetch(`${API_BASE_URL}/api/events`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCourseEvents(data.filter(e => (e.courseId?._id || e.courseId) === courseId));
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const getTopicEvents = (topicId: string) => {
        return courseEvents.filter(e => (e.topicId?._id || e.topicId) === topicId);
    };

    const getUnassignedEvents = () => {
        return courseEvents.filter(e => !e.topicId);
    };

    const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) fetchEvents();
        } catch (error) {
            console.error('Error updating event status:', error);
        }
    };

    const fetchCourseSchedule = async () => {
        try {
            const courseId = course._id || course.id;
            setLoadingSchedule(true);
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/schedule`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setCourseSchedule(data);
            } else {
                // Fallback to MOCK_SCHEDULE if no data in DB for this course
                const mockData = MOCK_SCHEDULE.filter(s => String(s.courseId) === String(courseId));
                setCourseSchedule(mockData);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            const courseId = course._id || course.id;
            const mockData = MOCK_SCHEDULE.filter(s => String(s.courseId) === String(courseId));
            setCourseSchedule(mockData);
        } finally {
            setLoadingSchedule(false);
        }
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseId = initialCourse._id || initialCourse.id;
                const response = await fetch(`${API_BASE_URL}/api/courses`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    const currentCourse = data.find(c => (c._id || c.id) === courseId);
                    if (currentCourse) {
                        setCourse(currentCourse);
                    }
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
        fetchTopics();
        fetchEvents();
        fetchCourseSchedule();

        const courseId = initialCourse._id || initialCourse.id;
        if (!courseId) return;

        setLoadingStudents(true);
        fetch(`${API_BASE_URL}/api/courses/${courseId}/students`)
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
                setStudents([]);
            })
            .finally(() => setLoadingStudents(false));
    }, [initialCourse]);

    const fetchAvailableStudents = async () => {
        const courseId = course._id || course.id;
        if (!courseId) return;

        setLoadingAvailableStudents(true);
        setInviteStatus(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/available-students`);
            const data = await res.json();
            setAvailableStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching available students:', error);
            setAvailableStudents([]);
        } finally {
            setLoadingAvailableStudents(false);
        }
    };

    const handleInviteStudent = async (studentId: string) => {
        const courseId = course._id || course.id;
        const professorId = user?._id || (user as any)?.id;
        if (!courseId || !professorId) return;

        setInvitingStudentId(studentId);
        setInviteStatus(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/invite-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professorId, studentId })
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                setInviteStatus({ type: 'error', message: data?.message || 'No se pudo invitar al alumno' });
                return;
            }

            // Invitation is pending: do NOT enroll the student here.
            setAvailableStudents(prev => prev.filter(s => String(s._id || s.id) !== String(studentId)));
            setInviteStatus({ type: 'success', message: data?.message || 'Invitación enviada' });
        } catch (error) {
            console.error('Error inviting student:', error);
            setInviteStatus({ type: 'error', message: 'Error invitando alumno' });
        } finally {
            setInvitingStudentId(null);
        }
    };

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const courseId = course._id || course.id;
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTopicTitle,
                    description: newTopicDesc,
                    senderId: user?._id || user?.id
                })
            });
            if (response.ok) {
                setShowAddTopicModal(false);
                setNewTopicTitle('');
                setNewTopicDesc('');
                fetchTopics();
            }
        } catch (error) {
            console.error('Error creating topic:', error);
        }
    };

    const handleEditResource = (topicId: string, resource: Resource) => {
        setSelectedTopicId(topicId);
        setEditingResourceId(resource._id || null);
        setNewResource({
            type: resource.type,
            title: resource.title || '',
            url: resource.url || '',
            link: resource.link || '',
            content: resource.content || '',
            dueDate: resource.dueDate ? new Date(resource.dueDate).toISOString().split('T')[0] : ''
        });
        setShowAddResourceModal(true);
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopicId) return;

        // Validación: al menos un campo debe tener contenido
        if (!newResource.title && !newResource.content && !newResource.link && !newResource.url) {
            alert('Por favor, rellena al menos un campo (título, descripción, enlace o archivo).');
            return;
        }

        try {
            const resourceData = {
                ...newResource,
                dueDate: newResource.type === 'task' ? newResource.dueDate : undefined,
                senderId: user?._id || user?.id
            };

            const url = editingResourceId 
                ? `${API_BASE_URL}/api/topics/${selectedTopicId}/resources/${editingResourceId}`
                : `${API_BASE_URL}/api/topics/${selectedTopicId}/resources`;
            
            const method = editingResourceId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resourceData)
            });

            if (response.ok) {
                setShowAddResourceModal(false);
                setEditingResourceId(null);
                setNewResource({ type: 'material', title: '', url: '', link: '', content: '', dueDate: '' });
                fetchTopics();
            }
        } catch (error) {
            console.error('Error saving resource:', error);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const courseId = course._id || course.id;
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newEvent,
                    courseId,
                    senderId: user?._id || user?.id
                })
            });
            if (response.ok) {
                setShowAddEventModal(false);
                setNewEvent({ type: 'activity', title: '', date: new Date().toISOString().split('T')[0] });
                fetchEvents();
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const getResourceIcon = (type: Resource['type']) => {
        switch (type) {
            case 'file': return <File size={18} />;
            case 'link': return <Link size={18} />;
            case 'task': return <ClipboardList size={18} />;
            default: return <FileText size={18} />;
        }
    };

    const getResourceColor = (type: Resource['type']) => {
        switch (type) {
            case 'file': return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'link': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'task': return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este tema y todos sus recursos?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, { method: 'DELETE' });
            if (response.ok) fetchTopics();
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    };

    const handleDeleteResource = async (topicId: string, resourceId: string) => {
        if (!resourceId || !window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/resources/${resourceId}`, { method: 'DELETE' });
            if (response.ok) fetchTopics();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const handleToggleVisibility = async (topicId: string, resourceId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/resources/${resourceId}/toggle-visibility`, { method: 'PATCH' });
            if (response.ok) fetchTopics();
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/messages`, {
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
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/notify-all`, {
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
                        {typeof course.professor === 'object' ? `${course.professor.nombre} ${course.professor.apellidos}` : (course.professor || 'Profesor')}
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
                <button
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 py-4 font-semibold text-center transition-all duration-300 tracking-wide flex items-center justify-center gap-2 relative
              ${activeTab === 'students' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                >
                    <Users size={18} className={activeTab === 'students' ? 'text-blue-600 dark:text-blue-400' : ''} />
                    Alumnos ({displayStudents.length})
                    {activeTab === 'students' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
                </button>
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
                                {loadingSchedule ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Cargando horarios...</p>
                                ) : courseSchedule.length > 0 ? (
                                    courseSchedule.map((s, idx) => (
                                        <div key={s._id || idx} className="mb-1 last:mb-0">
                                            <p className="text-gray-900 dark:text-white font-medium text-sm">
                                                {DAYS[s.day - 1]}: {s.startTime} - {s.endTime}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">Aula: {s.classroom}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No hay horarios programados.</p>
                                )}
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="text-blue-500" size={18} />
                                    Miembros de la Clase
                                </h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {loadingStudents ? (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse border-2 border-white dark:border-zinc-800"></div>
                                        ) : displayStudents.slice(0, 5).map((student, i) => (
                                            <img
                                                key={student._id || i}
                                                className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-zinc-800 object-cover"
                                                src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id}`}
                                                alt={student.nombre}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm font-medium">
                                        <span className="text-blue-600 dark:text-blue-400">{loadingStudents ? '...' : displayStudents.length}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">alumnos matriculados</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('students')}
                                    className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 w-fit"
                                >
                                    Ver todos los miembros <ArrowLeft size={14} className="rotate-180" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl flex flex-col gap-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="text-blue-500" size={18} />
                                    Información del Docente
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-bold text-gray-900 dark:text-white mr-2">Especialidad:</span>
                                        {typeof course.professor === 'object' ? course.professor.especialidad : 'Especialista en Educación'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-bold text-gray-900 dark:text-white mr-2">Contacto:</span>
                                        {typeof course.professor === 'object' ? course.professor.email : 'contacto@educonnect.com'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (typeof course.professor === 'object') {
                                            setMessageRecipient(course.professor);
                                            setShowMessageModal(true);
                                        }
                                    }}
                                    className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all w-fit"
                                >
                                    <MessageCircle size={16} />
                                    Enviar Mensaje Directo
                                </button>
                            </div>

                            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl flex flex-col gap-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="text-indigo-500" size={18} />
                                    Carga Académica
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-white dark:bg-zinc-800 p-3 rounded-xl border border-indigo-50 dark:border-zinc-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dedicación Semanal</span>
                                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{course.totalWeeklyHours || 4}h</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                        * Las horas incluyen clases presenciales y tiempo estimado de trabajo autónomo.
                                    </p>
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
                             <div className="flex flex-wrap gap-3">
                                 <button
                                     onClick={() => {
                                         setIsInviteStudentModalOpen(true);
                                         fetchAvailableStudents();
                                     }}
                                     className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                 >
                                     <UserPlus size={18} />
                                     Invitar nuevo Alumno
                                 </button>
                                 <button
                                     onClick={() => setIsNotifyClassModalOpen(true)}
                                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                 >
                                     <Send size={18} />
                                     Notificar a Toda la Clase
                                 </button>
                             </div>
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="text-blue-500" size={24} />
                                Planificación Temática
                            </h2>
                            {userRole === 'TEACHER' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAddTopicModal(true)}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <Plus size={18} />
                                        Añadir Tema
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Eventos sin clasificar (Migración/Generales) */}
                        {getUnassignedEvents().length > 0 && (
                            <div className="mb-8 p-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-gray-50/30 dark:bg-zinc-900/20">
                                <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    Eventos Generales / Sin Clasificar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getUnassignedEvents().map(event => (
                                        <div key={event._id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 group">
                                            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-xl p-2 min-w-[50px] shadow-sm border border-gray-100 dark:border-zinc-700">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                                                <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-1 inline-block ${event.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    {event.type === 'exam' ? 'Examen' : 'Actividad'}
                                                </span>
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate">{event.title}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {topics.length > 0 ? (
                                topics.map((topic) => (
                                    <div key={topic._id} className="border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-sm transition-all border-l-4 border-l-blue-500">
                                        <div className="p-6 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/30">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{topic.title}</h3>
                                                {topic.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{topic.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {userRole === 'TEACHER' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { setSelectedTopicId(topic._id); setShowAddResourceModal(true); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                                                            title="Añadir recurso"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setNewEvent({ ...newEvent, topicId: topic._id }); setShowAddEventModal(true); }}
                                                            className="p-2 text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-xl transition-all"
                                                            title="Añadir hito (Examen/Entrega)"
                                                        >
                                                            <Calendar size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTopic(topic._id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                            title="Eliminar tema"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => setExpandedTopics(prev => ({ ...prev, [topic._id]: !prev[topic._id] }))}
                                                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700"
                                                >
                                                    {expandedTopics[topic._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedTopics[topic._id] && (
                                            <div className="p-6 space-y-8 bg-white dark:bg-zinc-900/20 border-t border-gray-100 dark:border-zinc-800">
                                                
                                                {/* Sección de Recursos del Tema */}
                                                <div>
                                                    <h4 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <FileText size={14} />
                                                        Materiales y Recursos
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {topic.resources && topic.resources.length > 0 ? (
                                                            topic.resources
                                                                .filter(r => userRole === 'TEACHER' || r.visible)
                                                                .map((resource, idx) => (
                                                                    <div key={resource._id || idx} className={`p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all group ${!resource.visible ? 'opacity-50 grayscale' : ''}`}>
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex items-start gap-4 flex-1">
                                                                                <div className={`p-3 rounded-2xl shrink-0 ${getResourceColor(resource.type)} shadow-sm`}>
                                                                                    {getResourceIcon(resource.type)}
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">
                                                                                            {resource.title || 'Recurso sin título'}
                                                                                        </h4>
                                                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${resource.type === 'task' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                                            {resource.type === 'task' ? 'Tarea' : 'Material'}
                                                                                        </span>
                                                                                    </div>
                                                                                    
                                                                                    {resource.content && (
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">{resource.content}</p>
                                                                                    )}

                                                                                    <div className="flex flex-wrap gap-3">
                                                                                        {resource.link && (
                                                                                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors">
                                                                                                <Link size={12} /> ENLACE WEB
                                                                                            </a>
                                                                                        )}
                                                                                        {resource.url && (
                                                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors">
                                                                                                <FileDown size={12} /> DESCARGAR ARCHIVO
                                                                                            </a>
                                                                                        )}
                                                                                        {resource.dueDate && (
                                                                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg">
                                                                                                <Clock size={12} /> ENTREGA: {new Date(resource.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                {userRole === 'TEACHER' && (
                                                                                    <>
                                                                                        <button
                                                                                            onClick={() => handleToggleVisibility(topic._id, resource._id!)}
                                                                                            className="p-2 text-gray-400 hover:text-blue-500 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                                                                        >
                                                                                            {resource.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleEditResource(topic._id, resource)}
                                                                                            className="p-2 text-gray-400 hover:text-amber-500 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
                                                                                            title="Editar recurso"
                                                                                        >
                                                                                            <Pencil size={18} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleDeleteResource(topic._id, resource._id!)}
                                                                                            className="p-2 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                                                        >
                                                                                            <Trash2 size={18} />
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <p className="text-sm text-gray-400 italic py-2">No hay materiales en este tema.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Sección de Hitos (Agenda) del Tema */}
                                                <div>
                                                    <h4 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        Hitos y Evaluación
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {getTopicEvents(topic._id).length > 0 ? (
                                                            getTopicEvents(topic._id).map(event => (
                                                                <div key={event._id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                                                    event.status === 'done' || event.status === 'graded' 
                                                                    ? 'bg-green-50/30 border-green-100 dark:bg-green-900/10 dark:border-green-900/20' 
                                                                    : 'bg-pink-50/30 border-pink-100 dark:bg-pink-900/10 dark:border-pink-900/20'
                                                                }`}>
                                                                    <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-800 rounded-xl p-2 min-w-[50px] shadow-sm border border-pink-100 dark:border-zinc-700">
                                                                        <span className="text-[10px] font-black text-pink-500 uppercase">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                                                                        <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                                                event.modality === 'paper' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                                            }`}>
                                                                                {event.modality === 'paper' ? 'Papel' : 'Digital'}
                                                                            </span>
                                                                            {event.status !== 'scheduled' && (
                                                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-green-100 text-green-600`}>
                                                                                    {event.status === 'done' ? 'Realizado' : 'Calificado'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{event.title}</h4>
                                                                    </div>
                                                                    {userRole === 'TEACHER' && (
                                                                        <div className="flex flex-col gap-1">
                                                                            {event.status === 'scheduled' && (
                                                                                <button 
                                                                                    onClick={() => handleUpdateEventStatus(event._id, 'done')}
                                                                                    className="p-1.5 text-gray-400 hover:text-green-600 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 transition-all"
                                                                                    title="Marcar como realizado"
                                                                                >
                                                                                    <CheckCircle2 size={16} />
                                                                                </button>
                                                                            )}
                                                                            {event.status === 'done' && (
                                                                                <button 
                                                                                    onClick={() => handleUpdateEventStatus(event._id, 'graded')}
                                                                                    className="p-1.5 text-gray-400 hover:text-blue-600 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 transition-all"
                                                                                    title="Marcar como calificado"
                                                                                >
                                                                                    <Award size={16} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-400 italic col-span-full">No hay hitos programados para este tema.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[2.5rem] bg-gray-50/50 dark:bg-zinc-900/30">
                                    <BookOpen size={64} className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 text-lg font-bold">No hay temas definidos para esta asignatura.</p>
                                    <p className="text-gray-500 text-sm mt-1">Planifica los bloques de ejercicios, apuntes y actividades.</p>
                                    {userRole === 'TEACHER' && (
                                        <button
                                            onClick={() => setShowAddTopicModal(true)}
                                            className="mt-6 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                        >
                                            + Crear el primer bloque
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Modals */}

            {/* Modal Añadir Tema */}
            {showAddTopicModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="text-indigo-500" size={28} />
                                Nuevo Tema / Bloque
                            </h2>
                            <form onSubmit={handleCreateTopic} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Título del Tema</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTopicTitle}
                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Ej: Tema 1: Introducción a la algoritmia"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Descripción (Opcional)</label>
                                    <textarea
                                        value={newTopicDesc}
                                        onChange={(e) => setNewTopicDesc(e.target.value)}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Breve resumen de lo que se verá en este bloque..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddTopicModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1"
                                    >
                                        CREAR TEMA
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Añadir Recurso */}
            {showAddResourceModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <Plus className="text-blue-500" size={28} />
                                Nuevo Material o Tarea
                            </h2>
                            <form onSubmit={handleAddResource} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setNewResource({ ...newResource, type: 'material' })}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newResource.type === 'material' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800'}`}
                                    >
                                        <BookOpen className={newResource.type === 'material' ? 'text-blue-500' : 'text-gray-400'} />
                                        <span className="text-xs font-bold uppercase">Material / Teoría</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewResource({ ...newResource, type: 'task' })}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newResource.type === 'task' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800'}`}
                                    >
                                        <ClipboardList className={newResource.type === 'task' ? 'text-blue-500' : 'text-gray-400'} />
                                        <span className="text-xs font-bold uppercase">Tarea / Ejercicio</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Título (Opcional)</label>
                                        <input
                                            type="text"
                                            value={newResource.title}
                                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Ej: Introducción a los bucles"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Descripción / Detalles</label>
                                        <textarea
                                            value={newResource.content}
                                            onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Instrucciones o apuntes rápidos..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Enlace Web (Opcional)</label>
                                        <input
                                            type="url"
                                            value={newResource.link}
                                            onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Archivo/URL Documento</label>
                                        <input
                                            type="text"
                                            value={newResource.url}
                                            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Ruta al archivo o PDF..."
                                        />
                                    </div>

                                    {newResource.type === 'task' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                                                <Clock size={14} className="text-pink-500" />
                                                Fecha Límite de Entrega (Opcional)
                                            </label>
                                            <input
                                                type="date"
                                                value={newResource.dueDate}
                                                onChange={(e) => setNewResource({ ...newResource, dueDate: e.target.value })}
                                                className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddResourceModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
                                    >
                                        GUARDAR RECURSO
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Modal Invitar Alumno (solo profesores) */}
            {isInviteStudentModalOpen && userRole === 'TEACHER' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UserPlus className="text-indigo-600 dark:text-indigo-400" size={24} />
                                        Invitar nuevo Alumno
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Solo aparecen alumnos que no están inscritos en esta asignatura.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsInviteStudentModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                                    title="Cerrar"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {inviteStatus && (
                                <div className={`mb-5 p-4 rounded-2xl border flex items-center gap-2 ${inviteStatus.type === 'success'
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/40'
                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/40'
                                    }`}>
                                    {inviteStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="font-medium">{inviteStatus.message}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Disponibles: <span className="text-indigo-700 dark:text-indigo-300">{loadingAvailableStudents ? '...' : availableStudents.length}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fetchAvailableStudents()}
                                    className="px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Actualizar lista
                                </button>
                            </div>

                            <div className="max-h-[55vh] overflow-auto pr-1">
                                {loadingAvailableStudents ? (
                                    <div className="py-10 text-center text-gray-500 font-medium animate-pulse">
                                        Cargando alumnos...
                                    </div>
                                ) : availableStudents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableStudents.map((student) => {
                                            const sid = String(student._id || student.id);
                                            const isInviting = invitingStudentId === sid;
                                            return (
                                                <div key={sid} className="flex items-center p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30 rounded-2xl hover:shadow-md transition-all duration-300">
                                                    <img
                                                        src={student.profileImage || `https://i.pravatar.cc/150?u=${student._id || student.email}`}
                                                        alt={student.nombre}
                                                        className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-700 shadow-sm mr-4"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {student.nombre} {student.apellidos}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInviteStudent(sid)}
                                                        disabled={isInviting}
                                                        className={`ml-3 px-4 py-2 rounded-xl font-bold text-white shadow-sm transition-all ${isInviting
                                                            ? 'bg-indigo-400 cursor-not-allowed'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5'
                                                            }`}
                                                    >
                                                        {isInviting ? 'Invitando...' : 'Invitar'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-14 text-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl bg-gray-50/50 dark:bg-zinc-800/20">
                                        <Users size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
                                        <p className="text-gray-700 dark:text-gray-200 font-semibold">No hay alumnos disponibles para invitar.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Todos los alumnos ya están inscritos o no hay alumnos en la base de datos.</p>
                                    </div>
                                )}
                            </div>
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

            {/* Modal Añadir Evento de Agenda */}
            {showAddEventModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                                <Calendar className="text-pink-500" size={28} />
                                Nuevo Hito / Evento
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                Vinculado a: <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{topics.find(t => t._id === newEvent.topicId)?.title || 'General'}</span>
                            </p>
                            <form onSubmit={handleCreateEvent} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Tipo</label>
                                        <select
                                            value={newEvent.type}
                                            onChange={(e: any) => setNewEvent({ ...newEvent, type: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold"
                                        >
                                            <option value="activity">Actividad</option>
                                            <option value="exam">Examen</option>
                                            <option value="event">Evento</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Modalidad</label>
                                        <select
                                            value={newEvent.modality}
                                            onChange={(e: any) => setNewEvent({ ...newEvent, modality: e.target.value })}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold"
                                        >
                                            <option value="digital">Digital</option>
                                            <option value="paper">Papel / Físico</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Título</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                        placeholder="Ej: Entrega Práctica Temas 1 y 2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddEventModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-2xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1"
                                    >
                                        CREAR HITO
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
