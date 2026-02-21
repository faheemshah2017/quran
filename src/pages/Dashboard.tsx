import { useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, CheckCircle, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';

export default function Dashboard() {
    const { progress, overallProgress } = useProgressContext();
    const navigate = useNavigate();

    const stats = [
        {
            label: 'Verses Read',
            value: progress.readVerses.length,
            total: 6236,
            icon: BookOpen,
            color: 'emerald',
        },
        {
            label: 'Chapters Done',
            value: progress.completedChapters.length,
            total: 114,
            icon: CheckCircle,
            color: 'teal',
        },
        {
            label: 'Bookmarks',
            value: progress.bookmarks.length,
            total: null,
            icon: Bookmark,
            color: 'amber',
        },
        {
            label: 'Overall Progress',
            value: `${overallProgress}%`,
            total: null,
            icon: TrendingUp,
            color: 'sky',
        },
    ];

    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-500 to-emerald-600',
        teal: 'from-teal-500 to-teal-600',
        amber: 'from-amber-500 to-amber-600',
        sky: 'from-sky-500 to-sky-600',
    };

    const bgMap: Record<string, string> = {
        emerald: 'bg-emerald-500/10 text-emerald-400',
        teal: 'bg-teal-500/10 text-teal-400',
        amber: 'bg-amber-500/10 text-amber-400',
        sky: 'bg-sky-500/10 text-sky-400',
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Hero */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-700/30 p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-900/40 shrink-0">
                    <span className="font-arabic text-white text-3xl font-bold">ق</span>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </h1>
                    <p className="text-slate-400 text-sm">In the name of Allah, the Most Gracious, the Most Merciful</p>
                </div>
                <button
                    onClick={() =>
                        navigate(
                            `/chapters/${progress.lastRead?.chapterId ?? 1}`
                        )
                    }
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-emerald-900/30 shrink-0"
                >
                    <Clock size={16} />
                    Continue Reading
                    <ArrowRight size={16} />
                </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, total, icon: Icon, color }) => (
                    <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                        <div className={`w-9 h-9 rounded-lg ${bgMap[color]} flex items-center justify-center mb-3`}>
                            <Icon size={18} />
                        </div>
                        <p className="text-2xl font-bold text-white mb-0.5">
                            {value}
                            {total !== null && (
                                <span className="text-slate-500 text-sm font-normal"> / {total}</span>
                            )}
                        </p>
                        <p className="text-slate-400 text-xs">{label}</p>
                        {total !== null && typeof value === 'number' && (
                            <div className="mt-2 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
                                    style={{ width: `${Math.min(100, Math.round((value / total) * 100))}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Bookmarks */}
            {progress.bookmarks.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold text-base">Recent Bookmarks</h2>
                        <button
                            onClick={() => navigate('/bookmarks')}
                            className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1 transition-colors"
                        >
                            View all <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid gap-3">
                        {progress.bookmarks.slice(-4).reverse().map((bm) => (
                            <button
                                key={bm.verseKey}
                                onClick={() => navigate(`/chapters/${bm.chapterId}?verse=${bm.verseNumber}`)}
                                className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 hover:border-amber-500/30 rounded-xl p-3.5 text-left transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                    <Bookmark size={14} className="text-amber-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-white text-sm font-medium truncate">{bm.chapterName}</p>
                                    <p className="text-slate-400 text-xs">Verse {bm.verseNumber} · {bm.verseKey}</p>
                                </div>
                                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Start */}
            {progress.readVerses.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-slate-400 mb-4 text-sm">Ready to start your Quran journey?</p>
                    <button
                        onClick={() => navigate('/chapters')}
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <BookOpen size={18} />
                        Browse Chapters
                    </button>
                </div>
            )}
        </div>
    );
}
