import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

// ─── Demo Data ─────────────────────────────────────────────────────────────────
export type Word = {
  id: string; word: string; tr: string; def: string;
  example: string; exampleTr: string; type: string; mastery: number;
};

export const LIST_DATA: Record<string, { name: string; color: string; bg: string; symbol: string; words: Word[] }> = {
  '1': {
    name: 'B1 Temel Kelimeler', color: Colors.primary, bg: Colors.primaryLight, symbol: 'book.fill',
    words: [
      { id: '1', word: 'Eloquent',    tr: 'Belagatlı',     def: 'Güzel ve etkili konuşma yeteneğine sahip', example: 'She gave an eloquent speech.', exampleTr: 'Belagatlı bir konuşma yaptı.', type: 'adjective', mastery: 3 },
      { id: '2', word: 'Serendipity', tr: 'Güzel tesadüf', def: 'Şans eseri yapılan güzel bir keşif', example: 'Finding that book was pure serendipity.', exampleTr: 'O kitabı bulmak saf bir tesadüftü.', type: 'noun', mastery: 1 },
      { id: '3', word: 'Resilient',   tr: 'Dayanıklı',     def: 'Zorluklardan çabuk toparlanabilen', example: 'Children are remarkably resilient.', exampleTr: 'Çocuklar inanılmaz derecede dayanıklıdır.', type: 'adjective', mastery: 4 },
      { id: '4', word: 'Ephemeral',   tr: 'Geçici',        def: 'Çok kısa süren, geçici olan', example: 'Fame can be ephemeral.', exampleTr: 'Şöhret geçici olabilir.', type: 'adjective', mastery: 2 },
      { id: '5', word: 'Meticulous',  tr: 'Titiz',         def: 'Her detaya özen gösteren', example: 'She is meticulous in her work.', exampleTr: 'İşinde çok titizdir.', type: 'adjective', mastery: 0 },
      { id: '6', word: 'Ambiguous',   tr: 'Belirsiz',      def: 'Birden fazla anlama gelebilen', example: 'The message was ambiguous.', exampleTr: 'Mesaj belirsizdi.', type: 'adjective', mastery: 2 },
      { id: '7', word: 'Diligent',    tr: 'Çalışkan',      def: 'İşine özen ve gayret gösteren', example: 'He is a diligent student.', exampleTr: 'Çalışkan bir öğrencidir.', type: 'adjective', mastery: 4 },
      { id: '8', word: 'Tenacious',   tr: 'Azimli',        def: 'Hedefinden vazgeçmeyen, ısrarcı', example: 'She is tenacious in her goals.', exampleTr: 'Hedeflerinde azimlidir.', type: 'adjective', mastery: 1 },
      { id: '9', word: 'Benevolent',  tr: 'Hayırsever',    def: 'İyilik yapmaktan hoşlanan', example: 'A benevolent donation.', exampleTr: 'Hayırsever bir bağış.', type: 'adjective', mastery: 0 },
      { id: '10', word: 'Candid',     tr: 'Dürüst',        def: 'Açık sözlü, samimi', example: 'Please be candid with me.', exampleTr: 'Lütfen benimle dürüst ol.', type: 'adjective', mastery: 3 },
    ],
  },
  '2': {
    name: 'İş İngilizcesi', color: Colors.green, bg: Colors.greenLight, symbol: 'briefcase.fill',
    words: [
      { id: '1', word: 'Leverage',    tr: 'Kaldıraç etkisi', def: 'Bir avantajı en iyi şekilde kullanmak', example: 'We can leverage our network.', exampleTr: 'Ağımızı kullanabiliriz.', type: 'noun', mastery: 2 },
      { id: '2', word: 'Streamline',  tr: 'Sadeleştirmek',   def: 'Süreci daha verimli hale getirmek', example: 'We need to streamline our process.', exampleTr: 'Sürecimizi sadeleştirmeliyiz.', type: 'verb', mastery: 1 },
      { id: '3', word: 'Synergy',     tr: 'Sinerji',         def: 'İki unsurun birlikte daha güçlü olması', example: 'There is great synergy in this team.', exampleTr: 'Bu ekipte büyük sinerji var.', type: 'noun', mastery: 3 },
      { id: '4', word: 'Delegate',    tr: 'Yetki devretmek', def: 'Görevi başka birine aktarmak', example: 'A good manager knows how to delegate.', exampleTr: 'İyi bir yönetici nasıl yetki devredeceğini bilir.', type: 'verb', mastery: 4 },
      { id: '5', word: 'Milestone',   tr: 'Kilometre taşı',  def: 'Projedeki önemli başarı noktası', example: 'We reached a major milestone.', exampleTr: 'Büyük bir kilometre taşına ulaştık.', type: 'noun', mastery: 2 },
    ],
  },
  '3': {
    name: 'Akademik Kelimeler', color: Colors.purple, bg: Colors.purpleLight, symbol: 'graduationcap.fill',
    words: [
      { id: '1', word: 'Hypothesis',  tr: 'Hipotez',     def: 'Kanıtlanmayı bekleyen önerme', example: 'The hypothesis was confirmed.', exampleTr: 'Hipotez doğrulandı.', type: 'noun', mastery: 3 },
      { id: '2', word: 'Empirical',   tr: 'Ampirik',     def: 'Gözlem ve deneyime dayalı', example: 'Empirical evidence is crucial.', exampleTr: 'Ampirik kanıt çok önemlidir.', type: 'adjective', mastery: 1 },
      { id: '3', word: 'Paradigm',    tr: 'Paradigma',   def: 'Düşünce veya araştırmada temel model', example: 'A paradigm shift in science.', exampleTr: 'Bilimde bir paradigma değişimi.', type: 'noun', mastery: 0 },
      { id: '4', word: 'Synthesis',   tr: 'Sentez',      def: 'Farklı unsurları birleştirme', example: 'A synthesis of ideas.', exampleTr: 'Fikirlerin sentezi.', type: 'noun', mastery: 2 },
    ],
  },
  '4': {
    name: 'Seyahat', color: Colors.accent, bg: Colors.accentLight, symbol: 'airplane',
    words: [
      { id: '1', word: 'Itinerary',     tr: 'Seyahat planı', def: 'Gezi için hazırlanmış detaylı plan', example: 'Check the itinerary.', exampleTr: 'Seyahat planına bak.', type: 'noun', mastery: 2 },
      { id: '2', word: 'Accommodation', tr: 'Konaklama',     def: 'Seyahatte kalınacak yer', example: 'Book your accommodation early.', exampleTr: 'Konaklamayı erken ayırın.', type: 'noun', mastery: 4 },
      { id: '3', word: 'Departure',     tr: 'Kalkış',        def: 'Bir yerden ayrılma, kalkış', example: 'Check the departure time.', exampleTr: 'Kalkış saatini kontrol edin.', type: 'noun', mastery: 3 },
    ],
  },
};

const MASTERY_COLORS = ['#D1D5DB', Colors.accent, '#FBBF24', '#86EFAC', Colors.easy];
const MASTERY_LABELS = ['Yeni', 'Öğreniliyor', 'Tanıdık', 'İyi', 'Öğrenildi'];

function MasteryDots({ level }: { level: number }) {
  return (
    <View style={md.row}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={i}
          style={[md.dot, { backgroundColor: i < level ? MASTERY_COLORS[level] : Colors.borderLight }]}
        />
      ))}
    </View>
  );
}

const md = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function WordListScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const list = LIST_DATA[listId ?? '1'];
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return list?.words ?? [];
    const q = query.toLowerCase();
    return (list?.words ?? []).filter(
      w => w.word.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q)
    );
  }, [query, list]);

  if (!list) return null;

  const mastered  = list.words.filter(w => w.mastery === 4).length;
  const learning  = list.words.filter(w => w.mastery > 0 && w.mastery < 4).length;
  const newWords  = list.words.filter(w => w.mastery === 0).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
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

      {/* Stats strip */}
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

      {/* Search */}
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

      {/* Word List */}
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

      {/* FAB */}
      <TouchableOpacity
        style={[s.fab, { backgroundColor: list.color }]}
        onPress={() => router.push({ pathname: '/words/add' as any, params: { listId } })}
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

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: Colors.textMuted, fontSize: 15 },

  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
});
