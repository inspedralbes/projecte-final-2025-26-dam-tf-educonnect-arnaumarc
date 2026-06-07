import React, { useState, useEffect, useRef } from 'react';
import { Course, UserRole, User, Topic, Resource } from '../types';
import { API_BASE_URL } from '../config';
import { MOCK_SCHEDULE } from '../constants';
import { RichTextEditor } from '../components/RichTextEditor';
import { SubmissionTracker } from '../components/SubmissionTracker';
import { useSocket } from '../src/context/SocketContext';
import {
    Users, FileText, Calendar, ArrowLeft, MessageCircle, Send, X, AlertCircle, AlertTriangle,
    CheckCircle2, Plus, ChevronDown, ChevronUp, Link, File, ClipboardList,
    Trash2, Eye, EyeOff, ExternalLink, FileDown, BookOpen, Clock, Award, Pencil, UserPlus, UserMinus
} from 'lucide-react';

interface CourseDetailsViewProps {
    course: Course | any;
    userRole: UserRole;
    user?: User | null;
    onBack: () => void;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({ course: initialCourse, userRole, user, onBack }) => {
    const [course, setCourse] = useState(initialCourse);
    const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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

    // Nous estats per notificar a la classe
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
        dueDate: '',
        requiresSubmission: false,
        submissionType: 'done' as Resource['submissionType']
    });

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        type: 'activity' as 'activity' | 'exam' | 'event' | 'holiday' | 'strike',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        topicId: '',
        modality: 'digital' as 'paper' | 'digital',
        status: 'scheduled' as 'scheduled' | 'done' | 'graded',
        requiresSubmission: true,
        submissionType: 'done' as 'file' | 'comment' | 'done'
    });
    const [courseEvents, setCourseEvents] = useState<any[]>([]);
    const [courseSchedule, setCourseSchedule] = useState<any[]>([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    // Seguimiento de entregas
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showTrackerModal, setShowTrackerModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<{ id: string, type: 'resource' | 'event', title: string, submissionType: string } | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);

    // Refs for scrolling to resources
    const resourcesRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Parse deep links from localStorage
    useEffect(() => {
        const savedDeepLink = localStorage.getItem('deepLinkData');
        if (!savedDeepLink || topics.length === 0) return;

        try {
            const { topicId, resourceId, eventId } = JSON.parse(savedDeepLink);
            
            setActiveTab('resources');
            if (topicId) {
                setExpandedTopics(prev => ({ ...prev, [topicId]: true }));
            }
            
            // Wait for render
            setTimeout(() => {
                const targetId = resourceId || eventId || topicId;
                if (targetId && resourcesRefs.current[targetId]) {
                    resourcesRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    const el = resourcesRefs.current[targetId];
                    if (el) {
                        el.classList.add('ring-2', 'ring-blue-500', 'ring-offset-4', 'dark:ring-offset-zinc-900');
                        setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-4', 'dark:ring-offset-zinc-900'), 3000);
                    }
                    // Clear deep link after use
                    localStorage.removeItem('deepLinkData');
                }
            }, 800);
        } catch (e) {
            console.error('Error parsing deep link data', e);
        }
    }, [topics]);

    const fetchSubmissions = async () => {
        try {
            const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
            const response = await fetch(`${API_BASE_URL}/api/submissions/course/${courseId}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('submission_updated', (data: any) => {
            const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
            if (String(data.courseId) === String(courseId)) {
                // Actualizar la lista de entregas localmente
                setSubmissions(prev => {
                    const exists = prev.find(s => String(s._id || s.id) === String(data.submission._id || data.submission.id));
                    if (exists) {
                        return prev.map(s => String(s._id || s.id) === String(data.submission._id || data.submission.id) ? data.submission : s);
                    }
                    return [...prev, data.submission];
                });
            }
        });

        socket.on('submission_evaluated', (data: any) => {
            fetchSubmissions();
        });

        return () => {
            socket.off('submission_updated');
            socket.off('submission_evaluated');
        };
    }, [socket, course]);

    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    const fetchTopics = async () => {
        try {
            const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
        fetchSubmissions();

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

    const handleUnenroll = async () => {
        if (!user?._id) return;
        if (!window.confirm(`¿Estás seguro de que quieres desapuntarte de ${course.title}?`)) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/unenroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: user._id })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message);
                onBack(); // Volver al listado de asignaturas ya que el alumno ya no pertenece a esta
            } else {
                alert(data.message || 'Error al desapuntarse');
            }
        } catch (error) {
            console.error('Error unenrolling:', error);
            alert('Error al desapuntarse de la asignatura');
        }
    };

    const fetchAvailableStudents = async () => {
        const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
                setInviteStatus({ type: 'error', message: data?.message || "No s'ha pogut convidar l'alumne" });
                return;
            }

            // Invitation is pending: do NOT enroll the student here.
            setAvailableStudents(prev => prev.filter(s => String(s._id || s.id) !== String(studentId)));
                setInviteStatus({ type: 'success', message: data?.message || 'Convit enviat' });
        } catch (error) {
            console.error('Error inviting student:', error);
            setInviteStatus({ type: 'error', message: "Error convidant l'alumne" });
        } finally {
            setInvitingStudentId(null);
        }
    };

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
                const data = await response.json();
                setShowAddTopicModal(false);
                setNewTopicTitle('');
                setNewTopicDesc('');
                if (data && data._id) {
                    setExpandedTopics(prev => ({ ...prev, [data._id]: true }));
                }
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
            dueDate: resource.dueDate ? new Date(resource.dueDate).toISOString().split('T')[0] : '',
            requiresSubmission: resource.requiresSubmission || false,
            submissionType: resource.submissionType || 'done'
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
                requiresSubmission: newResource.type === 'task' ? true : newResource.requiresSubmission,
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
            
            const isDigitalActivity = (newEvent.type === 'activity' || newEvent.type === 'exam') && newEvent.modality === 'digital';
            
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newEvent,
                    requiresSubmission: isDigitalActivity ? true : newEvent.requiresSubmission,
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

    const getSubmissionForActivity = (activityId: string) => {
        return submissions.find(s => String(s.activityId) === String(activityId) && String(s.studentId?._id || s.studentId) === String(user?._id || user?.id));
    };

    const handleSubmission = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedActivity) return;

        // Tasca 6.4: Verificar si ja existeix una entrega per demanar confirmació
        const existing = getSubmissionForActivity(selectedActivity.id);
        if (existing && !showConfirmOverwrite) {
            setShowConfirmOverwrite(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const courseId = course._id || course.id;
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
            const formData = new FormData();
            formData.append('studentId', user?._id || user?.id || '');
            formData.append('activityId', selectedActivity.id);
            formData.append('activityType', selectedActivity.type);
            formData.append('courseId', courseId);
            formData.append('submissionType', selectedActivity.submissionType);

            if (selectedActivity.submissionType === 'file' && submissionFile) {
                formData.append('file', submissionFile);
            } else if (submissionContent) {
                formData.append('content', submissionContent);
            }

            const response = await fetch(`${API_BASE_URL}/api/submissions`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setShowSubmissionModal(false);
                setShowConfirmOverwrite(false);
                setSubmissionContent('');
                setSubmissionFile(null);
                setSelectedActivity(null);
                fetchSubmissions();
            }
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        if (!window.confirm('Segur que vols eliminar aquest tema i tots els seus recursos?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, { method: 'DELETE' });
            if (response.ok) fetchTopics();
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    };

    const handleDeleteResource = async (topicId: string, resourceId: string) => {
        if (!resourceId || !window.confirm('Segur que vols eliminar aquest recurs?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/resources/${resourceId}`, { method: 'DELETE' });
            if (response.ok) fetchTopics();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este hito de la agenda? Esta acción es definitiva.')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, { method: 'DELETE' });
            if (response.ok) fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
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
                    senderModel: userRole === 'TEACHER' ? 'Professor' : 'Alumne',
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
    const courseProfessorId = (course?.professor?._id || course?.professor)?.toString();
    const currentUserId = (user?._id || (user as any)?.id)?.toString();
    const isCourseOwnerTeacher = userRole === 'TEACHER' && !!currentUserId && !!courseProfessorId && courseProfessorId === currentUserId;
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
                setNotifyStatus({ type: 'success', message: data.message || 'Notificació enviada correctament.' });
                setTimeout(() => {
                    setIsNotifyClassModalOpen(false);
                    setNotifyTitle('');
                    setNotifyContent('');
                    setNotifyStatus(null);
                }, 2000);
            } else {
                setNotifyStatus({ type: 'error', message: data.message || 'Error en enviar la notificació.' });
            }
        } catch (error) {
            setNotifyStatus({ type: 'error', message: 'Error de connexió del servidor.' });
        } finally {
            setIsSubmittingNotify(false);
        }
    };

    const displayStudents = students;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors gap-2 font-medium bg-gray-50 dark:bg-zinc-800/50 px-4 py-2 rounded-xl focus:outline-none w-fit"
                >
                    <ArrowLeft size={18} />
                    Tornar a assignatures
                </button>

                {userRole === 'STUDENT' && (
                    <button
                        onClick={handleUnenroll}
                        className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500/80 transition-all font-medium border border-red-500/30 px-4 py-2 rounded-xl focus:outline-none shadow-sm"
                        title="Darse de baja de esta asignatura"
                    >
                        <UserMinus size={18} />
                        Desapuntarse
                    </button>
                )}
            </div>

            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none group mb-8 border border-gray-200 dark:border-zinc-800">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition-all duration-700 scale-100 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-lg">
                        {course.title}
                    </h1>
                    <p className="text-xl text-blue-300 font-medium tracking-wide">
                        {typeof course.professor === 'object' ? `${course.professor.nombre} ${course.professor.apellidos}` : (course.professor || 'Professor')}
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
                    Alumnes ({displayStudents.length})
                    {activeTab === 'students' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex-1 py-4 font-semibold text-center transition-all duration-300 tracking-wide flex items-center justify-center gap-2 relative
            ${activeTab === 'resources' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50'}`}
                >
                    <Calendar size={18} className={activeTab === 'resources' ? 'text-blue-600 dark:text-blue-400' : ''} />
                    Recursos i agenda
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
                                    Horaris
                                </h3>
                                {loadingSchedule ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Carregant horaris...</p>
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
                                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No hi ha horaris programats.</p>
                                )}
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="text-blue-500" size={18} />
                                    Membres de la classe
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
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">alumnes matriculats</span>
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

                        <div className="pt-4">
                            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl flex flex-col gap-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="text-indigo-500" size={18} />
                                    Càrrega acadèmica
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-white dark:bg-zinc-800 p-3 rounded-xl border border-indigo-50 dark:border-zinc-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dedicación Semanal</span>
                                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{course.totalWeeklyHours || 4}h</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                        * Les hores inclouen classes presencials i el temps estimat de treball autònom.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                 <Users className="text-blue-500" size={24} />
                                 Llista d'alumnes
                             </h2>
                             {userRole === 'TEACHER' && (
                                 <div className="flex flex-wrap gap-3">
                                     <button
                                         onClick={() => {
                                             setIsInviteStudentModalOpen(true);
                                             fetchAvailableStudents();
                                         }}
                                         className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                     >
                                         <UserPlus size={18} />
                                         Convidar nou alumne
                                     </button>
                                     <button
                                         onClick={() => setIsNotifyClassModalOpen(true)}
                                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                     >
                                         <Send size={18} />
                                         Notificar tota la classe
                                     </button>
                                 </div>
                             )}
                         </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
                            {loadingStudents ? (
                                <div className="col-span-full py-12 text-center text-gray-500 font-medium animate-pulse">
                                    Carregant la llista d'alumnes...
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
                                            title="Enviar missatge"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl bg-gray-50/50 dark:bg-zinc-800/20">
                                    <Users size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">No hi ha alumnes inscrits en aquesta assignatura.</p>
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
                                        Afegir tema
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Esdeveniments sense classificar (migració/generals) */}
                {getUnassignedEvents().length > 0 && (
                    <div className="mb-8 p-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-gray-50/30 dark:bg-zinc-900/20">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Esdeveniments generals / sense classificar
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getUnassignedEvents().map(event => (
                                <div 
                                    key={event._id} 
                                    ref={el => resourcesRefs.current[event._id] = el}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                    event.status === 'done' || event.status === 'graded' 
                                    ? 'bg-green-50/30 border-green-100 dark:bg-green-900/10 dark:border-green-900/20' 
                                    : 'bg-white border-gray-100 dark:bg-zinc-800/50 dark:border-zinc-800'
                                } group`}>
                                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-xl p-2 min-w-[50px] shadow-sm border border-gray-100 dark:border-zinc-700">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(event.date).toLocaleDateString('ca-ES', { month: 'short' })}</span>
                                        <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                event.modality === 'paper' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {event.modality === 'paper' ? 'Paper' : 'Digital'}
                                            </span>
                                            {event.status !== 'scheduled' && (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-green-100 text-green-600`}>
                                                    {event.status === 'done' ? 'Realitzat' : 'Avaluat'}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{event.title}</h4>
                                        {event.description && (
                                            <div 
                                                className="text-xs text-gray-500 dark:text-gray-400 mt-2 rich-content"
                                                dangerouslySetInnerHTML={{ __html: event.description }}
                                            />
                                        )}
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
                                            <button 
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 transition-all"
                                                title="Eliminar esdeveniment"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                        <div className="space-y-4">
                            {topics.length > 0 ? (
                                topics.map((topic) => (
                                    <div 
                                        key={topic._id} 
                                        ref={el => { resourcesRefs.current[topic._id] = el; }}
                                        className="border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-sm transition-all border-l-4 border-l-blue-500"
                                    >
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
                                                            title="Afegir recurs"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setNewEvent({ ...newEvent, topicId: topic._id }); setShowAddEventModal(true); }}
                                                            className="p-2 text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-xl transition-all"
                                                            title="Afegir fita (examen/entrega)"
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
                                                        Materials i recursos
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {topic.resources && topic.resources.length > 0 ? (
                                                            topic.resources
                                                                .filter(r => userRole === 'TEACHER' || r.visible)
                                                                .map((resource, idx) => (
                                                                    <div 
                                                                        key={resource._id || idx} 
                                                                        ref={el => { if (resource._id) resourcesRefs.current[resource._id] = el; }}
                                                                        className={`p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all group ${!resource.visible ? 'opacity-50 grayscale' : ''}`}
                                                                    >
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex items-start gap-4 flex-1">
                                                                                <div className={`p-3 rounded-2xl shrink-0 ${getResourceColor(resource.type)} shadow-sm`}>
                                                                                    {getResourceIcon(resource.type)}
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">
                                                                                            {resource.title || 'Recurs sense títol'}
                                                                                        </h4>
                                                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${resource.type === 'task' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                                            {resource.type === 'task' ? 'Tasca' : 'Material'}
                                                                                        </span>
                                                                                    </div>
                                                                                    
                                                                                    {resource.content && (
                                                                                        <div 
                                                                                           className="text-sm text-gray-600 dark:text-gray-400 mb-3 rich-content"
                                                                                           dangerouslySetInnerHTML={{ __html: resource.content }}
                                                                                        />
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
                                        <Clock size={12} /> LLIURAMENT: {new Date(resource.dueDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Estat de lliurament per a alumnes */}
                                                                                    {userRole === 'STUDENT' && (resource.requiresSubmission || resource.type === 'task') && (
                                                                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">                                                                                            <div className="flex items-center justify-between">
                                                                                                {getSubmissionForActivity(resource._id!) ? (
                                                                                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider">
                                                                                                        <CheckCircle2 size={16} />
                                                                                                        Tasca lliurada {getSubmissionForActivity(resource._id!)?.status === 'TARDE' && (
                                                                                                            <span className="text-orange-500">(FORA DE TERMINI)</span>
                                                                                                        )}
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                                                                                                        <AlertCircle size={16} />
                                                                                                        Pendiente de entrega
                                                                                                    </div>
                                                                                                )}

                                                                                                {getSubmissionForActivity(resource._id!)?.grade !== undefined && (
                                                                                                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                                                                                        <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                                                                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-tight">Nota: {getSubmissionForActivity(resource._id!)?.grade}/10</span>
                                                                                                    </div>
                                                                                                )}

                                                                                                {!getSubmissionForActivity(resource._id!) && (
                                                                                                    <button
                                                                                                        onClick={() => {
                                                                                                            setSelectedActivity({
                                                                                                                id: resource._id!,
                                                                                                                type: 'resource',
                                                                                                                title: resource.title || 'Tasca',
                                                                                                                submissionType: resource.submissionType || 'done'
                                                                                                            });
                                                                                                            setShowSubmissionModal(true);
                                                                                                        }}
                                                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95"
                                                                                                    >
                                                                                                        REALIZAR ENTREGA
                                                                                                    </button>
                                                                                                )}
                                                                                            </div>

                                                                                            {getSubmissionForActivity(resource._id!)?.feedback && (
                                                                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20 flex gap-2">
                                                                                                    <MessageCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                                                                                    <p className="text-xs text-blue-800 dark:text-blue-300 italic">"{getSubmissionForActivity(resource._id!)?.feedback}"</p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}

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
                                                                                            title="Editar recurs"
                                                                                        >
                                                                                            <Pencil size={18} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleDeleteResource(topic._id, resource._id!)}
                                                                                            className="p-2 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                                                        >
                                                                                            <Trash2 size={18} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setSelectedActivity({
                                                                                                    id: resource._id!,
                                                                                                    type: 'resource',
                                                                                                    title: resource.title || 'Tasca',
                                                                                                    submissionType: resource.submissionType || 'done'
                                                                                                });
                                                                                                setShowTrackerModal(true);
                                                                                            }}
                                                                                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105"
                                                                                        >
                                                                                            SEGUIMIENTO
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <p className="text-sm text-gray-400 italic py-2">No hi ha materials en aquest tema.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                        {/* Secció de fites (agenda) del tema */}
                                                <div>
                                                    <h4 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        Fites i avaluació
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {getTopicEvents(topic._id).length > 0 ? (
                                                            getTopicEvents(topic._id).map(event => (
                                                                <div 
                                                                    key={event._id} 
                                                                    ref={el => resourcesRefs.current[event._id] = el}
                                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                                                    event.status === 'done' || event.status === 'graded' 
                                                                    ? 'bg-green-50/30 border-green-100 dark:bg-green-900/10 dark:border-green-900/20' 
                                                                    : 'bg-pink-50/30 border-pink-100 dark:bg-pink-900/10 dark:border-pink-900/20'
                                                                }`}>
                                                                    <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-800 rounded-xl p-2 min-w-[50px] shadow-sm border border-pink-100 dark:border-zinc-700">
                                                                        <span className="text-[10px] font-black text-pink-500 uppercase">{new Date(event.date).toLocaleDateString('ca-ES', { month: 'short' })}</span>
                                                                        <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                                                event.modality === 'paper' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                                            }`}>
                                                                                {event.modality === 'paper' ? 'Paper' : 'Digital'}
                                                                            </span>
                                                                            {event.status !== 'scheduled' && (
                                                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-green-100 text-green-600`}>
                                                                                    {event.status === 'done' ? 'Realitzat' : 'Avaluat'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{event.title}</h4>
                                                                        {event.description && (
                                                                            <div 
                                                                                className="text-xs text-gray-500 dark:text-gray-400 mt-2 rich-content"
                                                                                dangerouslySetInnerHTML={{ __html: event.description }}
                                                                            />
                                                                        )}

                                                                        {/* Estat de lliurament per a alumnes en esdeveniments */}
                                                                        {userRole === 'STUDENT' && (event.requiresSubmission || event.type === 'activity' || event.type === 'exam') && (
                                                                            <div className="mt-3 pt-3 border-t border-pink-100 dark:border-pink-900/30 flex items-center justify-between gap-4">                                                                                {getSubmissionForActivity(event._id!) ? (
                                                                                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-[10px] uppercase">
                                                                                        <CheckCircle2 size={14} />
                                                                                        Lliurat
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex items-center gap-1.5 text-pink-600 font-bold text-[10px] uppercase">
                                                                                        <AlertCircle size={14} />
                                                                                        Pendiente
                                                                                    </div>
                                                                                )}

                                                                                {!getSubmissionForActivity(event._id!) && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setSelectedActivity({
                                                                                                id: event._id!,
                                                                                                type: 'event',
                                                                                                title: event.title,
                                                                                                submissionType: event.submissionType || 'done'
                                                                                            });
                                                                                            setShowSubmissionModal(true);
                                                                                        }}
                                                                                        className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-sm transition-all"
                                                                                    >
                                                                                        ENTREGAR
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        )}
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
                                                                            <button 
                                                                                onClick={() => handleDeleteEvent(event._id)}
                                                                                className="p-1.5 text-gray-400 hover:text-red-600 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 transition-all"
                                                                                title="Eliminar esdeveniment"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-400 italic col-span-full">No hi ha fites programades per a aquest tema.</p>
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
                                    <p className="text-gray-600 dark:text-gray-400 text-lg font-bold">No hi ha temes definits per a aquesta assignatura.</p>
                                    <p className="text-gray-500 text-sm mt-1">Planifica els blocs d'exercicis, apunts i activitats.</p>
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

            {/* Modal afegir tema */}
            {showAddTopicModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="text-indigo-500" size={28} />
                                Nou tema / bloc
                            </h2>
                            <form onSubmit={handleCreateTopic} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Títol del tema</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTopicTitle}
                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Ex.: Tema 1: introducció a l'algorísmia"
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

            {/* Modal afegir recurs */}
            {showAddResourceModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <Plus className="text-blue-500" size={28} />
                                Nou material o tasca
                            </h2>
                            <form onSubmit={handleAddResource} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setNewResource({ ...newResource, type: 'material', requiresSubmission: false })}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newResource.type === 'material' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800'}`}
                                    >
                                        <BookOpen className={newResource.type === 'material' ? 'text-blue-500' : 'text-gray-400'} />
                                        <span className="text-xs font-bold uppercase">Material / teoria</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewResource({ ...newResource, type: 'task', requiresSubmission: true })}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newResource.type === 'task' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800'}`}
                                    >
                                        <ClipboardList className={newResource.type === 'task' ? 'text-blue-500' : 'text-gray-400'} />
                                        <span className="text-xs font-bold uppercase">Tasca / exercici</span>
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
                                        <RichTextEditor
                                            content={newResource.content}
                                            onChange={(html) => setNewResource({ ...newResource, content: html })}
                                            placeholder="Instrucciones o apuntes rápidos..."
                                        />
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
                                        <>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                                                    <Clock size={14} className="text-pink-500" />
                                                    Configuració de l'entrega
                                                </label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewResource({ ...newResource, requiresSubmission: true, submissionType: 'done' })}
                                                        className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newResource.requiresSubmission && newResource.submissionType === 'done' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                                    >
                                                        Solo Completar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewResource({ ...newResource, requiresSubmission: true, submissionType: 'comment' })}
                                                        className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newResource.requiresSubmission && newResource.submissionType === 'comment' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                                    >
                                                        Comentario
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewResource({ ...newResource, requiresSubmission: true, submissionType: 'file' })}
                                                        className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newResource.requiresSubmission && newResource.submissionType === 'file' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                                    >
                                                        Archivo
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                                                    <Clock size={14} className="text-pink-500" />
                                                    Data límit de l'entrega (opcional)
                                                </label>
                                                <input
                                                    type="date"
                                                    value={newResource.dueDate}
                                                    onChange={(e) => setNewResource({ ...newResource, dueDate: e.target.value })}
                                                    className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                                />
                                            </div>
                                        </>
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

            {/* Modal de missatge */}
            {showMessageModal && messageRecipient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageCircle className="text-blue-500" size={24} />
                                Enviar missatge
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
                                        placeholder="Escriu un títol..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contenido</label>
                                    <textarea
                                        required
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className="w-full p-3.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white h-32 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="Escriu el teu missatge aquí..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMessageModal(false)}
                                        className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancel·lar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        Enviar missatge
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal convidar alumne (només professors) */}
            {isInviteStudentModalOpen && userRole === 'TEACHER' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UserPlus className="text-indigo-600 dark:text-indigo-400" size={24} />
                                        Convidar nou alumne
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Només apareixen els alumnes que no estan inscrits en aquesta assignatura.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsInviteStudentModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                                    title="Tancar"
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
                                        Carregant alumnes...
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
                                                        {isInviting ? 'Convidant...' : 'Convidar'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-14 text-center border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl bg-gray-50/50 dark:bg-zinc-800/20">
                                        <Users size={48} className="mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
                                        <p className="text-gray-700 dark:text-gray-200 font-semibold">No hi ha alumnes disponibles per convidar.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tots els alumnes ja estan inscrits o no hi ha alumnes a la base de dades.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de notificació massiva */}
            {isNotifyClassModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Send size={24} className="text-blue-600 dark:text-blue-400" />
                                Nova notificació a la classe
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
                                    Assignatura
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
                                    placeholder="Ex.: Recordatori d'examen, canvi d'aula..."
                                    value={notifyTitle}
                                    onChange={(e) => setNotifyTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Missatge
                                </label>
                                <RichTextEditor
                                    content={notifyContent}
                                    onChange={(html) => setNotifyContent(html)}
                                    placeholder="Escriu el missatge per a tota la classe aquí..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNotifyClassModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel·lar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingNotify}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-white shadow-sm transition-all ${isSubmittingNotify
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isSubmittingNotify ? 'Enviant...' : 'Enviar a tota la classe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal afegir esdeveniment d'agenda */}
            {showAddEventModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                                <Calendar className="text-pink-500" size={28} />
                                Nova fita / esdeveniment
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                Vinculat a: <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{topics.find(t => t._id === newEvent.topicId)?.title || 'General'}</span>
                            </p>
                            <form onSubmit={handleCreateEvent} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Tipo</label>
                                        <select
                                            value={newEvent.type}
                                            onChange={(e: any) => {
                                                const val = e.target.value;
                                                const requiresSub = (val === 'activity' || val === 'exam') && newEvent.modality === 'digital';
                                                setNewEvent({ ...newEvent, type: val, requiresSubmission: requiresSub });
                                            }}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold"
                                        >
                                            <option value="activity">Activitat</option>
                                            <option value="exam">Examen</option>
                                            <option value="event">Esdeveniment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Modalidad</label>
                                        <select
                                            value={newEvent.modality}
                                            onChange={(e: any) => {
                                                const val = e.target.value;
                                                const requiresSub = (newEvent.type === 'activity' || newEvent.type === 'exam') && val === 'digital';
                                                setNewEvent({ ...newEvent, modality: val, requiresSubmission: requiresSub });
                                            }}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-bold"
                                        >
                                            <option value="digital">Digital</option>
                                            <option value="paper">Paper / físic</option>
                                        </select>
                                    </div>

                                    {newEvent.modality === 'digital' && (
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                                                <Clock size={14} className="text-pink-500" />
                                                    Configuració de l'entrega
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewEvent({ ...newEvent, requiresSubmission: true, submissionType: 'done' })}
                                                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newEvent.requiresSubmission && newEvent.submissionType === 'done' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-400'}`}
                                                >
                                                    Solo Completar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewEvent({ ...newEvent, requiresSubmission: true, submissionType: 'comment' })}
                                                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newEvent.requiresSubmission && newEvent.submissionType === 'comment' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-400'}`}
                                                >
                                                    Comentario
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewEvent({ ...newEvent, requiresSubmission: true, submissionType: 'file' })}
                                                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${newEvent.requiresSubmission && newEvent.submissionType === 'file' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-400'}`}
                                                >
                                                    Archivo
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Título</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                        placeholder="Ex.: Entrega pràctica temes 1 i 2"
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
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Descripción / Instrucciones</label>
                                    <RichTextEditor
                                        content={newEvent.description}
                                        onChange={(html) => setNewEvent({ ...newEvent, description: html })}
                                        placeholder="Detalles del examen o actividad..."
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

            {/* Panel de Seguimiento (Profesor) */}
            {showTrackerModal && selectedActivity && (
                <SubmissionTracker
                    activity={selectedActivity}
                    courseId={course._id || course.id}
                    allStudents={students}
                    submissions={submissions}
                    onClose={() => setShowTrackerModal(false)}
                    onRefresh={fetchSubmissions}
                    currentUserId={user?._id || user?.id || ''}
                />
            )}

            {/* Modal d'entrega (alumne) */}
            {showSubmissionModal && selectedActivity && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                                <Send className="text-blue-500" size={28} />
                                Fer entrega
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                Activitat: <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{selectedActivity.title}</span>
                            </p>

                            <form onSubmit={handleSubmission} className="space-y-6">
                                {selectedActivity.submissionType === 'file' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">URL del fitxer / enllaç d'entrega</label>
                                        <input
                                            type="text"
                                            required
                                            value={submissionContent}
                                            onChange={(e) => setSubmissionContent(e.target.value)}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                )}

                                {selectedActivity.submissionType === 'comment' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Comentario de Confirmación</label>
                                        <textarea
                                            required
                                            value={submissionContent}
                                            onChange={(e) => setSubmissionContent(e.target.value)}
                                            className="w-full p-4 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white h-32 resize-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Escriu aquí la teva resposta o confirmació..."
                                        ></textarea>
                                    </div>
                                )}

                                {selectedActivity.submissionType === 'done' && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                            Esta actividad solo requiere que confirmes que la has completado. Pulsa el botón de abajo para finalizar.
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmissionModal(false)}
                                        className="flex-1 py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
                                    >
                                        {isSubmitting ? 'ENVIANT...' : 'LLIURAR ARA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Re-entrega */}
            {showConfirmOverwrite && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Vols sobreescriure l'entrega?</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                Ya has realizado una entrega para esta actividad. Al enviar una nueva, la anterior será reemplazada permanentemente.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleSubmission()}
                                    className="w-full py-4 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
                                >
                                    SÍ, SOBRESCRIBIR
                                </button>
                                <button
                                    onClick={() => setShowConfirmOverwrite(false)}
                                    className="w-full py-4 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


