import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay,
  withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { loadDashboardStats } from '../../lib/stats';
import { DEFAULT_LISTS } from '../../data/demoWords';
import { wordOfTheDay } from '../../lib/wordOfDay';
import { CountUp } from '../../components/anim';

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'İyi geceler';
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

// Haftalık grafikte 0'dan büyüyen bar
function ChartBar({ value, max, index, isToday }: { value: number; max: number; index: number; isToday: boolean }) {
  const h = useSharedValue(3);
  const target = value > 0 ? Math.max((value / max) * 72, 6) : 3;
  useEffect(() => {
    h.value = 3;
    h.value = withDelay(index * 60, withSpring(target, { damping: 14, stiffness: 140 }));
  }, [target, index, h]);
  const anim = useAnimatedStyle(() => ({ height: h.value }));
  const bg = value > 0 ? (isToday ? Colors.primary : Colors.primarySoft) : Colors.borderLight;
  return <Animated.View style={[styles.chartBar, { backgroundColor: bg }, anim]} />;
}

// Nefes alan alev ikonu
function FlamePulse() {
  const sc = useSharedValue(1);
  useEffect(() => {
    sc.value = withRepeat(
      withSequence(withTiming(1.14, { duration: 850 }), withTiming(1, { duration: 850 })),
      -1, false,
    );
  }, [sc]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={anim}>
      <SymbolView name="flame.fill" size={24} tintColor={Colors.accent} type="monochrome" />
    </Animated.View>
  );
}

const QUICK_MODES = [
  { title: 'Flashcard', symbol: 'rectangle.on.rectangle.fill', color: Colors.primary,  bg: Colors.primaryLight, dest: '/study/flashcard' },
  { title: 'Quiz',      symbol: 'checkmark.circle.fill',       color: Colors.green,    bg: Colors.greenLight,   dest: '/study/quiz'      },
  { title: 'Yazarak',   symbol: 'keyboard.fill',               color: Colors.purple,   bg: Colors.purpleLight,  dest: '/study/typing'    },
  { title: 'Konuşma',   symbol: 'mic.fill',                    color: '#EC4899',       bg: '#FDF2F8',           dest: '/study/speaking'  },
  { title: 'Eşleştir',  symbol: 'squares.leading.rectangle',   color: Colors.blue,     bg: Colors.blueLight,    dest: '/study/matching'  },
];

type Stats = {
  totalXp: number; streak: number; todayWords: number;
  dailyGoal: number; weeklyXp: { name: string; xp: number }[]; dueCount: number;
  studiedToday: boolean;
};

const EMPTY_STATS: Stats = {
  totalXp: 0, streak: 0, todayWords: 0, dailyGoal: 10,
  weeklyXp: [{ name: 'Pzt', xp: 0 }, { name: 'Sal', xp: 0 }, { name: 'Çar', xp: 0 }, { name: 'Per', xp: 0 }, { name: 'Cum', xp: 0 }, { name: 'Cmt', xp: 0 }, { name: 'Paz', xp: 0 }],
  dueCount: 0, studiedToday: true,
};

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [randomListId, setRandomListId] = useState('1');
  const [randomListName, setRandomListName] = useState('B1 Temel Kelimeler');

  const loadAll = useCallback(async () => {
    const [nameVal, raw, preferred, s] = await Promise.all([
      AsyncStorage.getItem('user_name'),
      AsyncStorage.getItem('custom_lists'),
      AsyncStorage.getItem('preferred_list'),
      loadDashboardStats(),
    ]);

    if (nameVal) setUserName(nameVal);
    setStats(s);

    const custom: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
    const all = [
      ...DEFAULT_LISTS.map(l => ({ id: l.id, name: l.name })),
      ...custom.map(l => ({ id: l.id, name: l.name })),
    ];
    // Seviye tercihine uyan liste havuzda 3 kat ağırlıklı
    const favored = all.find(l => l.id === preferred);
    const pool = favored ? [...all, favored, favored] : all;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setRandomListId(picked.id);
    setRandomListName(picked.name);
  }, []);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('onboarding_done').then(val => {
      if (val !== 'true') router.replace('/onboarding');
    });
    loadAll();
  }, [loadAll]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }, [loadAll]);

  const loadRandomList = useCallback(async () => {
    const raw = await AsyncStorage.getItem('custom_lists');
    const custom: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
    const all = [
      ...DEFAULT_LISTS.map(l => ({ id: l.id, name: l.name })),
      ...custom.map(l => ({ id: l.id, name: l.name })),
    ];
    const picked = all[Math.floor(Math.random() * all.length)];
    setRandomListId(picked.id);
    setRandomListName(picked.name);
  }, []);

  const dailyPct = Math.min((stats.todayWords / stats.dailyGoal) * 100, 100);
  const maxXp    = Math.max(...stats.weeklyXp.map(d => d.xp), 1);
  const dailyWord = wordOfTheDay();

  // Günlük hedef barı animasyonlu dolar
  const progressW = useSharedValue(0);
  useEffect(() => {
    progressW.value = withTiming(dailyPct, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [dailyPct, progressW]);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value}%` }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{timeGreeting()}{userName ? `, ${userName}` : ''}</Text>
            <Text style={styles.subtitle}>Bugün harika bir gün</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpLabel}>XP</Text>
            <CountUp value={stats.totalXp} duration={700} style={styles.xpValue} />
          </View>
        </View>

        {/* Streak + haftalık aktivite */}
        {stats.streak > 0 && (
          <View style={styles.streakCard}>
            <View style={styles.streakTop}>
              <FlamePulse />
              <View style={styles.streakLeft}>
                <Text style={styles.streakTitle}>
                  <Text style={styles.streakCount}>{stats.streak}</Text> günlük seri
                </Text>
                <Text style={styles.streakSub}>{stats.studiedToday ? 'Bugünü de tamamladın!' : 'Bugün de devam et!'}</Text>
              </View>
            </View>
            <View style={styles.weekRow}>
              {stats.weeklyXp.map((d, i) => {
                const isToday = i === stats.weeklyXp.length - 1;
                const active = d.xp > 0;
                return (
                  <View key={i} style={styles.weekCol}>
                    <View style={[
                      styles.weekBox,
                      active && styles.weekBoxActive,
                      isToday && styles.weekBoxToday,
                    ]}>
                      {active ? (
                        <SymbolView name="checkmark" size={11} tintColor="#fff" type="monochrome" />
                      ) : (
                        <View style={styles.weekBoxDot} />
                      )}
                    </View>
                    <Text style={[styles.weekDay, isToday && styles.weekDayToday]}>{d.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Günün Kelimesi */}
        <TouchableOpacity
          style={styles.wodCard}
          onPress={() => router.push({ pathname: '/words/detail' as any, params: { listId: dailyWord.listId, wordId: dailyWord.id } })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#7C3AED', Colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={styles.wodStrip}
          />
          <View style={styles.wodBody}>
            <Text style={styles.wodLabel}>GÜNÜN KELİMESİ</Text>
            <Text style={styles.wodWord}>{dailyWord.word}</Text>
            <Text style={styles.wodTr}>{dailyWord.tr}</Text>
          </View>
          <TouchableOpacity
            style={styles.wodListen}
            onPress={() => Speech.speak(dailyWord.word, { language: 'en-US', rate: 0.85 })}
            activeOpacity={0.75}
          >
            <SymbolView name="speaker.wave.2.fill" size={16} tintColor={Colors.primary} type="monochrome" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Streak risk uyarısı */}
        {stats.streak > 0 && !stats.studiedToday && (
          <TouchableOpacity style={styles.riskBanner} onPress={() => router.push('/study/select')} activeOpacity={0.85}>
            <SymbolView name="flame.fill" size={18} tintColor={Colors.warning} type="monochrome" />
            <View style={{ flex: 1 }}>
              <Text style={styles.riskTitle}>Serin risk altında!</Text>
              <Text style={styles.riskSub}>Bugün henüz çalışmadın — serini korumak için birkaç kelime yeter.</Text>
            </View>
            <SymbolView name="chevron.right" size={13} tintColor={Colors.warning} type="monochrome" />
          </TouchableOpacity>
        )}

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaPrimaryWrap} onPress={() => router.push('/study/select')} activeOpacity={0.88}>
            <LinearGradient
              colors={[Colors.primary, '#7C3AED']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.ctaPrimary}
            >
              <Text style={styles.ctaPrimaryText}>Çalışmaya Başla</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => router.push('/categories')} activeOpacity={0.85}>
            <Text style={styles.ctaSecondaryText}>+ Kelime</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            {
              value: stats.dueCount, label: 'Tekrar Bekliyor', color: Colors.warning,
              onPress: stats.dueCount > 0
                ? () => router.push({ pathname: '/study/flashcard' as any, params: { listId: '_due' } })
                : undefined,
            },
            { value: stats.todayWords,  label: 'Bugün Çalışılan', color: Colors.success  },
            { value: stats.streak,      label: 'Günlük Seri',     color: Colors.primary  },
            { value: `%${Math.round(dailyPct)}`, label: 'Günlük Hedef', color: Colors.purple },
          ].map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.statCard, { borderLeftColor: s.color }]}
              onPress={s.onPress}
              disabled={!s.onPress}
              activeOpacity={0.8}
            >
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              {s.onPress && (
                <View style={styles.statChevron}>
                  <SymbolView name="chevron.right" size={11} tintColor={s.color} type="monochrome" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Günlük Hedef</Text>
            <Text style={styles.cardSub}>{stats.todayWords} / {stats.dailyGoal} kelime</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFillWrap, progressStyle]}>
              <LinearGradient
                colors={[Colors.primary, Colors.purple]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressLabel}>
            {dailyPct >= 100 ? 'Hedef tamamlandı, harikasın!' : `${stats.dailyGoal - stats.todayWords} kelime kaldı`}
          </Text>
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Haftalık XP</Text>
          <View style={styles.chart}>
            {stats.weeklyXp.map((d, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={styles.chartBarWrap}>
                  {i === stats.weeklyXp.length - 1 && d.xp > 0 && (
                    <Text style={styles.chartTodayXp}>{d.xp}</Text>
                  )}
                  <ChartBar value={d.xp} max={maxXp} index={i} isToday={i === stats.weeklyXp.length - 1} />
                </View>
                <Text style={[styles.chartLabel, i === stats.weeklyXp.length - 1 && styles.chartLabelToday]}>{d.name}</Text>
                {d.xp > 0 && i !== stats.weeklyXp.length - 1 && <Text style={styles.chartXp}>{d.xp}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Hızlı Başla */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Başla</Text>
          <TouchableOpacity onPress={loadRandomList} activeOpacity={0.7}>
            <SymbolView name="arrow.clockwise" size={14} tintColor={Colors.primary} type="monochrome" />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSub}>{randomListName} listesiyle</Text>
        <View style={styles.modeGrid}>
          {QUICK_MODES.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.modeCard, { borderTopColor: m.color }]}
              onPress={() => router.push({ pathname: m.dest as any, params: { listId: randomListId } })}
              activeOpacity={0.82}
            >
              <View style={[styles.modeIcon, { backgroundColor: m.bg }]}>
                <SymbolView name={m.symbol as any} size={18} tintColor={m.color} type="monochrome" />
              </View>
              <Text style={[styles.modeTitle, { color: m.color }]}>{m.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 26, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  xpBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, alignItems: 'center', gap: 2 },
  xpLabel: { fontSize: 9, fontWeight: '700', color: Colors.primary, letterSpacing: 1.2, textTransform: 'uppercase' },
  xpValue: { fontSize: 17, fontWeight: '800', color: Colors.primary },

  streakCard: { backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.accentSoft, gap: 12 },
  streakTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakLeft: { gap: 3 },
  streakTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  streakCount: { color: Colors.accent, fontWeight: '800', fontSize: 16 },
  streakSub: { fontSize: 12, color: Colors.textSecondary },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekCol: { alignItems: 'center', gap: 4 },
  weekBox: { width: 26, height: 26, borderRadius: 9, backgroundColor: Colors.accentSoft + '60', alignItems: 'center', justifyContent: 'center' },
  weekBoxActive: { backgroundColor: Colors.accent },
  weekBoxToday: { borderWidth: 2, borderColor: Colors.accent },
  weekBoxDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accentSoft },
  weekDay: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  weekDayToday: { color: Colors.accent, fontWeight: '800' },

  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  ctaPrimaryWrap: { flex: 1, borderRadius: 14, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 6 },
  ctaPrimary: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.1 },
  ctaSecondary: { backgroundColor: Colors.bgCard, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  ctaSecondaryText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: Colors.bgCard, borderRadius: 14, padding: 16, gap: 5, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  statChevron: { position: 'absolute', top: 14, right: 12 },

  wodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  wodStrip: { width: 5, alignSelf: 'stretch' },
  wodBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 16, gap: 2 },
  wodLabel: { fontSize: 9, fontWeight: '800', color: Colors.primary, letterSpacing: 1.4 },
  wodWord: { fontSize: 20, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.3 },
  wodTr: { fontSize: 13, color: Colors.textSecondary },
  wodListen: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 16 },

  riskBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.warningLight, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16, borderWidth: 1, borderColor: Colors.warning + '40' },
  riskTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  riskSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, lineHeight: 15 },

  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  cardSub: { color: Colors.textSecondary, fontSize: 13 },
  progressTrack: { height: 10, backgroundColor: Colors.borderLight, borderRadius: 5, overflow: 'hidden' },
  progressFillWrap: { height: '100%', borderRadius: 5, overflow: 'hidden' },
  progressLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 9 },

  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 18, height: 104 },
  chartCol: { flex: 1, alignItems: 'center', gap: 5 },
  chartBarWrap: { flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center', gap: 3 },
  chartBar: { width: '68%', borderRadius: 5, minHeight: 3 },
  chartLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  chartLabelToday: { color: Colors.primary, fontWeight: '800' },
  chartTodayXp: { color: Colors.primary, fontSize: 9, fontWeight: '800' },
  chartXp: { color: Colors.textMuted, fontSize: 8, fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  sectionTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16 },
  sectionSub: { color: Colors.textMuted, fontSize: 12, marginBottom: 12, marginTop: 3 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  modeCard: { width: '30.8%', backgroundColor: Colors.bgCard, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center', gap: 8, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  modeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: 11, fontWeight: '700' },
});
