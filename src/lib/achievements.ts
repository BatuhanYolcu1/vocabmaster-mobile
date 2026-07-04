import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  earned: boolean;
  progress: number; // 0-1
};

// Tüm rozetler mevcut AsyncStorage istatistiklerinden türetilir — ekstra state yok
export async function loadAchievements(): Promise<Achievement[]> {
  const pairs = await AsyncStorage.multiGet([
    'stats_total_xp', 'stats_max_streak', 'stats_total_correct',
    'stats_total_attempts', 'custom_lists',
  ]);
  const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));

  const xp = parseInt(m.stats_total_xp ?? '0');
  const maxStreak = parseInt(m.stats_max_streak ?? '0');
  const attempts = parseInt(m.stats_total_attempts ?? '0');
  const correct = parseInt(m.stats_total_correct ?? '0');
  const accuracy = attempts > 0 ? (correct / attempts) * 100 : 0;
  const customLists = JSON.parse(m.custom_lists ?? '[]') as unknown[];

  const pct = (val: number, goal: number) => Math.min(val / goal, 1);

  return [
    { id: 'first',     title: 'İlk Adım',          desc: 'İlk oturumunu tamamla',        icon: 'figure.walk',          color: Colors.primary, earned: attempts >= 1,          progress: pct(attempts, 1) },
    { id: 'curious',   title: 'Meraklı',            desc: '50 kelime çalış',              icon: 'sparkle.magnifyingglass', color: Colors.blue,  earned: attempts >= 50,         progress: pct(attempts, 50) },
    { id: 'hunter',    title: 'Kelime Avcısı',      desc: '250 kelime çalış',             icon: 'scope',                color: Colors.green,   earned: attempts >= 250,        progress: pct(attempts, 250) },
    { id: 'bookworm',  title: 'Sözlük Kurdu',       desc: '1000 kelime çalış',            icon: 'books.vertical.fill',  color: Colors.purple,  earned: attempts >= 1000,       progress: pct(attempts, 1000) },
    { id: 'spark',     title: 'Kıvılcım',           desc: '3 günlük seri yap',            icon: 'sparkles',             color: Colors.accent,  earned: maxStreak >= 3,         progress: pct(maxStreak, 3) },
    { id: 'flame',     title: 'Alev',               desc: '7 günlük seri yap',            icon: 'flame.fill',           color: '#F97316',      earned: maxStreak >= 7,         progress: pct(maxStreak, 7) },
    { id: 'fire',      title: 'Yangın',             desc: '30 günlük seri yap',           icon: 'flame.circle.fill',    color: Colors.danger,  earned: maxStreak >= 30,        progress: pct(maxStreak, 30) },
    { id: 'novice',    title: 'Çırak',              desc: '500 XP topla',                 icon: 'star.fill',            color: Colors.warning, earned: xp >= 500,              progress: pct(xp, 500) },
    { id: 'adept',     title: 'Kalfa',              desc: '2500 XP topla',                icon: 'star.circle.fill',     color: '#F59E0B',      earned: xp >= 2500,             progress: pct(xp, 2500) },
    { id: 'master',    title: 'Usta',               desc: '10000 XP topla',               icon: 'crown.fill',           color: '#D97706',      earned: xp >= 10000,            progress: pct(xp, 10000) },
    { id: 'sniper',    title: 'Keskin Nişancı',     desc: '%90+ doğruluk (100+ deneme)',  icon: 'target',               color: '#EC4899',      earned: accuracy >= 90 && attempts >= 100, progress: attempts >= 100 ? pct(accuracy, 90) : pct(attempts, 100) * 0.5 },
    { id: 'collector', title: 'Koleksiyoncu',       desc: 'İlk özel listeni oluştur',     icon: 'folder.fill.badge.plus', color: '#06B6D4',    earned: customLists.length >= 1, progress: pct(customLists.length, 1) },
  ];
}
