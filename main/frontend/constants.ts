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

export const MOCK_EVENTS: CalendarEvent[] = [];