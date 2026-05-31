import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

type ListItem = {
  id: string; name: string; desc: string; symbol: string;
  color: string; count: number; iconIndex: number;
};

const DEFAULT_LISTS: ListItem[] = [
  { id: '1', name: 'B1 Temel Kelimeler', desc: 'Günlük konuşma dili', symbol: 'book.fill',          color: Colors.primary, count: 50, iconIndex: 0 },
  { id: '2', name: 'İş İngilizcesi',     desc: 'Profesyonel ortam',   symbol: 'briefcase.fill',     color: Colors.green,   count: 30, iconIndex: 1 },
  { id: '3', name: 'Akademik Kelimeler', desc: 'Üniversite düzeyi',   symbol: 'graduationcap.fill', color: Colors.purple,  count: 45, iconIndex: 2 },
  { id: '4', name: 'Seyahat',            desc: 'Gezi ve turizm',      symbol: 'airplane',           color: Colors.accent,  count: 25, iconIndex: 3 },
];

export default function CategoriesScreen() {
  const [lists, setLists] = useState<ListItem[]>(DEFAULT_LISTS);

  const loadLists = useCallback(async () => {
    const raw = await AsyncStorage.getItem('custom_lists');
    const custom: ListItem[] = raw ? JSON.parse(raw) : [];
    setLists([...DEFAULT_LISTS, ...custom]);
  }, []);

  // Refresh every time the screen comes into focus (e.g. after creating a new list)
  useFocusEffect(useCallback(() => { loadLists(); }, [loadLists]));

  const totalWords = lists.reduce((a, l) => a + (l.count || 0), 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Kelime Listeleri</Text>
          <Text style={s.subtitle}>{totalWords} kelime toplam</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/words/new-list' as any)}
        >
          <Text style={s.addText}>+ Yeni Liste</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadLists} tintColor={Colors.primary} />}
      >
        {lists.map((list) => (
          <TouchableOpacity
            key={list.id}
            style={s.card}
            onPress={() => router.push({ pathname: '/words/[listId]' as any, params: { listId: list.id } })}
            activeOpacity={0.8}
          >
            <View style={[s.iconBox, { backgroundColor: list.color + '18' }]}>
              <SymbolView name={list.symbol as any} size={22} tintColor={list.color} type="monochrome" />
            </View>
            <View style={s.info}>
              <Text style={s.name}>{list.name}</Text>
              <Text style={s.desc}>{list.desc}</Text>
            </View>
            <View style={s.right}>
              <Text style={[s.count, { color: list.color }]}>{list.count || '—'}</Text>
              <Text style={s.countLabel}>kelime</Text>
            </View>
            <SymbolView name="chevron.right" size={14} tintColor={Colors.textMuted} type="monochrome" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={s.emptyCard}
          activeOpacity={0.75}
          onPress={() => router.push('/words/new-list' as any)}
        >
          <View style={s.emptyIconWrap}>
            <SymbolView name="plus" size={20} tintColor={Colors.primary} type="monochrome" />
          </View>
          <Text style={s.emptyText}>Yeni liste oluştur</Text>
          <Text style={s.emptyDesc}>Kendi kelime setini ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  addBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  desc: { color: Colors.textMuted, fontSize: 12 },
  right: { alignItems: 'center', marginRight: 10 },
  count: { fontSize: 20, fontWeight: '800' },
  countLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  emptyCard: {
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 20,
    alignItems: 'center', marginTop: 4,
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed',
  },
  emptyIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  emptyText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  emptyDesc: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },
});
