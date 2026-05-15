import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { 
    Bold, Italic, List, ListOrdered, Table as TableIcon, 
    Image as ImageIcon, Undo, Redo, Type 
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL de la imagen:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 rounded-t-2xl">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-zinc-700 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                title="Negrita"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-zinc-700 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                title="Cursiva"
            >
                <Italic size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-zinc-700 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                title="Lista de viñetas"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-zinc-700 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                title="Lista numerada"
            >
                <ListOrdered size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                title="Insertar Tabla"
            >
                <TableIcon size={18} />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                title="Insertar Imagen"
            >
                <ImageIcon size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-blue-500"
                title="Color Azul"
            >
                <Type size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                title="Quitar Color"
            >
                <X size={14} />
            </button>
            <div className="flex-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                title="Deshacer"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                title="Rehacer"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            Color,
            Image,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-gray-900 dark:text-white',
            },
        },
    });

    return (
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

const X = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);
