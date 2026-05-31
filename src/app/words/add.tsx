import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const TYPE_OPTIONS = [
  { id: 'noun',      label: 'İsim'  },
  { id: 'verb',      label: 'Fiil'  },
  { id: 'adjective', label: 'Sıfat' },
  { id: 'adverb',    label: 'Zarf'  },
];

export default function AddWordScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();

  const [word,      setWord]      = useState('');
  const [tr,        setTr]        = useState('');
  const [def,       setDef]       = useState('');
  const [example,   setExample]   = useState('');
  const [exampleTr, setExampleTr] = useState('');
  const [type,      setType]      = useState('adjective');
  const [saving,    setSaving]    = useState(false);

  const trRef        = useRef<TextInput>(null);
  const defRef       = useRef<TextInput>(null);
  const exampleRef   = useRef<TextInput>(null);
  const exampleTrRef = useRef<TextInput>(null);

  const isValid  = word.trim().length > 0 && tr.trim().length > 0;
  const btnColor = isValid ? Colors.primary : Colors.borderLight;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const key  = `words_${listId}`;
      const raw  = await AsyncStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const newWord = {
        id:        Date.now().toString(),
        word:      word.trim(),
        tr:        tr.trim(),
        def:       def.trim(),
        example:   example.trim(),
        exampleTr: exampleTr.trim(),
        type,
        mastery:   0,
        createdAt: new Date().toISOString(),
      };
      list.push(newWord);
      await AsyncStorage.setItem(key, JSON.stringify(list));
      router.back();
    } catch {
      Alert.alert('Hata', 'Kelime kaydedilirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={s.safe} edges={['top']}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
          <Text style={s.title}>Yeni Kelime</Text>
          <TouchableOpacity
            style={[s.saveBtn, { backgroundColor: isValid ? Colors.primary : Colors.borderLight }]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={!isValid || saving}
          >
            <Text style={[s.saveBtnText, { color: isValid ? '#fff' : Colors.textMuted }]}>
              {saving ? '...' : 'Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Zorunlu alanlar */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Kelime Bilgileri</Text>

            <Text style={s.label}>İngilizce <Text style={s.required}>*</Text></Text>
            <TextInput
              style={s.input}
              placeholder="örn. Eloquent"
              placeholderTextColor={Colors.textMuted}
              value={word}
              onChangeText={setWord}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => trRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={s.divider} />

            <Text style={[s.label, { marginTop: 12 }]}>Türkçe Karşılık <Text style={s.required}>*</Text></Text>
            <TextInput
              ref={trRef}
              style={s.input}
              placeholder="örn. Belagatlı"
              placeholderTextColor={Colors.textMuted}
              value={tr}
              onChangeText={setTr}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => defRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          {/* Kelime türü */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Kelime Türü</Text>
            <View style={s.typeRow}>
              {TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.typeBtn, type === opt.id && s.typeBtnActive]}
                  onPress={() => setType(opt.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.typeBtnText, type === opt.id && s.typeBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Opsiyonel */}
          <View style={s.card}>
            <View style={s.cardTitleRow}>
              <Text style={s.cardTitle}>Ek Bilgiler</Text>
              <Text style={s.optionalTag}>opsiyonel</Text>
            </View>

            <Text style={s.label}>Tanım</Text>
            <TextInput
              ref={defRef}
              style={[s.input, s.inputMulti]}
              placeholder="Kelimenin Türkçe tanımı..."
              placeholderTextColor={Colors.textMuted}
              value={def}
              onChangeText={setDef}
              multiline
              returnKeyType="next"
              onSubmitEditing={() => exampleRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={s.divider} />

            <Text style={[s.label, { marginTop: 12 }]}>Örnek Cümle (İngilizce)</Text>
            <TextInput
              ref={exampleRef}
              style={[s.input, s.inputMulti]}
              placeholder="She gave an eloquent speech."
              placeholderTextColor={Colors.textMuted}
              value={example}
              onChangeText={setExample}
              multiline
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => exampleTrRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={s.divider} />

            <Text style={[s.label, { marginTop: 12 }]}>Örnek Cümle (Türkçe)</Text>
            <TextInput
              ref={exampleTrRef}
              style={[s.input, s.inputMulti]}
              placeholder="Belagatlı bir konuşma yaptı."
              placeholderTextColor={Colors.textMuted}
              value={exampleTr}
              onChangeText={setExampleTr}
              multiline
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>

          {/* Kaydet butonu */}
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: btnColor }]}
            onPress={handleSave}
            activeOpacity={0.88}
            disabled={!isValid || saving}
          >
            <SymbolView name="checkmark" size={15} tintColor="#fff" type="monochrome" />
            <Text style={s.primaryBtnText}>
              {saving ? 'Kaydediliyor...' : 'Kelimeyi Kaydet'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnText: { fontWeight: '700', fontSize: 14 },

  content: { paddingHorizontal: 20, paddingBottom: 48 },

  card: {
    backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  optionalTag: {
    fontSize: 11, color: Colors.textMuted, fontWeight: '500',
    backgroundColor: Colors.borderLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
  },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  required: { color: Colors.danger },
  input: {
    fontSize: 15, color: Colors.textPrimary,
    paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: Colors.bgSubtle, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top', paddingTop: 12 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight, marginVertical: 14 },

  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeBtn: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12,
    backgroundColor: Colors.bgSubtle, borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  typeBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primarySoft },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.primary, fontWeight: '700' },

  primaryBtn: {
    borderRadius: 16, paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
