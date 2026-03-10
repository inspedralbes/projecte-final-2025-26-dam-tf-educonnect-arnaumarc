export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  CHAT = 'CHAT',
  MEET = 'MEET',
  WORKSHOPS = 'WORKSHOPS',
  PROFILE = 'PROFILE'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  professor: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isMe: boolean;
  timestamp: string;
}

export interface User {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  type: 'alumno' | 'professor';
  clase?: string;
  profileImage?: string | null;
  theme?: 'light' | 'dark';
}
