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

export interface Activity {
  id: string;
  title: string;
  dueDate: string;
  courseId: string;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  courseId: string;
}

export type CalendarEvent =
  | { type: 'activity'; data: Activity }
  | { type: 'exam'; data: Exam };