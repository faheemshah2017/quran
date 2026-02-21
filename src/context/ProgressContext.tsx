import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    getProgress,
    markVerseRead,
    addBookmark,
    removeBookmark,
    isBookmarked,
    isVerseRead,
    getChapterProgress,
    getOverallProgress,
    setLastRead,
    markChapterComplete,
} from '../utils/progress';
import type { ReadingProgress, Bookmark } from '../types';

interface ProgressContextType {
    progress: ReadingProgress;
    overallProgress: number;
    markRead: (chapterId: number, verseNumber: number, totalVerses: number) => void;
    toggleBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => void;
    checkBookmarked: (verseKey: string) => boolean;
    checkVerseRead: (verseKey: string) => boolean;
    getChapterPct: (chapterId: number, totalVerses: number) => number;
    updateLastRead: (chapterId: number, verseNumber: number) => void;
    refresh: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const [progress, setProgress] = useState<ReadingProgress>(getProgress);
    const [overallProgress, setOverallProgress] = useState(getOverallProgress);

    const refresh = useCallback(() => {
        setProgress(getProgress());
        setOverallProgress(getOverallProgress());
    }, []);

    const markRead = useCallback(
        (chapterId: number, verseNumber: number, totalVerses: number) => {
            markVerseRead(chapterId, verseNumber);
            markChapterComplete(chapterId, totalVerses);
            refresh();
        },
        [refresh]
    );

    const toggleBookmark = useCallback(
        (bookmark: Omit<Bookmark, 'createdAt'>) => {
            if (isBookmarked(bookmark.verseKey)) {
                removeBookmark(bookmark.verseKey);
            } else {
                addBookmark(bookmark);
            }
            refresh();
        },
        [refresh]
    );

    const updateLastRead = useCallback(
        (chapterId: number, verseNumber: number) => {
            setLastRead(chapterId, verseNumber);
            refresh();
        },
        [refresh]
    );

    return (
        <ProgressContext.Provider
            value={{
                progress,
                overallProgress,
                markRead,
                toggleBookmark,
                checkBookmarked: isBookmarked,
                checkVerseRead: isVerseRead,
                getChapterPct: getChapterProgress,
                updateLastRead,
                refresh,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgressContext() {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgressContext must be used inside ProgressProvider');
    return ctx;
}
