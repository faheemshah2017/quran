export interface Chapter {
  id: number;
  nameSimple: string;
  nameArabic: string;
  nameComplex: string;
  versesCount: number;
  revelationPlace: string;
  translatedName: {
    name: string;
    languageName: string;
  };
}

export interface Verse {
  id: number;
  verseNumber: number;
  verseKey: string;
  chapterId: number;
  textUthmani: string;
  translations: Translation[];
}

export interface Translation {
  id: number;
  text: string;
  resourceName?: string;
}

export interface ReadingProgress {
  lastRead: {
    chapterId: number;
    verseNumber: number;
  };
  completedChapters: number[];
  bookmarks: Bookmark[];
  readVerses: string[]; // e.g. ["1:1", "1:2", ...]
}

export interface Bookmark {
  chapterId: number;
  verseNumber: number;
  verseKey: string;
  chapterName: string;
  note?: string;
  createdAt: string;
}
