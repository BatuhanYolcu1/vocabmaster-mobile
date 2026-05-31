import { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
  interpolate, runOnJS, Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '../../constants/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 75;

const DEMO_WORDS = [
  {
    id: '1', word: 'Eloquent', turkishTranslation: 'Belagatlı',
    definitionTr: 'Güzel ve etkili konuşma yeteneğine sahip',
    exampleSentence: 'She gave an eloquent speech.',
    exampleSentenceTr: 'Belagatlı bir konuşma yaptı.', type: 'adjective',
  },
  {
    id: '2', word: 'Serendipity', turkishTranslation: 'Güzel tesadüf',
    definitionTr: 'Şans eseri yapılan güzel bir keşif',
    exampleSentence: 'Finding that book was pure serendipity.',
    exampleSentenceTr: 'O kitabı bulmak saf bir tesadüftü.', type: 'noun',
  },
  {
    id: '3', word: 'Resilient', turkishTranslation: 'Dayanıklı',
    definitionTr: 'Zorluklardan çabuk toparlanabilen',
    exampleSentence: 'Children are remarkably resilient.',
    exampleSentenceTr: 'Çocuklar inanılmaz derecede dayanıklıdır.', type: 'adjective',
  },
  {
    id: '4', word: 'Ephemeral', turkishTranslation: 'Geçici',
    definitionTr: 'Çok kısa süren, geçici olan',
    exampleSentence: 'Fame can be ephemeral.',
    exampleSentenceTr: 'Şöhret geçici olabilir.', type: 'adjective',
  },
  {
    id: '5', word: 'Meticulous', turkishTranslation: 'Titiz',
    definitionTr: 'Her detaya özen gösteren',
    exampleSentence: 'She is meticulous in her work.',
    exampleSentenceTr: 'İşinde çok titizdir.', type: 'adjective',
  },
];

const WORD_COLORS = [Colors.primary, '#22C55E', '#A855F7', Colors.accent, '#3B82F6'];
const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };

// ─── Rating Button ────────────────────────────────────────────────────────────
function RatingBtn({
  label, sub, color, bg, onPress,
}: { label: string; sub: string; color: string; bg: string; onPress: () => void }) {
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FlashcardScreen() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hard, setHard] = useState(0);
  const [good, setGood] = useState(0);
  const [easy, setEasy] = useState(0);
  const [done, setDone] = useState(false);

  // Use ref so gesture callbacks always see latest index
  const indexRef = useRef(0);
  indexRef.current = index;

  // Shared animation values
  const flipVal   = useSharedValue(0);   // 0 = front, 1 = back
  const txCard    = useSharedValue(0);   // swipe x
  const tyCard    = useSharedValue(0);   // swipe y
  const tiltCard  = useSharedValue(0);   // card tilt (deg)
  const isFlippedSV = useSharedValue(0); // mirror of isFlipped for worklet

  const word        = DEMO_WORDS[index];
  const accentColor = WORD_COLORS[index % WORD_COLORS.length];
  const nextColor   = WORD_COLORS[(index + 1) % WORD_COLORS.length];
  const progress    = (index + 1) / DEMO_WORDS.length;

  // ── flip ──────────────────────────────────────────────────────────────────
  const flipCard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flipVal.value = withSpring(1, { damping: 16, stiffness: 160 });
    isFlippedSV.value = 1;
    setIsFlipped(true);
  }, []);

  // ── advance card (stable – uses ref) ─────────────────────────────────────
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
    const cur = indexRef.current;
    if (cur < DEMO_WORDS.length - 1) {
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
  }, []);

  // ── button rating ─────────────────────────────────────────────────────────
  const EXIT_CONFIG = { duration: 220, easing: Easing.out(Easing.cubic) };

  const rateButton = useCallback((rating: 'hard' | 'good' | 'easy') => {
    const exitX = rating === 'easy' ? SCREEN_W + 200 : rating === 'hard' ? -SCREEN_W - 200 : 0;
    const exitY = rating === 'good' ? -(SCREEN_W + 200) : 0;
    tiltCard.value = withTiming(rating === 'easy' ? 14 : rating === 'hard' ? -14 : 0, { duration: 120 });
    txCard.value   = withTiming(exitX, EXIT_CONFIG, () => { runOnJS(advanceCard)(rating); });
    if (rating === 'good') tyCard.value = withTiming(exitY, EXIT_CONFIG);
  }, [advanceCard]);

  // ── swipe gesture (active only when flipped) ──────────────────────────────
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
        tiltCard.value = withTiming(14, { duration: 80 });
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

  // ── animated styles ───────────────────────────────────────────────────────
  const cardMotion = useAnimatedStyle(() => ({
    transform: [
      { translateX: txCard.value },
      { translateY: tyCard.value },
      { rotate: `${tiltCard.value}deg` },
    ],
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

  const easyOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(txCard.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));
  const hardOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(txCard.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const goodOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(tyCard.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  // Next card scales up as current card moves away
  const nextCardAnim = useAnimatedStyle(() => {
    const dist  = Math.sqrt(txCard.value ** 2 + tyCard.value ** 2);
    const scale = interpolate(dist, [0, SWIPE_THRESHOLD * 1.4], [0.93, 1], Extrapolation.CLAMP);
    const op    = interpolate(dist, [0, SWIPE_THRESHOLD], [0.55, 0.9], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity: op };
  });

  const stackCardAnim = useAnimatedStyle(() => {
    const dist  = Math.sqrt(txCard.value ** 2 + tyCard.value ** 2);
    const scale = interpolate(dist, [0, SWIPE_THRESHOLD * 1.4], [0.86, 0.93], Extrapolation.CLAMP);
    const op    = interpolate(dist, [0, SWIPE_THRESHOLD], [0.3, 0.55], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity: op };
  });

  // ── card faces (shared markup) ────────────────────────────────────────────
  const cardFaces = (
    <View style={styles.cardWrapper}>
      {/* FRONT */}
      <Animated.View style={[styles.card, frontFace]}>
        <View style={[styles.cardTop, { backgroundColor: accentColor }]}>
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{TYPE_LABELS[word.type] ?? word.type}</Text>
          </View>
          <Text style={styles.wordText}>{word.word}</Text>
          <TouchableOpacity
            style={styles.listenBtn}
            onPress={() => Speech.speak(word.word, { language: 'en-US', rate: 0.85 })}
            activeOpacity={0.75}
          >
            <SymbolView name="speaker.wave.2.fill" size={14} tintColor="rgba(255,255,255,0.9)" type="monochrome" />
            <Text style={styles.listenText}>Dinle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.tapHint}>Çevirmek için dokun</Text>
          <View style={[styles.tapHintLine, { backgroundColor: accentColor + '30' }]} />
        </View>
      </Animated.View>

      {/* BACK */}
      <Animated.View style={[styles.card, backFace]}>
        <View style={[styles.cardBackStrip, { backgroundColor: accentColor }]} />
        <View style={styles.cardBackContent}>
          <View style={styles.backBlock}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Tanım</Text>
            <Text style={styles.backDef}>{word.definitionTr}</Text>
          </View>
          <View style={styles.backDivider} />
          <View style={[styles.backBlock, styles.exampleBlock]}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Örnek Cümle</Text>
            <Text style={styles.exampleEn}>"{word.exampleSentence}"</Text>
            <Text style={styles.exampleTr}>{word.exampleSentenceTr}</Text>
          </View>
          <View style={styles.backDivider} />
          <View style={styles.backBlock}>
            <Text style={[styles.backLabel, { color: accentColor }]}>Türkçe</Text>
            <Text style={[styles.translationText, { color: accentColor }]}>{word.turkishTranslation}</Text>
          </View>
        </View>

        {/* Swipe overlays */}
        <Animated.View style={[styles.swipeOverlay, styles.easyOverlay, easyOverlay]}>
          <Text style={styles.swipeOverlayText}>Kolay</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeOverlay, styles.hardOverlay, hardOverlay]}>
          <Text style={styles.swipeOverlayText}>Zor</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeOverlay, styles.goodOverlay, goodOverlay]}>
          <Text style={styles.swipeOverlayText}>İyi</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );

  // ── done screen ───────────────────────────────────────────────────────────
  if (done) {
    const total = DEMO_WORDS.length;
    const xp    = good * 5 + easy * 10;
    const acc   = Math.round(((good + easy) / total) * 100);
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.doneContent}>
          <View style={[styles.doneIconWrap, { backgroundColor: acc >= 80 ? Colors.warningLight : Colors.primaryLight }]}>
            <SymbolView
              name={acc >= 80 ? 'trophy.fill' : acc >= 60 ? 'star.fill' : 'hand.thumbsup.fill'}
              size={38}
              tintColor={acc >= 80 ? Colors.warning : Colors.primary}
              type="monochrome"
            />
          </View>
          <Text style={styles.doneTitle}>Oturum Tamamlandı</Text>
          <Text style={styles.doneAcc}>{acc}% doğruluk</Text>
          <View style={styles.xpCard}>
            <Text style={styles.xpCardLabel}>Kazanılan XP</Text>
            <Text style={styles.xpCardVal}>+{xp}</Text>
          </View>
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
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.88}>
            <Text style={styles.doneBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.againBtn}
            onPress={() => { setIndex(0); setIsFlipped(false); setHard(0); setGood(0); setEasy(0); setDone(false); flipVal.value = 0; isFlippedSV.value = 0; }}
            activeOpacity={0.8}
          >
            <Text style={styles.againBtnText}>Tekrar Çalış</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── main screen ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn} activeOpacity={0.7}>
          <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: accentColor }]} />
          </View>
        </View>
        <Text style={styles.progressText}>{index + 1} / {DEMO_WORDS.length}</Text>
      </View>

      {/* Card Stack Area */}
      <View style={styles.cardArea}>
        {/* Stack card 2 (deepest) */}
        {index + 2 < DEMO_WORDS.length && (
          <Animated.View style={[styles.stackBase, stackCardAnim, { top: 24 }]}>
            <View style={[styles.card, styles.stackCard, { borderTopColor: WORD_COLORS[(index + 2) % WORD_COLORS.length] }]} />
          </Animated.View>
        )}
        {/* Stack card 1 */}
        {index + 1 < DEMO_WORDS.length && (
          <Animated.View style={[styles.stackBase, nextCardAnim, { top: 12 }]}>
            <View style={[styles.card, styles.stackCard, { borderTopColor: nextColor }]} />
          </Animated.View>
        )}

        {/* Active card */}
        {isFlipped ? (
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.stackBase, cardMotion, { top: 0 }]}>
              {cardFaces}
            </Animated.View>
          </GestureDetector>
        ) : (
          <TouchableOpacity
            style={[styles.stackBase, { top: 0 }]}
            onPress={flipCard}
            activeOpacity={0.97}
          >
            {cardFaces}
          </TouchableOpacity>
        )}
      </View>

      {/* Rating Area */}
      <View style={styles.ratingArea}>
        {isFlipped ? (
          <>
            <View style={styles.swipeHints}>
              <Text style={styles.swipeHint}>← Zor</Text>
              <Text style={styles.swipeHint}>İyi ↑</Text>
              <Text style={styles.swipeHint}>Kolay →</Text>
            </View>
            <View style={styles.ratingRow}>
              <RatingBtn label="Zor" sub="← kaydır" color={Colors.hard} bg={Colors.hardBg} onPress={() => rateButton('hard')} />
              <RatingBtn label="İyi" sub="↑ kaydır" color={Colors.good} bg={Colors.goodBg} onPress={() => rateButton('good')} />
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
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: CARD_RADIUS,
    minHeight: 340,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  stackCard: {
    minHeight: 340,
    borderTopWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  // Card Front
  cardTop: { paddingTop: 32, paddingBottom: 28, paddingHorizontal: 28, alignItems: 'center', gap: 14 },
  typePill: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  typeText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  wordText: { color: '#fff', fontSize: 46, fontWeight: '800', textAlign: 'center', letterSpacing: -1 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  listenText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
  cardBottom: { paddingVertical: 20, alignItems: 'center', gap: 12 },
  tapHint: { color: Colors.textMuted, fontSize: 12, letterSpacing: 0.3 },
  tapHintLine: { width: 40, height: 3, borderRadius: 2 },

  // Card Back
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

  // Swipe overlays
  swipeOverlay: { position: 'absolute', top: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  easyOverlay: { right: 16, backgroundColor: Colors.easyBg, borderWidth: 1.5, borderColor: Colors.easy + '60' },
  hardOverlay: { left: 16, backgroundColor: Colors.hardBg, borderWidth: 1.5, borderColor: Colors.hard + '60' },
  goodOverlay: { alignSelf: 'center', left: '35%', backgroundColor: Colors.goodBg, borderWidth: 1.5, borderColor: Colors.good + '60' },
  swipeOverlayText: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },

  // Rating
  ratingArea: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8, gap: 8 },
  swipeHints: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  swipeHint: { color: Colors.textMuted, fontSize: 11, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingBtn: { borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 3, borderWidth: 1.5 },
  ratingLabel: { fontSize: 15, fontWeight: '800' },
  ratingSub: { fontSize: 10, fontWeight: '500' },
  showBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  showBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Done screen
  doneContent: { padding: 24, alignItems: 'center', gap: 16, paddingBottom: 40 },
  doneIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 4 },
  doneTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
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

  warningLight: { backgroundColor: Colors.warningLight },
});
