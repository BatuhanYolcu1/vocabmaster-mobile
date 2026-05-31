import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, SRSCard, Word, calculateNextReview, createSRSCard } from './srs';
import { api } from './api';

interface SessionStats {
  totalWords: number; hardCount: number; goodCount: number; easyCount: number;
  startTime: string; endTime?: string;
}
interface StudyStore {
  isSessionActive: boolean; cards: SRSCard[]; currentIndex: number;
  isFlipped: boolean; stats: SessionStats | null; _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  startSession: (words: Word[]) => void;
  flipCard: () => void; rateCard: (rating: Rating) => void;
  nextCard: () => void; endSession: () => void; resetSession: () => void;
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      isSessionActive: false, cards: [], currentIndex: 0,
      isFlipped: false, stats: null, _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      startSession: (words) => set({
        isSessionActive: true, cards: words.map(createSRSCard), currentIndex: 0,
        isFlipped: false, stats: { totalWords: words.length, hardCount: 0, goodCount: 0, easyCount: 0, startTime: new Date().toISOString() },
      }),
      flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),
      rateCard: (rating) => {
        const { cards, currentIndex, stats } = get();
        if (currentIndex >= cards.length || !stats) return;
        const updated = calculateNextReview(cards[currentIndex], rating);
        const updatedCards = [...cards]; updatedCards[currentIndex] = updated;
        const newStats = { ...stats };
        if (rating === 'hard') newStats.hardCount++;
        else if (rating === 'good') newStats.goodCount++;
        else newStats.easyCount++;
        set({ cards: updatedCards, stats: newStats });
        api.progress.update(cards[currentIndex].word.id, rating).catch(() => {});
        get().nextCard();
      },
      nextCard: () => {
        const { currentIndex, cards } = get();
        if (currentIndex < cards.length - 1) set({ currentIndex: currentIndex + 1, isFlipped: false });
        else get().endSession();
      },
      endSession: () => {
        const { stats } = get();
        if (!stats) return;
        const completed = { ...stats, endTime: new Date().toISOString() };
        const xp = stats.goodCount * 5 + stats.easyCount * 10;
        if (xp > 0) api.xp.add(xp, 'flashcard').catch(() => {});
        set({ isSessionActive: false, stats: completed });
      },
      resetSession: () => set({ isSessionActive: false, cards: [], currentIndex: 0, isFlipped: false, stats: null }),
    }),
    { name: 'vocab-study', storage: createJSONStorage(() => AsyncStorage), onRehydrateStorage: () => (s) => s?.setHasHydrated(true) }
  )
);
