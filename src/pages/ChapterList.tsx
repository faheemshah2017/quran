import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { Chapter } from '../types';
import { fetchChapters } from '../utils/api';
import ChapterCard from '../components/ChapterCard';

export default function ChapterList() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');

    useEffect(() => {
        fetchChapters()
            .then(setChapters)
            .catch(() => setError('Failed to load chapters. Please check your internet connection.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = chapters.filter((c) => {
        const matchSearch =
            query === '' ||
            c.nameSimple.toLowerCase().includes(query.toLowerCase()) ||
            c.translatedName?.name?.toLowerCase().includes(query.toLowerCase()) ||
            String(c.id).includes(query);
        const matchFilter =
            filter === 'all' || c.revelationPlace?.toLowerCase() === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Chapters</h1>
                <p className="text-slate-400 text-sm">114 Surahs of the Holy Quran</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name or number…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'meccan', 'medinan'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors
                ${filter === f
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="text-emerald-400 animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-24">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            ) : (
                <>
                    <p className="text-slate-500 text-xs mb-4">{filtered.length} chapters</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map((chapter) => (
                            <ChapterCard key={chapter.id} chapter={chapter} />
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-slate-400 text-sm">No chapters found.</div>
                    )}
                </>
            )}
        </div>
    );
}
