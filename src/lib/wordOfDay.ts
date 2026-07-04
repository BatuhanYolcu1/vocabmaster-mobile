import { DEFAULT_LISTS, StudyWord } from '../data/demoWords';

export type DailyWord = StudyWord & { listId: string };

// Tarihe göre deterministik seçim — aynı gün hep aynı kelime, ertesi gün değişir
export function wordOfTheDay(): DailyWord {
  const today = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (const c of today) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  const pool = DEFAULT_LISTS.flatMap(l => l.words.map(w => ({ ...w, listId: l.id })));
  return pool[hash % pool.length];
}
