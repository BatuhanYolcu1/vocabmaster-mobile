import { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';
import { DEFAULT_LISTS, StudyWord } from '../../data/demoWords';
import { masteryFromSRS, loadSRSMap, SRSCard } from '../../lib/stats';

export type Word = StudyWord & { mastery: number };

const MASTERY_COLORS = ['#D1D5DB', Colors.accent, '#FBBF24', '#86EFAC', Colors.easy];

function MasteryDots({ level }: { level: number }) {
  const lv = Math.min(Math.max(level, 0), 4);
  return (
    <View style={md.row}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={[md.dot, { backgroundColor: i < lv ? MASTERY_COLORS[lv] : Colors.borderLight }]} />
      ))}
    </View>
  );
}

const md = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default function WordListScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const defaultList = DEFAULT_LISTS.find(l => l.id === listId);
  const [query,       setQuery]       = useState('');
  const [customWords, setCustomWords] = useState<Word[]>([]);
  const [customList,  setCustomList]  = useState<{ name: string; color: string; bg: string; symbol: string } | null>(null);
  const [srsMap,      setSrsMap]      = useState<Record<string, SRSCard>>({});

  useFocusEffect(useCallback(() => {
    (async () => {
      const [raw, srs] = await Promise.all([
        AsyncStorage.getItem(`words_${listId}`),
        loadSRSMap(listId ?? ''),
      ]);
      setCustomWords(raw ? JSON.parse(raw) : []);
      setSrsMap(srs);
      if (!defaultList) {
        const listsRaw = await AsyncStorage.getItem('custom_lists');
        const lists = listsRaw ? JSON.parse(listsRaw) : [];
        const found = lists.find((l: any) => l.id === listId);
        if (found) setCustomList({ name: found.name, color: found.color, bg: found.color + '18', symbol: found.symbol });
      }
    })();
  }, [listId, defaultList]));

  // Mastery gerçek SRS verisinden türetilir
  const withMastery = useCallback(
    (ws: StudyWord[]): Word[] => ws.map(w => ({ ...w, mastery: masteryFromSRS(srsMap[w.id]) })),
    [srsMap],
  );

  const list = defaultList
    ? { name: defaultList.name, color: defaultList.color, bg: defaultList.bg, symbol: defaultList.symbol, words: [...withMastery(defaultList.words), ...withMastery(customWords)] }
    : customList
      ? { ...customList, words: withMastery(customWords) }
      : null;

  const filtered = useMemo(() => {
    const all = list?.words ?? [];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(w => w.word.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q));
  }, [query, list]);

  const customWordIds = useMemo(() => new Set(customWords.map(w => w.id)), [customWords]);

  const confirmDelete = (wordId: string, wordName: string) => {
    Alert.alert('Kelimeyi Sil', `"${wordName}" kalıcı olarak silinecek.`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          const updated = customWords.filter(w => w.id !== wordId);
          await AsyncStorage.setItem(`words_${listId}`, JSON.stringify(updated));
          setCustomWords(updated);
        },
      },
    ]);
  };

  const handleLongPress = (item: Word) => {
    if (!customWordIds.has(item.id)) return;
    Alert.alert(item.word, 'Ne yapmak istersiniz?', [
      { text: 'Düzenle', onPress: () => router.push({ pathname: '/words/add' as any, params: { listId, wordId: item.id } }) },
      { text: 'Sil', style: 'destructive', onPress: () => confirmDelete(item.id, item.word) },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  if (!list) return null;

  const mastered = list.words.filter(w => w.mastery === 4).length;
  const learning = list.words.filter(w => w.mastery > 0 && w.mastery < 4).length;
  const newWords = list.words.filter(w => w.mastery === 0).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.title}>{list.name}</Text>
          <Text style={s.subtitle}>{list.words.length} kelime</Text>
        </View>
        <TouchableOpacity
          style={[s.studyBtn, { backgroundColor: list.color }]}
          onPress={() => router.push('/study/select')}
          activeOpacity={0.85}
        >
          <SymbolView name="play.fill" size={13} tintColor="#fff" type="monochrome" />
          <Text style={s.studyBtnText}>Çalış</Text>
        </TouchableOpacity>
      </View>

      <View style={s.statsStrip}>
        {[
          { label: 'Öğrenildi', count: mastered, color: Colors.easy },
          { label: 'Öğreniliyor', count: learning, color: Colors.accent },
          { label: 'Yeni', count: newWords, color: Colors.textMuted },
        ].map((st) => (
          <View key={st.label} style={s.statItem}>
            <Text style={[s.statCount, { color: st.color }]}>{st.count}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.searchWrap}>
        <SymbolView name="magnifyingglass" size={15} tintColor={Colors.textMuted} type="monochrome" style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Kelime ara..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.wordCard}
            onPress={() => router.push({ pathname: '/words/detail' as any, params: { listId, wordId: item.id } })}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={400}
            activeOpacity={0.75}
          >
            <View style={s.wordLeft}>
              <Text style={s.wordEn}>{item.word}</Text>
              <Text style={s.wordTr}>{item.tr}</Text>
            </View>
            <View style={s.wordRight}>
              <View style={[s.typeBadge, { backgroundColor: list.color + '15' }]}>
                <Text style={[s.typeText, { color: list.color }]}>
                  {item.type === 'adjective' ? 'sıfat' : item.type === 'noun' ? 'isim' : item.type === 'verb' ? 'fiil' : item.type}
                </Text>
              </View>
              <MasteryDots level={item.mastery} />
              {customWordIds.has(item.id) && (
                <View style={s.customDot} />
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <SymbolView name="magnifyingglass" size={28} tintColor={Colors.textMuted} type="monochrome" />
            <Text style={s.emptyText}>Sonuç bulunamadı</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[s.fab, { backgroundColor: list.color }]}
        onPress={() => router.push({ pathname: '/words/add' as any, params: { listId } })}
        onLongPress={() => {
          Alert.alert('Kelime Ekle', undefined, [
            { text: 'Tek Kelime', onPress: () => router.push({ pathname: '/words/add' as any, params: { listId } }) },
            { text: 'Toplu Ekle (yapıştır)', onPress: () => router.push({ pathname: '/words/import' as any, params: { listId } }) },
            { text: 'İptal', style: 'cancel' },
          ]);
        }}
        delayLongPress={400}
        activeOpacity={0.88}
      >
        <SymbolView name="plus" size={22} tintColor="#fff" type="monochrome" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  headerText: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  studyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  studyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  statsStrip: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 14, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statCount: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: Colors.bgCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  searchIcon: { width: 16, height: 16 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, padding: 0 },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  separator: { height: 8 },
  wordCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.bgCard, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  wordLeft: { flex: 1, gap: 3 },
  wordEn: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  wordTr: { fontSize: 13, color: Colors.textSecondary },
  wordRight: { alignItems: 'flex-end', gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  customDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: Colors.textMuted, fontSize: 15 },

  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
});
