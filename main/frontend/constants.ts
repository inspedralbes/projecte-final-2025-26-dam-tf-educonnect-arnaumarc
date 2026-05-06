import { Course, ChatMessage, CalendarEvent } from './types';

export const MOCK_COURSES: Course[] = [];

export const MOCK_SCHEDULE = [];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'Grup de Classe',
    text: 'Hola a tots, ¿algu té els apunts de Projecte?',
    isMe: false,
    timestamp: '10:00 AM'
  },
  {
    id: '2',
    sender: 'Yo',
    text: 'Sí, els pujaré a la plataforma en un moment.',
    isMe: true,
    timestamp: '10:05 AM'
  },
  {
    id: '3',
    sender: 'Pol Prats',
    text: 'Recordeu que l\'entrega de PSP és demà.',
    isMe: false,
    timestamp: '10:15 AM'
  }
];

export const MOCK_USER = {
  name: 'Arnau Perera',
  role: 'Estudiant Premium',
  email: 'arnau.marc@educonnect.com',
  stats: {
    courses: 9,
    average: '8.5',
    certificates: 4
  },
  enrolledCourses: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
};

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    type: 'activity',
    data: { id: '1', title: 'Entrega Projecte Final', dueDate: new Date(2026, 1, 18).toISOString(), courseId: '2' }
  },
  {
    type: 'activity',
    data: { id: '2', title: 'Exercicis Unitat 3', dueDate: new Date(2026, 1, 20).toISOString(), courseId: '3' }
  },
  {
    type: 'exam',
    data: { id: '3', title: 'Examen IPO II', date: new Date(2026, 1, 25).toISOString(), courseId: '1' }
  },
  {
    type: 'exam',
    data: { id: '4', title: 'Global Accés a Dades', date: new Date(2026, 1, 27).toISOString(), courseId: '4' }
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