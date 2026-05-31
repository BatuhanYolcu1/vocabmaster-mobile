import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput,
  KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
  interpolate, Extrapolation,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    symbol: 'books.vertical.fill',
    color: Colors.primary,
    bg: Colors.primaryLight,
    title: 'VocabMaster\'a\nHoş Geldin',
    desc: 'Kelime öğrenmenin en akıllı ve eğlenceli yolu. Hazır mısın?',
  },
  {
    symbol: 'rectangle.stack.fill',
    color: '#A855F7',
    bg: '#F3E8FF',
    title: 'Akıllı Flashcard\'lar',
    desc: 'Spaced repetition sistemiyle kelimeler hafızana kazınır.',
  },
  {
    symbol: 'checkmark.circle.fill',
    color: Colors.green,
    bg: Colors.greenLight,
    title: 'Quizlerle Pekiştir',
    desc: '4 seçenekli sorularla öğrendiklerini test et ve puan kazan.',
  },
  {
    symbol: 'flame.fill',
    color: Colors.accent,
    bg: Colors.accentLight,
    title: 'Her Gün Bir Adım',
    desc: 'Günlük seri oluştur, alışkanlık yap — küçük adımlar büyük fark yaratır.',
  },
];

const GOAL_OPTIONS = [
  { value: 5,  label: '5',  sub: 'Hafif' },
  { value: 10, label: '10', sub: 'Normal' },
  { value: 20, label: '20', sub: 'Yoğun' },
  { value: 30, label: '30', sub: 'Ateşli' },
];

const TOTAL_STEPS = SLIDES.length + 1; // 4 slides + 1 setup

async function completeOnboarding() {
  await AsyncStorage.setItem('onboarding_done', 'true');
}

export default function OnboardingScreen() {
  const [step,        setStep]        = useState(0);
  const [selectedGoal, setGoal]       = useState(10);
  const [name,        setName]        = useState('');

  // Slide animation
  const slideX     = useSharedValue(0);
  // Icon animation
  const iconScale  = useSharedValue(0.6);
  const iconOpacity = useSharedValue(0);

  const isSetup  = step === SLIDES.length;
  const slide    = !isSetup ? SLIDES[step] : null;
  const isLast   = step === TOTAL_STEPS - 1;

  // Animate icon in on each step
  useEffect(() => {
    iconScale.value   = 0.65;
    iconOpacity.value = 0;
    iconScale.value   = withSpring(1, { damping: 14, stiffness: 140 });
    iconOpacity.value = withTiming(1, { duration: 260 });
  }, [step]);

  const animateTo = (nextStep: number) => {
    slideX.value = withTiming(-W, { duration: 180, easing: Easing.in(Easing.cubic) });
    setTimeout(() => {
      setStep(nextStep);
      slideX.value = W;
      slideX.value = withSpring(0, { damping: 18, stiffness: 160 });
    }, 190);
  };

  const goNext = () => animateTo(step + 1);

  const goBack = () => {
    if (step === 0) return;
    slideX.value = withTiming(W, { duration: 180, easing: Easing.in(Easing.cubic) });
    setTimeout(() => {
      setStep(step - 1);
      slideX.value = -W;
      slideX.value = withSpring(0, { damping: 18, stiffness: 160 });
    }, 190);
  };

  const finish = async () => {
    Keyboard.dismiss();
    await completeOnboarding();
    if (name.trim()) await AsyncStorage.setItem('user_name', name.trim());
    await AsyncStorage.setItem('daily_goal', String(selectedGoal));
    router.replace('/(tabs)');
  };

  const skip = () => animateTo(SLIDES.length);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    opacity: interpolate(Math.abs(slideX.value), [0, W * 0.4, W], [1, 0.2, 0], Extrapolation.CLAMP),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <SafeAreaView style={s.safe}>
      {/* Top bar */}
      <View style={s.topBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={goBack} style={s.topBtn} activeOpacity={0.7}>
            <SymbolView name="chevron.left" size={16} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
        ) : (
          <View style={s.topBtn} />
        )}
        <View style={s.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i === step && s.dotActive,
                i === step && { backgroundColor: slide?.color ?? Colors.primary },
                i < step && { backgroundColor: Colors.borderLight },
              ]}
            />
          ))}
        </View>
        {!isSetup ? (
          <TouchableOpacity onPress={skip} style={s.topBtn} activeOpacity={0.7}>
            <Text style={s.skipText}>Atla</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.topBtn} />
        )}
      </View>

      {/* Content */}
      <Animated.View style={[s.content, slideStyle]}>
        {!isSetup && slide ? (
          <>
            {/* Illustration */}
            <View style={s.illustrationWrap}>
              <Animated.View style={iconStyle}>
                <View style={[s.iconOuter, { backgroundColor: slide.color + '10' }]}>
                  <View style={[s.iconInner, { backgroundColor: slide.color + '20' }]}>
                    <SymbolView name={slide.symbol as any} size={62} tintColor={slide.color} type="monochrome" />
                  </View>
                </View>
              </Animated.View>
            </View>

            {/* Text */}
            <View style={s.textWrap}>
              <Text style={s.slideTitle}>{slide.title}</Text>
              <Text style={s.slideDesc}>{slide.desc}</Text>
            </View>
          </>
        ) : (
          /* Setup Step */
          <View style={s.setupWrap}>
            <Animated.View style={[s.setupIconWrap, iconStyle]}>
              <View style={[s.iconOuter, { backgroundColor: Colors.primary + '10' }]}>
                <View style={[s.iconInner, { backgroundColor: Colors.primary + '20' }]}>
                  <SymbolView name="target" size={56} tintColor={Colors.primary} type="monochrome" />
                </View>
              </View>
            </Animated.View>

            <Text style={s.slideTitle}>Hedefini Belirle</Text>
            <Text style={s.slideDesc}>Günde kaç kelime öğrenmek istiyorsun?</Text>

            <View style={s.goalGrid}>
              {GOAL_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    s.goalBtn,
                    selectedGoal === g.value && { backgroundColor: Colors.primaryLight, borderColor: Colors.primarySoft },
                  ]}
                  onPress={() => setGoal(g.value)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.goalNum, selectedGoal === g.value && { color: Colors.primary }]}>
                    {g.label}
                  </Text>
                  <Text style={[s.goalSub, selectedGoal === g.value && { color: Colors.primary }]}>
                    {g.sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.nameWrap}>
              <Text style={s.nameLabel}>Adın (opsiyonel)</Text>
              <TextInput
                style={[s.nameInput, name.length > 0 && s.nameInputFilled]}
                placeholder="örn. Batuhan"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={finish}
              />
            </View>
          </View>
        )}
      </Animated.View>

      {/* Bottom button */}
      <View style={s.bottom}>
        <TouchableOpacity
          style={[s.nextBtn, { backgroundColor: slide?.color ?? Colors.primary }]}
          onPress={isSetup ? finish : goNext}
          activeOpacity={0.88}
        >
          <Text style={s.nextBtnText}>{isSetup ? 'Başla!' : 'İleri'}</Text>
          <SymbolView
            name={isSetup ? 'checkmark' : 'arrow.right'}
            size={15}
            tintColor="#fff"
            type="monochrome"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  topBtn: { width: 56, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  skipText: { color: Colors.textMuted, fontSize: 14, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { width: 22, height: 7, borderRadius: 4 },

  content: { flex: 1, paddingHorizontal: 28 },

  illustrationWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconOuter: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  iconInner: { width: 148, height: 148, borderRadius: 74, alignItems: 'center', justifyContent: 'center' },

  textWrap: { paddingBottom: 24, gap: 12 },
  slideTitle: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary, lineHeight: 40, letterSpacing: -0.5 },
  slideDesc: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },

  setupWrap: { flex: 1, paddingTop: 12, gap: 16 },
  setupIconWrap: { alignSelf: 'center', marginBottom: 8 },
  goalGrid: { flexDirection: 'row', gap: 10 },
  goalBtn: { flex: 1, backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  goalNum: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  goalSub: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  nameWrap: { gap: 8 },
  nameLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  nameInput: { fontSize: 15, color: Colors.textPrimary, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: Colors.bgCard, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border },
  nameInputFilled: { borderColor: Colors.primarySoft, backgroundColor: Colors.primaryLight + '50' },

  bottom: { paddingHorizontal: 28, paddingBottom: 20, paddingTop: 12 },
  nextBtn: { borderRadius: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
