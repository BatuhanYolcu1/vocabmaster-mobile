import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

type ParsedWord = { word: string; tr: string };

// Desteklenen ayraçlar: " - ", " – ", ":", tab
function parseLines(text: string): ParsedWord[] {
  const out: ParsedWord[] = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    let parts: string[] = [];
    if (line.includes('\t')) parts = line.split('\t');
    else if (line.includes(' - ')) parts = line.split(' - ');
    else if (line.includes(' – ')) parts = line.split(' – ');
    else if (line.includes(':')) parts = line.split(':');
    if (parts.length < 2) continue;
    const word = parts[0].trim();
    const tr = parts.slice(1).join(' ').trim();
    if (word && tr) out.push({ word, tr });
  }
  return out;
}

export default function ImportScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(() => parseLines(text), [text]);

  const handleImport = async () => {
    if (parsed.length === 0 || saving) return;
    setSaving(true);
    try {
      const key = `words_${listId}`;
      const raw = await AsyncStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      parsed.forEach((p, i) => {
        list.push({
          id: (now + i).toString(),
          word: p.word,
          tr: p.tr,
          def: '', example: '', exampleTr: '',
          type: 'noun', mastery: 0,
          createdAt: new Date().toISOString(),
        });
      });
      await AsyncStorage.setItem(key, JSON.stringify(list));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Hata', 'Kelimeler kaydedilirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
          <Text style={s.title}>Toplu Kelime Ekle</Text>
          <TouchableOpacity
            style={[s.saveBtn, { backgroundColor: parsed.length > 0 ? Colors.primary : Colors.borderLight }]}
            onPress={handleImport}
            disabled={parsed.length === 0 || saving}
            activeOpacity={0.85}
          >
            <Text style={[s.saveBtnText, { color: parsed.length > 0 ? '#fff' : Colors.textMuted }]}>
              {saving ? '...' : 'Ekle'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.infoCard}>
            <SymbolView name="info.circle.fill" size={16} tintColor={Colors.primary} type="monochrome" />
            <Text style={s.infoText}>
              Her satıra bir kelime yaz veya yapıştır. Kelime ile anlamı arasına tire, iki nokta veya sekme koy:{'\n'}
              <Text style={s.infoExample}>apple - elma{'\n'}book: kitap</Text>
            </Text>
          </View>

          <TextInput
            style={s.input}
            placeholder={'apple - elma\nbook - kitap\nhouse - ev'}
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            autoCorrect={false}
            autoCapitalize="none"
            textAlignVertical="top"
          />

          <View style={[s.previewBadge, parsed.length > 0 && s.previewBadgeActive]}>
            <SymbolView
              name={parsed.length > 0 ? 'checkmark.circle.fill' : 'doc.text'}
              size={15}
              tintColor={parsed.length > 0 ? Colors.easy : Colors.textMuted}
              type="monochrome"
            />
            <Text style={[s.previewText, parsed.length > 0 && { color: Colors.easy }]}>
              {parsed.length > 0 ? `${parsed.length} kelime bulundu` : 'Henüz kelime algılanmadı'}
            </Text>
          </View>

          {parsed.slice(0, 5).map((p, i) => (
            <View key={i} style={s.previewRow}>
              <Text style={s.previewWord}>{p.word}</Text>
              <SymbolView name="arrow.right" size={11} tintColor={Colors.textMuted} type="monochrome" />
              <Text style={s.previewTr}>{p.tr}</Text>
            </View>
          ))}
          {parsed.length > 5 && (
            <Text style={s.moreText}>+ {parsed.length - 5} kelime daha</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnText: { fontWeight: '700', fontSize: 14 },

  content: { paddingHorizontal: 20, paddingBottom: 48, gap: 12 },

  infoCard: { flexDirection: 'row', gap: 10, backgroundColor: Colors.primaryLight, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.primarySoft },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  infoExample: { fontWeight: '700', color: Colors.primary },

  input: {
    minHeight: 180, fontSize: 15, color: Colors.textPrimary, lineHeight: 24,
    backgroundColor: Colors.bgCard, borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: Colors.border,
  },

  previewBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  previewBadgeActive: {},
  previewText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },

  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgCard, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  previewWord: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  previewTr: { fontSize: 14, color: Colors.textSecondary },
  moreText: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
});
