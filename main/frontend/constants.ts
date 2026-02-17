import { Course, ChatMessage } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Matemáticas Avanzadas',
    description: 'Cálculo integral y diferencial para ingeniería.',
    professor: 'Dr. Roberto Martínez',
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: '2',
    title: 'Historia del Arte',
    description: 'Análisis de corrientes artísticas del siglo XIX.',
    professor: 'Lic. Ana Gómez',
    image: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: '3',
    title: 'Programación Web',
    description: 'Introducción a React, TypeScript y Node.js.',
    professor: 'Ing. Carlos Ruiz',
    image: 'https://picsum.photos/300/200?random=3'
  },
  {
    id: '4',
    title: 'Física Cuántica',
    description: 'Fundamentos de la mecánica cuántica.',
    professor: 'Dra. Elena Foix',
    image: 'https://picsum.photos/300/200?random=4'
  }
];

export const MOCK_SCHEDULE = [
  {
    id: '101',
    courseId: '1', // Matematicas
    day: 1, // Lunes
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'Aula 101'
  },
  {
    id: '102',
    courseId: '2', // Historia
    day: 2, // Martes
    startTime: '11:30',
    endTime: '13:00',
    classroom: 'Auditorio B'
  },
  {
    id: '103',
    courseId: '3', // Web
    day: 3, // Miercoles
    startTime: '15:00',
    endTime: '17:00',
    classroom: 'Lab Comp 2'
  },
  {
    id: '104',
    courseId: '4', // Fisica
    day: 4, // Jueves
    startTime: '08:00',
    endTime: '10:00',
    classroom: 'Lab Fisica'
  },
  {
    id: '105',
    courseId: '1', // Matematicas (again)
    day: 3, // Miercoles
    startTime: '11:00',
    endTime: '13:00',
    classroom: 'Aula 101'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'Grupo de Clase',
    text: 'Hola a todos, ¿alguien tiene los apuntes de ayer?',
    isMe: false,
    timestamp: '10:00 AM'
  },
  {
    id: '2',
    sender: 'Yo',
    text: 'Sí, los subiré a la plataforma en un momento.',
    isMe: true,
    timestamp: '10:05 AM'
  },
  {
    id: '3',
    sender: 'Profesor',
    text: 'Recordad que la entrega es mañana.',
    isMe: false,
    timestamp: '10:15 AM'
  }
];