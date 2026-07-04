import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const BACKUP_MARKER = 'vocabmaster_backup_v1';

export default function BackupScreen() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      const data: Record<string, string> = {};
      for (const [k, v] of pairs) if (v !== null) data[k] = v;
      const backup = JSON.stringify({ marker: BACKUP_MARKER, exportedAt: new Date().toISOString(), data });
      await Clipboard.setStringAsync(backup);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLastAction(`Yedek panoya kopyalandı (${keys.length} kayıt). Notlar gibi güvenli bir yere yapıştır.`);
    } catch {
      Alert.alert('Hata', 'Yedek oluşturulamadı.');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (importing) return;
    setImporting(true);
    try {
      const text = await Clipboard.getStringAsync();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        Alert.alert('Geçersiz Yedek', 'Panoda geçerli bir VocabMaster yedeği bulunamadı. Önce yedek metnini kopyala.');
        return;
      }
      if (parsed?.marker !== BACKUP_MARKER || typeof parsed?.data !== 'object') {
        Alert.alert('Geçersiz Yedek', 'Panodaki metin bir VocabMaster yedeği değil.');
        return;
      }
      const entries = Object.entries(parsed.data as Record<string, string>);
      Alert.alert(
        'Yedeği Geri Yükle',
        `${entries.length} kayıt geri yüklenecek ve mevcut veriler üzerine yazılacak. Devam edilsin mi?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Geri Yükle', style: 'destructive',
            onPress: async () => {
              await AsyncStorage.multiSet(entries as [string, string][]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setLastAction(`${entries.length} kayıt geri yüklendi. Uygulama verileri güncellendi.`);
            },
          },
        ],
      );
    } catch {
      Alert.alert('Hata', 'Geri yükleme başarısız oldu.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
        </TouchableOpacity>
        <Text style={s.title}>Yedekleme</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.infoCard}>
          <SymbolView name="externaldrive.fill.badge.icloud" size={22} tintColor={Colors.primary} type="monochrome" />
          <Text style={s.infoText}>
            Tüm verilerin (kelimeler, listeler, XP, seri, istatistikler) yalnızca bu cihazda saklanır.
            Uygulamayı silersen veriler kaybolur — düzenli yedek almanı öneririz.
          </Text>
        </View>

        <TouchableOpacity style={s.actionCard} onPress={handleExport} activeOpacity={0.8}>
          <View style={[s.actionIcon, { backgroundColor: Colors.primaryLight }]}>
            <SymbolView name="square.and.arrow.up" size={20} tintColor={Colors.primary} type="monochrome" />
          </View>
          <View style={s.actionInfo}>
            <Text style={s.actionTitle}>{exporting ? 'Hazırlanıyor…' : 'Yedeği Panoya Kopyala'}</Text>
            <Text style={s.actionDesc}>Tüm verilerini tek bir metin olarak dışa aktar. Notlar'a veya bir mesaja yapıştırarak sakla.</Text>
          </View>
          <SymbolView name="chevron.right" size={13} tintColor={Colors.textMuted} type="monochrome" />
        </TouchableOpacity>

        <TouchableOpacity style={s.actionCard} onPress={handleImport} activeOpacity={0.8}>
          <View style={[s.actionIcon, { backgroundColor: Colors.greenLight }]}>
            <SymbolView name="square.and.arrow.down" size={20} tintColor={Colors.green} type="monochrome" />
          </View>
          <View style={s.actionInfo}>
            <Text style={s.actionTitle}>{importing ? 'Kontrol ediliyor…' : 'Panodan Geri Yükle'}</Text>
            <Text style={s.actionDesc}>Daha önce kopyaladığın yedek metnini panoya al, sonra buna dokun.</Text>
          </View>
          <SymbolView name="chevron.right" size={13} tintColor={Colors.textMuted} type="monochrome" />
        </TouchableOpacity>

        {!!lastAction && (
          <View style={s.resultCard}>
            <SymbolView name="checkmark.circle.fill" size={16} tintColor={Colors.easy} type="monochrome" />
            <Text style={s.resultText}>{lastAction}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },

  content: { padding: 20, gap: 12, paddingBottom: 48 },

  infoCard: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.primarySoft },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  actionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  actionDesc: { fontSize: 11, color: Colors.textMuted, marginTop: 3, lineHeight: 15 },

  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.easyBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.easy + '40' },
  resultText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
});
