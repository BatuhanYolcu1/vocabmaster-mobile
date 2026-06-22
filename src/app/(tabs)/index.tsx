import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';
import { loadDashboardStats } from '../../lib/stats';
import { DEFAULT_LISTS } from '../../data/demoWords';

const QUICK_MODES = [
  { title: 'Flashcard', symbol: 'rectangle.on.rectangle.fill', color: Colors.primary,  bg: Colors.primaryLight, dest: '/study/flashcard' },
  { title: 'Quiz',      symbol: 'checkmark.circle.fill',       color: Colors.green,    bg: Colors.greenLight,   dest: '/study/quiz'      },
  { title: 'Yazarak',   symbol: 'keyboard.fill',               color: Colors.purple,   bg: Colors.purpleLight,  dest: '/study/typing'    },
  { title: 'Konuşma',   symbol: 'mic.fill',                    color: '#EC4899',       bg: '#FDF2F8',           dest: '/study/speaking'  },
];

type Stats = {
  totalXp: number; streak: number; todayWords: number;
  dailyGoal: number; weeklyXp: { name: string; xp: number }[]; dueCount: number;
};

const EMPTY_STATS: Stats = {
  totalXp: 0, streak: 0, todayWords: 0, dailyGoal: 20,
  weeklyXp: [{ name: 'Pzt', xp: 0 }, { name: 'Sal', xp: 0 }, { name: 'Çar', xp: 0 }, { name: 'Per', xp: 0 }, { name: 'Cum', xp: 0 }, { name: 'Cmt', xp: 0 }, { name: 'Paz', xp: 0 }],
  dueCount: 0,
};

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [randomListId, setRandomListId] = useState('1');
  const [randomListName, setRandomListName] = useState('B1 Temel Kelimeler');

  const loadAll = useCallback(async () => {
    const [nameVal, raw, s] = await Promise.all([
      AsyncStorage.getItem('user_name'),
      AsyncStorage.getItem('custom_lists'),
      loadDashboardStats(),
    ]);

    if (nameVal) setUserName(nameVal);
    setStats(s);

    const custom: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
    const all = [
      ...DEFAULT_LISTS.map(l => ({ id: l.id, name: l.name })),
      ...custom.map(l => ({ id: l.id, name: l.name })),
    ];
    const picked = all[Math.floor(Math.random() * all.length)];
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
            <Text style={styles.greeting}>Merhaba{userName ? `, ${userName}` : ''}</Text>
            <Text style={styles.subtitle}>Bugün harika bir gün</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text style={styles.xpValue}>{stats.totalXp.toLocaleString()}</Text>
          </View>
        </View>

        {/* Streak */}
        {stats.streak > 0 && (
          <View style={styles.streakCard}>
            <View style={styles.streakLeft}>
              <Text style={styles.streakTitle}>
                <Text style={styles.streakCount}>{stats.streak}</Text> günlük seri
              </Text>
              <Text style={styles.streakSub}>Bugün de devam et!</Text>
            </View>
            <View style={styles.streakDots}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={[styles.dot, i < stats.streak && styles.dotFilled]} />
              ))}
            </View>
          </View>
        )}

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => router.push('/study/select')} activeOpacity={0.88}>
            <Text style={styles.ctaPrimaryText}>Çalışmaya Başla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => router.push('/categories')} activeOpacity={0.85}>
            <Text style={styles.ctaSecondaryText}>+ Kelime</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { value: stats.dueCount,    label: 'Tekrar Bekliyor', color: Colors.warning  },
            { value: stats.todayWords,  label: 'Bugün Çalışılan', color: Colors.success  },
            { value: stats.todayWords,  label: 'Bugün',           color: Colors.primary  },
            { value: `%${Math.round(dailyPct)}`, label: 'Günlük Hedef', color: Colors.purple },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { borderLeftColor: s.color }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Daily Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Günlük Hedef</Text>
            <Text style={styles.cardSub}>{stats.todayWords} / {stats.dailyGoal} kelime</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${dailyPct}%` as any }]} />
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
                  <View style={[styles.chartBar, { height: d.xp > 0 ? Math.max((d.xp / maxXp) * 72, 6) : 3, backgroundColor: d.xp > 0 ? Colors.primary : Colors.borderLight }]} />
                </View>
                <Text style={styles.chartLabel}>{d.name}</Text>
                {d.xp > 0 && <Text style={styles.chartXp}>{d.xp}</Text>}
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
  content: { padding: 20, paddingBottom: 48 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  xpBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, alignItems: 'center', gap: 2 },
  xpLabel: { fontSize: 9, fontWeight: '700', color: Colors.primary, letterSpacing: 1.2, textTransform: 'uppercase' },
  xpValue: { fontSize: 17, fontWeight: '800', color: Colors.primary },

  streakCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.accentLight, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.accentSoft },
  streakLeft: { gap: 3 },
  streakTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  streakCount: { color: Colors.accent, fontWeight: '800', fontSize: 16 },
  streakSub: { fontSize: 12, color: Colors.textSecondary },
  streakDots: { flexDirection: 'row', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.accentSoft },
  dotFilled: { backgroundColor: Colors.accent },

  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  ctaPrimary: { flex: 1, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 6 },
  ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.1 },
  ctaSecondary: { backgroundColor: Colors.bgCard, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  ctaSecondaryText: { color: Colors.textSecondary, fontWeight: '700', fontSize: 15 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: Colors.bgCard, borderRadius: 14, padding: 16, gap: 5, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },

  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  cardSub: { color: Colors.textSecondary, fontSize: 13 },
  progressTrack: { height: 10, backgroundColor: Colors.borderLight, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: Colors.primary },
  progressLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 9 },

  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 18, height: 96 },
  chartCol: { flex: 1, alignItems: 'center', gap: 5 },
  chartBarWrap: { flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  chartBar: { width: '68%', borderRadius: 5, minHeight: 3 },
  chartLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  chartXp: { color: Colors.textMuted, fontSize: 8, fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  sectionTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16 },
  sectionSub: { color: Colors.textMuted, fontSize: 12, marginBottom: 12, marginTop: 3 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  modeCard: { width: '47.5%', backgroundColor: Colors.bgCard, borderRadius: 14, padding: 16, alignItems: 'center', gap: 10, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  modeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: 12, fontWeight: '700' },
});
