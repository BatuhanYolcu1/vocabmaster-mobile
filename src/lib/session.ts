import { StudyWord } from '../data/demoWords';

// Oturum ayarlarını uygular: karıştırma + kelime sayısı sınırı.
// count: '10' | '20' | 'all' (string param olarak gelir), shuffle: '1' | '0'
export function prepareWords(
  words: StudyWord[],
  opts: { count?: string; shuffle?: string },
): StudyWord[] {
  let result = [...words];
  if (opts.shuffle !== '0') {
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  }
  const n = opts.count && opts.count !== 'all' ? parseInt(opts.count) : NaN;
  if (!isNaN(n) && n > 0) result = result.slice(0, n);
  return result;
}
