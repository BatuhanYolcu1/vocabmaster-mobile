import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const STORAGE_KEY_ENABLED = 'notif_enabled';
const STORAGE_KEY_HOUR    = 'notif_hour';
const STORAGE_KEY_MINUTE  = 'notif_minute';

const TIME_PRESETS = [
  { label: '08:00', hour: 8,  minute: 0,  desc: 'Sabah'    },
  { label: '12:00', hour: 12, minute: 0,  desc: 'Öğle'     },
  { label: '18:00', hour: 18, minute: 0,  desc: 'Akşamüstü' },
  { label: '20:00', hour: 20, minute: 0,  desc: 'Akşam'    },
  { label: '22:00', hour: 22, minute: 0,  desc: 'Gece'     },
];

const NOTIF_MESSAGES = [
  { title: 'Kelime Vakti!',         body: 'Bugünlük hedefinle bir adım daha yaklaş.' },
  { title: 'Hazır mısın?',          body: 'Birkaç dakika çalışmak büyük fark yaratır.' },
  { title: 'Serini koru!',          body: 'Bugün de çalış, serini devam ettir.' },
  { title: 'Günlük doz zamanı',     body: 'Yeni kelimeler seni bekliyor.' },
];

async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function scheduleDaily(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const msg = NOTIF_MESSAGES[Math.floor(Math.random() * NOTIF_MESSAGES.length)];
  await Notifications.scheduleNotificationAsync({
    content: { title: msg.title, body: msg.body, sound: true },
    trigger:  { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export default function NotificationsScreen() {
  const [enabled,    setEnabled]    = useState(false);
  const [hour,       setHour]       = useState(20);
  const [minute,     setMinute]     = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [scheduled,  setScheduled]  = useState<Notifications.NotificationRequest[]>([]);

  useEffect(() => {
    (async () => {
      const [en, h, m] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_ENABLED),
        AsyncStorage.getItem(STORAGE_KEY_HOUR),
        AsyncStorage.getItem(STORAGE_KEY_MINUTE),
      ]);
      setEnabled(en === 'true');
      if (h) setHour(parseInt(h));
      if (m) setMinute(parseInt(m));
      const list = await Notifications.getAllScheduledNotificationsAsync();
      setScheduled(list);
      setLoading(false);
    })();
  }, []);

  const handleToggle = async (val: boolean) => {
    if (val) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'İzin Gerekli',
          'Bildirimler için uygulama ayarlarından izin vermen gerekiyor.',
          [{ text: 'Tamam' }],
        );
        return;
      }
      await scheduleDaily(hour, minute);
      await AsyncStorage.setItem(STORAGE_KEY_ENABLED, 'true');
      const list = await Notifications.getAllScheduledNotificationsAsync();
      setScheduled(list);
    } else {
      await cancelAll();
      await AsyncStorage.setItem(STORAGE_KEY_ENABLED, 'false');
      setScheduled([]);
    }
    setEnabled(val);
  };

  const handleTimeSelect = async (h: number, m: number) => {
    setHour(h);
    setMinute(m);
    await AsyncStorage.setItem(STORAGE_KEY_HOUR,   String(h));
    await AsyncStorage.setItem(STORAGE_KEY_MINUTE, String(m));
    if (enabled) {
      await scheduleDaily(h, m);
      const list = await Notifications.getAllScheduledNotificationsAsync();
      setScheduled(list);
    }
  };

  const sendTest = async () => {
    const granted = await requestPermission();
    if (!granted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Kelime Vakti!', body: 'Test bildirimi — çalışıyor!', sound: true },
      trigger:  null,
    });
  };

  if (loading) return <SafeAreaView style={s.safe} />;

  const selectedPreset = TIME_PRESETS.find(p => p.hour === hour && p.minute === minute);
  const timeLabel = selectedPreset?.label ?? `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
        </TouchableOpacity>
        <Text style={s.title}>Bildirimler</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Ana toggle */}
        <View style={s.card}>
          <View style={s.toggleRow}>
            <View style={s.toggleLeft}>
              <View style={[s.iconBox, { backgroundColor: Colors.primaryLight }]}>
                <SymbolView name="bell.fill" size={18} tintColor={Colors.primary} type="monochrome" />
              </View>
              <View>
                <Text style={s.toggleTitle}>Günlük Hatırlatıcı</Text>
                <Text style={s.toggleSub}>Her gün belirtilen saatte bildirim</Text>
              </View>
            </View>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: Colors.borderLight, true: Colors.primarySoft }}
              thumbColor={enabled ? Colors.primary : '#fff'}
            />
          </View>

          {enabled && (
            <View style={s.activeInfo}>
              <SymbolView name="checkmark.circle.fill" size={14} tintColor={Colors.easy} type="monochrome" />
              <Text style={s.activeText}>
                Her gün <Text style={s.activeTime}>{timeLabel}</Text>'de bildirim alacaksın
              </Text>
            </View>
          )}
        </View>

        {/* Saat seçimi */}
        <View style={[s.card, !enabled && s.cardDisabled]}>
          <Text style={s.cardTitle}>Hatırlatıcı Saati</Text>
          <View style={s.timeGrid}>
            {TIME_PRESETS.map((preset) => {
              const isSelected = preset.hour === hour && preset.minute === minute;
              return (
                <TouchableOpacity
                  key={preset.label}
                  style={[s.timeBtn, isSelected && s.timeBtnActive]}
                  onPress={() => handleTimeSelect(preset.hour, preset.minute)}
                  activeOpacity={0.75}
                  disabled={!enabled}
                >
                  <Text style={[s.timeBtnLabel, isSelected && s.timeBtnLabelActive]}>
                    {preset.label}
                  </Text>
                  <Text style={[s.timeBtnDesc, isSelected && s.timeBtnDescActive]}>
                    {preset.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bildirim önizleme */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Örnek Bildirim</Text>
          <View style={s.previewBox}>
            <View style={s.previewHeader}>
              <View style={[s.previewAppIcon, { backgroundColor: Colors.primaryLight }]}>
                <SymbolView name="books.vertical.fill" size={12} tintColor={Colors.primary} type="monochrome" />
              </View>
              <Text style={s.previewAppName}>VocabMaster</Text>
              <Text style={s.previewTime}>şimdi</Text>
            </View>
            <Text style={s.previewTitle}>Kelime Vakti!</Text>
            <Text style={s.previewBody}>Bugünlük hedefinle bir adım daha yaklaş.</Text>
          </View>
        </View>

        {/* Test bildirimi */}
        <TouchableOpacity style={s.testBtn} onPress={sendTest} activeOpacity={0.85}>
          <SymbolView name="bell.badge.fill" size={16} tintColor={Colors.primary} type="monochrome" />
          <Text style={s.testBtnText}>Test Bildirimi Gönder</Text>
        </TouchableOpacity>

        {/* Aktif bildirim sayısı */}
        {scheduled.length > 0 && (
          <Text style={s.scheduledInfo}>
            {scheduled.length} aktif zamanlanmış bildirim
          </Text>
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

  content: { padding: 20, gap: 14, paddingBottom: 48 },

  card: { backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardDisabled: { opacity: 0.5 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  toggleSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  activeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.greenLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  activeText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  activeTime: { fontWeight: '700', color: Colors.textPrimary },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: { flex: 1, minWidth: '28%', backgroundColor: Colors.bgSubtle, borderRadius: 14, paddingVertical: 12, alignItems: 'center', gap: 3, borderWidth: 1.5, borderColor: Colors.borderLight },
  timeBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primarySoft },
  timeBtnLabel: { fontSize: 16, fontWeight: '800', color: Colors.textSecondary },
  timeBtnLabelActive: { color: Colors.primary },
  timeBtnDesc: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  timeBtnDescActive: { color: Colors.primary },

  previewBox: { backgroundColor: Colors.bgSubtle, borderRadius: 14, padding: 14, gap: 4, borderWidth: 1, borderColor: Colors.borderLight },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  previewAppIcon: { width: 20, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  previewAppName: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, flex: 1 },
  previewTime: { fontSize: 11, color: Colors.textMuted },
  previewTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  previewBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  testBtn: { backgroundColor: Colors.bgCard, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: Colors.primarySoft },
  testBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },

  scheduledInfo: { textAlign: 'center', fontSize: 12, color: Colors.textMuted },
});
