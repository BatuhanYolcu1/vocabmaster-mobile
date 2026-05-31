import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';

const STATS = [
  { label: 'Toplam Kelime', value: '248', color: Colors.primary },
  { label: 'Toplam XP', value: '1.840', color: Colors.accent },
  { label: 'En Uzun Seri', value: '12 gün', color: Colors.green },
  { label: 'Doğruluk', value: '%78', color: Colors.purple },
];

const MENU_ITEMS = [
  { label: 'Bildirimler', symbol: 'bell.fill', color: Colors.primary, route: '/settings/notifications' },
  { label: 'Günlük Hedef', symbol: 'target', color: Colors.green, route: null },
  { label: 'Dil Ayarları', symbol: 'globe', color: Colors.blue, route: null },
  { label: 'Yardım', symbol: 'questionmark.circle.fill', color: Colors.purple, route: null },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user_name').then(val => { if (val) setUserName(val); });
  }, []);

  const displayName = userName || 'Kullanıcı';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar & Info */}
        <View style={s.hero}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.email}>bthnylc1@gmail.com</Text>
          <View style={s.freeBadge}>
            <Text style={s.freeBadgeText}>Ücretsiz Plan</Text>
          </View>
        </View>

        {/* Level */}
        <View style={s.levelCard}>
          <View style={s.levelHeader}>
            <View>
              <Text style={s.levelTitle}>Seviye 4</Text>
              <Text style={s.levelSub}>650 / 1000 XP</Text>
            </View>
            <View style={s.streakPill}>
              <Text style={s.streakVal}>5</Text>
              <Text style={s.streakLabel}>Gün Seri</Text>
            </View>
          </View>
          <View style={s.xpTrack}>
            <View style={[s.xpFill, { width: '65%' }]} />
          </View>
          <Text style={s.xpNote}>350 XP daha → Seviye 5</Text>
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {STATS.map((st, i) => (
            <View key={i} style={[s.statCard, { borderTopColor: st.color }]}>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Upgrade Banner */}
        <TouchableOpacity style={s.upgradeBanner} activeOpacity={0.88}>
          <View style={s.upgradeLeft}>
            <Text style={s.upgradeTitle}>Pro'ya Geç</Text>
            <Text style={s.upgradeSub}>Tüm modlar, sınırsız liste, gelişmiş istatistikler</Text>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#fff" type="monochrome" />
        </TouchableOpacity>

        {/* Menu */}
        <View style={s.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={[s.menuRow, i < MENU_ITEMS.length - 1 && s.menuRowBorder]} activeOpacity={0.7} onPress={() => { if (item.route) router.push(item.route as any); }}>
              <View style={[s.menuIconBox, { backgroundColor: item.color + '15' }]}>
                <SymbolView name={item.symbol as any} size={16} tintColor={item.color} type="monochrome" />
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              <SymbolView name="chevron.right" size={13} tintColor={Colors.textMuted} type="monochrome" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} activeOpacity={0.8}>
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 50, gap: 16 },

  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 3,
    borderColor: Colors.primarySoft,
  },
  avatarText: { color: Colors.primary, fontSize: 26, fontWeight: '800' },
  name: { color: Colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  email: { color: Colors.textMuted, fontSize: 13 },
  freeBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 2,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  freeBadgeText: { color: Colors.accent, fontWeight: '700', fontSize: 12 },

  levelCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 18 },
  levelSub: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },
  streakPill: {
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  streakVal: { color: Colors.accent, fontSize: 20, fontWeight: '900' },
  streakLabel: { color: Colors.accent, fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  xpTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  xpNote: { color: Colors.textMuted, fontSize: 11 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '500' },

  upgradeBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  upgradeLeft: { flex: 1 },
  upgradeTitle: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 3 },
  upgradeSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 17 },

  menuCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: Colors.textPrimary, fontWeight: '500', fontSize: 14 },

  logoutBtn: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.danger + '40',
  },
  logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 14 },
});
