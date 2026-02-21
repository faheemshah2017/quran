import type { Chapter, Verse } from '../types';

const BASE = 'https://api.qurancdn.com/api/qdc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapChapter(c: any): Chapter {
  return {
    id: c.id,
    nameSimple: c.name_simple,
    nameArabic: c.name_arabic,
    nameComplex: c.name_complex,
    versesCount: c.verses_count,
    revelationPlace: c.revelation_place,
    translatedName: {
      name: c.translated_name?.name ?? '',
      languageName: c.translated_name?.language_name ?? '',
    },
  };
}

export async function fetchChapters(): Promise<Chapter[]> {
  const res = await fetch(`${BASE}/chapters?language=en`);
  if (!res.ok) throw new Error(`fetchChapters failed: ${res.status}`);
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.chapters as any[]).map(mapChapter);
}

export async function fetchChapter(id: number): Promise<Chapter> {
  const res = await fetch(`${BASE}/chapters/${id}?language=en`);
  if (!res.ok) throw new Error(`fetchChapter failed: ${res.status}`);
  const data = await res.json();
  return mapChapter(data.chapter);
}

export async function fetchVerses(
  chapterId: number,
  page = 1
): Promise<{ verses: Verse[]; totalPages: number }> {
  const perPage = 20;

  // Fetch Arabic text and translations in parallel
  const [versesRes, translationsRes] = await Promise.all([
    fetch(
      `${BASE}/verses/by_chapter/${chapterId}?language=en&words=false&fields=text_uthmani&per_page=${perPage}&page=${page}`
    ),
    fetch(
      `${BASE}/verses/by_chapter/${chapterId}?language=en&words=false&translations=131&fields=text_uthmani&per_page=${perPage}&page=${page}`
    ),
  ]);

  if (!versesRes.ok) throw new Error(`fetchVerses failed: ${versesRes.status}`);
  const versesData = await versesRes.json();
  const translationsData = translationsRes.ok ? await translationsRes.json() : { verses: [] };

  // Build a map of verse_key -> translation text
  const translationMap: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const v of (translationsData.verses ?? []) as any[]) {
    if (v.translations?.[0]) {
      translationMap[v.verse_key] = v.translations[0].text ?? '';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verses: Verse[] = (versesData.verses as any[]).map((v) => ({
    id: v.id,
    verseNumber: v.verse_number,
    verseKey: v.verse_key,
    chapterId,
    textUthmani: v.text_uthmani,
    translations: translationMap[v.verse_key]
      ? [{ id: 131, text: translationMap[v.verse_key] }]
      : [],
  }));

  const totalPages: number = versesData.pagination?.total_pages ?? 1;
  return { verses, totalPages };
}
