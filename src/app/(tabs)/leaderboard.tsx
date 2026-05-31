import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const DATA = [
  { rank: 1, name: 'Ahmet Y.', xp: 4820, streak: 21, isMe: false, color: '#F59E0B' },
  { rank: 2, name: 'Zeynep K.', xp: 4210, streak: 15, isMe: false, color: '#94A3B8' },
  { rank: 3, name: 'Can D.', xp: 3950, streak: 12, isMe: false, color: '#CD7C32' },
  { rank: 4, name: 'Sen', xp: 1840, streak: 5, isMe: true, color: Colors.primary },
  { rank: 5, name: 'Elif M.', xp: 1700, streak: 8, isMe: false, color: Colors.textMuted },
  { rank: 6, name: 'Burak A.', xp: 1540, streak: 3, isMe: false, color: Colors.textMuted },
];

const AVATAR_COLORS = ['#5B4CF5', '#22C55E', '#F97316', '#EF4444', '#A855F7', '#3B82F6'];

function Avatar({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View
      style={[
        avatarStyles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '18', borderColor: color + '40' },
      ]}
    >
      <Text style={[avatarStyles.text, { color, fontSize: size * 0.33 }]}>{initials}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  text: { fontWeight: '800' },
});

export default function LeaderboardScreen() {
  const top3 = DATA.slice(0, 3);
  const rest = DATA.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = [72, 96, 56];
  const rankLabels = ['2.', '1.', '3.'];
  const rankColors = ['#94A3B8', '#F59E0B', '#CD7C32'];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Liderlik Tablosu</Text>
        <Text style={s.subtitle}>Bu haftanın en iyileri</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={s.podiumWrapper}>
          {podiumOrder.map((user, i) =>
            user ? (
              <View key={user.rank} style={[s.podiumItem, i === 1 && s.podiumCenter]}>
                <Avatar name={user.name} color={rankColors[i]} size={i === 1 ? 52 : 44} />
                <Text style={[s.podiumName, i === 1 && s.podiumNameFirst]}>{user.name}</Text>
                <View style={[s.podiumBar, { height: podiumHeights[i], backgroundColor: rankColors[i] + '20', borderColor: rankColors[i] + '40' }]}>
                  <Text style={[s.podiumRankText, { color: rankColors[i] }]}>{rankLabels[i]}</Text>
                </View>
                <Text style={[s.podiumXp, { color: rankColors[i] }]}>{user.xp.toLocaleString()} XP</Text>
              </View>
            ) : null
          )}
        </View>

        {/* Rest of the list */}
        <View style={s.list}>
          {rest.map((u, i) => (
            <View key={u.rank} style={[s.row, u.isMe && s.rowMe]}>
              <Text style={[s.rankNum, u.isMe && s.rankNumMe]}>#{u.rank}</Text>
              <Avatar name={u.name} color={u.isMe ? Colors.primary : AVATAR_COLORS[u.rank % AVATAR_COLORS.length]} size={38} />
              <View style={s.rowInfo}>
                <Text style={[s.rowName, u.isMe && s.rowNameMe]}>{u.isMe ? 'Sen' : u.name}</Text>
                <Text style={s.rowStreak}>{u.streak} günlük seri</Text>
              </View>
              <Text style={[s.rowXp, u.isMe && s.rowXpMe]}>{u.xp.toLocaleString()} XP</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  content: { padding: 20, paddingBottom: 40 },
  podiumWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
    paddingTop: 10,
  },
  podiumItem: { flex: 1, alignItems: 'center', gap: 6 },
  podiumCenter: { marginBottom: 16 },
  podiumName: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 80,
  },
  podiumNameFirst: { color: Colors.textPrimary, fontWeight: '800', fontSize: 12 },
  podiumBar: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: 4,
  },
  podiumRankText: { fontWeight: '900', fontSize: 18, paddingVertical: 8 },
  podiumXp: { fontSize: 11, fontWeight: '700' },
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  rowMe: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primarySoft,
  },
  rankNum: { color: Colors.textMuted, fontWeight: '700', fontSize: 13, width: 28 },
  rankNumMe: { color: Colors.primary },
  rowInfo: { flex: 1 },
  rowName: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  rowNameMe: { color: Colors.primary },
  rowStreak: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  rowXp: { color: Colors.textSecondary, fontWeight: '700', fontSize: 13 },
  rowXpMe: { color: Colors.primary },
});
