import { Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import type { Verse, Chapter } from '../types';
import { useProgressContext } from '../context/ProgressContext';

interface VerseCardProps {
    verse: Verse;
    chapter: Chapter;
    showTranslation: boolean;
}

export default function VerseCard({ verse, chapter, showTranslation }: VerseCardProps) {
    const { markRead, toggleBookmark, checkBookmarked, checkVerseRead } = useProgressContext();
    const bookmarked = checkBookmarked(verse.verseKey);
    const isRead = checkVerseRead(verse.verseKey);

    const handleMarkRead = () => {
        markRead(chapter.id, verse.verseNumber, chapter.versesCount);
    };

    const handleBookmark = () => {
        toggleBookmark({
            chapterId: chapter.id,
            verseNumber: verse.verseNumber,
            verseKey: verse.verseKey,
            chapterName: chapter.nameSimple,
        });
    };

    return (
        <div
            className={`group rounded-xl border p-5 transition-all duration-200
        ${isRead
                    ? 'bg-emerald-900/10 border-emerald-700/30'
                    : 'bg-slate-800/50 border-slate-700/40 hover:border-slate-600/60'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 text-slate-300 text-xs font-medium flex items-center justify-center">
                        {verse.verseNumber}
                    </span>
                    <span className="text-slate-500 text-xs">{verse.verseKey}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleBookmark}
                        title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        className={`p-1.5 rounded-lg transition-colors ${bookmarked
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-slate-500 hover:text-amber-400 hover:bg-amber-400/10'
                            }`}
                    >
                        {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <button
                        onClick={handleMarkRead}
                        title={isRead ? 'Already read' : 'Mark as read'}
                        disabled={isRead}
                        className={`p-1.5 rounded-lg transition-colors ${isRead
                            ? 'text-emerald-400 bg-emerald-400/10 cursor-default'
                            : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10'
                            }`}
                    >
                        <CheckCircle size={16} />
                    </button>
                </div>
            </div>

            {/* Arabic */}
            <p className="font-arabic text-right text-2xl text-white leading-relaxed mb-4 select-text">
                {verse.textUthmani}
            </p>

            {/* Translation */}
            {showTranslation && verse.translations?.[0] && (
                <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                    {verse.translations[0].text.replace(/<[^>]+>/g, '')}
                </p>
            )}
        </div>
    );
}
