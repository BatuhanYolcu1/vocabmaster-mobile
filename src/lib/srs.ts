export type Rating = 'hard' | 'good' | 'easy';

export interface Word {
  id: string;
  word: string;
  definitionTr: string;
  exampleSentence: string;
  exampleSentenceTr: string;
  turkishTranslation: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb';
  level?: string;
  category?: string;
}

export interface SRSCard {
  word: Word;
  interval: number;
  easeFactor: number;
  nextReview: Date;
  reviewCount: number;
}

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;

export function createSRSCard(word: Word): SRSCard {
  return { word, interval: 0, easeFactor: DEFAULT_EASE, nextReview: new Date(), reviewCount: 0 };
}

export function calculateNextReview(card: SRSCard, rating: Rating): SRSCard {
  let newInterval: number;
  let newEase = card.easeFactor;
  const isFirst = card.reviewCount === 0;
  const qualityMap: Record<Rating, number> = { hard: 1, good: 3, easy: 5 };
  const q = qualityMap[rating];
  newEase = Math.max(MIN_EASE, Math.min(MAX_EASE, newEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
  switch (rating) {
    case 'hard': newInterval = isFirst || card.interval < 1440 ? 1 : Math.max(1440, Math.round(card.interval * 0.5)); break;
    case 'good': newInterval = isFirst ? 10 : card.interval < 1440 ? 1440 : Math.round(card.interval * newEase); break;
    case 'easy': newInterval = isFirst ? 4 * 1440 : card.interval < 1440 ? 4 * 1440 : Math.round(card.interval * newEase * 1.3); break;
  }
  newInterval = Math.min(newInterval!, 180 * 1440);
  const nextReview = new Date();
  nextReview.setMinutes(nextReview.getMinutes() + newInterval);
  return { ...card, interval: newInterval!, easeFactor: newEase, nextReview, reviewCount: card.reviewCount + 1 };
}

export function getIntervalLabel(quality: number, interval: number, ease: number): string {
  const ratingMap: Record<number, Rating> = { 1: 'hard', 3: 'good', 5: 'easy' };
  const rating = ratingMap[quality];
  if (!rating) return '';
  const card = { word: {} as Word, interval, easeFactor: ease, nextReview: new Date(), reviewCount: interval > 0 ? 1 : 0 };
  const result = calculateNextReview(card, rating);
  const min = result.interval;
  if (min < 60) return `${min}dk`;
  if (min < 1440) return `${Math.round(min / 60)}sa`;
  return `${Math.round(min / 1440)}g`;
}

export function calculateXP(rating: Rating, streak: number): number {
  const base: Record<Rating, number> = { hard: 3, good: 5, easy: 8 };
  return Math.round(base[rating] * (1 + Math.min(streak / 30, 1)));
}
