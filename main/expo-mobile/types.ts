export enum AppView {
  LOGIN = 'LOGIN',
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
  email: string;
  name: string;
}
