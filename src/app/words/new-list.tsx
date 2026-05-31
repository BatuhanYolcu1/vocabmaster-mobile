import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const ICONS = [
  { symbol: 'book.fill',          color: Colors.primary  },
  { symbol: 'briefcase.fill',     color: Colors.green    },
  { symbol: 'graduationcap.fill', color: Colors.purple   },
  { symbol: 'airplane',           color: Colors.accent   },
  { symbol: 'heart.fill',         color: '#EC4899'       },
  { symbol: 'star.fill',          color: '#F59E0B'       },
  { symbol: 'flame.fill',         color: '#EF4444'       },
  { symbol: 'globe',              color: Colors.blue     },
];

export default function NewListScreen() {
  const [name,      setName]      = useState('');
  const [desc,      setDesc]      = useState('');
  const [iconIndex, setIconIndex] = useState(0);
  const [saving,    setSaving]    = useState(false);
  const descRef = useRef<TextInput>(null);

  const selected  = ICONS[iconIndex];
  const isValid   = name.trim().length > 0;
  const btnColor  = isValid ? selected.color : Colors.borderLight;

  const handleCreate = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const raw   = await AsyncStorage.getItem('custom_lists');
      const lists = raw ? JSON.parse(raw) : [];
      const newList = {
        id:        Date.now().toString(),
        name:      name.trim(),
        desc:      desc.trim(),
        iconIndex,
        symbol:    selected.symbol,
        color:     selected.color,
        count:     0,
        createdAt: new Date().toISOString(),
      };
      lists.push(newList);
      await AsyncStorage.setItem('custom_lists', JSON.stringify(lists));
      router.back();
    } catch {
      Alert.alert('Hata', 'Liste oluşturulurken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={s.safe} edges={['top']}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <SymbolView name="xmark" size={15} tintColor={Colors.textSecondary} type="monochrome" />
          </TouchableOpacity>
          <Text style={s.title}>Yeni Liste</Text>
          <TouchableOpacity
            style={[s.saveBtn, { backgroundColor: isValid ? Colors.primary : Colors.borderLight }]}
            onPress={handleCreate}
            activeOpacity={0.85}
            disabled={!isValid || saving}
          >
            <Text style={[s.saveBtnText, { color: isValid ? '#fff' : Colors.textMuted }]}>
              {saving ? '...' : 'Oluştur'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {/* Preview */}
          <View style={[s.preview, { borderColor: selected.color + '40' }]}>
            <View style={[s.previewIcon, { backgroundColor: selected.color + '18' }]}>
              <SymbolView name={selected.symbol as any} size={28} tintColor={selected.color} type="monochrome" />
            </View>
            <View style={s.previewText}>
              <Text style={[s.previewName, !name && s.previewPlaceholder]} numberOfLines={1}>
                {name.trim() || 'Liste adı'}
              </Text>
              <Text style={s.previewDesc} numberOfLines={1}>
                {desc.trim() || 'Açıklama...'}
              </Text>
            </View>
          </View>

          {/* İkon seç */}
          <View style={s.card}>
            <Text style={s.cardLabel}>İkon ve Renk</Text>
            <View style={s.iconGrid}>
              {ICONS.map((icon, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    s.iconBtn,
                    i === iconIndex && { backgroundColor: icon.color + '18', borderColor: icon.color + '60' },
                  ]}
                  onPress={() => setIconIndex(i)}
                  activeOpacity={0.75}
                >
                  <SymbolView
                    name={icon.symbol as any}
                    size={22}
                    tintColor={i === iconIndex ? icon.color : Colors.textMuted}
                    type="monochrome"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Liste Bilgileri */}
          <View style={s.card}>
            <Text style={s.cardLabel}>Liste Bilgileri</Text>

            <Text style={s.fieldLabel}>
              Liste Adı <Text style={{ color: Colors.danger }}>*</Text>
            </Text>
            <TextInput
              style={s.input}
              placeholder="örn. IELTS Kelimeleri"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => descRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={s.divider} />

            <Text style={[s.fieldLabel, { marginTop: 12 }]}>Açıklama</Text>
            <TextInput
              ref={descRef}
              style={s.input}
              placeholder="Kısa bir açıklama..."
              placeholderTextColor={Colors.textMuted}
              value={desc}
              onChangeText={setDesc}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
          </View>

          {/* Oluştur Butonu */}
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: btnColor }]}
            onPress={handleCreate}
            activeOpacity={0.88}
            disabled={!isValid || saving}
          >
            <SymbolView name="plus" size={16} tintColor="#fff" type="monochrome" />
            <Text style={s.primaryBtnText}>
              {saving ? 'Oluşturuluyor...' : 'Listeyi Oluştur'}
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

  preview: {
    backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  previewIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  previewText: { flex: 1 },
  previewName: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  previewPlaceholder: { color: Colors.textMuted },
  previewDesc: { fontSize: 13, color: Colors.textSecondary },

  card: {
    backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconBtn: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.bgSubtle, borderWidth: 1.5, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },

  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  input: {
    fontSize: 15, color: Colors.textPrimary,
    paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: Colors.bgSubtle, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight, marginVertical: 14 },

  primaryBtn: {
    borderRadius: 16, paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
