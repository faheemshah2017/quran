import { Menu, BookOpen } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { overallProgress, progress } = useProgressContext();

    return (
        <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center px-4 gap-4 sticky top-0 z-10">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
                <Menu size={20} />
            </button>

            <div className="flex-1 flex items-center gap-2 min-w-0">
                <BookOpen size={16} className="text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-sm truncate">
                    {progress.lastRead
                        ? `Last read: Surah ${progress.lastRead.chapterId}, Verse ${progress.lastRead.verseNumber}`
                        : 'Start reading today'}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Overall</span>
                    <div className="w-28 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <span className="text-emerald-400 text-xs font-medium">{overallProgress}%</span>
                </div>
            </div>
        </header>
    );
}
