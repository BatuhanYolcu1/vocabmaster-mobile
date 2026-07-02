import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LISTS } from '../data/demoWords';

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const DEFAULT_DAILY_GOAL = 10;

export type SRSCard = { interval: number; easeFactor: number; reviewCount: number; nextReviewTime: number };

// 0=Yeni, 1=Öğreniliyor, 2=Tanıdık, 3=İyi, 4=Öğrenildi — interval büyüdükçe seviye artar
export function masteryFromSRS(card?: SRSCard): number {
  if (!card || !card.reviewCount) return 0;
  if (card.interval >= 4 * 1440) return 4;
  if (card.interval >= 1440) return 3;
  if (card.interval >= 60) return 2;
  return 1;
}

export async function loadSRSMap(listId: string): Promise<Record<string, SRSCard>> {
  try {
    const raw = await AsyncStorage.getItem(`srs_${listId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function recordSession(correct: number, total: number, xp: number): Promise<void> {
  if (total === 0) return;
  const today = todayStr();
  const prev = new Date();
  prev.setDate(prev.getDate() - 1);
  const yesterday = prev.toISOString().split('T')[0];

  const pairs = await AsyncStorage.multiGet([
    'stats_total_xp', 'stats_streak', 'stats_max_streak',
    'stats_last_date', 'stats_total_correct', 'stats_total_attempts', 'stats_daily_xp',
  ]);
  const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));

  const totalXp = parseInt(m.stats_total_xp ?? '0') + xp;
  const lastDate = m.stats_last_date;
  const cur = parseInt(m.stats_streak ?? '0');
  let newStreak = cur;
  if (lastDate !== today) {
    newStreak = lastDate === yesterday ? cur + 1 : 1;
  }
  const maxStreak = Math.max(newStreak, parseInt(m.stats_max_streak ?? '0'));
  const totalCorrect = parseInt(m.stats_total_correct ?? '0') + correct;
  const totalAttempts = parseInt(m.stats_total_attempts ?? '0') + total;

  const dailyXp: Record<string, number> = JSON.parse(m.stats_daily_xp ?? '{}');
  dailyXp[today] = (dailyXp[today] ?? 0) + xp;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  Object.keys(dailyXp).forEach(d => { if (d < cutoffStr) delete dailyXp[d]; });

  const todayWordsKey = `stats_daily_words_${today}`;
  const todayWordsRaw = await AsyncStorage.getItem(todayWordsKey);
  const newTodayWords = parseInt(todayWordsRaw ?? '0') + total;

  await AsyncStorage.multiSet([
    ['stats_total_xp', totalXp.toString()],
    ['stats_streak', newStreak.toString()],
    ['stats_max_streak', maxStreak.toString()],
    ['stats_last_date', today],
    ['stats_total_correct', totalCorrect.toString()],
    ['stats_total_attempts', totalAttempts.toString()],
    ['stats_daily_xp', JSON.stringify(dailyXp)],
    [todayWordsKey, newTodayWords.toString()],
  ]);
}

export async function loadDashboardStats() {
  const today = todayStr();
  const prev = new Date();
  prev.setDate(prev.getDate() - 1);
  const yesterday = prev.toISOString().split('T')[0];

  const pairs = await AsyncStorage.multiGet([
    'stats_total_xp', 'stats_streak', 'stats_daily_xp', 'daily_goal',
    `stats_daily_words_${today}`, 'stats_last_date',
  ]);
  const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));

  const dailyXp: Record<string, number> = JSON.parse(m.stats_daily_xp ?? '{}');
  const weeklyXp = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    weeklyXp.push({ name: DAY_NAMES[d.getDay()], xp: dailyXp[ds] ?? 0 });
  }

  const dueCount = await countDueWords();
  const totalXp = parseInt(m.stats_total_xp ?? '0');
  const todayWords = parseInt(m[`stats_daily_words_${today}`] ?? '0');
  const dailyGoal = parseInt(m.daily_goal ?? String(DEFAULT_DAILY_GOAL));

  // Seri, son çalışma bugün veya dün değilse kırılmıştır — kayıtlı değeri de sıfırla
  let streak = parseInt(m.stats_streak ?? '0');
  const lastDate = m.stats_last_date;
  if (streak > 0 && lastDate !== today && lastDate !== yesterday) {
    streak = 0;
    await AsyncStorage.setItem('stats_streak', '0');
  }

  const studiedToday = lastDate === today;

  return { totalXp, streak, todayWords, dailyGoal, weeklyXp, dueCount, studiedToday };
}

export async function loadProfileStats() {
  const pairs = await AsyncStorage.multiGet([
    'stats_total_xp', 'stats_streak', 'stats_max_streak',
    'stats_total_correct', 'stats_total_attempts', 'custom_lists',
  ]);
  const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));

  const totalAttempts = parseInt(m.stats_total_attempts ?? '0');
  const totalCorrect = parseInt(m.stats_total_correct ?? '0');
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const customLists: { id: string }[] = JSON.parse(m.custom_lists ?? '[]');
  let customWordCount = 0;
  for (const list of customLists) {
    const raw = await AsyncStorage.getItem(`words_${list.id}`);
    if (raw) customWordCount += (JSON.parse(raw) as unknown[]).length;
  }

  const totalXp = parseInt(m.stats_total_xp ?? '0');
  const streak = parseInt(m.stats_streak ?? '0');
  const maxStreak = parseInt(m.stats_max_streak ?? '0');
  const level = Math.floor(totalXp / 1000) + 1;
  const levelXp = totalXp % 1000;
  const defaultWordCount = DEFAULT_LISTS.reduce((sum, l) => sum + l.words.length, 0);

  return {
    totalXp,
    streak,
    maxStreak,
    accuracy,
    totalWords: defaultWordCount + customWordCount,
    level,
    levelXp,
    nextLevelXp: 1000,
  };
}

export async function countDueWords(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const srsKeys = keys.filter(k => k.startsWith('srs_'));
    if (srsKeys.length === 0) return 0;
    const now = Date.now();
    let count = 0;
    const srsData = await AsyncStorage.multiGet(srsKeys);
    for (const [, val] of srsData) {
      if (!val) continue;
      const data: Record<string, { nextReviewTime: number }> = JSON.parse(val);
      for (const card of Object.values(data)) {
        if (card.nextReviewTime && card.nextReviewTime <= now) count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

export async function saveSRSCard(
  listId: string, wordId: string,
  interval: number, easeFactor: number, reviewCount: number,
): Promise<void> {
  const key = `srs_${listId}`;
  const raw = await AsyncStorage.getItem(key);
  const data: Record<string, unknown> = raw ? JSON.parse(raw) : {};
  data[wordId] = {
    interval,
    easeFactor,
    reviewCount,
    nextReviewTime: Date.now() + interval * 60 * 1000,
  };
  await AsyncStorage.setItem(key, JSON.stringify(data));
}
