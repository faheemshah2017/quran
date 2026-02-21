import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, Loader2, ChevronLeft, ChevronRight,
    Eye, EyeOff, CheckCheck
} from 'lucide-react';
import type { Chapter, Verse } from '../types';
import { fetchChapter, fetchVerses } from '../utils/api';
import VerseCard from '../components/VerseCard';
import { useProgressContext } from '../context/ProgressContext';

export default function ChapterReader() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const targetVerse = searchParams.get('verse');

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showTranslation, setShowTranslation] = useState(true);
    const topRef = useRef<HTMLDivElement>(null);

    const { markRead, updateLastRead, getChapterPct } = useProgressContext();
    const chapterId = Number(id);

    useEffect(() => {
        setLoading(true);
        setError('');
        Promise.all([fetchChapter(chapterId), fetchVerses(chapterId, page)])
            .then(([ch, { verses: v, totalPages: tp }]) => {
                setChapter(ch);
                setVerses(v);
                setTotalPages(tp);
                if (v.length > 0) updateLastRead(chapterId, v[0].verseNumber);
            })
            .catch(() => setError('Failed to load chapter. Please try again.'))
            .finally(() => setLoading(false));
    }, [chapterId, page]);

    // Scroll to top on page change
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [page]);

    const handleMarkAllRead = () => {
        if (!chapter) return;
        verses.forEach((v) => markRead(chapter.id, v.verseNumber, chapter.versesCount));
    };

    const pct = chapter ? getChapterPct(chapter.id, chapter.versesCount) : 0;

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto" ref={topRef}>
            {/* Back + Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/chapters')}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    All Chapters
                </button>

                {chapter && (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                                        {chapter.id}
                                    </span>
                                    <h1 className="text-xl font-bold text-white">{chapter.nameSimple}</h1>
                                </div>
                                <p className="text-slate-400 text-sm">{chapter.translatedName?.name}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                    <span>{chapter.versesCount} verses</span>
                                    <span>·</span>
                                    <span className="capitalize">{chapter.revelationPlace}</span>
                                    {pct > 0 && (
                                        <>
                                            <span>·</span>
                                            <span className="text-emerald-400">{pct}% read</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="font-arabic text-3xl text-emerald-300 shrink-0">{chapter.nameArabic}</p>
                        </div>

                        {/* Progress bar */}
                        {pct > 0 && (
                            <div className="mt-4 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-xs">
                    Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTranslation((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
              ${showTranslation
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                    >
                        {showTranslation ? <Eye size={13} /> : <EyeOff size={13} />}
                        Translation
                    </button>
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                        <CheckCheck size={13} />
                        Mark page read
                    </button>
                </div>
            </div>

            {/* Bismillah (all chapters except At-Tawbah = 9, and Al-Fatihah = 1 which has it as verse 1) */}
            {chapter && chapter.id !== 9 && chapter.id !== 1 && page === 1 && (
                <div className="text-center mb-6 py-4 border-b border-slate-700/50">
                    <p className="font-arabic text-2xl text-emerald-300">
                        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                    </p>
                </div>
            )}

            {/* Verses */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="text-emerald-400 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-24 text-red-400 text-sm">{error}</div>
            ) : (
                <div className="space-y-4">
                    {verses.map((verse) => (
                        <div
                            key={verse.id}
                            id={`verse-${verse.verseNumber}`}
                            className={
                                targetVerse && String(verse.verseNumber) === targetVerse
                                    ? 'ring-2 ring-amber-400/50 rounded-xl'
                                    : ''
                            }
                        >
                            <VerseCard
                                verse={verse}
                                chapter={chapter!}
                                showTranslation={showTranslation}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:border-emerald-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-slate-500 text-sm">{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:border-emerald-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Chapter navigation */}
            {!loading && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
                    <button
                        onClick={() => navigate(`/chapters/${chapterId - 1}`)}
                        disabled={chapterId <= 1}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} /> Previous Surah
                    </button>
                    <button
                        onClick={() => navigate(`/chapters/${chapterId + 1}`)}
                        disabled={chapterId >= 114}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Next Surah <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
