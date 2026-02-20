import { Course, ChatMessage, CalendarEvent } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Programació',
    description: 'Fonaments de programació, algorísmia i estructures de dades en Java i Python.',
    professor: 'Dr. Roberto Martínez',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'c2',
    title: 'Base de Dades',
    description: 'Disseny, implementació i manipulació de bases de dades relacionals i NoSQL.',
    professor: 'Lic. Ana Gómez',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'c3',
    title: 'FOL',
    description: 'Formació i Orientació Laboral. Drets del treballador i prevenció de riscos.',
    professor: 'Dra. Elena Foix',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'c4',
    title: 'Formació en IA',
    description: 'Introducció a la Intel·ligència Artificial, Machine Learning i LLMs.',
    professor: 'Ing. Carlos Ruiz',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000'
  }
];

export const MOCK_SCHEDULE = [
  {
    id: 's1',
    courseId: 'c1', // Programacio
    day: 1, // Lunes
    startTime: '08:00',
    endTime: '10:00',
    classroom: 'Lab 1'
  },
  {
    id: 's2',
    courseId: 'c2', // BD
    day: 1, // Lunes
    startTime: '10:00',
    endTime: '12:00',
    classroom: 'Lab 2'
  },
  {
    id: 's3',
    courseId: 'c1', // Programacio
    day: 2, // Martes
    startTime: '11:30',
    endTime: '13:30',
    classroom: 'Lab 1'
  },
  {
    id: 's4',
    courseId: 'c3', // FOL
    day: 3, // Miercoles
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'Aula 204'
  },
  {
    id: 's5',
    courseId: 'c4', // IA
    day: 4, // Jueves
    startTime: '15:00',
    endTime: '18:00',
    classroom: 'Lab IA'
  },
  {
    id: 's6',
    courseId: 'c2', // BD
    day: 5, // Viernes
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'Lab 2'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Grup Programació',
    text: 'Algú ha pogut fer l\'exercici del bucle while?',
    isMe: false,
    timestamp: '10:00 AM'
  },
  {
    id: 'm2',
    sender: 'Jo',
    text: 'Sí, t\'envio el codi per privat.',
    isMe: true,
    timestamp: '10:05 AM'
  },
  {
    id: 'm3',
    sender: 'Profesor BD',
    text: 'Recordeu que demà tenim pràctica de SQL.',
    isMe: false,
    timestamp: '10:15 AM'
  }
];

export const MOCK_USER = {
  name: 'Marc Cara',
  role: 'Estudiante',
  email: 'marc.cara@inspedralbes.cat',
  stats: {
    courses: 4,
    average: '7.8',
    certificates: 2
  },
  enrolledCourses: ['c1', 'c2', 'c3', 'c4']
};

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    type: 'activity',
    data: { id: 'e1', title: 'Pràctica Java Arrays', dueDate: new Date(2026, 1, 22).toISOString(), courseId: 'c1' }
  },
  {
    type: 'activity',
    data: { id: 'e2', title: 'Disseny ER', dueDate: new Date(2026, 1, 24).toISOString(), courseId: 'c2' }
  },
  {
    type: 'exam',
    data: { id: 'e3', title: 'Examen SQL', date: new Date(2026, 1, 26).toISOString(), courseId: 'c2' }
  },
  {
    type: 'exam',
    data: { id: 'e4', title: 'Test Prevenció Riscos', date: new Date(2026, 1, 27).toISOString(), courseId: 'c3' }
  },
  {
    type: 'event',
    data: { id: 'e5', title: 'Hackathon IA', date: new Date(2026, 2, 5).toISOString(), courseId: 'c4' }
  },
  {
    type: 'holiday',
    data: { id: 'h1', title: 'Setmana Santa', date: new Date(2026, 3, 2).toISOString() }
  },
  {
    type: 'strike',
    data: { id: 's1', title: 'Vaga Transport', date: new Date(2026, 1, 20).toISOString() }
  }
];