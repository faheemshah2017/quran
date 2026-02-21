import type { ReadingProgress, Bookmark } from '../types';

const STORAGE_KEY = 'quran_progress';

const defaultProgress: ReadingProgress = {
  lastRead: { chapterId: 1, verseNumber: 1 },
  completedChapters: [],
  bookmarks: [],
  readVerses: [],
};

export function getProgress(): ReadingProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultProgress;
}

export function saveProgress(progress: ReadingProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markVerseRead(chapterId: number, verseNumber: number): void {
  const progress = getProgress();
  const key = `${chapterId}:${verseNumber}`;
  if (!progress.readVerses.includes(key)) {
    progress.readVerses.push(key);
  }
  progress.lastRead = { chapterId, verseNumber };
  saveProgress(progress);
}

export function markChapterComplete(chapterId: number, totalVerses: number): void {
  const progress = getProgress();
  // Check all verses of this chapter are read
  let allRead = true;
  for (let v = 1; v <= totalVerses; v++) {
    if (!progress.readVerses.includes(`${chapterId}:${v}`)) {
      allRead = false;
      break;
    }
  }
  if (allRead && !progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
    saveProgress(progress);
  }
}

export function addBookmark(bookmark: Omit<Bookmark, 'createdAt'>): void {
  const progress = getProgress();
  const exists = progress.bookmarks.find(
    (b) => b.verseKey === bookmark.verseKey
  );
  if (!exists) {
    progress.bookmarks.push({ ...bookmark, createdAt: new Date().toISOString() });
    saveProgress(progress);
  }
}

export function removeBookmark(verseKey: string): void {
  const progress = getProgress();
  progress.bookmarks = progress.bookmarks.filter((b) => b.verseKey !== verseKey);
  saveProgress(progress);
}

export function isBookmarked(verseKey: string): boolean {
  return getProgress().bookmarks.some((b) => b.verseKey === verseKey);
}

export function isVerseRead(verseKey: string): boolean {
  return getProgress().readVerses.includes(verseKey);
}

export function getChapterProgress(chapterId: number, totalVerses: number): number {
  const progress = getProgress();
  let count = 0;
  for (let v = 1; v <= totalVerses; v++) {
    if (progress.readVerses.includes(`${chapterId}:${v}`)) count++;
  }
  return Math.round((count / totalVerses) * 100);
}

export function getOverallProgress(): number {
  const progress = getProgress();
  // 6236 total verses in Quran
  return Math.round((progress.readVerses.length / 6236) * 100);
}

export function setLastRead(chapterId: number, verseNumber: number): void {
  const progress = getProgress();
  progress.lastRead = { chapterId, verseNumber };
  saveProgress(progress);
}
