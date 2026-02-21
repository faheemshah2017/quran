import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle } from 'lucide-react';
import type { Chapter } from '../types';
import { useProgressContext } from '../context/ProgressContext';

interface ChapterCardProps {
    chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
    const navigate = useNavigate();
    const { getChapterPct, progress } = useProgressContext();
    const pct = getChapterPct(chapter.id, chapter.versesCount);
    const isComplete = progress.completedChapters.includes(chapter.id);

    return (
        <button
            onClick={() => navigate(`/chapters/${chapter.id}`)}
            className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/20"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0">
                    {chapter.id}
                </div>
                {isComplete ? (
                    <CheckCircle size={16} className="text-emerald-400 mt-0.5" />
                ) : pct > 0 ? (
                    <span className="text-xs text-slate-400">{pct}%</span>
                ) : (
                    <BookOpen size={16} className="text-slate-600 mt-0.5 group-hover:text-slate-400 transition-colors" />
                )}
            </div>

            <p className="text-white font-semibold text-sm mb-0.5 truncate">{chapter.nameSimple}</p>
            <p className="text-slate-400 text-xs mb-1 truncate">{chapter.translatedName?.name}</p>
            <p className="font-arabic text-emerald-300 text-base leading-none mb-3">{chapter.nameArabic}</p>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>{chapter.versesCount} verses</span>
                <span className="capitalize">{chapter.revelationPlace}</span>
            </div>

            {pct > 0 && (
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            )}
        </button>
    );
}
