import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';
import { DEFAULT_LISTS as WORD_LISTS } from '../../data/demoWords';

type ListItem = {
  id: string; name: string; desc: string; symbol: string;
  color: string; count: number; iconIndex: number;
};

const DESCS: Record<string, string> = {
  '1': 'Günlük konuşma dili',
  '2': 'Profesyonel ortam',
  '3': 'Üniversite düzeyi',
  '4': 'Gezi ve turizm',
};

const DEFAULT_LISTS: ListItem[] = WORD_LISTS.map((l, i) => ({
  id: l.id, name: l.name, desc: DESCS[l.id] ?? '', symbol: l.symbol,
  color: l.color, count: l.words.length, iconIndex: i,
}));

export default function CategoriesScreen() {
  const [lists, setLists] = useState<ListItem[]>(DEFAULT_LISTS);

  const loadLists = useCallback(async () => {
    const raw = await AsyncStorage.getItem('custom_lists');
    const custom: ListItem[] = raw ? JSON.parse(raw) : [];
    // Gerçek kelime sayıları: default sayısı + words_{id}'deki kullanıcı kelimeleri
    const all = await Promise.all([...DEFAULT_LISTS, ...custom].map(async (l) => {
      const wr = await AsyncStorage.getItem(`words_${l.id}`);
      const extra = wr ? (JSON.parse(wr) as unknown[]).length : 0;
      const base = DEFAULT_LISTS.find(d => d.id === l.id)?.count ?? 0;
      return { ...l, count: base + extra };
    }));
    setLists(all);
  }, []);

  // Refresh every time the screen comes into focus (e.g. after creating a new list)
  useFocusEffect(useCallback(() => { loadLists(); }, [loadLists]));

  const isDefault = (id: string) => DEFAULT_LISTS.some(d => d.id === id);

  const deleteList = useCallback((list: ListItem) => {
    Alert.alert('Listeyi Sil', `"${list.name}" ve içindeki tüm kelimeler kalıcı olarak silinecek.`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          const raw = await AsyncStorage.getItem('custom_lists');
          const custom: ListItem[] = raw ? JSON.parse(raw) : [];
          await AsyncStorage.setItem('custom_lists', JSON.stringify(custom.filter(l => l.id !== list.id)));
          await AsyncStorage.multiRemove([`words_${list.id}`, `srs_${list.id}`]);
          loadLists();
        },
      },
    ]);
  }, [loadLists]);

  const renameList = useCallback((list: ListItem) => {
    Alert.prompt('Listeyi Yeniden Adlandır', undefined, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Kaydet',
        onPress: async (newName?: string) => {
          const trimmed = newName?.trim();
          if (!trimmed) return;
          const raw = await AsyncStorage.getItem('custom_lists');
          const custom: ListItem[] = raw ? JSON.parse(raw) : [];
          await AsyncStorage.setItem('custom_lists', JSON.stringify(
            custom.map(l => (l.id === list.id ? { ...l, name: trimmed } : l)),
          ));
          loadLists();
        },
      },
    ], 'plain-text', list.name);
  }, [loadLists]);

  const handleLongPress = useCallback((list: ListItem) => {
    if (isDefault(list.id)) return;
    Alert.alert(list.name, 'Ne yapmak istersiniz?', [
      { text: 'Yeniden Adlandır', onPress: () => renameList(list) },
      { text: 'Sil', style: 'destructive', onPress: () => deleteList(list) },
      { text: 'İptal', style: 'cancel' },
    ]);
  }, [renameList, deleteList]);

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
            onLongPress={() => handleLongPress(list)}
            delayLongPress={400}
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
