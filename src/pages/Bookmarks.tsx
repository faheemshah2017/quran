import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';

export default function Bookmarks() {
    const { progress, toggleBookmark } = useProgressContext();
    const navigate = useNavigate();
    const bookmarks = [...progress.bookmarks].reverse();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Bookmarks</h1>
                <p className="text-slate-400 text-sm">
                    {bookmarks.length} saved {bookmarks.length === 1 ? 'verse' : 'verses'}
                </p>
            </div>

            {bookmarks.length === 0 ? (
                <div className="text-center py-24">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                        <Bookmark size={28} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 mb-2">No bookmarks yet</p>
                    <p className="text-slate-500 text-sm mb-6">Hover over a verse while reading and click the bookmark icon</p>
                    <button
                        onClick={() => navigate('/chapters')}
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                        Start Reading
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookmarks.map((bm) => (
                        <div
                            key={bm.verseKey}
                            className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/40 hover:border-amber-500/20 rounded-xl p-4 group transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                <Bookmark size={16} className="text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm">{bm.chapterName}</p>
                                <p className="text-slate-400 text-xs">
                                    Verse {bm.verseNumber} · {bm.verseKey}
                                </p>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    Saved {new Date(bm.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() =>
                                        navigate(`/chapters/${bm.chapterId}?verse=${bm.verseNumber}`)
                                    }
                                    className="p-2 rounded-lg bg-slate-700 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
                                    title="Go to verse"
                                >
                                    <ArrowRight size={15} />
                                </button>
                                <button
                                    onClick={() =>
                                        toggleBookmark({
                                            chapterId: bm.chapterId,
                                            verseNumber: bm.verseNumber,
                                            verseKey: bm.verseKey,
                                            chapterName: bm.chapterName,
                                        })
                                    }
                                    className="p-2 rounded-lg bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Remove bookmark"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
