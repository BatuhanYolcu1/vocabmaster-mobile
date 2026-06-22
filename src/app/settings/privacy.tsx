import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const SECTIONS = [
  {
    title: 'Toplanan Veriler',
    icon: 'list.bullet.clipboard.fill',
    color: Colors.primary,
    body: 'VocabMaster yalnızca uygulamanın çalışması için gereken verileri toplar:\n\n• Kullanıcı adı (isteğe bağlı)\n• Günlük hedef tercihi\n• Çalışma geçmişi ve XP puanları\n• Bildirim tercihleri',
  },
  {
    title: 'Verilerin Saklanması',
    icon: 'iphone',
    color: Colors.green,
    body: 'Tüm veriler yalnızca cihazınızda saklanır. Hiçbir veri harici sunuculara gönderilmez. Uygulamamız çevrimdışı çalışır; internet bağlantısı gerektirmez.',
  },
  {
    title: 'Mikrofon Kullanımı',
    icon: 'mic.fill',
    color: '#EC4899',
    body: '"Konuşma" çalışma modunda telaffuz pratiği yapmak için mikrofon erişimi istenebilir. Ses kayıtları cihazınızda işlenir ve kesinlikle dışarıya gönderilmez.',
  },
  {
    title: 'Bildirimler',
    icon: 'bell.fill',
    color: Colors.accent,
    body: 'Günlük hatırlatıcı bildirimleri gönderebilmek için bildirim izni istenebilir. Ayarlar ekranından istediğiniz zaman devre dışı bırakabilirsiniz.',
  },
  {
    title: 'Verilerinizi Silme',
    icon: 'trash.fill',
    color: Colors.danger,
    body: 'Tüm uygulama verilerini silmek için:\n\n1. Profil → Çıkış Yap\n2. Cihaz Ayarları → VocabMaster → Depolama → Temizle\n\nYa da uygulamayı kaldırarak tüm verileri kalıcı olarak silebilirsiniz.',
  },
  {
    title: 'İletişim',
    icon: 'envelope.fill',
    color: Colors.blue,
    body: 'Gizlilik ile ilgili sorularınız için:\nvocabmaster@bthnylc.com\n\nGüncellemeler bu ekranda yayımlanacaktır.',
  },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
          <Text style={s.backText}>Geri</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Gizlilik Politikası</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.intro}>
          <View style={s.introIcon}>
            <SymbolView name="lock.shield.fill" size={32} tintColor={Colors.primary} type="monochrome" />
          </View>
          <Text style={s.introTitle}>Gizliliğiniz Önceliğimiz</Text>
          <Text style={s.introSub}>VocabMaster, verilerinize saygı gösterir. Hiçbir kişisel veri reklam amaçlı kullanılmaz veya üçüncü taraflarla paylaşılmaz.</Text>
        </View>

        {SECTIONS.map((sec, i) => (
          <View key={i} style={s.section}>
            <View style={s.secHeader}>
              <View style={[s.secIcon, { backgroundColor: sec.color + '15' }]}>
                <SymbolView name={sec.icon as any} size={16} tintColor={sec.color} type="monochrome" />
              </View>
              <Text style={s.secTitle}>{sec.title}</Text>
            </View>
            <Text style={s.secBody}>{sec.body}</Text>
          </View>
        ))}

        <Text style={s.updated}>Son güncelleme: Haziran 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 72 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  intro: { alignItems: 'center', gap: 10, backgroundColor: Colors.primaryLight, borderRadius: 20, padding: 24, marginBottom: 4 },
  introIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  introTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  introSub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 18, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  secHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  secTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  secBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  updated: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },
});
