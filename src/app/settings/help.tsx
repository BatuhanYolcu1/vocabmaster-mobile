import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

const FAQ = [
  {
    q: 'VocabMaster nasıl çalışır?',
    a: 'Hazır listelerden veya kendi oluşturduğun listelerden kelime çalışırsın. 4 farklı mod var: Flashcard (kart çevirme), Quiz (çoktan seçmeli), Yazarak Öğren ve Konuşma. Her çalışma XP kazandırır ve günlük serini büyütür.',
  },
  {
    q: 'SRS (aralıklı tekrar) nedir?',
    a: 'Spaced Repetition System — bilimsel olarak kanıtlanmış bir öğrenme tekniği. Flashcard modunda bir kelimeyi "Zor" olarak işaretlersen kısa sürede, "Kolay" olarak işaretlersen günler sonra tekrar karşına çıkar. Ana sayfadaki "Tekrar Bekliyor" sayısı, tekrar zamanı gelen kelimeleri gösterir.',
  },
  {
    q: 'XP nasıl kazanılır?',
    a: 'Her çalışma modunda doğru cevaplar XP kazandırır. Zorluğa göre değişir: Flashcard 5-10, Quiz 8, Yazarak 12, Konuşma 15 XP. Her 1000 XP\'de bir seviye atlarsın.',
  },
  {
    q: 'Günlük seri (streak) nasıl korunur?',
    a: 'Her gün en az bir çalışma oturumu tamamlarsan serin devam eder. Bir gün atlanırsa seri sıfırlanır. Bildirimleri açarak günlük hatırlatıcı kurabilirsin.',
  },
  {
    q: 'Kendi kelime listemi oluşturabilir miyim?',
    a: 'Evet! Listeler sekmesinde "+ Yeni Liste" ile kendi listeni oluşturabilir, içine kelime ekleyebilirsin. Kelimeleri düzenlemek veya silmek için kelimeye uzun bas.',
  },
  {
    q: 'Verilerim nerede saklanıyor?',
    a: 'Tüm verilerin (kelimeler, istatistikler, ilerleme) yalnızca senin cihazında saklanır. Hiçbir veri sunucuya gönderilmez. Uygulamayı silersen veriler de silinir.',
  },
  {
    q: 'Verilerimi nasıl silebilirim?',
    a: 'Profil sekmesindeki "Çıkış Yap" ile onboarding sıfırlanır. Tüm verileri kalıcı silmek için uygulamayı cihazından kaldırman yeterli.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={s.faqCard} onPress={() => setOpen(o => !o)} activeOpacity={0.8}>
      <View style={s.faqHeader}>
        <Text style={s.faqQ}>{q}</Text>
        <SymbolView
          name={open ? 'chevron.up' : 'chevron.down'}
          size={13}
          tintColor={Colors.textMuted}
          type="monochrome"
        />
      </View>
      {open && <Text style={s.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <SymbolView name="chevron.left" size={16} tintColor={Colors.primary} type="monochrome" />
        </TouchableOpacity>
        <Text style={s.title}>Yardım</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionLabel}>Sıkça Sorulan Sorular</Text>
        {FAQ.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}

        <View style={s.contactCard}>
          <View style={s.contactIcon}>
            <SymbolView name="envelope.fill" size={18} tintColor={Colors.primary} type="monochrome" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.contactTitle}>Hâlâ sorun mu var?</Text>
            <Text style={s.contactDesc}>vocabmaster@bthnylc.com adresine yaz, en kısa sürede dönüş yapalım.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },

  content: { padding: 20, gap: 10, paddingBottom: 48 },
  sectionLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },

  faqCard: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary, lineHeight: 20 },
  faqA: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, marginTop: 8, borderWidth: 1, borderColor: Colors.primarySoft },
  contactIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center' },
  contactTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  contactDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 3, lineHeight: 17 },
});
