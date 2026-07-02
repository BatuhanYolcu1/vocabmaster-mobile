import { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';
import { DEFAULT_LISTS, StudyWord } from '../../data/demoWords';
import { masteryFromSRS, loadSRSMap } from '../../lib/stats';

const MASTERY_COLORS = ['#D1D5DB', Colors.accent, '#FBBF24', '#86EFAC', Colors.easy];
const MASTERY_LABELS = ['Yeni', 'Öğreniliyor', 'Tanıdık', 'İyi', 'Öğrenildi'];
const TYPE_LABELS: Record<string, string> = { noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf' };

type ListMeta = { name: string; color: string };

export default function WordDetailScreen() {
  const { listId, wordId } = useLocalSearchParams<{ listId: string; wordId: string }>();
  const [word, setWord] = useState<StudyWord | null>(null);
  const [listMeta, setListMeta] = useState<ListMeta | null>(null);
  const [mastery, setMastery] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    (async () => {
      const def = DEFAULT_LISTS.find(l => l.id === listId);
      let meta: ListMeta | null = def ? { name: def.name, color: def.color } : null;
      let found: StudyWord | undefined = def?.words.find(w => w.id === wordId);

      // Custom kelime veya custom liste — AsyncStorage'dan
      if (!found) {
        const raw = await AsyncStorage.getItem(`words_${listId}`);
        const customWords: StudyWord[] = raw ? JSON.parse(raw) : [];
        found = customWords.find(w => w.id === wordId);
      }
      if (!meta) {
        const listsRaw = await AsyncStorage.getItem('custom_lists');
        const lists = listsRaw ? JSON.parse(listsRaw) : [];
        const foundList = lists.find((l: any) => l.id === listId);
        if (foundList) meta = { name: foundList.name, color: foundList.color || Colors.primary };
      }

      const srsMap = listId ? await loadSRSMap(listId) : {};
      setMastery(found ? masteryFromSRS(srsMap[found.id]) : 0);
      setWord(found ?? null);
      setListMeta(meta ?? { name: '', color: Colors.primary });
      setLoading(false);
    })();
  }, [listId, wordId]));

  if (loading) return <SafeAreaView style={s.safe} />;

  if (!word || !listMeta) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.notFound}>
          <SymbolView name="questionmark.circle" size={32} tintColor={Colors.textMuted} type="monochrome" />
          <Text style={s.notFoundText}>Kelime bulunamadı</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={s.notFoundLink}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const color = listMeta.color;
  const level = Math.min(mastery, 4);
  const masteryColor = MASTERY_COLORS[level];
  const masteryLabel = MASTERY_LABELS[level];

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Kelime Detayı</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Hero Card */}
        <View style={s.heroCard}>
          <View style={[s.heroStrip, { backgroundColor: color }]} />
          <View style={s.heroBody}>
            <View style={s.heroTop}>
              <View style={[s.typePill, { backgroundColor: color + '18' }]}>
                <Text style={[s.typeText, { color }]}>
                  {TYPE_LABELS[word.type] ?? word.type}
                </Text>
              </View>
              <TouchableOpacity
                style={s.listenBtn}
                onPress={() => Speech.speak(word.word, { language: 'en-US', rate: 0.85 })}
                activeOpacity={0.75}
              >
                <SymbolView name="speaker.wave.2.fill" size={14} tintColor={color} type="monochrome" />
                <Text style={[s.listenText, { color }]}>Dinle</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.wordText}>{word.word}</Text>
            <Text style={s.trText}>{word.tr}</Text>
          </View>
        </View>

        {/* Mastery */}
        <View style={s.masteryCard}>
          <View style={s.masteryLeft}>
            <Text style={s.masteryCardLabel}>Ustalık Seviyesi</Text>
            <Text style={[s.masteryLevelText, { color: masteryColor }]}>{masteryLabel}</Text>
          </View>
          <View style={s.masteryDots}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                style={[s.dot, {
                  backgroundColor: i < level ? masteryColor : Colors.borderLight,
                  transform: [{ scale: i < level ? 1 : 0.85 }],
                }]}
              />
            ))}
          </View>
        </View>

        {/* Info Sections */}
        <View style={s.infoCard}>
          {!!word.def && (
            <>
              <View style={s.section}>
                <Text style={[s.sectionLabel, { color }]}>Tanım</Text>
                <Text style={s.sectionText}>{word.def}</Text>
              </View>
              <View style={s.divider} />
            </>
          )}

          {!!word.example && (
            <View style={s.section}>
              <Text style={[s.sectionLabel, { color }]}>Örnek Cümle</Text>
              <View style={s.exampleBox}>
                <Text style={s.exampleEn}>"{word.example}"</Text>
                {!!word.exampleTr && <Text style={s.exampleTr}>{word.exampleTr}</Text>}
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: color }]}
          onPress={() => router.push({ pathname: '/study/flashcard' as any, params: { listId, wordId: word.id } })}
          activeOpacity={0.88}
        >
          <SymbolView name="play.fill" size={14} tintColor="#fff" type="monochrome" />
          <Text style={s.primaryBtnText}>Bu Kelimeyi Çalış</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={s.secondaryBtnText}>Listeye Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 12, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { color: Colors.textMuted, fontSize: 15 },
  notFoundLink: { color: Colors.primary, fontWeight: '700', fontSize: 14 },

  heroCard: { backgroundColor: Colors.bgCard, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  heroStrip: { height: 6 },
  heroBody: { padding: 24, gap: 10 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  typeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSubtle },
  listenText: { fontSize: 13, fontWeight: '600' },
  wordText: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1 },
  trText: { fontSize: 18, color: Colors.textSecondary, fontWeight: '500' },

  masteryCard: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  masteryLeft: { gap: 4 },
  masteryCardLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  masteryLevelText: { fontSize: 18, fontWeight: '800' },
  masteryDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 14, height: 14, borderRadius: 7 },

  infoCard: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 20, gap: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  section: { paddingVertical: 14, gap: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  sectionText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 23 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight },
  exampleBox: { backgroundColor: Colors.bgSubtle, borderRadius: 12, padding: 14, gap: 6 },
  exampleEn: { fontSize: 14, color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 21 },
  exampleTr: { fontSize: 12, color: Colors.textMuted },

  primaryBtn: { borderRadius: 16, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 15, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
