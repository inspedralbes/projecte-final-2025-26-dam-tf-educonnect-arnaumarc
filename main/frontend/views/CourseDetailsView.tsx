import React, { useState } from 'react';
import { Course, UserRole } from '../types';
import { Users, FileText, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';

interface CourseDetailsViewProps {
    course: Course;
    userRole: UserRole;
    onBack: () => void;
}

// Mock data for enrolled students - eventually fetched from backend
const MOCK_STUDENTS = [
    { id: '1', name: 'Laura Martínez', email: 'laura.m@edu.cat', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Pau Casals', email: 'pau.c@edu.cat', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Julia Roberts', email: 'julia.r@edu.cat', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Marc Cara', email: 'marc.c@edu.cat', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Arnau Perera', email: 'arnau.p@edu.cat', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({ course, userRole, onBack }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'students' | 'resources'>('info');

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 transition-colors duration-300">
            <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors gap-2 font-bold focus:outline-none"
            >
                <ArrowLeft size={20} />
                Tornar a Assignatures
            </button>

            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] group">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition-all duration-500 scale-100 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 shadow-black drop-shadow-md">
                        {course.title}
                    </h1>
                    <p className="text-xl text-cyan-300 font-bold tracking-wide">
                        {course.professor}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b-4 border-black dark:border-white bg-white dark:bg-zinc-800">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
            ${activeTab === 'info' ? 'bg-cyan-200 dark:bg-cyan-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                >
                    <FileText size={20} /> Informació
                </button>
                {userRole === 'TEACHER' && (
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
              ${activeTab === 'students' ? 'bg-purple-200 dark:bg-purple-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                    >
                        <Users size={20} /> Alumnes ({MOCK_STUDENTS.length})
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex-1 py-4 font-bold text-center transition-colors uppercase tracking-wider flex items-center justify-center gap-2
            ${activeTab === 'resources' ? 'bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'}`}
                >
                    <Calendar size={20} /> Recursos & Agenda
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-zinc-800 border-4 border-t-0 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] min-h-[400px]">

                {activeTab === 'info' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-1 -rotate-1">
                            DESCRIPCIÓ DEL CURS
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 bg-gray-50 dark:bg-zinc-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Horaris</h3>
                                <p className="text-gray-600 dark:text-gray-400">Dilluns i Dimecres: 15:00 - 17:00</p>
                                <p className="text-gray-600 dark:text-gray-400">Aula: Lab 3</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-zinc-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Avaluació</h3>
                                <p className="text-gray-600 dark:text-gray-400">40% Pràctiques</p>
                                <p className="text-gray-600 dark:text-gray-400">60% Examen Final</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && userRole === 'TEACHER' && (
                    <div>
                        <h2 className="text-2xl font-bold bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-1 rotate-1 mb-8">
                            LLISTA D'ALUMNES
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MOCK_STUDENTS.map(student => (
                                <div key={student.id} className="flex items-center p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-zinc-700 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer group">
                                    <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full border-2 border-black dark:border-gray-400 mr-4" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{student.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400" title="Enviar missatge">
                                        <MessageCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-400 mb-4">Material de Curs</h2>
                        <p className="text-gray-500">Aquí apareixeran els PDFs i recursos del curs.</p>
                        <button className="mt-6 px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            Pujar Nou Recurs
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
