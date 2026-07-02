import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../constants/colors';

export function StudyEmpty({ listId }: { listId?: string }) {
  const isDue = listId === '_due';
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.body}>
        <View style={s.iconWrap}>
          <SymbolView
            name={isDue ? 'checkmark.seal.fill' : 'tray'}
            size={34}
            tintColor={isDue ? Colors.easy : Colors.primary}
            type="monochrome"
          />
        </View>
        <Text style={s.title}>
          {isDue ? 'Tekrar bekleyen kelime yok' : 'Bu listede henüz kelime yok'}
        </Text>
        <Text style={s.desc}>
          {isDue
            ? 'Harika gidiyorsun! Kelime çalıştıkça tekrarlar burada birikecek.'
            : 'Çalışmaya başlamak için önce listeye kelime ekle.'}
        </Text>
        {!isDue && listId && (
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.replace({ pathname: '/words/add' as any, params: { listId } })}
            activeOpacity={0.85}
          >
            <SymbolView name="plus" size={15} tintColor="#fff" type="monochrome" />
            <Text style={s.primaryBtnText}>Kelime Ekle</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={s.secondaryBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
          <Text style={s.secondaryBtnText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 6,
  },
  title: { fontSize: 19, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.3 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: 10 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingHorizontal: 22, paddingVertical: 14,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  secondaryBtn: { paddingHorizontal: 22, paddingVertical: 12 },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
