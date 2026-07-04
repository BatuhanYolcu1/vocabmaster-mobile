import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
  interpolate, runOnJS, Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { loadStudyWords, StudyWord } from '../../data/demoWords';
import { prepareWords } from '../../lib/session';
import { recordSession, saveSRSCard } from '../../lib/stats';
import { StudyEmpty } from '../../components/study-empty';
import { StudySkeleton } from '../../components/skeleton';
import { Confetti } from '../../components/confetti';
import { SpringIn, CountUp } from '../../components/anim';
import { LevelUpModal } from '../../components/level-up-modal';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 75;

const WORD_COLORS = [Colors.primary, '#22C55E', '#A855F7', Colors.accent, '#3B82F6'];
const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };

// SRS interval per rating (minutes) for first review
const FIRST_INTERVAL: Record<'hard' | 'good' | 'easy', number> = { hard: 1, good: 10, easy: 4 * 1440 };
const DEFAULT_EASE = 2.5;

function RatingBtn({ label, sub, color, bg, onPress }: { label: string; sub: string; color: string; bg: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.ratingBtn, { backgroundColor: bg, borderColor: color + '55', flex: 1 }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.ratingLabel, { color }]}>{label}</Text>
      <Text style={[styles.ratingSub, { color: color + '99' }]}>{sub}</Text>
    </TouchableOpacity>
  );
}

export default function FlashcardScreen() {
  const { listId, wordId, count, shuffle } = useLocalSearchParams<{ listId?: string; wordId?: string; count?: string; shuffle?: string }>();
  const [words, setWords] = useState<StudyWord[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hard, setHard] = useState(0);
  const [good, setGood] = useState(0);
  const [easy, setEasy] = useState(0);
  const [done, setDone] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  const indexRef = useRef(0);
  indexRef.current = index;
  const sessionSaved = useRef(false);

  const flipVal    = useSharedValue(0);
  const txCard     = useSharedValue(0);
  const tyCard     = useSharedValue(0);
  const tiltCard   = useSharedValue(0);
  const isFlippedSV = useSharedValue(0);

  useEffect(() => {
    loadStudyWords(listId).then(w => {
      setWords(wordId ? w.filter(x => x.id === wordId) : prepareWords(w, { count, shuffle }));
      setLoading(false);
    });
  }, [listId, wordId, count, shuffle]);

  const word        = words[index];
  const accentColor = WORD_COLORS[index % WORD_COLORS.length];
  const nextColor   = WORD_COLORS[(index + 1) % WORD_COLORS.length];
  const progress    = words.length > 0 ? (index + 1) / words.length : 0;

  const flipCard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flipVal.value = withSpring(1, { damping: 16, stiffness: 160 });
    isFlippedSV.value = 1;
    setIsFlipped(true);
  }, []);

  const advanceCard = useCallback((rating: 'hard' | 'good' | 'easy') => {
    if (rating === 'hard') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setHard(h => h + 1);
    } else if (rating === 'good') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setGood(g => g + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEasy(e => e + 1);
    }

    // Save SRS data for this card — tekrar modunda kelimenin asıl listesine yazılır
    const srsListId = word?._listId ?? listId;
    if (srsListId && srsListId !== '_due' && word) {
      const interval = FIRST_INTERVAL[rating];
      saveSRSCard(srsListId, word.id, interval, DEFAULT_EASE, 1).catch(() => {});
    }

    const cur = indexRef.current;
    if (cur < words.length - 1) {
      setIndex(cur + 1);
      setIsFlipped(false);
      flipVal.value     = withTiming(0, { duration: 0 });
      txCard.value      = 0;
      tyCard.value      = 0;
      tiltCard.value    = 0;
      isFlippedSV.value = 0;
    } else {
      setDone(true);
    }
  }, [words, listId, word]);

  const EXIT_CONFIG = { duration: 220, easing: Easing.out(Easing.cubic) };

  const rateButton = useCallback((rating: 'hard' | 'good' | 'easy') => {
    const exitX = rating === 'easy' ? SCREEN_W + 200 : rating === 'hard' ? -SCREEN_W - 200 : 0;
    const exitY = rating === 'good' ? -(SCREEN_W + 200) : 0;
    tiltCard.value = withTiming(rating === 'easy' ? 14 : rating === 'hard' ? -14 : 0, { duration: 120 });
    txCard.value   = withTiming(exitX, EXIT_CONFIG, () => { runOnJS(advanceCard)(rating); });
    if (rating === 'good') tyCard.value = withTiming(exitY, EXIT_CONFIG);
  }, [advanceCard]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      if (isFlippedSV.value === 0) return;
      txCard.value   = e.translationX;
      tyCard.value   = e.translationY;
      tiltCard.value = interpolate(e.translationX, [-SCREEN_W, SCREEN_W], [-14, 14], Extrapolation.CLAMP);
    })
    .onEnd((e) => {
      'worklet';
      if (isFlippedSV.value === 0) { txCard.value = withSpring(0); return; }
      const exitCfg = { duration: 220, easing: Easing.out(Easing.cubic) };
      if (e.translationX > SWIPE_THRESHOLD) {
        tiltCard.value = withTiming(14,  { duration: 80 });
        txCard.value   = withTiming(SCREEN_W + 200, exitCfg, () => { runOnJS(advanceCard)('easy'); });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        tiltCard.value = withTiming(-14, { duration: 80 });
        txCard.value   = withTiming(-SCREEN_W - 200, exitCfg, () => { runOnJS(advanceCard)('hard'); });
      } else if (e.translationY < -SWIPE_THRESHOLD) {
        tyCard.value = withTiming(-(SCREEN_W + 200), exitCfg, () => { runOnJS(advanceCard)('good'); });
      } else {
        txCard.value   = withSpring(0, { damping: 18 });
        tyCard.value   = withSpring(0, { damping: 18 });
        tiltCard.value = withSpring(0, { damping: 18 });
      }
    });

  const cardMotion = useAnimatedStyle(() => ({
    transform: [{ translateX: txCard.value }, { translateY: tyCard.value }, { rotate: `${tiltCard.value}deg` }],
  }));
  const frontFace = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${interpolate(flipVal.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: interpolate(flipVal.value, [0, 0.38, 0.45, 1], [1, 1, 0, 0]),
  }));
  const backFace = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${interpolate(flipVal.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: interpolate(flipVal.value, [0, 0.45, 0.52, 1], [0, 0, 1, 1]),
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  }));
  const easyOverlay = useAnimatedStyle(() => ({ opacity: interpolate(txCard.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP) }));
  const hardOverlay = useAnimatedStyle(() => ({ opacity: interpolate(txCard.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP) }));
  const goodOverlay = useAnimatedStyle(() => ({ opacity: interpolate(tyCard.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP) }));
  const nextCardAnim = useAnimatedStyle(() => {
    const dist  = Math.sqrt(txCard.value ** 2 + tyCard.value ** 2);
    return { transform: [{ scale: interpolate(dist, [0, SWIPE_THRESHOLD * 1.4], [0.93, 1], Extrapolation.CLAMP) }], opacity: interpolate(dist, [0, SWIPE_THRESHOLD], [0.55, 0.9], Extrapolation.CLAMP) };
  });
  const stackCardAnim = useAnimatedStyle(() => {
    const dist  = Math.sqrt(txCard.value ** 2 + tyCard.value ** 2);
    return { transform: [{ scale: interpolate(dist, [0, SWIPE_THRESHOLD * 1.4], [0.86, 0.93], Extrapolation.CLAMP) }], opacity: interpolate(dist, [0, SWIPE_THRESHOLD], [0.3, 0.55], Extrapolation.CLAMP) };
  });

  if (!loading && words.length === 0) return <StudyEmpty listId={listId} />;

  if (loading || !word) return <StudySkeleton />;

  const cardFaces = (
    <View style={styles.cardWrapper}>
      <Animated.View style={[styles.card, frontFace]}>
        <LinearGradient
          colors={[accentColor, accentColor + 'CC']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.cardTop}
        >
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{TYPE_LABELS[word.type] ?? word.type}</Text>
          </View>
          <Text style={styles.wordText}>{word.word}</Text>
          <TouchableOpacity style={styles.listenBtn} onPress={() => Speech.speak(word.word, { language: 'en-US', rate: 0.85 })} activeOpacity={0.75}>
            <SymbolView name="speaker.wave.2.fill" size={14} tintColor="rgba(255,255,255,0.9)" type="monochrome" />
            <Text style={styles.listenText}>Dinle</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.cardBottom}>
          <Text style={styles.tapHint}>Çevirmek için dokun</Text>
          <View style={[styles.tapHintLine, { backgroundColor: accentColor + '30' }]} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, backFace]}>
        <View style={[styles.cardBackStrip, { backgroundColor: accentColor }]} />
        <View style={styles.cardBackContent}>
          <View style={styles.backBlock}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Tanım</Text>
            <Text style={styles.backDef}>{word.def}</Text>
          </View>
          <View style={styles.backDivider} />
          <View style={[styles.backBlock, styles.exampleBlock]}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Örnek Cümle</Text>
            <Text style={styles.exampleEn}>"{word.example}"</Text>
            <Text style={styles.exampleTr}>{word.exampleTr}</Text>
          </View>
          <View style={styles.backDivider} />
          <View style={styles.backBlock}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Türkçe</Text>
            <Text style={[styles.translationText, { color: accentColor }]}>{word.tr}</Text>
          </View>
        </View>
        <Animated.View style={[styles.swipeOverlay, styles.easyOverlay, easyOverlay]}><Text style={styles.swipeOverlayText}>Kolay</Text></Animated.View>
        <Animated.View style={[styles.swipeOverlay, styles.hardOverlay, hardOverlay]}><Text style={styles.swipeOverlayText}>Zor</Text></Animated.View>
        <Animated.View style={[styles.swipeOverlay, styles.goodOverlay, goodOverlay]}><Text style={styles.swipeOverlayText}>İyi</Text></Animated.View>
      </Animated.View>
    </View>
  );

  if (done) {
    const total = words.length;
    const xp    = good * 5 + easy * 10;
    const acc   = total > 0 ? Math.round(((good + easy) / total) * 100) : 0;
    if (!sessionSaved.current) {
      sessionSaved.current = true;
      recordSession(good + easy, total, xp)
        .then(r => { if (r.leveledUp) setLevelUp(r.newLevel); })
        .catch(() => {});
    }
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.doneContent}>
          <SpringIn>
            <View style={[styles.doneIconWrap, { backgroundColor: acc >= 80 ? Colors.warningLight : Colors.primaryLight }]}>
              <SymbolView name={acc >= 80 ? 'trophy.fill' : acc >= 60 ? 'star.fill' : 'hand.thumbsup.fill'} size={38} tintColor={acc >= 80 ? Colors.warning : Colors.primary} type="monochrome" />
            </View>
          </SpringIn>
          <Text style={styles.doneTitle}>Oturum Tamamlandı</Text>
          <Text style={styles.doneAcc}>{acc}% doğruluk</Text>
          <SpringIn delay={150} style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.xpCard}>
              <Text style={styles.xpCardLabel}>Kazanılan XP</Text>
              <CountUp value={xp} prefix="+" style={styles.xpCardVal} />
            </View>
          </SpringIn>
          <SpringIn delay={300} style={{ width: '100%' }}>
            <View style={styles.resultsCard}>
              {[
                { label: 'Zor', count: hard, color: Colors.hard, bg: Colors.hardBg },
                { label: 'İyi', count: good, color: Colors.good, bg: Colors.goodBg },
                { label: 'Kolay', count: easy, color: Colors.easy, bg: Colors.easyBg },
              ].map((r) => (
                <View key={r.label} style={styles.resultRow}>
                  <View style={[styles.resultDot, { backgroundColor: r.color }]} />
                  <Text style={[styles.resultLabel, { color: r.color }]}>{r.label}</Text>
                  <View style={styles.resultBarWrap}>
                    <View style={[styles.resultBar, { width: `${(r.count / total) * 100}%` as any, backgroundColor: r.bg, borderColor: r.color + '50' }]} />
                  </View>
                  <Text style={[styles.resultCount, { color: r.color }]}>{r.count}</Text>
                </View>
              ))}
            </View>
          </SpringIn>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={styles.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.againBtn} onPress={() => { sessionSaved.current = false; setIndex(0); setIsFlipped(false); setHard(0); setGood(0); setEasy(0); setDone(false); flipVal.value = 0; isFlippedSV.value = 0; }} activeOpacity={0.8}>
            <Text style={styles.againBtnText}>Tekrar Çalış</Text>
          </TouchableOpacity>
        </ScrollView>
        {acc >= 80 && <Confetti />}
        <LevelUpModal level={levelUp ?? 0} visible={levelUp !== null} onClose={() => setLevelUp(null)} />
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
        <Text style={styles.progressText}>{index + 1} / {words.length}</Text>
      </View>

      <View style={styles.cardArea}>
        {index + 2 < words.length && (
          <Animated.View style={[styles.stackBase, stackCardAnim, { top: 24 }]}>
            <View style={[styles.card, styles.stackCard, { borderTopColor: WORD_COLORS[(index + 2) % WORD_COLORS.length] }]} />
          </Animated.View>
        )}
        {index + 1 < words.length && (
          <Animated.View style={[styles.stackBase, nextCardAnim, { top: 12 }]}>
            <View style={[styles.card, styles.stackCard, { borderTopColor: nextColor }]} />
          </Animated.View>
        )}

        {isFlipped ? (
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.stackBase, cardMotion, { top: 0 }]}>{cardFaces}</Animated.View>
          </GestureDetector>
        ) : (
          <TouchableOpacity style={[styles.stackBase, { top: 0 }]} onPress={flipCard} activeOpacity={0.97}>{cardFaces}</TouchableOpacity>
        )}
      </View>

      <View style={styles.ratingArea}>
        {isFlipped ? (
          <>
            <View style={styles.swipeHints}>
              <Text style={styles.swipeHint}>← Zor</Text>
              <Text style={styles.swipeHint}>İyi ↑</Text>
              <Text style={styles.swipeHint}>Kolay →</Text>
            </View>
            <View style={styles.ratingRow}>
              <RatingBtn label="Zor"   sub="← kaydır" color={Colors.hard} bg={Colors.hardBg} onPress={() => rateButton('hard')} />
              <RatingBtn label="İyi"   sub="↑ kaydır" color={Colors.good} bg={Colors.goodBg} onPress={() => rateButton('good')} />
              <RatingBtn label="Kolay" sub="→ kaydır" color={Colors.easy} bg={Colors.easyBg} onPress={() => rateButton('easy')} />
            </View>
          </>
        ) : (
          <TouchableOpacity style={[styles.showBtn, { backgroundColor: accentColor }]} onPress={flipCard} activeOpacity={0.88}>
            <Text style={styles.showBtnText}>Cevabı Göster</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  progressWrap: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600', minWidth: 42, textAlign: 'right' },
  cardArea: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
  stackBase: { position: 'absolute', left: 20, right: 20 },
  cardWrapper: { width: '100%' },
  card: { backgroundColor: Colors.bgCard, borderRadius: CARD_RADIUS, minHeight: 340, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 10 },
  stackCard: { minHeight: 340, borderTopWidth: 5, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cardTop: { paddingTop: 32, paddingBottom: 28, paddingHorizontal: 28, alignItems: 'center', gap: 14 },
  typePill: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  typeText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  wordText: { color: '#fff', fontSize: 46, fontFamily: Fonts.headingBlack, textAlign: 'center', letterSpacing: -1 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  listenText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
  cardBottom: { paddingVertical: 20, alignItems: 'center', gap: 12 },
  tapHint: { color: Colors.textMuted, fontSize: 12, letterSpacing: 0.3 },
  tapHintLine: { width: 40, height: 3, borderRadius: 2 },
  cardBackStrip: { height: 5 },
  cardBackContent: { padding: 24, gap: 0 },
  backBlock: { paddingVertical: 12 },
  backLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  backDef: { color: Colors.textPrimary, fontSize: 15, lineHeight: 22 },
  backDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight },
  exampleBlock: { backgroundColor: Colors.bgSubtle, borderRadius: 12, paddingHorizontal: 14, marginHorizontal: -4 },
  exampleEn: { color: Colors.textSecondary, fontSize: 13, fontStyle: 'italic', lineHeight: 20 },
  exampleTr: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  translationText: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  swipeOverlay: { position: 'absolute', top: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  easyOverlay: { right: 16, backgroundColor: Colors.easyBg, borderWidth: 1.5, borderColor: Colors.easy + '60' },
  hardOverlay: { left: 16, backgroundColor: Colors.hardBg, borderWidth: 1.5, borderColor: Colors.hard + '60' },
  goodOverlay: { alignSelf: 'center', left: '35%', backgroundColor: Colors.goodBg, borderWidth: 1.5, borderColor: Colors.good + '60' },
  swipeOverlayText: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  ratingArea: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8, gap: 8 },
  swipeHints: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  swipeHint: { color: Colors.textMuted, fontSize: 11, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingBtn: { borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 3, borderWidth: 1.5 },
  ratingLabel: { fontSize: 15, fontWeight: '800' },
  ratingSub: { fontSize: 10, fontWeight: '500' },
  showBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  showBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 4 },
  doneTitle: { fontSize: 28, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.5 },
  doneAcc: { fontSize: 16, color: Colors.textSecondary },
  xpCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.accentSoft },
  xpCardLabel: { color: Colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  xpCardVal: { fontSize: 38, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  resultsCard: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultDot: { width: 8, height: 8, borderRadius: 4 },
  resultLabel: { fontSize: 13, fontWeight: '700', width: 48 },
  resultBarWrap: { flex: 1, height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  resultBar: { height: '100%', borderRadius: 4, borderWidth: 1 },
  resultCount: { fontSize: 14, fontWeight: '800', width: 22, textAlign: 'right' },
  doneBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  againBtn: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  againBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },
});
