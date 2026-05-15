import React, { useEffect, useState } from 'react';
import { Bell, User as UserIcon, BookOpen, Building, Trash2, ChevronDown, ChevronRight, Clock, Phone, MessageSquare, GraduationCap } from 'lucide-react';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { MOCK_EVENTS } from '../constants';
import { User } from '../types';
import { API_BASE_URL } from '../config';
import { useSocket, FeedItem } from '../src/context/SocketContext';

interface TablonViewProps {
  user: User | null;
}

export const TablonView: React.FC<TablonViewProps> = ({ user }) => {
  const { feed, deleteMessage } = useSocket();
  const [activeTab, setActiveTab] = useState<'personal' | 'clase' | 'general'>(() => {
    return (localStorage.getItem('tablonActiveTab') as 'personal' | 'clase' | 'general') || 'personal';
  });

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('tablonActiveTab', activeTab);
  }, [activeTab]);

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.map((ev: any) => ({
          type: ev.type,
          data: {
            id: ev._id,
            title: ev.title,
            date: ev.date,
            courseId: ev.courseId?._id
          }
        }));
        setEvents(formattedEvents);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const filteredEvents = (events.length > 0 ? events : MOCK_EVENTS).filter(ev => {
    if (ev.type === 'activity' || ev.type === 'exam') {
      if (user?.enrolledCourses) {
        // If user has real enrolled courses (as objects or strings)
        const courses = user.enrolledCourses as any[];
        return courses.some(c => (c._id || c) === ev.data.courseId);
      }
      return true;
    }
    return true;
  });

  // --- Lógica de Smart Feed ---

  const isOld = (date: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  // Filtrar por tab y luego aplicar agrupación
  const getCategorizedFeed = () => {
    if (activeTab === 'personal') {
      return feed.filter(item => {
        const isPersonalType = ['MESSAGE', 'DIRECT_MESSAGE', 'MEET_CALL', 'MEET_MESSAGE', 'PROFESSOR_ADVISORY', 'COURSE_INVITE'].includes(item.type);
        const isPrivateMessage = item.source === 'message' && (item.raw as any).isPrivate;
        const isProfessorAdvisory = item.type === 'PROFESSOR_ADVISORY';
        const isMeetEvent = item.type === 'MEET_CALL' || item.type === 'MEET_MESSAGE';
        
        return isPersonalType || isPrivateMessage || isProfessorAdvisory || isMeetEvent || (!item.courseId && item.source === 'message');
      });
    } else if (activeTab === 'clase') {
      return feed.filter(item => {
        const isAcademicType = ['MATERIAL', 'ANNOUNCEMENT', 'EXAM'].includes(item.type);
        const isCourseMessage = item.source === 'message' && !(item.raw as any).isPrivate;
        const isFromProfessor = (item.raw as any).senderModel === 'Professor';

        return (!!item.courseId && item.type !== 'COURSE_INVITE') && 
               (item.source === 'notification' || isCourseMessage) &&
               !isOld(item.date);
      });
    } else {
      // General: Avisos institucionales (sin curso y de System/Admin) o tipo SYSTEM
      return feed.filter(item => {
        const isInstitutional = (item.raw as any).senderModel === 'System' || (item.raw as any).senderModel === 'Admin';
        const isSystemType = item.type === 'SYSTEM';
        return (!item.courseId && (isInstitutional || isSystemType)) || 
               (!item.courseId && item.source === 'notification' && item.type === 'ANNOUNCEMENT');
      });
    }
  };

  const groupFeed = (items: FeedItem[]) => {
    const groups: (FeedItem | { isGroup: true, items: FeedItem[], type: string, courseId: string, title: string, date: string, id: string })[] = [];
    const processedIds = new Set<string>();

    items.forEach((item) => {
      if (processedIds.has(item.id)) return;

      // Solo agrupar notificaciones de material/aviso del mismo curso en 48h
      if (item.source === 'notification' && (item.type === 'MATERIAL' || item.type === 'ANNOUNCEMENT') && item.courseId) {
        const sameTypeAndCourse = items.filter(other => 
          other.id !== item.id &&
          other.source === 'notification' &&
          other.type === item.type &&
          other.courseId === item.courseId &&
          Math.abs(new Date(other.date).getTime() - new Date(item.date).getTime()) < 48 * 60 * 60 * 1000
        );

        if (sameTypeAndCourse.length > 0) {
          const groupItems = [item, ...sameTypeAndCourse];
          const groupId = `group-${item.type}-${item.courseId}-${new Date(item.date).toDateString()}`;
          groups.push({
            isGroup: true,
            id: groupId,
            items: groupItems,
            type: item.type,
            courseId: item.courseId,
            title: `${groupItems.length} nuevos ${item.type === 'MATERIAL' ? 'materiales' : 'avisos'} de clase`,
            date: item.date
          });
          groupItems.forEach(gi => processedIds.add(gi.id));
          return;
        }
      }

      // Nueva agrupación para eventos de Meet del mismo remitente y mismo día
      if (item.type === 'MEET_CALL' || item.type === 'MEET_MESSAGE') {
        const sameSenderAndDay = items.filter(other => 
          other.id !== item.id &&
          !processedIds.has(other.id) &&
          (other.type === 'MEET_CALL' || other.type === 'MEET_MESSAGE') &&
          other.sender?._id === item.sender?._id &&
          new Date(other.date).toDateString() === new Date(item.date).toDateString()
        );

        if (sameSenderAndDay.length > 0) {
          const groupItems = [item, ...sameSenderAndDay];
          const groupId = `group-meet-${item.sender?._id}-${new Date(item.date).toDateString()}`;
          groups.push({
            isGroup: true,
            id: groupId,
            items: groupItems,
            type: 'MEET_GROUP',
            courseId: '',
            title: `Actividad reciente en Meet de ${item.sender?.nombre || 'Profesor'} ${item.sender?.apellidos || ''}`,
            date: item.date
          });
          groupItems.forEach(gi => processedIds.add(gi.id));
          return;
        }
      }

      groups.push(item);
      processedIds.add(item.id);
    });

    return groups;
  };

  const currentCategorizedFeed = getCategorizedFeed();
  const groupedFeed = groupFeed(currentCategorizedFeed);

  const toggleGroup = (groupId: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(groupId)) newSet.delete(groupId);
    else newSet.add(groupId);
    setExpandedGroups(newSet);
  };

  const handleDeleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteMessage(id);
  };

  const renderFeedItem = (item: FeedItem, isInsideGroup = false) => {
    const isHighPriority = (item.raw as any).priority === 'HIGH';
    
    // Icon Mapping
    let Icon = Bell;
    if (item.source === 'message') Icon = UserIcon;
    else if (item.type === 'MATERIAL') Icon = BookOpen;
    else if (item.type === 'MEET_CALL') Icon = Phone;
    else if (item.type === 'MEET_MESSAGE' || item.type === 'MESSAGE') Icon = MessageSquare;
    else if (item.type === 'PROFESSOR_ADVISORY') Icon = GraduationCap;
    else if (item.type === 'SYSTEM' || (item.raw as any).senderModel === 'Admin') Icon = Building;

    // Color Mapping
    let bgColor = 'bg-rose-50 dark:bg-rose-900/30';
    let textColor = 'text-rose-600 dark:text-rose-400';
    
    if (item.source === 'message' || item.type === 'MEET_CALL' || item.type === 'MEET_MESSAGE') {
      bgColor = 'bg-blue-50 dark:bg-blue-900/30';
      textColor = 'text-blue-600 dark:text-blue-400';
    } else if (item.type === 'MATERIAL' || item.type === 'ANNOUNCEMENT') {
      bgColor = 'bg-amber-50 dark:bg-amber-900/30';
      textColor = 'text-amber-600 dark:text-amber-400';
    } else if (item.type === 'PROFESSOR_ADVISORY') {
      bgColor = 'bg-indigo-50 dark:bg-indigo-900/30';
      textColor = 'text-indigo-600 dark:text-indigo-400';
    }

    return (
      <li key={item.id} className={`flex items-start gap-4 p-5 bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative ${isInsideGroup ? 'ml-8 border-l-4 border-l-blue-500' : ''} ${isHighPriority ? 'ring-2 ring-red-500/50 bg-red-50/10 dark:bg-red-900/10' : ''}`}>
        <div className={`flex-shrink-0 mt-1 p-2 ${bgColor} ${textColor} rounded-full transition-colors`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white text-base">{item.title}</p>
            {isHighPriority && (
              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">
                Urgente
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-zinc-700/50 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {item.sender && (
              <span className="flex items-center gap-1">
                <UserIcon size={12} />
                De: {item.sender?.nombre} {item.sender?.apellidos}
              </span>
            )}
          </div>
        </div>
        {item.source === 'message' && (
          <button
            onClick={(e) => handleDeleteMessage(item.id, e)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Eliminar mensaje"
          >
            <Trash2 size={18} />
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
      <h1 className="text-4xl font-black text-center mb-2 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        INS PEDRALBES
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-12 font-medium tracking-wide uppercase text-sm">Proyecto Educativo Conectado</p>

      <div className="mb-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-200 dark:border-zinc-800 transition-all">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'personal' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <UserIcon size={18} className={activeTab === 'personal' ? 'text-blue-600 dark:text-blue-400' : ''} />
            Personal
            {activeTab === 'personal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
          <button
            onClick={() => setActiveTab('clase')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'clase' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <BookOpen size={18} className={activeTab === 'clase' ? 'text-blue-600 dark:text-blue-400' : ''} />
            Clase
            {activeTab === 'clase' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-semibold text-center transition-all duration-300 relative ${activeTab === 'general' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Building size={18} className={activeTab === 'general' ? 'text-blue-600 dark:text-blue-400' : ''} />
            General
            {activeTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[200px]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              {activeTab === 'personal' && <Bell size={20} className="text-blue-500" />}
              {activeTab === 'clase' && <BookOpen size={20} className="text-amber-500" />}
              {activeTab === 'general' && <Building size={20} className="text-indigo-500" />}
              {activeTab === 'personal' ? 'Notificaciones Personales' : activeTab === 'clase' ? 'Avisos de Clase' : 'Avisos de la Escuela'}
            </h2>
            <ul className="space-y-4">
              {groupedFeed.length > 0 ? groupedFeed.map((item, idx) => {
                if ('isGroup' in item) {
                  const isExpanded = expandedGroups.has(item.id);
                  return (
                    <div key={item.id} className="space-y-2">
                      <button 
                        onClick={() => toggleGroup(item.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-all"
                      >
                        <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            {item.type === 'MATERIAL' ? <BookOpen size={16} /> : (item.type === 'MEET_GROUP' ? <Phone size={16} /> : <Bell size={16} />)}
                          </div>
                          {item.title}
                          <span className="ml-2 text-xs font-medium text-gray-400">({item.items.length})</span>
                        </div>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                      {isExpanded && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {item.items.map(subItem => renderFeedItem(subItem, true))}
                        </div>
                      )}
                    </div>
                  );
                }
                return renderFeedItem(item as FeedItem);
              }) : (
                <li className="flex flex-col items-center justify-center p-12 bg-gray-50/80 dark:bg-zinc-800/20 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                  <Bell className="text-gray-300 dark:text-zinc-600 mb-3" size={32} />
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-center">No hay nuevos avisos en esta categoría.</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Monthly Calendar Section */}
      <div className="mb-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-200 dark:border-zinc-800 p-6 md:p-8 transition-all">
        <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-gray-900 dark:text-white transition-colors tracking-wide">
          <span className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center -rotate-3 shadow-md">
            <BookOpen size={20} />
          </span>
          Calendario Académico
        </h3>
        <div className="h-[600px]">
          <MonthlyCalendar events={filteredEvents} />
        </div>
      </div>
    </div>
  );
};