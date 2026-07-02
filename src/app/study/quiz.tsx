import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { loadStudyWords, StudyWord } from '../../data/demoWords';
import { recordSession } from '../../lib/stats';
import { StudyEmpty } from '../../components/study-empty';

type Question = { word: string; type: string; correct: string; options: string[] };

function buildQuestions(words: StudyWord[]): Question[] {
  if (words.length < 2) return [];
  return words.map((w, i) => {
    const pool = words.filter((_, j) => j !== i).map(o => o.tr);
    const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrongs, w.tr].sort(() => Math.random() - 0.5);
    return { word: w.word, type: w.type, correct: w.tr, options };
  });
}

const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };
const WORD_COLORS = [Colors.primary, '#22C55E', '#A855F7', Colors.accent, '#3B82F6', Colors.primary, '#22C55E', '#A855F7'];

type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

function OptionBtn({ label, state, onPress }: { label: string; state: OptionState; onPress: () => void; delay: number }) {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (state === 'correct') {
      scale.value = withSequence(withTiming(0.94, { duration: 80 }), withSpring(1.04, { damping: 10, stiffness: 200 }), withSpring(1, { damping: 14 }));
    } else if (state === 'wrong') {
      shake.value = withSequence(
        withTiming(-8, { duration: 55 }), withTiming(8, { duration: 55 }),
        withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 }),
        withTiming(0,  { duration: 45 }),
      );
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shake.value }],
    opacity: state === 'dimmed' ? 0.38 : 1,
  }));

  const bg   = state === 'correct' ? Colors.easyBg : state === 'wrong' ? Colors.hardBg : Colors.bgCard;
  const bdr  = state === 'correct' ? Colors.easy + '80' : state === 'wrong' ? Colors.hard + '80' : Colors.border;
  const txtCl = state === 'correct' ? Colors.easy : state === 'wrong' ? Colors.hard : Colors.textPrimary;

  return (
    <Animated.View style={[animStyle, { flex: 1 }]}>
      <TouchableOpacity style={[styles.optionBtn, { backgroundColor: bg, borderColor: bdr }]} onPress={state === 'idle' ? onPress : undefined} activeOpacity={0.78} disabled={state !== 'idle'}>
        {state === 'correct' && <SymbolView name="checkmark.circle.fill" size={16} tintColor={Colors.easy} type="monochrome" style={styles.optionIcon} />}
        {state === 'wrong'   && <SymbolView name="xmark.circle.fill"     size={16} tintColor={Colors.hard} type="monochrome" style={styles.optionIcon} />}
        <Text style={[styles.optionText, { color: txtCl }]} numberOfLines={2}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function QuizScreen() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex]     = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordsRef = useRef<StudyWord[]>([]);
  const sessionSaved = useRef(false);

  useEffect(() => {
    loadStudyWords(listId).then(w => {
      wordsRef.current = w;
      setQuestions(buildQuestions(w));
      setLoading(false);
    });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [listId]);

  const cardY    = useSharedValue(40);
  const cardOpac = useSharedValue(0);

  const enterCard = useCallback(() => {
    cardY.value    = 40;
    cardOpac.value = 0;
    cardY.value    = withSpring(0,   { damping: 18, stiffness: 160 });
    cardOpac.value = withTiming(1,   { duration: 200, easing: Easing.out(Easing.cubic) });
  }, []);

  useEffect(() => { if (!loading) enterCard(); }, [index, loading]);

  const cardStyle    = useAnimatedStyle(() => ({ transform: [{ translateY: cardY.value }], opacity: cardOpac.value }));
  const q            = questions[index];
  const accentColor  = WORD_COLORS[index % WORD_COLORS.length];
  const progress     = questions.length > 0 ? (index + 1) / questions.length : 0;

  const handleSelect = useCallback((option: string) => {
    if (selected !== null || !q) return;
    setSelected(option);
    const isCorrect = option === q.correct;
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(s => s + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    timerRef.current = setTimeout(() => {
      if (index < questions.length - 1) { setIndex(i => i + 1); setSelected(null); }
      else setDone(true);
    }, 1100);
  }, [selected, q, index, questions.length]);

  const getOptionState = (opt: string): OptionState => {
    if (selected === null) return 'idle';
    if (opt === q.correct)  return 'correct';
    if (opt === selected)   return 'wrong';
    return 'dimmed';
  };

  if (!loading && wordsRef.current.length === 0) return <StudyEmpty listId={listId} />;

  if (loading || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 }}>
          <Text style={{ color: Colors.textMuted, textAlign: 'center' }}>
            {loading ? 'Yükleniyor…' : 'Quiz için en az 2 kelime gerekli. Listeye kelime ekleyin.'}
          </Text>
          {!loading && (
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    const total = questions.length;
    const acc   = Math.round((score / total) * 100);
    const xp    = score * 8;
    if (!sessionSaved.current) {
      sessionSaved.current = true;
      recordSession(score, total, xp).catch(() => {});
    }
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.doneContent}>
          <View style={[styles.doneIconWrap, { backgroundColor: acc >= 70 ? Colors.primaryLight : Colors.warningLight }]}>
            <SymbolView name={acc >= 80 ? 'trophy.fill' : acc >= 60 ? 'star.fill' : 'hand.thumbsup.fill'} size={38} tintColor={acc >= 80 ? Colors.warning : Colors.primary} type="monochrome" />
          </View>
          <Text style={styles.doneTitle}>Quiz Tamamlandı</Text>
          <Text style={styles.doneAcc}>{score} / {total} doğru · {acc}%</Text>
          <View style={styles.xpCard}>
            <Text style={styles.xpCardLabel}>Kazanılan XP</Text>
            <Text style={styles.xpCardVal}>+{xp}</Text>
          </View>
          <View style={styles.resultsRow}>
            <View style={[styles.resultStat, { backgroundColor: Colors.easyBg, borderColor: Colors.easy + '50' }]}>
              <SymbolView name="checkmark.circle.fill" size={22} tintColor={Colors.easy} type="monochrome" />
              <Text style={[styles.resultStatVal, { color: Colors.easy }]}>{score}</Text>
              <Text style={styles.resultStatLabel}>Doğru</Text>
            </View>
            <View style={[styles.resultStat, { backgroundColor: Colors.hardBg, borderColor: Colors.hard + '50' }]}>
              <SymbolView name="xmark.circle.fill" size={22} tintColor={Colors.hard} type="monochrome" />
              <Text style={[styles.resultStatVal, { color: Colors.hard }]}>{total - score}</Text>
              <Text style={styles.resultStatLabel}>Yanlış</Text>
            </View>
            <View style={[styles.resultStat, { backgroundColor: Colors.primaryLight, borderColor: Colors.primarySoft }]}>
              <SymbolView name="bolt.fill" size={22} tintColor={Colors.primary} type="monochrome" />
              <Text style={[styles.resultStatVal, { color: Colors.primary }]}>{xp}</Text>
              <Text style={styles.resultStatLabel}>XP</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={styles.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.againBtn} onPress={() => { sessionSaved.current = false; setIndex(0); setSelected(null); setScore(0); setDone(false); setQuestions(buildQuestions(wordsRef.current)); }} activeOpacity={0.8}>
            <Text style={styles.againBtnText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn} activeOpacity={0.7}>
          <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: accentColor }]} />
          </View>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{score}</Text>
          <SymbolView name="checkmark" size={10} tintColor={Colors.primary} type="monochrome" />
        </View>
      </View>

      <View style={styles.body}>
        <Animated.View style={cardStyle}>
          <View style={styles.wordCard}>
            <View style={[styles.cardStrip, { backgroundColor: accentColor }]} />
            <View style={styles.cardInner}>
              <View style={[styles.typePill, { backgroundColor: accentColor + '18' }]}>
                <Text style={[styles.typeText, { color: accentColor }]}>{TYPE_LABELS[q.type] ?? q.type}</Text>
              </View>
              <Text style={styles.wordText}>{q.word}</Text>
              <Text style={styles.questionHint}>Hangi anlama geliyor?</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.optionsGrid}>
          <View style={styles.optionsRow}>
            {q.options.slice(0, 2).map((opt, i) => (
              <OptionBtn key={opt} label={opt} state={getOptionState(opt)} onPress={() => handleSelect(opt)} delay={i * 60} />
            ))}
          </View>
          <View style={styles.optionsRow}>
            {q.options.slice(2, 4).map((opt, i) => (
              <OptionBtn key={opt} label={opt} state={getOptionState(opt)} onPress={() => handleSelect(opt)} delay={(i + 2) * 60} />
            ))}
          </View>
        </View>
        <Text style={styles.counter}>{index + 1} / {questions.length}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  scorePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 20 },
  wordCard: { backgroundColor: Colors.bgCard, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  cardStrip: { height: 6 },
  cardInner: { padding: 28, alignItems: 'center', gap: 12 },
  typePill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  typeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  wordText: { fontSize: 42, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -1 },
  questionHint: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  optionsGrid: { flex: 1, gap: 10 },
  optionsRow: { flex: 1, flexDirection: 'row', gap: 10 },
  optionBtn: { flex: 1, borderRadius: 18, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2, minHeight: 72 },
  optionIcon: { width: 16, height: 16 },
  optionText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  counter: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500' },
  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  doneTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  doneAcc: { fontSize: 15, color: Colors.textSecondary },
  xpCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.accentSoft },
  xpCardLabel: { color: Colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  xpCardVal: { fontSize: 38, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  resultsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  resultStat: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1.5 },
  resultStatVal: { fontSize: 24, fontWeight: '800' },
  resultStatLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  doneBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  againBtn: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  againBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },
});
