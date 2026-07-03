import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

function Avatar({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={[av.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '18', borderColor: color + '40' }]}>
      <Text style={[av.text, { color, fontSize: size * 0.33 }]}>{initials}</Text>
    </View>
  );
}
const av = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  text: { fontWeight: '800' },
});

export default function LeaderboardScreen() {
  const [myXp, setMyXp]       = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [myName, setMyName]   = useState('Sen');

  useFocusEffect(useCallback(() => {
    AsyncStorage.multiGet(['stats_total_xp', 'stats_streak', 'user_name']).then(pairs => {
      const m = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]));
      setMyXp(parseInt(m.stats_total_xp ?? '0'));
      setMyStreak(parseInt(m.stats_streak ?? '0'));
      if (m.user_name) setMyName(m.user_name);
    });
  }, []));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Liderlik Tablosu</Text>
        <Text style={s.subtitle}>Kendi ilerlemenizi takip edin</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Coming soon banner */}
        <View style={s.comingBanner}>
          <SymbolView name="person.2.fill" size={22} tintColor={Colors.primary} type="monochrome" />
          <View style={s.comingInfo}>
            <Text style={s.comingTitle}>Çok Oyunculu Mod Yakında</Text>
            <Text style={s.comingSub}>Arkadaşlarınla rekabet etmek için güncellemeyi bekle!</Text>
          </View>
        </View>

        {/* User's own stats — prominent card */}
        <View style={s.meCard}>
          <View style={s.meTop}>
            <View style={s.meMedal}>
              <SymbolView name="trophy.fill" size={20} tintColor={Colors.warning} type="monochrome" />
            </View>
            <Avatar name={myName} color={Colors.primary} size={52} />
            <View style={s.meMedal} />
          </View>
          <Text style={s.meName}>{myName}</Text>
          <Text style={s.meXp}>{myXp.toLocaleString()} XP</Text>
          <View style={s.meStatsRow}>
            <View style={s.meStat}>
              <SymbolView name="flame.fill" size={14} tintColor={Colors.accent} type="monochrome" />
              <Text style={s.meStatVal}>{myStreak}</Text>
              <Text style={s.meStatLabel}>Günlük Seri</Text>
            </View>
            <View style={s.meStatDivider} />
            <View style={s.meStat}>
              <SymbolView name="bolt.fill" size={14} tintColor={Colors.primary} type="monochrome" />
              <Text style={s.meStatVal}>{myXp.toLocaleString()}</Text>
              <Text style={s.meStatLabel}>Toplam XP</Text>
            </View>
            <View style={s.meStatDivider} />
            <View style={s.meStat}>
              <SymbolView name="star.fill" size={14} tintColor={Colors.warning} type="monochrome" />
              <Text style={s.meStatVal}>{Math.floor(myXp / 1000) + 1}</Text>
              <Text style={s.meStatLabel}>Seviye</Text>
            </View>
          </View>
        </View>

        {/* Motivational milestones */}
        <Text style={s.sectionTitle}>XP Kilometre Taşları</Text>
        {[
          { xp: 100,  label: 'Başlangıç',   icon: 'star.fill',       color: Colors.textMuted },
          { xp: 500,  label: 'Öğrenci',      icon: 'book.fill',       color: Colors.green     },
          { xp: 1000, label: 'Azimli',        icon: 'flame.fill',      color: Colors.accent    },
          { xp: 2500, label: 'Uzman',          icon: 'graduationcap.fill', color: Colors.purple },
          { xp: 5000, label: 'Usta',           icon: 'trophy.fill',     color: Colors.warning   },
        ].map(ms => {
          const reached = myXp >= ms.xp;
          return (
            <View key={ms.xp} style={[s.msRow, reached && s.msRowReached]}>
              <View style={[s.msIcon, { backgroundColor: reached ? ms.color + '20' : Colors.borderLight }]}>
                <SymbolView name={ms.icon as any} size={16} tintColor={reached ? ms.color : Colors.textMuted} type="monochrome" />
              </View>
              <View style={s.msInfo}>
                <Text style={[s.msLabel, reached && { color: ms.color }]}>{ms.label}</Text>
                <Text style={s.msSub}>{ms.xp.toLocaleString()} XP</Text>
              </View>
              {reached
                ? <SymbolView name="checkmark.circle.fill" size={20} tintColor={ms.color} type="monochrome" />
                : <Text style={s.msRemain}>{(ms.xp - myXp).toLocaleString()} kaldı</Text>
              }
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  content: { padding: 20, paddingBottom: 120, gap: 12 },

  comingBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.primarySoft },
  comingInfo: { flex: 1 },
  comingTitle: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  comingSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2, lineHeight: 17 },

  meCard: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 20, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderWidth: 1.5, borderColor: Colors.primarySoft },
  meTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meMedal: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  meName: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  meXp: { fontSize: 32, fontWeight: '900', color: Colors.primary, letterSpacing: -1 },
  meStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  meStat: { flex: 1, alignItems: 'center', gap: 4 },
  meStatVal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  meStatLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  meStatDivider: { width: StyleSheet.hairlineWidth, height: 36, backgroundColor: Colors.borderLight },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  msRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  msRowReached: { borderColor: Colors.borderLight },
  msIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  msInfo: { flex: 1 },
  msLabel: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  msSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  msRemain: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
});
