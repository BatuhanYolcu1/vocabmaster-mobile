import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';
import { DEFAULT_LISTS } from '../../data/demoWords';
import { countDueWords } from '../../lib/stats';

type ListItem = { id: string; name: string; count: number; color: string; symbol: string };

const MODES = [
  {
    id: 'flashcard',
    name: 'Flashcard',
    desc: 'Çevir, düşün, hatırla',
    symbol: 'rectangle.on.rectangle.fill',
    color: Colors.primary,
    bg: Colors.primaryLight,
    free: true,
  },
  {
    id: 'quiz',
    name: 'Quiz',
    desc: '4 seçenek, 1 doğru cevap',
    symbol: 'checkmark.circle.fill',
    color: Colors.green,
    bg: Colors.greenLight,
    free: true,
  },
  {
    id: 'typing',
    name: 'Yazarak Öğren',
    desc: 'Yazarak kalıcı öğren',
    symbol: 'keyboard.fill',
    color: Colors.purple,
    bg: Colors.purpleLight,
    free: true,
  },
  {
    id: 'speaking',
    name: 'Konuşma',
    desc: 'Sesli söyle, kendini değerlendir',
    symbol: 'mic.fill',
    color: '#EC4899',
    bg: '#FDF2F8',
    free: true,
  },
];

export default function StudySelectScreen() {
  const [step, setStep] = useState<'list' | 'mode'>('list');
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [dueCount, setDueCount] = useState(0);

  useFocusEffect(useCallback(() => {
    setStep('list');
    setSelectedList(null);
    async function loadLists() {
      const defaults: ListItem[] = DEFAULT_LISTS.map(l => ({
        id: l.id, name: l.name, count: l.words.length, color: l.color, symbol: l.symbol,
      }));
      const raw = await AsyncStorage.getItem('custom_lists');
      const custom: { id: string; name: string; icon?: string; color?: string }[] = raw ? JSON.parse(raw) : [];
      const customItems: ListItem[] = await Promise.all(
        custom.map(async c => {
          const wordsRaw = await AsyncStorage.getItem(`words_${c.id}`);
          const count = wordsRaw ? (JSON.parse(wordsRaw) as unknown[]).length : 0;
          return { id: c.id, name: c.name, count, color: c.color || Colors.primary, symbol: c.icon || 'list.bullet' };
        })
      );
      setLists([...defaults, ...customItems]);
      setDueCount(await countDueWords());
    }
    loadLists();
  }, []));

  const goBack = () => {
    if (step === 'mode') { setStep('list'); return; }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView
            name={step === 'mode' ? 'chevron.left' : 'xmark'}
            size={16}
            tintColor={Colors.primary}
            type="monochrome"
          />
          <Text style={s.backText}>{step === 'mode' ? 'Geri' : 'Kapat'}</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{step === 'list' ? 'Liste Seç' : 'Mod Seç'}</Text>
        <View style={{ width: 72 }} />
      </View>

      {/* Step indicator */}
      <View style={s.steps}>
        <View style={[s.step, step === 'list' && s.stepActive]}>
          <Text style={[s.stepNum, step === 'list' && s.stepNumActive]}>1</Text>
        </View>
        <View style={s.stepLine} />
        <View style={[s.step, step === 'mode' && s.stepActive]}>
          <Text style={[s.stepNum, step === 'mode' && s.stepNumActive]}>2</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {step === 'list' ? (
          <>
            {dueCount > 0 && (
              <TouchableOpacity
                style={s.dueCard}
                onPress={() => { setSelectedList('_due'); setStep('mode'); }}
                activeOpacity={0.85}
              >
                <View style={s.dueIcon}>
                  <SymbolView name="clock.arrow.circlepath" size={20} tintColor={Colors.warning} type="monochrome" />
                </View>
                <View style={s.listInfo}>
                  <Text style={s.dueName}>Tekrar Bekleyenler</Text>
                  <Text style={s.dueCountText}>{dueCount} kelime tekrar zamanı geldi</Text>
                </View>
                <SymbolView name="chevron.right" size={14} tintColor={Colors.warning} type="monochrome" />
              </TouchableOpacity>
            )}
            <Text style={s.sectionLabel}>Hangi listeden çalışacaksın?</Text>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={s.listCard}
                onPress={() => { setSelectedList(list.id); setStep('mode'); }}
                activeOpacity={0.8}
              >
                <View style={[s.listIcon, { backgroundColor: list.color + '15' }]}>
                  <SymbolView name={list.symbol as any} size={20} tintColor={list.color} type="monochrome" />
                </View>
                <View style={s.listInfo}>
                  <Text style={s.listName}>{list.name}</Text>
                  <Text style={s.listCount}>{list.count} kelime</Text>
                </View>
                <SymbolView name="chevron.right" size={14} tintColor={Colors.textMuted} type="monochrome" />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <Text style={s.sectionLabel}>Nasıl çalışmak istiyorsun?</Text>
            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={s.modeCard}
                onPress={() => {
                  const dest = mode.id === 'quiz'     ? '/study/quiz'
                            : mode.id === 'typing'   ? '/study/typing'
                            : mode.id === 'speaking' ? '/study/speaking'
                            : '/study/flashcard';
                  router.push({ pathname: dest as any, params: { listId: selectedList } });
                }}
                activeOpacity={0.8}
              >
                <View style={[s.modeIconBox, { backgroundColor: mode.bg }]}>
                  <SymbolView name={mode.symbol as any} size={22} tintColor={mode.color} type="monochrome" />
                </View>
                <View style={s.modeInfo}>
                  <Text style={s.modeName}>{mode.name}</Text>
                  <Text style={s.modeDesc}>{mode.desc}</Text>
                </View>
                <SymbolView name="chevron.right" size={14} tintColor={Colors.textMuted} type="monochrome" />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 72 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },

  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingHorizontal: 80,
    marginBottom: 8,
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: { backgroundColor: Colors.primary },
  stepNum: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  stepNumActive: { color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.borderLight, marginHorizontal: 6 },

  content: { padding: 20, gap: 10, paddingBottom: 40 },
  sectionLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 4 },

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  dueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.warningLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.warning + '50',
    marginBottom: 6,
  },
  dueIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '800', marginBottom: 3 },
  dueCountText: { color: Colors.warning, fontSize: 12, fontWeight: '600' },
  listIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: { flex: 1 },
  listName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  listCount: { color: Colors.textMuted, fontSize: 12 },

  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  modeCardLocked: { opacity: 0.6 },
  modeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeInfo: { flex: 1 },
  modeName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  modeNameLocked: { color: Colors.textSecondary },
  modeDesc: { color: Colors.textMuted, fontSize: 12 },
  proBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accentSoft,
  },
  proText: { color: Colors.accent, fontSize: 11, fontWeight: '700' },
});
