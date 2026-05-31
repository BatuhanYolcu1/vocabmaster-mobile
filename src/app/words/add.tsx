import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
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

  const isValid  = word.trim().length > 0 && tr.trim().length > 0;
  const btnColor = isValid ? Colors.primary : Colors.borderLight;

  const handleSave = () => {
    if (!isValid) return;
    // TODO: gerçek kayıt (store/API)
    router.back();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
          <Text style={s.title}>Yeni Kelime</Text>
          <TouchableOpacity
            style={[s.saveBtn, !isValid && s.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={!isValid}
          >
            <Text style={[s.saveBtnText, !isValid && s.saveBtnTextDisabled]}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Zorunlu alanlar */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Kelime Bilgileri</Text>

            <View style={s.field}>
              <Text style={s.label}>İngilizce <Text style={s.required}>*</Text></Text>
              <TextInput
                style={[s.input, word.length > 0 && s.inputFilled]}
                placeholder="örn. Eloquent"
                placeholderTextColor={Colors.textMuted}
                value={word}
                onChangeText={setWord}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={s.divider} />

            <View style={s.field}>
              <Text style={s.label}>Türkçe Karşılık <Text style={s.required}>*</Text></Text>
              <TextInput
                style={[s.input, tr.length > 0 && s.inputFilled]}
                placeholder="örn. Belagatlı"
                placeholderTextColor={Colors.textMuted}
                value={tr}
                onChangeText={setTr}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
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

            <View style={s.field}>
              <Text style={s.label}>Tanım</Text>
              <TextInput
                style={[s.input, s.inputMulti, def.length > 0 && s.inputFilled]}
                placeholder="Kelimenin Türkçe tanımı..."
                placeholderTextColor={Colors.textMuted}
                value={def}
                onChangeText={setDef}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={s.divider} />

            <View style={s.field}>
              <Text style={s.label}>Örnek Cümle (İngilizce)</Text>
              <TextInput
                style={[s.input, s.inputMulti, example.length > 0 && s.inputFilled]}
                placeholder="She gave an eloquent speech."
                placeholderTextColor={Colors.textMuted}
                value={example}
                onChangeText={setExample}
                multiline
                numberOfLines={2}
                autoCorrect={false}
              />
            </View>

            <View style={s.divider} />

            <View style={s.field}>
              <Text style={s.label}>Örnek Cümle (Türkçe)</Text>
              <TextInput
                style={[s.input, s.inputMulti, exampleTr.length > 0 && s.inputFilled]}
                placeholder="Belagatlı bir konuşma yaptı."
                placeholderTextColor={Colors.textMuted}
                value={exampleTr}
                onChangeText={setExampleTr}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: btnColor }]}
            onPress={handleSave}
            activeOpacity={0.88}
            disabled={!isValid}
          >
            <SymbolView name="checkmark" size={15} tintColor="#fff" type="monochrome" />
            <Text style={s.primaryBtnText}>Kelimeyi Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  saveBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnDisabled: { backgroundColor: Colors.borderLight },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  saveBtnTextDisabled: { color: Colors.textMuted },

  content: { padding: 20, gap: 14, paddingBottom: 48 },

  card: { backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18, gap: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  optionalTag: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', backgroundColor: Colors.borderLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },

  field: { gap: 7, paddingVertical: 12 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  required: { color: Colors.danger },
  input: { fontSize: 15, color: Colors.textPrimary, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: Colors.bgSubtle, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.borderLight },
  inputFilled: { borderColor: Colors.primarySoft, backgroundColor: Colors.primaryLight + '50' },
  inputMulti: { height: 70, textAlignVertical: 'top', paddingTop: 10 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight },

  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.bgSubtle, borderWidth: 1.5, borderColor: Colors.borderLight },
  typeBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primarySoft },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.primary, fontWeight: '700' },

  primaryBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5 },
  primaryBtnDisabled: { backgroundColor: Colors.borderLight, shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
