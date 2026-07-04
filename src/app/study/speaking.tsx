import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withRepeat, withSequence, Easing,
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

const WORD_COLORS = [Colors.primary, '#22C55E', '#A855F7', Colors.accent, '#3B82F6'];
const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };

type Phase = 'listen' | 'recording' | 'evaluate';

export default function SpeakingScreen() {
  const { listId, count, shuffle } = useLocalSearchParams<{ listId?: string; count?: string; shuffle?: string }>();
  const [words, setWords] = useState<StudyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [index,   setIndex]   = useState(0);
  const [phase,   setPhase]   = useState<Phase>('listen');
  const [correct, setCorrect] = useState(0);
  const [wrong,   setWrong]   = useState(0);
  const [done,    setDone]    = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionSaved = useRef(false);

  useEffect(() => {
    loadStudyWords(listId).then(w => { setWords(prepareWords(w, { count, shuffle })); setLoading(false); });
    return () => { Speech.stop(); if (recordTimer.current) clearTimeout(recordTimer.current); };
  }, [listId, count, shuffle]);

  const word        = words[index];
  const accentColor = WORD_COLORS[index % WORD_COLORS.length];
  const progress    = words.length > 0 ? (index + 1) / words.length : 0;

  // Animations
  const micScale    = useSharedValue(1);
  const micOpacity  = useSharedValue(1);
  const pulseScale  = useSharedValue(1);
  const pulseOpac   = useSharedValue(0);
  const cardY       = useSharedValue(30);
  const cardOpac    = useSharedValue(0);
  const answerOpac  = useSharedValue(0);

  // Card entrance on new word
  useEffect(() => {
    if (!word) return;
    cardY.value    = 30;
    cardOpac.value = 0;
    cardY.value    = withSpring(0,   { damping: 18, stiffness: 160 });
    cardOpac.value = withTiming(1,   { duration: 250 });
    answerOpac.value = 0;
    setPhase('listen');
    const t = setTimeout(() => speakWord(), 400);
    return () => clearTimeout(t);
  }, [index, word]);

  const speakWord = () => {
    Speech.stop();
    Speech.speak(word.word, { language: 'en-US', rate: 0.8, pitch: 1.0 });
  };

  // Mic button press & hold
  const startRecording = () => {
    if (phase !== 'listen') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('recording');
    // Pulse animation
    micScale.value   = withSpring(0.92, { damping: 12 });
    pulseOpac.value  = withTiming(1, { duration: 200 });
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 700, easing: Easing.out(Easing.ease) }),
        withTiming(1.0, { duration: 0 }),
      ), -1, false,
    );
    // Auto-reveal after 2s
    recordTimer.current = setTimeout(() => stopRecording(), 2000);
  };

  const stopRecording = () => {
    if (recordTimer.current) clearTimeout(recordTimer.current);
    micScale.value   = withSpring(1);
    pulseOpac.value  = withTiming(0, { duration: 200 });
    pulseScale.value = withTiming(1);
    setPhase('evaluate');
    answerOpac.value = withTiming(1, { duration: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEval = (isCorrect: boolean) => {
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrect(c => c + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrong(w => w + 1);
    }
    cardOpac.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      if (index < words.length - 1) {
        setIndex(i => i + 1);
      } else {
        setDone(true);
      }
    }, 220);
  };

  const cardStyle   = useAnimatedStyle(() => ({ transform: [{ translateY: cardY.value }], opacity: cardOpac.value }));
  const micStyle    = useAnimatedStyle(() => ({ transform: [{ scale: micScale.value }], opacity: micOpacity.value }));
  const pulseStyle  = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], opacity: pulseOpac.value }));
  const answerStyle = useAnimatedStyle(() => ({ opacity: answerOpac.value }));

  if (!loading && words.length === 0) return <StudyEmpty listId={listId} />;

  // ── Done ──────────────────────────────────────────────────────────────────
  if (loading || !word) return <StudySkeleton />;

  if (done) {
    const total = words.length;
    const acc   = Math.round((correct / total) * 100);
    const xp    = correct * 15;
    if (!sessionSaved.current) {
      sessionSaved.current = true;
      recordSession(correct, total, xp)
        .then(r => { if (r.leveledUp) setLevelUp(r.newLevel); })
        .catch(() => {});
    }
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.doneContent}>
          <SpringIn>
            <View style={[s.doneIcon, { backgroundColor: acc >= 70 ? Colors.primaryLight : Colors.warningLight }]}>
              <SymbolView name={acc >= 80 ? 'trophy.fill' : 'star.fill'} size={38} tintColor={acc >= 80 ? Colors.warning : Colors.primary} type="monochrome" />
            </View>
          </SpringIn>
          <Text style={s.doneTitle}>Muhteşem!</Text>
          <Text style={s.doneAcc}>{correct} / {total} doğru · {acc}%</Text>
          <SpringIn delay={150} style={{ width: '100%', alignItems: 'center' }}>
            <View style={s.xpCard}>
              <Text style={s.xpLabel}>Kazanılan XP</Text>
              <CountUp value={xp} prefix="+" style={s.xpVal} />
            </View>
          </SpringIn>
          <SpringIn delay={300} style={{ width: '100%' }}>
            <View style={s.resultRow}>
              <View style={[s.resultStat, { backgroundColor: Colors.easyBg, borderColor: Colors.easy + '50' }]}>
                <SymbolView name="checkmark.circle.fill" size={22} tintColor={Colors.easy} type="monochrome" />
                <Text style={[s.resultNum, { color: Colors.easy }]}>{correct}</Text>
                <Text style={s.resultLbl}>Doğru</Text>
              </View>
              <View style={[s.resultStat, { backgroundColor: Colors.hardBg, borderColor: Colors.hard + '50' }]}>
                <SymbolView name="xmark.circle.fill" size={22} tintColor={Colors.hard} type="monochrome" />
                <Text style={[s.resultNum, { color: Colors.hard }]}>{wrong}</Text>
                <Text style={s.resultLbl}>Yanlış</Text>
              </View>
            </View>
          </SpringIn>
          <TouchableOpacity style={[s.doneBtn, { backgroundColor: '#EC4899' }]} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={s.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.againBtn} onPress={() => { sessionSaved.current = false; setIndex(0); setPhase('listen'); setCorrect(0); setWrong(0); setDone(false); }} activeOpacity={0.8}>
            <Text style={s.againBtnText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </ScrollView>
        {acc >= 80 && <Confetti />}
        <LevelUpModal level={levelUp ?? 0} visible={levelUp !== null} onClose={() => setLevelUp(null)} />
      </SafeAreaView>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => { Speech.stop(); router.replace('/(tabs)'); }} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
        </TouchableOpacity>
        <View style={s.progressWrap}>
          <View style={s.progressTrack}>
            <Animated.View style={[s.progressFill, { width: `${progress * 100}%` as any, backgroundColor: '#EC4899' }]} />
          </View>
        </View>
        <View style={s.scorePill}>
          <Text style={s.scoreText}>{correct}</Text>
          <SymbolView name="checkmark" size={10} tintColor={'#EC4899'} type="monochrome" />
        </View>
      </View>

      <View style={s.body}>
        {/* Word card */}
        <Animated.View style={cardStyle}>
          <View style={s.wordCard}>
            <View style={[s.cardStrip, { backgroundColor: accentColor }]} />
            <View style={s.cardInner}>
              <View style={s.cardTopRow}>
                <View style={[s.typePill, { backgroundColor: accentColor + '18' }]}>
                  <Text style={[s.typeText, { color: accentColor }]}>{TYPE_LABELS[word.type] ?? word.type}</Text>
                </View>
                <TouchableOpacity style={s.replayBtn} onPress={speakWord} activeOpacity={0.75}>
                  <SymbolView name="speaker.wave.2.fill" size={15} tintColor={accentColor} type="monochrome" />
                  <Text style={[s.replayText, { color: accentColor }]}>Tekrar Dinle</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.wordText}>{word.word}</Text>
              <Text style={s.hint}>
                {phase === 'listen' ? 'Dinle, sonra mikrofona bas ve söyle' :
                 phase === 'recording' ? 'Söylüyorsun...' : 'Kendini değerlendir'}
              </Text>
            </View>

            {/* Answer reveal */}
            <Animated.View style={[s.answerSection, answerStyle]}>
              <View style={s.answerDivider} />
              <View style={s.answerBody}>
                <Text style={[s.answerLabel, { color: accentColor }]}>Türkçe</Text>
                <Text style={s.answerTr}>{word.tr}</Text>
                <Text style={s.answerDef}>{word.def}</Text>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Mic / Eval area */}
        {phase !== 'evaluate' ? (
          <View style={s.micArea}>
            <Text style={s.micHint}>{phase === 'listen' ? 'Hazır olunca bas' : 'Bırakmak için bekle...'}</Text>
            <View style={s.micWrap}>
              {/* Pulse ring */}
              <Animated.View style={[s.micPulse, { borderColor: '#EC4899' }, pulseStyle]} />
              {/* Mic button */}
              <Animated.View style={micStyle}>
                <Pressable
                  style={[s.micBtn, phase === 'recording' && s.micBtnActive]}
                  onPressIn={startRecording}
                  onPressOut={() => { if (phase === 'recording') stopRecording(); }}
                >
                  <SymbolView name="mic.fill" size={28} tintColor={phase === 'recording' ? '#fff' : '#EC4899'} type="monochrome" />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        ) : (
          <View style={s.evalArea}>
            <Text style={s.evalHint}>Nasıl gitti?</Text>
            <View style={s.evalRow}>
              <TouchableOpacity style={[s.evalBtn, s.evalBtnWrong]} onPress={() => handleEval(false)} activeOpacity={0.8}>
                <SymbolView name="xmark" size={18} tintColor={Colors.hard} type="monochrome" />
                <Text style={[s.evalBtnText, { color: Colors.hard }]}>Olmadı</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.evalBtn, s.evalBtnCorrect]} onPress={() => handleEval(true)} activeOpacity={0.8}>
                <SymbolView name="checkmark" size={18} tintColor={Colors.easy} type="monochrome" />
                <Text style={[s.evalBtnText, { color: Colors.easy }]}>Söyledim!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={s.counter}>{index + 1} / {words.length}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  scorePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FDF2F8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { color: '#EC4899', fontWeight: '800', fontSize: 14 },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 20 },

  wordCard: { backgroundColor: Colors.bgCard, borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  cardStrip: { height: 5 },
  cardInner: { padding: 24, gap: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  typeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  replayBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.bgSubtle, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  replayText: { fontSize: 12, fontWeight: '600' },
  wordText: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1 },
  hint: { fontSize: 13, color: Colors.textMuted },

  answerSection: { overflow: 'hidden' },
  answerDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight },
  answerBody: { padding: 20, gap: 6 },
  answerLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  answerTr: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  answerDef: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  micArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  micHint: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  micWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  micPulse: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2 },
  micBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FDF2F8', borderWidth: 2, borderColor: '#EC4899', alignItems: 'center', justifyContent: 'center' },
  micBtnActive: { backgroundColor: '#EC4899' },

  evalArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  evalHint: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  evalRow: { flexDirection: 'row', gap: 12, width: '100%' },
  evalBtn: { flex: 1, borderRadius: 18, paddingVertical: 18, alignItems: 'center', gap: 8, borderWidth: 1.5 },
  evalBtnWrong: { backgroundColor: Colors.hardBg, borderColor: Colors.hard + '50' },
  evalBtnCorrect: { backgroundColor: Colors.easyBg, borderColor: Colors.easy + '50' },
  evalBtnText: { fontSize: 15, fontWeight: '800' },

  counter: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500' },

  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  doneTitle: { fontSize: 28, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.5 },
  doneAcc: { fontSize: 15, color: Colors.textSecondary },
  xpCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.accentSoft },
  xpLabel: { color: Colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  xpVal: { fontSize: 38, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  resultRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultStat: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1.5 },
  resultNum: { fontSize: 26, fontWeight: '800' },
  resultLbl: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  doneBtn: { width: '100%', borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  againBtn: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  againBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },
});
