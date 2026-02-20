import React from 'react';
import { Bell, Clock, Users, BookOpen } from 'lucide-react';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { MOCK_EVENTS } from '../constants';

export const TeacherDashboardView: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<'claustre' | 'departament' | 'general'>('claustre');

    // Teachers might see all events or a different set. For now using MOCK_EVENTS.
    const filteredEvents = MOCK_EVENTS;

    return (
        <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
            <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wide text-black dark:text-white">
                [INS PEDRALBES - DOCÈNCIA]
            </h1>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-12 font-medium">Portal del Professorat</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-800 p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-cyan-600 dark:text-cyan-400" size={24} />
                        <h3 className="font-bold text-lg text-black dark:text-white">Alumnes</h3>
                    </div>
                    <p className="text-3xl font-black text-black dark:text-white">124</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assignats aquest semestre</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                        <h3 className="font-bold text-lg text-black dark:text-white">Classes</h3>
                    </div>
                    <p className="text-3xl font-black text-black dark:text-white">18h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lectives setmanals</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="text-orange-600 dark:text-orange-400" size={24} />
                        <h3 className="font-bold text-lg text-black dark:text-white">Propera Classe</h3>
                    </div>
                    <p className="text-xl font-bold text-black dark:text-white">M02 - Base de Dades</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">10:00 - Lab 2</p>
                </div>
            </div>

            <div className="mb-8 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
                {/* Tabs Header */}
                <div className="flex border-b-2 border-black dark:border-white">
                    <button
                        onClick={() => setActiveTab('claustre')}
                        className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'claustre' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
                            } border-r-2 border-black dark:border-white`}
                    >
                        Claustre
                    </button>
                    <button
                        onClick={() => setActiveTab('departament')}
                        className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'departament' ? 'bg-pink-100 dark:bg-pink-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
                            } border-r-2 border-black dark:border-white`}
                    >
                        Departament
                    </button>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-3 px-4 font-bold text-center transition-colors ${activeTab === 'general' ? 'bg-cyan-100 dark:bg-cyan-900/50 text-black dark:text-white' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
                            }`}
                    >
                        General
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 min-h-[200px]">
                    {activeTab === 'claustre' && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                                <Bell size={20} />
                                Avisos del Claustre
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded">
                                    <span className="font-bold text-indigo-700 dark:text-indigo-400">•</span>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Reunió d'Avaluació</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Dimarts 25 a les 16:30h - Sala de Professors.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'departament' && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                                <Bell size={20} />
                                Departament d'Informàtica
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded">
                                    <span className="font-bold text-pink-700 dark:text-pink-400">•</span>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Comandes de Material</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Recordeu enviar les sol·licituds abans de divendres.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                                <Bell size={20} />
                                Avisos de l'Escola
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded">
                                    <span className="font-bold text-cyan-700 dark:text-cyan-400">•</span>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Manteniment Programat</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">La plataforma de notes estarà inactiva aquest cap de setmana.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Monthly Calendar Section */}
            <div className="mb-8">
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 text-black dark:text-white transition-colors">
                    <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center -rotate-3 italic tracking-tighter shadow-sm">CAL</span>
                    AGENDA DOCENT
                </h3>
                <div className="h-[600px]">
                    <MonthlyCalendar events={filteredEvents} />
                </div>
            </div>
        </div>
    );
};
