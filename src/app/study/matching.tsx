import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence, withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { loadStudyWords, StudyWord } from '../../data/demoWords';
import { prepareWords } from '../../lib/session';
import { recordSession } from '../../lib/stats';
import { StudyEmpty } from '../../components/study-empty';
import { StudySkeleton } from '../../components/skeleton';
import { Confetti } from '../../components/confetti';
import { SpringIn, CountUp } from '../../components/anim';
import { LevelUpModal } from '../../components/level-up-modal';

const ROUND_SIZE = 5;
const ACCENT = Colors.blue;

type Card = { wordId: string; label: string; side: 'en' | 'tr' };
type CardState = 'idle' | 'selected' | 'matched' | 'wrong';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MatchCard({ card, state, onPress, index }: {
  card: Card; state: CardState; onPress: () => void; index: number;
}) {
  const scale = useSharedValue(0.6);
  const shake = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = 0.6;
    opacity.value = 0;
    scale.value = withDelay(index * 50, withSpring(1, { damping: 13, stiffness: 170 }));
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 180 }));
  }, [card.wordId, card.side]);

  useEffect(() => {
    if (state === 'matched') {
      scale.value = withSequence(
        withSpring(1.06, { damping: 9, stiffness: 220 }),
        withTiming(0, { duration: 240 }),
      );
      opacity.value = withDelay(160, withTiming(0, { duration: 200 }));
    } else if (state === 'wrong') {
      shake.value = withSequence(
        withTiming(-7, { duration: 50 }), withTiming(7, { duration: 50 }),
        withTiming(-5, { duration: 45 }), withTiming(5, { duration: 45 }),
        withTiming(0, { duration: 40 }),
      );
    }
  }, [state]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateX: shake.value }],
  }));

  const bg = state === 'selected' ? Colors.blueLight
           : state === 'matched'  ? Colors.easyBg
           : state === 'wrong'    ? Colors.hardBg
           : Colors.bgCard;
  const border = state === 'selected' ? ACCENT
               : state === 'matched'  ? Colors.easy
               : state === 'wrong'    ? Colors.hard
               : Colors.border;
  const txt = state === 'selected' ? ACCENT
            : state === 'matched'  ? Colors.easy
            : state === 'wrong'    ? Colors.hard
            : Colors.textPrimary;

  return (
    <Animated.View style={[{ flex: 1 }, anim]}>
      <TouchableOpacity
        style={[s.card, { backgroundColor: bg, borderColor: border }]}
        onPress={onPress}
        disabled={state === 'matched'}
        activeOpacity={0.8}
      >
        <Text style={[s.cardText, { color: txt }]} numberOfLines={2} adjustsFontSizeToFit>
          {card.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MatchingScreen() {
  const { listId, count, shuffle: shuffleParam } = useLocalSearchParams<{ listId?: string; count?: string; shuffle?: string }>();
  const [words, setWords]     = useState<StudyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound]     = useState(0);
  const [leftCards,  setLeft]  = useState<Card[]>([]);
  const [rightCards, setRight] = useState<Card[]>([]);
  const [states, setStates]   = useState<Record<string, CardState>>({});
  const [selected, setSelected] = useState<Card | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [wrongCount, setWrongCount]     = useState(0);
  const [done, setDone]       = useState(false);
  const [fastRounds, setFastRounds] = useState(0);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const roundStart = useRef(Date.now());
  const sessionSaved = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadStudyWords(listId).then(w => {
      setWords(prepareWords(w, { count, shuffle: shuffleParam }));
      setLoading(false);
    });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [listId, count, shuffleParam]);

  const totalRounds = Math.ceil(words.length / ROUND_SIZE);
  const roundWords = words.slice(round * ROUND_SIZE, (round + 1) * ROUND_SIZE);

  // Yeni tur kur
  useEffect(() => {
    if (roundWords.length === 0) return;
    setLeft(roundWords.map(w => ({ wordId: w.id, label: w.word, side: 'en' as const })));
    setRight(shuffle(roundWords.map(w => ({ wordId: w.id, label: w.tr, side: 'tr' as const }))));
    setStates({});
    setSelected(null);
    roundStart.current = Date.now();
  }, [round, words]);

  const keyOf = (c: Card) => `${c.side}_${c.wordId}`;

  const handlePress = useCallback((card: Card) => {
    const key = keyOf(card);
    if (states[key] === 'matched') return;

    if (!selected) {
      setSelected(card);
      setStates(st => ({ ...st, [key]: 'selected' }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    // Aynı karta veya aynı tarafa basıldıysa seçim değişir
    if (selected.side === card.side) {
      setStates(st => ({ ...st, [keyOf(selected)]: 'idle', [key]: 'selected' }));
      setSelected(card);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    const prevKey = keyOf(selected);
    if (selected.wordId === card.wordId) {
      // Doğru eşleşme
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStates(st => ({ ...st, [prevKey]: 'matched', [key]: 'matched' }));
      setSelected(null);
      const newMatched = matchedCount + 1;
      setMatchedCount(newMatched);

      const matchedInRound = Object.entries({ ...states, [prevKey]: 'matched', [key]: 'matched' })
        .filter(([k, v]) => v === 'matched' && k.startsWith('en_')).length;
      if (matchedInRound === roundWords.length) {
        // Tur bitti — hız bonusu kontrolü
        const elapsed = (Date.now() - roundStart.current) / 1000;
        if (elapsed <= 30) setFastRounds(f => f + 1);
        timerRef.current = setTimeout(() => {
          if (round < totalRounds - 1) setRound(r => r + 1);
          else setDone(true);
        }, 550);
      }
    } else {
      // Yanlış
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrongCount(w => w + 1);
      setStates(st => ({ ...st, [prevKey]: 'wrong', [key]: 'wrong' }));
      setSelected(null);
      timerRef.current = setTimeout(() => {
        setStates(st => ({ ...st, [prevKey]: 'idle', [key]: 'idle' }));
      }, 550);
    }
  }, [selected, states, matchedCount, roundWords.length, round, totalRounds]);

  if (!loading && words.length === 0) return <StudyEmpty listId={listId} />;
  if (loading) return <StudySkeleton />;

  if (done) {
    const total = words.length;
    const attempts = total + wrongCount;
    const acc = Math.round((total / attempts) * 100);
    const baseXp = total * 10;
    const bonus = Math.round(baseXp * 0.2 * (fastRounds / Math.max(totalRounds, 1)));
    const xp = baseXp + bonus;
    if (!sessionSaved.current) {
      sessionSaved.current = true;
      recordSession(total, attempts, xp)
        .then(r => { if (r.leveledUp) setLevelUp(r.newLevel); })
        .catch(() => {});
    }
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.doneContent}>
          <SpringIn>
            <View style={[s.doneIcon, { backgroundColor: acc >= 70 ? Colors.blueLight : Colors.warningLight }]}>
              <SymbolView name={acc >= 80 ? 'trophy.fill' : 'star.fill'} size={38} tintColor={acc >= 80 ? Colors.warning : ACCENT} type="monochrome" />
            </View>
          </SpringIn>
          <Text style={s.doneTitle}>Eşleştirme Bitti!</Text>
          <Text style={s.doneAcc}>{total} eşleşme · %{acc} isabet</Text>
          <SpringIn delay={150} style={{ width: '100%', alignItems: 'center' }}>
            <View style={s.xpCard}>
              <Text style={s.xpLabel}>Kazanılan XP</Text>
              <CountUp value={xp} prefix="+" style={s.xpVal} />
              {bonus > 0 && <Text style={s.bonusText}>Hız bonusu dahil (+{bonus})</Text>}
            </View>
          </SpringIn>
          <SpringIn delay={300} style={{ width: '100%' }}>
            <View style={s.resultRow}>
              <View style={[s.resultStat, { backgroundColor: Colors.easyBg, borderColor: Colors.easy + '50' }]}>
                <SymbolView name="checkmark.circle.fill" size={22} tintColor={Colors.easy} type="monochrome" />
                <Text style={[s.resultNum, { color: Colors.easy }]}>{total}</Text>
                <Text style={s.resultLbl}>Eşleşme</Text>
              </View>
              <View style={[s.resultStat, { backgroundColor: Colors.hardBg, borderColor: Colors.hard + '50' }]}>
                <SymbolView name="xmark.circle.fill" size={22} tintColor={Colors.hard} type="monochrome" />
                <Text style={[s.resultNum, { color: Colors.hard }]}>{wrongCount}</Text>
                <Text style={s.resultLbl}>Hata</Text>
              </View>
              <View style={[s.resultStat, { backgroundColor: Colors.blueLight, borderColor: ACCENT + '50' }]}>
                <SymbolView name="bolt.fill" size={22} tintColor={ACCENT} type="monochrome" />
                <Text style={[s.resultNum, { color: ACCENT }]}>{fastRounds}</Text>
                <Text style={s.resultLbl}>Hızlı Tur</Text>
              </View>
            </View>
          </SpringIn>
          <TouchableOpacity style={s.doneBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={s.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.againBtn}
            onPress={() => {
              sessionSaved.current = false;
              setRound(0); setMatchedCount(0); setWrongCount(0); setFastRounds(0); setDone(false);
              setWords(w => shuffle(w));
            }}
            activeOpacity={0.8}
          >
            <Text style={s.againBtnText}>Tekrar Oyna</Text>
          </TouchableOpacity>
        </ScrollView>
        {acc >= 80 && <Confetti />}
        <LevelUpModal level={levelUp ?? 0} visible={levelUp !== null} onClose={() => setLevelUp(null)} />
      </SafeAreaView>
    );
  }

  const progress = totalRounds > 0 ? (round + 1) / totalRounds : 0;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
        </TouchableOpacity>
        <View style={s.progressWrap}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>
        <View style={s.roundPill}>
          <Text style={s.roundText}>{round + 1}/{totalRounds}</Text>
        </View>
      </View>

      <Text style={s.hint}>Kelimeyi anlamıyla eşleştir</Text>

      <View style={s.board}>
        <View style={s.column}>
          {leftCards.map((c, i) => (
            <MatchCard
              key={keyOf(c) + round}
              card={c}
              state={states[keyOf(c)] ?? 'idle'}
              onPress={() => handlePress(c)}
              index={i}
            />
          ))}
        </View>
        <View style={s.column}>
          {rightCards.map((c, i) => (
            <MatchCard
              key={keyOf(c) + round}
              card={c}
              state={states[keyOf(c)] ?? 'idle'}
              onPress={() => handlePress(c)}
              index={i + ROUND_SIZE}
            />
          ))}
        </View>
      </View>

      <Text style={s.counter}>{matchedCount} / {words.length} eşleşti</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: ACCENT },
  roundPill: { backgroundColor: Colors.blueLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  roundText: { color: ACCENT, fontWeight: '800', fontSize: 13 },

  hint: { textAlign: 'center', fontSize: 13, color: Colors.textMuted, marginBottom: 10 },

  board: { flex: 1, flexDirection: 'row', paddingHorizontal: 20, gap: 12, paddingBottom: 8 },
  column: { flex: 1, gap: 10 },
  card: {
    flex: 1, borderRadius: 16, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardText: { fontSize: 15, fontWeight: '700', textAlign: 'center' },

  counter: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500', paddingVertical: 10 },

  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  doneTitle: { fontSize: 28, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.5 },
  doneAcc: { fontSize: 15, color: Colors.textSecondary },
  xpCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.accentSoft },
  xpLabel: { color: Colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  xpVal: { fontSize: 38, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  bonusText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },
  resultRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultStat: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1.5 },
  resultNum: { fontSize: 26, fontWeight: '800' },
  resultLbl: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  doneBtn: { width: '100%', borderRadius: 16, paddingVertical: 18, alignItems: 'center', backgroundColor: ACCENT, shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  againBtn: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  againBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },
});
