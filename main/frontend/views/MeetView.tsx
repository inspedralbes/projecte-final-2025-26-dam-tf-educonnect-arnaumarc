import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MoreVertical, Users, MessageSquare } from 'lucide-react';

export const MeetView: React.FC = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-60px)] bg-[#202124] text-white flex flex-col">
      {/* Main Grid */}
      <div className="flex-1 p-4 flex gap-4 overflow-hidden">
        {/* Main Speaker */}
        <div className="flex-1 bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-700">
          <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-sm font-medium">
            Dr. Roberto Martínez
          </div>
          <img 
            src="https://picsum.photos/800/600" 
            alt="Main Speaker" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Sidebar Participants */}
        <div className="w-64 flex flex-col gap-4 hidden md:flex">
          <div className="h-40 bg-gray-800 rounded-lg relative overflow-hidden border border-gray-700">
            <div className="absolute bottom-2 left-2 text-xs font-medium">Tú</div>
             {camOn ? (
                 <img src="https://picsum.photos/300/200?random=10" className="w-full h-full object-cover" alt="Me" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-700">
                     <div className="w-12 h-12 rounded-full bg-purple-500 text-xl flex items-center justify-center">Y</div>
                 </div>
             )}
          </div>
          <div className="h-40 bg-gray-800 rounded-lg relative overflow-hidden border border-gray-700 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-yellow-500 text-black text-xl flex items-center justify-center font-bold">AG</div>
             <div className="absolute bottom-2 left-2 text-xs font-medium">Ana Gómez</div>
          </div>
          <div className="h-40 bg-gray-800 rounded-lg relative overflow-hidden border border-gray-700">
             <img src="https://picsum.photos/300/200?random=11" className="w-full h-full object-cover" alt="Student" />
             <div className="absolute bottom-2 left-2 text-xs font-medium">Carlos Ruiz</div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="h-20 bg-[#202124] flex items-center justify-between px-6 border-t border-gray-800">
        <div className="text-white font-medium text-sm hidden sm:block">
          {time} | Clase de Matemáticas
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-3 rounded-full ${micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'} transition-all`}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button 
             onClick={() => setCamOn(!camOn)}
            className={`p-3 rounded-full ${camOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'} transition-all`}
          >
            {camOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button className="p-3 rounded-full bg-red-600 hover:bg-red-500 w-16 flex items-center justify-center">
            <PhoneOff size={24} fill="white" />
          </button>
           <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 hidden sm:block">
            <MoreVertical size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          <button className="hover:bg-gray-700 p-2 rounded-full">
             <Users size={24} />
          </button>
          <button className="hover:bg-gray-700 p-2 rounded-full">
             <MessageSquare size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};