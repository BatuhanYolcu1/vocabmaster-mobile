import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withSequence, Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { loadStudyWords, StudyWord } from '../../data/demoWords';
import { recordSession } from '../../lib/stats';

const WORD_COLORS = [Colors.primary, '#22C55E', '#A855F7', Colors.accent, '#3B82F6'];
const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };

type Status = 'idle' | 'correct' | 'wrong';

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[İI]/g, 'i').replace(/[Şş]/g, 's')
    .replace(/[Ğğ]/g, 'g').replace(/[Üü]/g, 'u').replace(/[Öö]/g, 'o').replace(/[Çç]/g, 'c');
}

export default function TypingScreen() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const [words, setWords] = useState<StudyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [index,  setIndex]  = useState(0);
  const [value,  setValue]  = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [correct, setCorrect] = useState(0);
  const [wrong,   setWrong]   = useState(0);
  const [done,    setDone]    = useState(false);
  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionSaved = useRef(false);

  useEffect(() => {
    loadStudyWords(listId).then(w => { setWords(w); setLoading(false); });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [listId]);

  const word        = words[index];
  const accentColor = WORD_COLORS[index % WORD_COLORS.length];
  const progress    = words.length > 0 ? (index + 1) / words.length : 0;

  // Animations
  const cardScale  = useSharedValue(1);
  const inputShake = useSharedValue(0);
  const inputBg    = useSharedValue(0); // 0=idle, 1=correct, 2=wrong (used via style switch)
  const checkScale = useSharedValue(0);

  useEffect(() => {
    // Focus input on each new word
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleSubmit = () => {
    if (status !== 'idle' || !value.trim()) return;

    const isCorrect = normalize(value) === normalize(word.tr);

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCorrect(c => c + 1);
      setStatus('correct');
      cardScale.value = withSequence(
        withSpring(1.02, { damping: 10, stiffness: 200 }),
        withSpring(1,    { damping: 14 }),
      );
      checkScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrong(w => w + 1);
      setStatus('wrong');
      inputShake.value = withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming( 10, { duration: 55 }),
        withTiming( -8, { duration: 50 }),
        withTiming(  8, { duration: 50 }),
        withTiming(  0, { duration: 45 }),
      );
    }

    timerRef.current = setTimeout(() => {
      checkScale.value = withTiming(0, { duration: 100 });
      if (index < words.length - 1) {
        setIndex(i => i + 1);
        setValue('');
        setStatus('idle');
      } else {
        setDone(true);
      }
    }, isCorrect ? 900 : 1400);
  };

  const cardStyle   = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));
  const shakeStyle  = useAnimatedStyle(() => ({ transform: [{ translateX: inputShake.value }] }));
  const checkStyle  = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }], opacity: checkScale.value }));

  const inputBorderColor = status === 'correct' ? Colors.easy
                         : status === 'wrong'   ? Colors.hard
                         : Colors.border;
  const inputBgColor     = status === 'correct' ? Colors.easyBg
                         : status === 'wrong'   ? Colors.hardBg
                         : Colors.bgCard;

  // ── Done ──────────────────────────────────────────────────────────────────
  if (loading || !word) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.textMuted }}>Yükleniyor…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    const total = words.length;
    const acc   = Math.round((correct / total) * 100);
    const xp    = correct * 12;
    if (!sessionSaved.current) {
      sessionSaved.current = true;
      recordSession(correct, total, xp).catch(() => {});
    }
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.doneContent}>
          <View style={[s.doneIcon, { backgroundColor: acc >= 70 ? Colors.primaryLight : Colors.warningLight }]}>
            <SymbolView name={acc >= 80 ? 'trophy.fill' : 'star.fill'} size={38} tintColor={acc >= 80 ? Colors.warning : Colors.primary} type="monochrome" />
          </View>
          <Text style={s.doneTitle}>Harika!</Text>
          <Text style={s.doneAcc}>{correct} / {total} doğru · {acc}%</Text>
          <View style={s.xpCard}>
            <Text style={s.xpLabel}>Kazanılan XP</Text>
            <Text style={s.xpVal}>+{xp}</Text>
          </View>
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
          <TouchableOpacity style={s.doneBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={s.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.againBtn} onPress={() => { sessionSaved.current = false; setIndex(0); setValue(''); setStatus('idle'); setCorrect(0); setWrong(0); setDone(false); setLoading(false); }} activeOpacity={0.8}>
            <Text style={s.againBtnText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <Animated.View style={[s.progressFill, { width: `${progress * 100}%` as any, backgroundColor: accentColor }]} />
            </View>
          </View>
          <View style={s.scorePill}>
            <Text style={[s.scoreText, { color: accentColor }]}>{correct}</Text>
            <SymbolView name="checkmark" size={10} tintColor={accentColor} type="monochrome" />
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
                  <TouchableOpacity
                    style={s.listenBtn}
                    onPress={() => Speech.speak(word.word, { language: 'en-US', rate: 0.85 })}
                    activeOpacity={0.75}
                  >
                    <SymbolView name="speaker.wave.2.fill" size={14} tintColor={accentColor} type="monochrome" />
                  </TouchableOpacity>
                </View>
                <Text style={s.wordText}>{word.word}</Text>
                <Text style={s.prompt}>Türkçesini yaz</Text>

                {/* Correct overlay */}
                <Animated.View style={[s.correctOverlay, checkStyle]}>
                  <SymbolView name="checkmark.circle.fill" size={52} tintColor={Colors.easy} type="monochrome" />
                </Animated.View>
              </View>
            </View>
          </Animated.View>

          {/* Input */}
          <Animated.View style={shakeStyle}>
            <TextInput
              ref={inputRef}
              style={[s.input, { borderColor: inputBorderColor, backgroundColor: inputBgColor }]}
              placeholder="Türkçe karşılığını yaz..."
              placeholderTextColor={Colors.textMuted}
              value={value}
              onChangeText={v => { if (status === 'idle') setValue(v); }}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize="words"
              editable={status === 'idle'}
            />
          </Animated.View>

          {/* Wrong answer hint */}
          {status === 'wrong' && (
            <View style={s.hintBox}>
              <SymbolView name="lightbulb.fill" size={14} tintColor={Colors.warning} type="monochrome" />
              <Text style={s.hintText}>Doğru cevap: <Text style={s.hintAnswer}>{word.tr}</Text></Text>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={[
              s.submitBtn,
              { backgroundColor: status === 'correct' ? Colors.easy : status === 'wrong' ? Colors.hard : accentColor },
              !value.trim() && status === 'idle' && s.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.88}
            disabled={status !== 'idle'}
          >
            <Text style={s.submitBtnText}>
              {status === 'correct' ? 'Doğru!' : status === 'wrong' ? 'Yanlış' : 'Kontrol Et'}
            </Text>
            <SymbolView
              name={status === 'correct' ? 'checkmark' : status === 'wrong' ? 'xmark' : 'arrow.right'}
              size={15}
              tintColor="#fff"
              type="monochrome"
            />
          </TouchableOpacity>

          <Text style={s.counter}>{index + 1} / {words.length}</Text>
        </View>
      </KeyboardAvoidingView>
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
  scorePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { fontWeight: '800', fontSize: 14 },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20, gap: 14 },

  wordCard: { backgroundColor: Colors.bgCard, borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  cardStrip: { height: 5 },
  cardInner: { padding: 24, alignItems: 'center', gap: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  typePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  typeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  listenBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.bgSubtle, alignItems: 'center', justifyContent: 'center' },
  wordText: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -1 },
  prompt: { fontSize: 13, color: Colors.textMuted },
  correctOverlay: { position: 'absolute', alignSelf: 'center', bottom: 16 },

  input: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, paddingVertical: 16, paddingHorizontal: 18, borderRadius: 16, borderWidth: 2, textAlign: 'center' },

  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.warningLight, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: Colors.warning + '40' },
  hintText: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  hintAnswer: { color: Colors.textPrimary, fontWeight: '700' },

  submitBtn: { borderRadius: 16, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5 },
  submitBtnDisabled: { backgroundColor: Colors.borderLight, shadowOpacity: 0 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  counter: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500' },

  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  doneTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  doneAcc: { fontSize: 15, color: Colors.textSecondary },
  xpCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.accentSoft },
  xpLabel: { color: Colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  xpVal: { fontSize: 38, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  resultRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultStat: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1.5 },
  resultNum: { fontSize: 26, fontWeight: '800' },
  resultLbl: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  doneBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  againBtn: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  againBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },
});
