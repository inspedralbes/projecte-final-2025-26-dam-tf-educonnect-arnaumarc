import React from 'react';
import { toast } from 'react-hot-toast';
import { Check, Bell, X } from 'lucide-react';

interface InteractiveToastProps {
    id: string;
    title: string;
    content: string;
    onMarkAsRead: () => void;
}

export const InteractiveToast: React.FC<InteractiveToastProps> = ({ id, title, content, onMarkAsRead }) => {
    return (
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Bell size={20} />
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-l border-gray-100 dark:border-zinc-800">
                <button
                    onClick={() => {
                        onMarkAsRead();
                        toast.dismiss(id);
                    }}
                    className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest"
                >
                    <Check size={16} className="mr-1" /> Llegit
                </button>
                <button
                    onClick={() => toast.dismiss(id)}
                    className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

