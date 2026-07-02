import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { loadProfileStats } from '../../lib/stats';

type ProfileStats = {
  totalXp: number; streak: number; maxStreak: number;
  accuracy: number; totalWords: number; level: number;
  levelXp: number; nextLevelXp: number;
};

const EMPTY: ProfileStats = {
  totalXp: 0, streak: 0, maxStreak: 0, accuracy: 0,
  totalWords: 0, level: 1, levelXp: 0, nextLevelXp: 1000,
};

const GOAL_OPTIONS = [
  { value: '5',  label: '5 kelime', sub: 'Hafif' },
  { value: '10', label: '10 kelime', sub: 'Normal' },
  { value: '20', label: '20 kelime', sub: 'Önerilen' },
  { value: '30', label: '30 kelime', sub: 'Yoğun' },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');
  const [ps, setPs] = useState<ProfileStats>(EMPTY);
  const [goalModal, setGoalModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState('10');

  useFocusEffect(useCallback(() => {
    Promise.all([
      AsyncStorage.getItem('user_name'),
      AsyncStorage.getItem('daily_goal'),
      loadProfileStats(),
    ]).then(([name, goal, stats]) => {
      if (name) setUserName(name);
      if (goal) setCurrentGoal(goal);
      setPs(stats);
    });
  }, []));

  const displayName = userName || 'Kullanıcı';
  const initials    = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const levelPct    = Math.min((ps.levelXp / ps.nextLevelXp) * 100, 100);
  const xpToNext    = ps.nextLevelXp - ps.levelXp;

  const setGoal = async (val: string) => {
    await AsyncStorage.setItem('daily_goal', val);
    setCurrentGoal(val);
    setGoalModal(false);
  };

  const MENU_ITEMS = [
    { label: 'Bildirimler',  symbol: 'bell.fill',               color: Colors.primary, onPress: () => router.push('/settings/notifications') },
    { label: 'Günlük Hedef', symbol: 'target',                  color: Colors.green,   onPress: () => setGoalModal(true) },
    { label: 'Gizlilik',     symbol: 'lock.shield.fill',        color: Colors.blue,    onPress: () => router.push('/settings/privacy' as any) },
    { label: 'Yardım',       symbol: 'questionmark.circle.fill', color: Colors.purple,  onPress: () => router.push('/settings/help' as any) },
  ];

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Tüm veriler bu cihazda saklanmaktadır. Çıkış yaptığınızda onboarding yeniden başlayacak.', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('onboarding_done');
          router.replace('/onboarding');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={s.hero}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.name}>{displayName}</Text>
          <View style={s.freeBadge}>
            <Text style={s.freeBadgeText}>Ücretsiz Plan</Text>
          </View>
        </View>

        {/* Level card */}
        <View style={s.levelCard}>
          <View style={s.levelHeader}>
            <View>
              <Text style={s.levelTitle}>Seviye {ps.level}</Text>
              <Text style={s.levelSub}>{ps.levelXp} / {ps.nextLevelXp} XP</Text>
            </View>
            <View style={s.streakPill}>
              <Text style={s.streakVal}>{ps.streak}</Text>
              <Text style={s.streakLabel}>Gün Seri</Text>
            </View>
          </View>
          <View style={s.xpTrack}>
            <View style={[s.xpFill, { width: `${levelPct}%` as any }]} />
          </View>
          <Text style={s.xpNote}>{xpToNext} XP daha → Seviye {ps.level + 1}</Text>
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {[
            { label: 'Toplam Kelime', value: String(ps.totalWords),               color: Colors.primary },
            { label: 'Toplam XP',     value: ps.totalXp.toLocaleString(),         color: Colors.accent  },
            { label: 'En Uzun Seri',  value: `${ps.maxStreak} gün`,               color: Colors.green   },
            { label: 'Doğruluk',      value: `%${ps.accuracy}`,                   color: Colors.purple  },
          ].map((st, i) => (
            <View key={i} style={[s.statCard, { borderTopColor: st.color }]}>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={s.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.menuRow, i < MENU_ITEMS.length - 1 && s.menuRowBorder]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={[s.menuIconBox, { backgroundColor: item.color + '15' }]}>
                <SymbolView name={item.symbol as any} size={16} tintColor={item.color} type="monochrome" />
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              <SymbolView name="chevron.right" size={13} tintColor={Colors.textMuted} type="monochrome" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Daily Goal Modal */}
      <Modal visible={goalModal} transparent animationType="fade" onRequestClose={() => setGoalModal(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setGoalModal(false)}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Günlük Hedef</Text>
            <Text style={s.modalSub}>Her gün kaç kelime çalışmak istiyorsun?</Text>
            {GOAL_OPTIONS.map(g => (
              <TouchableOpacity
                key={g.value}
                style={[s.goalRow, currentGoal === g.value && s.goalRowActive]}
                onPress={() => setGoal(g.value)}
                activeOpacity={0.8}
              >
                <View style={s.goalInfo}>
                  <Text style={[s.goalLabel, currentGoal === g.value && s.goalLabelActive]}>{g.label}</Text>
                  <Text style={s.goalSub}>{g.sub}</Text>
                </View>
                {currentGoal === g.value && (
                  <SymbolView name="checkmark.circle.fill" size={20} tintColor={Colors.primary} type="monochrome" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 50, gap: 16 },

  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 4, borderWidth: 3, borderColor: Colors.primarySoft },
  avatarText: { color: Colors.primary, fontSize: 26, fontWeight: '800' },
  name: { color: Colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  freeBadge: { backgroundColor: Colors.accentLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 2, borderWidth: 1, borderColor: Colors.accentSoft },
  freeBadgeText: { color: Colors.accent, fontWeight: '700', fontSize: 12 },

  levelCard: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 18 },
  levelSub: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },
  streakPill: { backgroundColor: Colors.accentLight, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: Colors.accentSoft },
  streakVal: { color: Colors.accent, fontSize: 20, fontWeight: '900' },
  streakLabel: { color: Colors.accent, fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  xpTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  xpNote: { color: Colors.textMuted, fontSize: 11 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14, gap: 4, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '500' },

  menuCard: { backgroundColor: Colors.bgCard, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight },
  menuIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: Colors.textPrimary, fontWeight: '500', fontSize: 14 },

  logoutBtn: { backgroundColor: Colors.bgCard, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.danger + '40' },
  logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  modalSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  goalRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border },
  goalRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  goalInfo: { flex: 1 },
  goalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  goalLabelActive: { color: Colors.primary },
  goalSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
