import { Course, ChatMessage, CalendarEvent } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'IPO II',
    description: 'Interacció Persona-Ordinador II.',
    professor: 'Carles Narváez',
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: '2',
    title: 'Projecte',
    description: 'Projecte de Desenvolupament d\'Aplicacions Multiplataforma.',
    professor: 'Equip Docent (Toni Martí, Pol Prats, Álvaro Pérez)',
    image: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: '3',
    title: 'PSP',
    description: 'Programació de Serveis i Processos.',
    professor: 'Pol Prats',
    image: 'https://picsum.photos/300/200?random=3'
  },
  {
    id: '4',
    title: 'Accés a Dades',
    description: 'Gestió i accés a bases de dades.',
    professor: 'Toni Martí',
    image: 'https://picsum.photos/300/200?random=4'
  },
  {
    id: '5',
    title: 'Progr. Mòbils',
    description: 'Programació de dispositius mòbils.',
    professor: 'Pol Prats',
    image: 'https://picsum.photos/300/200?random=5'
  },
  {
    id: '6',
    title: 'Des. Interfície',
    description: 'Desenvolupament d\'interfícies.',
    professor: 'Álvaro Pérez',
    image: 'https://picsum.photos/300/200?random=6'
  },
  {
    id: '7',
    title: 'Tutoria',
    description: 'Sessió de tutoria i orientació.',
    professor: 'Pol Prats',
    image: 'https://picsum.photos/300/200?random=7'
  },
  {
    id: '8',
    title: 'Aplicacions IA',
    description: 'Aplicacions d\'Intel·ligència Artificial.',
    professor: 'Pol Prats',
    image: 'https://picsum.photos/300/200?random=8'
  },
  {
    id: '9',
    title: 'Fonaments IA',
    description: 'Fonaments d\'Intel·ligència Artificial.',
    professor: 'Álvaro Pérez',
    image: 'https://picsum.photos/300/200?random=9'
  }
];

export const MOCK_SCHEDULE = [
  // Dilluns
  { id: '101', courseId: '1', day: 1, startTime: '08:00', endTime: '10:00', classroom: 'Aula 1' },
  { id: '102', courseId: '2', day: 1, startTime: '10:00', endTime: '12:30', classroom: 'Aula 2' },
  // Dimarts
  { id: '103', courseId: '2', day: 2, startTime: '08:00', endTime: '10:00', classroom: 'Aula 2' },
  { id: '104', courseId: '6', day: 2, startTime: '10:00', endTime: '12:30', classroom: 'Aula 3' },
  // Dimecres
  { id: '105', courseId: '3', day: 3, startTime: '08:00', endTime: '10:00', classroom: 'Aula 1' },
  { id: '106', courseId: '7', day: 3, startTime: '10:00', endTime: '11:30', classroom: 'Tutoria' },
  { id: '107', courseId: '9', day: 3, startTime: '11:30', endTime: '12:30', classroom: 'Aula 4' },
  // Dijous
  { id: '108', courseId: '4', day: 4, startTime: '08:00', endTime: '10:00', classroom: 'Aula 1' },
  { id: '109', courseId: '8', day: 4, startTime: '10:00', endTime: '12:30', classroom: 'Aula 4' },
  // Divendres
  { id: '110', courseId: '5', day: 5, startTime: '08:00', endTime: '10:00', classroom: 'Aula 5' },
  { id: '111', courseId: '2', day: 5, startTime: '10:00', endTime: '12:30', classroom: 'Aula 2' }
];

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
    data: { id: '5', title: 'Xerrada Ciberseguretat', date: new Date(2026, 1, 12).toISOString() }
  },
  {
    type: 'holiday',
    data: { id: '6', title: 'Lliure Disposició', date: new Date(2026, 1, 28).toISOString() }
  },
  {
    type: 'strike',
    data: { id: '7', title: 'Vaga Estudiants', date: new Date(2026, 1, 19).toISOString() }
  }
];