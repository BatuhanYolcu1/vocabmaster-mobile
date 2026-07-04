import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { loadAchievements, Achievement } from '../../lib/achievements';
import { loadMonthlyActivity } from '../../lib/stats';
import { SpringIn } from '../../components/anim';

function heatColor(xp: number): string {
  if (xp === 0) return Colors.borderLight;
  if (xp < 50) return Colors.primarySoft;
  if (xp < 150) return '#8B7CF8';
  return Colors.primary;
}

export default function AchievementsScreen() {
  const [myXp, setMyXp]         = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [myName, setMyName]     = useState('Sen');
  const [badges, setBadges]     = useState<Achievement[]>([]);
  const [activity, setActivity] = useState<{ date: string; xp: number }[]>([]);

  useFocusEffect(useCallback(() => {
    AsyncStorage.multiGet(['stats_total_xp', 'stats_streak', 'user_name']).then(pairs => {
      const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));
      setMyXp(parseInt(m.stats_total_xp ?? '0'));
      setMyStreak(parseInt(m.stats_streak ?? '0'));
      if (m.user_name) setMyName(m.user_name);
    });
    loadAchievements().then(setBadges);
    loadMonthlyActivity().then(setActivity);
  }, []));

  const earnedCount = badges.filter(b => b.earned).length;
  const activeDays = activity.filter(d => d.xp > 0).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Başarımlar</Text>
        <Text style={s.subtitle}>{earnedCount} / {badges.length} rozet kazanıldı</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Me card */}
        <LinearGradient
          colors={[Colors.primary, '#7C3AED']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.meCard}
        >
          <Text style={s.meName}>{myName}</Text>
          <Text style={s.meXp}>{myXp.toLocaleString()} XP</Text>
          <View style={s.meStatsRow}>
            <View style={s.meStat}>
              <SymbolView name="flame.fill" size={14} tintColor="#fff" type="monochrome" />
              <Text style={s.meStatVal}>{myStreak}</Text>
              <Text style={s.meStatLabel}>Seri</Text>
            </View>
            <View style={s.meStatDivider} />
            <View style={s.meStat}>
              <SymbolView name="medal.fill" size={14} tintColor="#fff" type="monochrome" />
              <Text style={s.meStatVal}>{earnedCount}</Text>
              <Text style={s.meStatLabel}>Rozet</Text>
            </View>
            <View style={s.meStatDivider} />
            <View style={s.meStat}>
              <SymbolView name="star.fill" size={14} tintColor="#fff" type="monochrome" />
              <Text style={s.meStatVal}>{Math.floor(myXp / 1000) + 1}</Text>
              <Text style={s.meStatLabel}>Seviye</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Rozet grid */}
        <Text style={s.sectionTitle}>Rozetler</Text>
        <View style={s.badgeGrid}>
          {badges.map((b, i) => (
            <SpringIn key={b.id} delay={i * 40} style={s.badgeCell}>
              <View style={[s.badgeCard, !b.earned && s.badgeCardLocked]}>
                <View style={[s.badgeIcon, { backgroundColor: b.earned ? b.color + '1C' : Colors.borderLight }]}>
                  <SymbolView
                    name={(b.earned ? b.icon : 'lock.fill') as any}
                    size={22}
                    tintColor={b.earned ? b.color : Colors.textMuted}
                    type="monochrome"
                  />
                </View>
                <Text style={[s.badgeTitle, b.earned && { color: b.color }]} numberOfLines={1}>{b.title}</Text>
                <Text style={s.badgeDesc} numberOfLines={2}>{b.desc}</Text>
                {!b.earned && (
                  <View style={s.badgeTrack}>
                    <View style={[s.badgeFill, { width: `${Math.round(b.progress * 100)}%` as any }]} />
                  </View>
                )}
              </View>
            </SpringIn>
          ))}
        </View>

        {/* Aylık ısı haritası */}
        <Text style={s.sectionTitle}>Son 30 Gün</Text>
        <View style={s.heatCard}>
          <View style={s.heatGrid}>
            {activity.map((d) => (
              <View key={d.date} style={[s.heatBox, { backgroundColor: heatColor(d.xp) }]} />
            ))}
          </View>
          <View style={s.heatFooter}>
            <Text style={s.heatInfo}>{activeDays} aktif gün</Text>
            <View style={s.heatLegend}>
              <Text style={s.heatLegendText}>Az</Text>
              {[Colors.borderLight, Colors.primarySoft, '#8B7CF8', Colors.primary].map((c, i) => (
                <View key={i} style={[s.heatLegendBox, { backgroundColor: c }]} />
              ))}
              <Text style={s.heatLegendText}>Çok</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 26, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  content: { padding: 20, paddingBottom: 120, gap: 12 },

  meCard: {
    borderRadius: 20, padding: 20, alignItems: 'center', gap: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5,
  },
  meName: { fontSize: 18, fontFamily: Fonts.heading, color: '#fff' },
  meXp: { fontSize: 32, fontFamily: Fonts.headingBlack, color: '#fff', letterSpacing: -1 },
  meStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 18 },
  meStat: { alignItems: 'center', gap: 3, minWidth: 56 },
  meStatVal: { color: '#fff', fontSize: 16, fontWeight: '800' },
  meStatLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '600' },
  meStatDivider: { width: StyleSheet.hairlineWidth, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 8 },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCell: { width: '30.8%' },
  badgeCard: {
    backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8,
    alignItems: 'center', gap: 5, minHeight: 120,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  badgeCardLocked: { opacity: 0.72 },
  badgeIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  badgeTitle: { fontSize: 12, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  badgeDesc: { fontSize: 9.5, color: Colors.textMuted, textAlign: 'center', lineHeight: 13 },
  badgeTrack: { width: '85%', height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  badgeFill: { height: '100%', backgroundColor: Colors.primarySoft, borderRadius: 2 },

  heatCard: {
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  heatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  heatBox: { width: 26, height: 26, borderRadius: 7 },
  heatFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heatInfo: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  heatLegend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heatLegendBox: { width: 12, height: 12, borderRadius: 3.5 },
  heatLegendText: { fontSize: 10, color: Colors.textMuted },
});
