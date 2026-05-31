import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const LISTS = [
  { id: '1', name: 'B1 Temel Kelimeler', count: 50, color: Colors.primary, symbol: 'book.fill' },
  { id: '2', name: 'İş İngilizcesi', count: 30, color: Colors.green, symbol: 'briefcase.fill' },
  { id: '3', name: 'Akademik Kelimeler', count: 45, color: Colors.purple, symbol: 'graduationcap.fill' },
];

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
    desc: 'Söyle ve kontrol et',
    symbol: 'mic.fill',
    color: '#EC4899',
    bg: '#FDF2F8',
    free: true,
  },
];

export default function StudySelectScreen() {
  const [step, setStep] = useState<'list' | 'mode'>('list');
  const [selectedList, setSelectedList] = useState<string | null>(null);

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
            <Text style={s.sectionLabel}>Hangi listeden çalışacaksın?</Text>
            {LISTS.map((list) => (
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
